import os
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
STATIC_DATA_DIR = BASE_DIR / "statics/data"


class Config:
    SECRET_KEY = os.getenv(
        "SECRET_KEY", "your-secret-key-here"
    )  # Replace with your secret key
    ADMIN_USERNAME = os.getenv(
        "ADMIN_USERNAME", "admin"
    )  # Replace with your admin username
    ADMIN_PASSWORD = os.getenv(
        "ADMIN_PASSWORD", "admin123"
    )  # Replace with your admin password
    DATA_FILES = {
        "timetable": STATIC_DATA_DIR / "timetable.json",
        "buttons": STATIC_DATA_DIR / "buttons.json",
        "names": STATIC_DATA_DIR / "names.json",
    }
