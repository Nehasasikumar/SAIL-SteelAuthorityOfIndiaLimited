import logging
import os
import sys
from datetime import datetime
from typing import Optional, Dict, Any

# Create logs directory if it doesn't exist
os.makedirs("logs", exist_ok=True)

def get_logger(name: str, log_file: Optional[str] = None, level: int = logging.INFO) -> logging.Logger:
    """
    Create and configure a logger
    
    Args:
        name: Logger name
        log_file: Optional log file path
        level: Logging level
        
    Returns:
        Configured logger
    """
    logger = logging.getLogger(name)
    
    # Set level
    logger.setLevel(level)
    
    # Clear any existing handlers
    if logger.handlers:
        logger.handlers = []
    
    # Create console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(level)
    
    # Create formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # Add formatter to console handler
    console_handler.setFormatter(formatter)
    
    # Add console handler to logger
    logger.addHandler(console_handler)
    
    # Add file handler if log_file is provided
    if log_file:
        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(level)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    
    return logger

# Application-wide logger
app_logger = get_logger(
    "rakevision", 
    log_file=f"logs/app_{datetime.now().strftime('%Y%m%d')}.log",
    level=logging.INFO
)

# API request logger
api_logger = get_logger(
    "rakevision.api", 
    log_file=f"logs/api_{datetime.now().strftime('%Y%m%d')}.log",
    level=logging.INFO
)

# ML operations logger
ml_logger = get_logger(
    "rakevision.ml", 
    log_file=f"logs/ml_{datetime.now().strftime('%Y%m%d')}.log",
    level=logging.INFO
)