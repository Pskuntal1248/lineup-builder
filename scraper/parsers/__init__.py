"""
Parsers for different football data sources.
"""

from .transfermarkt import TransfermarktParser
from .fbref import FBrefParser

__all__ = ["TransfermarktParser", "FBrefParser"]
