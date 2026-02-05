import time
import logging
from typing import Optional
import requests
from requests.exceptions import RequestException, Timeout, HTTPError

from config import (
    HEADERS,
    REQUEST_TIMEOUT,
    REQUEST_DELAY,
    MAX_RETRIES,
    RETRY_DELAY,
)

logger = logging.getLogger(__name__)


class Fetcher:
    def __init__(
        self,
        delay: float = REQUEST_DELAY,
        timeout: int = REQUEST_TIMEOUT,
        max_retries: int = MAX_RETRIES,
        retry_delay: float = RETRY_DELAY,
    ):
        self.delay = delay
        self.timeout = timeout
        self.max_retries = max_retries
        self.retry_delay = retry_delay
        self.session = requests.Session()
        self.session.headers.update(HEADERS)
        self._last_request_time = 0
    
    def _wait_for_rate_limit(self) -> None:
        elapsed = time.time() - self._last_request_time
        if elapsed < self.delay:
            sleep_time = self.delay - elapsed
            logger.debug(f"Rate limiting: sleeping for {sleep_time:.2f}s")
            time.sleep(sleep_time)
    
    def fetch(self, url: str) -> Optional[str]:
        for attempt in range(self.max_retries):
            try:
                self._wait_for_rate_limit()
                
                logger.info(f"Fetching: {url} (attempt {attempt + 1}/{self.max_retries})")
                
                response = self.session.get(url, timeout=self.timeout)
                self._last_request_time = time.time()
                
                response.raise_for_status()
                
                logger.debug(f"Successfully fetched {url}")
                return response.text
                
            except Timeout:
                logger.warning(f"Timeout fetching {url}")
            except HTTPError as e:
                logger.warning(f"HTTP error {e.response.status_code} fetching {url}")
                if e.response.status_code == 404:
                    return None  # Don't retry 404s
                if e.response.status_code == 429:
                    # Rate limited - wait longer
                    logger.warning("Rate limited, waiting longer...")
                    time.sleep(self.retry_delay * 3)
            except RequestException as e:
                logger.warning(f"Request error fetching {url}: {e}")
            
            if attempt < self.max_retries - 1:
                logger.info(f"Retrying in {self.retry_delay}s...")
                time.sleep(self.retry_delay)
        
        logger.error(f"Failed to fetch {url} after {self.max_retries} attempts")
        return None
    
    def close(self) -> None:
        self.session.close()
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()
