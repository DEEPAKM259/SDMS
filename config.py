# config.py - App configuration
import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'sdms-dev-secret-key')
    DEBUG = True

    # Database configuration
    DB_URI = os.getenv('DATABASE_URL') or os.getenv('SQLALCHEMY_DATABASE_URI')
    if DB_URI:
        SQLALCHEMY_DATABASE_URI = DB_URI
    else:
        SQLALCHEMY_DATABASE_URI = 'sqlite:///sdms.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    if SQLALCHEMY_DATABASE_URI.startswith('sqlite'):
        SQLALCHEMY_ENGINE_OPTIONS = {'connect_args': {'check_same_thread': False}}

    # JWT
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'sdms-jwt-secret')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)

    # Google Cloud Storage
    GCS_BUCKET = os.getenv('GCS_BUCKET', 'sdms-reports-prod')
    GCS_CREDENTIALS = os.getenv('GCS_CREDENTIALS', 'gcs-key.json')

    # Upload limits
    MAX_CONTENT_LENGTH = 50 * 1024 * 1024  # 50 MB
