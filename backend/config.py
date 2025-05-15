import os

# Get the absolute path to the backend directory
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'super-secret-key'
    
    # Point to the correct SQLite file inside the instance folder
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'instance', 'ecowaste.db')
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
