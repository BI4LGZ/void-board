from flask_login import UserMixin
from config import Config


class User(UserMixin):
    def __init__(self):
        self.id = "admin"
        self.username = Config.ADMIN_USERNAME
        self.password = Config.ADMIN_PASSWORD

    @staticmethod
    def get(user_id):
        if user_id == "admin":
            return User()
        return None
