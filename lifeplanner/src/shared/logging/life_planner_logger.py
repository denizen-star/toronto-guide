"""
Logging system for LifePlanner
"""

import logging
import logging.handlers
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional


class LifePlannerLogger:
    """Custom logger for LifePlanner with structured logging"""
    
    def __init__(self, name: str = "lifeplanner", log_dir: str = "logs"):
        self.name = name
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(exist_ok=True)
        
        # Create logger
        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.DEBUG)
        
        # Clear existing handlers
        self.logger.handlers.clear()
        
        # Create formatters
        self.console_formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        
        self.file_formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s'
        )
        
        self.json_formatter = self._create_json_formatter()
        
        # Setup handlers
        self._setup_console_handler()
        self._setup_file_handlers()
    
    def _create_json_formatter(self):
        """Create JSON formatter for structured logging"""
        class JSONFormatter(logging.Formatter):
            def format(self, record):
                log_entry = {
                    'timestamp': datetime.fromtimestamp(record.created).isoformat(),
                    'level': record.levelname,
                    'logger': record.name,
                    'message': record.getMessage(),
                    'module': record.module,
                    'function': record.funcName,
                    'line': record.lineno
                }
                
                # Add extra fields if present
                if hasattr(record, 'user_id'):
                    log_entry['user_id'] = record.user_id
                if hasattr(record, 'persona_id'):
                    log_entry['persona_id'] = record.persona_id
                if hasattr(record, 'schedule_type'):
                    log_entry['schedule_type'] = record.schedule_type
                if hasattr(record, 'activity_count'):
                    log_entry['activity_count'] = record.activity_count
                if hasattr(record, 'duration_ms'):
                    log_entry['duration_ms'] = record.duration_ms
                
                return json.dumps(log_entry)
        
        return JSONFormatter()
    
    def _setup_console_handler(self):
        """Setup console handler"""
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        console_handler.setFormatter(self.console_formatter)
        self.logger.addHandler(console_handler)
    
    def _setup_file_handlers(self):
        """Setup file handlers"""
        # General log file
        general_handler = logging.handlers.RotatingFileHandler(
            self.log_dir / "lifeplanner.log",
            maxBytes=10*1024*1024,  # 10MB
            backupCount=5
        )
        general_handler.setLevel(logging.DEBUG)
        general_handler.setFormatter(self.file_formatter)
        self.logger.addHandler(general_handler)
        
        # Error log file
        error_handler = logging.handlers.RotatingFileHandler(
            self.log_dir / "errors.log",
            maxBytes=5*1024*1024,  # 5MB
            backupCount=3
        )
        error_handler.setLevel(logging.ERROR)
        error_handler.setFormatter(self.file_formatter)
        self.logger.addHandler(error_handler)
        
        # JSON structured log file
        json_handler = logging.handlers.RotatingFileHandler(
            self.log_dir / "structured.json",
            maxBytes=10*1024*1024,  # 10MB
            backupCount=5
        )
        json_handler.setLevel(logging.INFO)
        json_handler.setFormatter(self.json_formatter)
        self.logger.addHandler(json_handler)
    
    def info(self, message: str, **kwargs):
        """Log info message with extra context"""
        self.logger.info(message, extra=kwargs)
    
    def debug(self, message: str, **kwargs):
        """Log debug message with extra context"""
        self.logger.debug(message, extra=kwargs)
    
    def warning(self, message: str, **kwargs):
        """Log warning message with extra context"""
        self.logger.warning(message, extra=kwargs)
    
    def error(self, message: str, **kwargs):
        """Log error message with extra context"""
        self.logger.error(message, extra=kwargs)
    
    def critical(self, message: str, **kwargs):
        """Log critical message with extra context"""
        self.logger.critical(message, extra=kwargs)
    
    def log_schedule_generation(self, persona_id: str, schedule_type: str, 
                              start_date: str, duration: str, 
                              activity_count: int, duration_ms: float):
        """Log schedule generation with structured data"""
        self.info(
            f"Generated {schedule_type} schedule for {duration} starting {start_date}",
            persona_id=persona_id,
            schedule_type=schedule_type,
            activity_count=activity_count,
            duration_ms=duration_ms
        )
    
    def log_activity_selection(self, activity_name: str, activity_type: str, 
                              persona_id: str, score: float):
        """Log activity selection with scoring"""
        self.debug(
            f"Selected activity: {activity_name} (type: {activity_type}, score: {score:.2f})",
            persona_id=persona_id,
            activity_name=activity_name,
            activity_type=activity_type,
            score=score
        )
    
    def log_persona_usage(self, persona_id: str, usage_count: int):
        """Log persona usage statistics"""
        self.info(
            f"Persona {persona_id} usage count: {usage_count}",
            persona_id=persona_id,
            usage_count=usage_count
        )
    
    def log_performance(self, operation: str, duration_ms: float, **kwargs):
        """Log performance metrics"""
        self.info(
            f"Performance: {operation} took {duration_ms:.2f}ms",
            operation=operation,
            duration_ms=duration_ms,
            **kwargs
        )
    
    def log_error_with_context(self, error: Exception, context: Dict[str, Any]):
        """Log error with additional context"""
        self.error(
            f"Error: {str(error)}",
            error_type=type(error).__name__,
            **context
        )


def setup_logging(log_level: str = "INFO", log_dir: str = "logs") -> LifePlannerLogger:
    """Setup logging for the application"""
    # Convert string level to logging constant
    level_map = {
        "DEBUG": logging.DEBUG,
        "INFO": logging.INFO,
        "WARNING": logging.WARNING,
        "ERROR": logging.ERROR,
        "CRITICAL": logging.CRITICAL
    }
    
    logger = LifePlannerLogger(log_dir=log_dir)
    logger.logger.setLevel(level_map.get(log_level.upper(), logging.INFO))
    
    return logger


# Global logger instance
logger = LifePlannerLogger()


def get_logger(name: str = None) -> LifePlannerLogger:
    """Get logger instance"""
    if name:
        return LifePlannerLogger(name)
    return logger

