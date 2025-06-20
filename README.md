# ResolvIQ - Troubleshooting Documentation Tool

A modular Flask application for capturing and documenting server troubleshooting sessions with automatic report generation.

## Features

- **Auto-incrementing steps** - Each troubleshooting step is automatically numbered
- **Three input areas per step**: Command, Output, Analysis/Notes
- **Step management** - Add, remove, and organize troubleshooting steps
- **Resolution tracking** - Capture root cause, solution, and prevention measures
- **Automatic report generation** - Creates properly formatted technical reports
- **Session management** - Maintains state across browser sessions
- **Clean architecture** - Modular Flask application with separation of concerns

## Project Structure

```
resolviq/
├── app/
│   ├── __init__.py                 # Flask app factory
│   ├── models/
│   │   └── troubleshooting.py      # Data models
│   ├── services/
│   │   └── troubleshooting_service.py  # Business logic
│   ├── routes/
│   │   └── troubleshooting.py      # API routes and controllers
│   ├── templates/
│   │   ├── base.html              # Base template
│   │   ├── index.html             # Main interface
│   │   ├── report.html            # Report display
│   │   └── errors/                # Error pages
│   ├── static/
│   │   ├── css/style.css          # Custom styles
│   │   └── js/app.js              # Frontend JavaScript
│   └── utils/
│       ├── logger.py              # Logging configuration
│       └── error_handlers.py      # Error handling
├── config/
│   └── config.py                  # Application configuration
├── requirements.txt               # Python dependencies
└── run.py                        # Application entry point
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd resolviq
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

### Development
```bash
python run.py
```

The application will be available at `http://localhost:5000`

### Production
Set environment variables:
```bash
export FLASK_ENV=production
export SECRET_KEY=your-secret-key-here
python run.py
```

## Usage

### Workflow

1. **Fill in issue information** at the top of the page
2. **Add troubleshooting steps**:
   - Paste your command in the first box
   - Paste the output/result in the second box
   - Add analysis or reasoning (optional)
   - Click "Next Step" to save and clear for the next entry
3. **Repeat** for each troubleshooting step
4. **Fill in the resolution summary** when done
5. **Click "Generate Technical Report"**
6. **Copy the formatted report** for documentation

### Features

- **Auto-save** - Issue information and resolution data auto-saves every 30 seconds
- **Step management** - Remove steps if you make mistakes
- **Session persistence** - Your work is maintained across browser sessions
- **Responsive design** - Works on desktop and mobile devices
- **Error handling** - Comprehensive error handling and user feedback

## Architecture

### Models (`app/models/`)
- **IssueInfo** - Stores issue metadata (title, server, symptoms, priority)
- **Step** - Individual troubleshooting steps with command, output, and analysis
- **Resolution** - Resolution details including root cause and prevention
- **TroubleshootingSession** - Main session container

### Services (`app/services/`)
- **TroubleshootingService** - Business logic for session management, step handling, and report generation

### Routes (`app/routes/`)
- **troubleshooting_bp** - Flask blueprint with all API endpoints and page routes

### Templates (`app/templates/`)
- Jinja2 templates with responsive design using Tailwind CSS

### Static Files (`app/static/`)
- Custom CSS for animations and responsive design
- JavaScript for form handling, auto-save, and dynamic updates

## API Endpoints

- `GET /` - Main interface
- `POST /update_issue` - Update issue information
- `POST /add_step` - Add new troubleshooting step
- `POST /remove_step/<id>` - Remove specific step
- `POST /update_resolution` - Update resolution information
- `GET /generate_report` - Generate and display report
- `POST /reset_session` - Clear current session
- `GET /api/session_data` - Get current session data (JSON)

## Configuration

The application uses a configuration class system:

- **DevelopmentConfig** - Debug enabled, detailed logging
- **ProductionConfig** - Debug disabled, production-ready settings

Set the `FLASK_ENV` environment variable to control which configuration is used.

## Logging

- Application logs are stored in the `logs/` directory
- Log rotation is configured (10MB max file size, 10 backup files)
- Different log levels for development vs production

## Error Handling

- Custom error pages for 400, 404, and 500 errors
- Comprehensive exception handling
- User-friendly error messages
- Detailed server-side logging

## Development

### Adding New Features

1. **Models** - Add new data classes in `app/models/`
2. **Services** - Implement business logic in `app/services/`
3. **Routes** - Add new endpoints in `app/routes/`
4. **Templates** - Create/modify HTML templates in `app/templates/`
5. **Static Files** - Add CSS/JS in `app/static/`

### Testing

The project structure supports easy testing:
- Unit tests for models and services
- Integration tests for routes
- Frontend tests for JavaScript functionality

## License

[Add your license information here]