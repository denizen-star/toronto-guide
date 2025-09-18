# LifePlanner

A comprehensive personal life planning and scheduling application that helps you organize your daily activities, track habits, and achieve your goals.

## Features

- **Adaptive Scheduling**: Dynamic schedule generation based on your preferences and constraints
- **Activity Tracking**: Monitor and analyze your daily activities and habits
- **Goal Management**: Set and track personal and professional goals
- **Calendar Integration**: Interactive calendar views with completion tracking
- **Time Allocation**: Smart time management and allocation systems
- **Web Interface**: Modern web UI for easy interaction
- **Backup System**: Automatic backup and snapshot capabilities

## Project Structure

```
lifeplanner/
├── README.md                         # This file
├── requirements.txt                  # Python dependencies
├── setup.py                         # Package setup
├── Dockerfile                       # Docker configuration
├── docker-compose.yml              # Docker compose setup
│
├── Core Application Files
├── app.py                           # Main Flask application
├── dual_kevin_app.py               # Enhanced dual-view application
├── enhanced_dual_kevin_app.py      # Advanced application features
├── start_ui.py                     # UI server starter
├── run_ui_server.py               # UI server runner
├── simple_ui_server.py            # Simplified UI server
│
├── Schedule Generation
├── core_schedule_one_month.py      # Monthly schedule generation
├── core_schedule_weekly_breakdown.py # Weekly schedule breakdown
├── enhanced_schedule_generator.py   # Advanced schedule generation
├── september_2025_detailed_plan.py # Detailed planning scripts
├── job_search_schedule_generator.py # Job search specific scheduling
│
├── Calendar & Views
├── calendar_views.py               # Calendar view components
├── enhanced_calendar_views.py     # Enhanced calendar features
├── calendar_completion_integration.py # Completion tracking
├── yearly_dashboard.py            # Yearly overview dashboard
│
├── Time Management
├── time_allocation_tuner.py       # Time allocation optimization
├── time_analysis.py              # Time usage analysis
├── outcome_system_integration.py  # Outcome tracking system
│
├── UI & Web Assets
├── static/                        # Static web files (CSS, JS, images)
├── templates/                     # HTML templates
├── ui/                           # UI components and configuration
├── assets/                       # Application assets and branding
│
├── Data & Configuration
├── data/                         # Data files and databases
├── ui_config.json               # UI configuration
├── activity_usage_tracker.json  # Activity tracking data
├── test_allocation.json         # Test allocation data
│
├── Documentation
├── docs/                        # Detailed documentation
├── COMPREHENSIVE_REQUIREMENTS_SUMMARY.md
├── MASTER_SCHEDULE_REQUIREMENTS.xml
├── UI_DEVELOPMENT_PLAN.md
├── WEB_UI_README.md
├── YEARLY_PLAN_README.md
├── TIME_ALLOCATION_SYSTEM_README.md
├── OUTCOME_SYSTEM_README.md
│
├── Backups & Outputs
├── backups/                     # Backup files
├── outputs/                     # Generated outputs
├── snapshots/                   # System snapshots
│
└── Testing & Development
    ├── test_*.py                # Test files
    ├── demo_*.html             # Demo files
    └── *_demo.html             # HTML demos
```

## Quick Start

### Prerequisites

- Python 3.8+
- pip
- Virtual environment (recommended)

### Installation

1. **Set up virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**:
   ```bash
   python app.py
   # Or for the enhanced version:
   python enhanced_dual_kevin_app.py
   # Or start the UI server:
   python start_ui.py
   ```

### Docker Setup

1. **Build and run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

2. **Or build and run manually**:
   ```bash
   docker build -t lifeplanner .
   docker run -p 5000:5000 lifeplanner
   ```

## Usage

### Web Interface

Access the web interface at `http://localhost:5000` (or the port specified in your configuration).

### Schedule Generation

Generate personalized schedules using:
```bash
python core_schedule_one_month.py
python enhanced_schedule_generator.py
```

### Activity Tracking

Track your activities and analyze patterns:
```bash
python time_analysis.py
python time_allocation_tuner.py
```

## Configuration

- **UI Configuration**: Edit `ui_config.json` for UI settings
- **Activity Tracking**: Modify `activity_usage_tracker.json` for tracking preferences
- **Time Allocation**: Adjust settings in time allocation scripts

## Development

### Adding New Features

1. Create feature branch
2. Implement changes following existing patterns
3. Update documentation
4. Add tests if applicable
5. Submit pull request

### File Organization

- **Core logic**: Keep main application files in root
- **UI components**: Add to `ui/` directory
- **Static assets**: Place in `static/` directory
- **Templates**: Add HTML templates to `templates/`
- **Documentation**: Update relevant docs in `docs/`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

## License

[Add your license information here]

## Support

[Add support contact information or links here]
