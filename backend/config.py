import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "postgresql://postgres:Galahad%403101@localhost/note_summarizer"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get("SECRET_KEY", "supersecret")
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "superjwt")
