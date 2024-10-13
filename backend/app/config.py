import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    OPENAI_KEY = os.getenv('OPENAI_KEY')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    IMAGES_PATH = os.getenv('IMAGES_PATH')
    MODEL_PATH = os.getenv('MODEL_PATH')