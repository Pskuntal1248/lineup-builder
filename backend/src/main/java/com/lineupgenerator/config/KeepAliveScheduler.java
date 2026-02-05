package com.lineupgenerator.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class KeepAliveScheduler {

    private static final Logger logger = LoggerFactory.getLogger(KeepAliveScheduler.class);
    private final RestTemplate restTemplate = new RestTemplate();
    
    // Set via environment variable: RENDER_EXTERNAL_URL
    private final String selfUrl = System.getenv("RENDER_EXTERNAL_URL");
    
    @Scheduled(fixedRate = 300000, initialDelay = 60000)
    public void keepAlive() {
        if (selfUrl == null || selfUrl.isEmpty()) {
            return;
        }
        try {
            restTemplate.getForObject(selfUrl + "/api/health", String.class);
            logger.info("Keep-alive ping OK");
        } catch (Exception e) {
            logger.warn("Keep-alive failed: {}", e.getMessage());
        }
    }
}
