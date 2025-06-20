import logging
import os
from datetime import datetime
from logging.handlers import RotatingFileHandler

def setup_logger(app):
    """Setup application logging with file rotation"""
    
    # Create logs directory if it doesn't exist
    if not os.path.exists('logs'):
        os.makedirs('logs')
    
    # Configure logging level based on debug mode
    log_level = logging.DEBUG if app.debug else logging.INFO
    
    # Create formatters
    file_formatter = logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    )
    
    console_formatter = logging.Formatter(
        '%(levelname)s: %(message)s'
    )
    
    # File handler with rotation
    file_handler = RotatingFileHandler(
        'logs/resolviq.log',
        maxBytes=10240000,  # 10MB
        backupCount=10
    )
    file_handler.setFormatter(file_formatter)
    file_handler.setLevel(log_level)
    
    # Console handler for development
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(console_formatter)
    console_handler.setLevel(log_level)
    
    # Configure app logger
    app.logger.addHandler(file_handler)
    if app.debug:
        app.logger.addHandler(console_handler)
    
    app.logger.setLevel(log_level)
    app.logger.info('ResolvIQ logging configured')
    
    return app.logger