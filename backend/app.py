from flask import Flask
from config import Config
from extensions import db, login_manager, init_extensions
from auth_routes import auth_bp
from companies_routes import companies_bp
from admin_routes import admin_bp
from regions_routes import regions_bp





def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    init_extensions(app)
    
    with app.app_context():
        db.create_all()
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(companies_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(regions_bp)  # ← Add this
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
