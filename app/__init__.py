from flask import Flask
from config.config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Setup logging
    from app.utils.logger import setup_logger
    setup_logger(app)
    
    # Register error handlers
    from app.utils.error_handlers import register_error_handlers
    register_error_handlers(app)
    
    # Register blueprints
    from app.routes.troubleshooting import troubleshooting_bp
    app.register_blueprint(troubleshooting_bp)
    
    app.logger.info('ResolvIQ application started')
    return app