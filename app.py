# SDMS Backend - Flask Application
# app.py - Main entry point

from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db
from auth import auth_bp
from student import student_bp


def create_app():
    app = Flask(__name__, static_folder='.', static_url_path='')
    app.config.from_object(Config)

    # Setup extensions
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)
    JWTManager(app)

    # Register API routes
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(student_bp, url_prefix='/api/student')

    # Serve frontend pages
    @app.route('/')
    @app.route('/<path:path>')
    def serve(path='index.html'):
        return send_from_directory(app.static_folder, path)

    # Health check
    @app.route('/api/health')
    def health():
        return {'status': 'ok', 'service': 'SDMS'}

    # Create tables on startup
    with app.app_context():
        db.create_all()

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
