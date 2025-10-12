import os
from pydantic_settings import BaseSettings
from typing import Optional, Dict, Any, List
import pathlib

# Get the root directory
ROOT_DIR = pathlib.Path(__file__).parent.parent.parent.absolute()

class Settings(BaseSettings):
    # API settings
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "RakeVision AI"
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    # CORS settings
    BACKEND_CORS_ORIGINS: List[str] = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
    
    # Database settings
    DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL", None)
    DATABASE_USER: str = os.getenv("DATABASE_USER", "postgres")
    DATABASE_PASSWORD: str = os.getenv("DATABASE_PASSWORD", "postgres")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "rakevision")
    DATABASE_HOST: str = os.getenv("DATABASE_HOST", "localhost")
    DATABASE_PORT: str = os.getenv("DATABASE_PORT", "5432")
    SQLALCHEMY_DATABASE_URI: Optional[str] = None
    
    # ML settings
    MODEL_PATH: str = os.getenv("MODEL_PATH", "app/ml/models/")
    
    def __init__(self, **values: Any):
        super().__init__(**values)
        
        # Use SQLite for development and PostgreSQL for production
        if self.ENVIRONMENT.lower() == "production":
            # Use DATABASE_URL if provided, otherwise construct from individual settings
            if self.DATABASE_URL:
                self.SQLALCHEMY_DATABASE_URI = self.DATABASE_URL
            else:
                self.SQLALCHEMY_DATABASE_URI = f"postgresql://{self.DATABASE_USER}:{self.DATABASE_PASSWORD}@{self.DATABASE_HOST}:{self.DATABASE_PORT}/{self.DATABASE_NAME}"
        else:
            # SQLite for development
            sqlite_db_path = os.path.join(ROOT_DIR, "sqlite_dev.db")
            self.SQLALCHEMY_DATABASE_URI = f"sqlite:///{sqlite_db_path}"

settings = Settings()