from flask import Flask
from flask_login import LoginManager
from config import Config
from models import User
from routes import admin_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    login_manager = LoginManager()
    login_manager.login_view = "admin.login"
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return User.get(user_id)

    app.register_blueprint(admin_bp)
    return app


if __name__ == "__main__":
    app = create_app()
    app.run(port=5001)
