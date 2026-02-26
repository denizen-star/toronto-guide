# LifePlanner Developer Guide

## 📖 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Development Setup](#development-setup)
3. [Code Organization](#code-organization)
4. [Adding New Features](#adding-new-features)
5. [Testing Guidelines](#testing-guidelines)
6. [Performance Considerations](#performance-considerations)
7. [Contributing](#contributing)

## 🏗️ Architecture Overview

LifePlanner follows a clean, modular architecture with clear separation of concerns:

```
src/
├── shared/                 # Core models and utilities
│   ├── models/            # Data models (Activity, Persona, Schedule)
│   ├── utils/             # Utility functions (TimeUtils, ValidationUtils)
│   ├── exceptions/        # Custom exception hierarchy
│   └── logging/           # Logging system
├── features/              # Feature modules
│   ├── application/       # Main application orchestration
│   ├── configuration/     # Settings management
│   ├── personas/          # Persona management
│   ├── activities/        # Activity management
│   └── scheduling/        # Planning logic
├── cli/                   # Command line interface
└── examples/              # Example scripts and demos
```

### Design Patterns

- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic separation
- **Factory Pattern**: Object creation
- **Strategy Pattern**: Different planning strategies
- **Observer Pattern**: Event handling

## 🚀 Development Setup

### Prerequisites

- Python 3.8+
- pip
- git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lifeplanner.git
   cd lifeplanner
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Install development dependencies**
   ```bash
   pip install -r requirements-dev.txt
   ```

### Development Tools

- **Code Formatting**: Black
- **Linting**: Flake8
- **Type Checking**: MyPy
- **Testing**: Pytest
- **Documentation**: Sphinx

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src

# Run specific test categories
pytest tests/unit/
pytest tests/integration/
pytest tests/performance/
```

### Code Quality

```bash
# Format code
black src/

# Lint code
flake8 src/

# Type checking
mypy src/

# Sort imports
isort src/
```

## 📁 Code Organization

### Core Models (`src/shared/models/`)

**Activity Model**
```python
@dataclass
class Activity:
    name: str
    activity_type: ActivityType
    duration_hours: float
    cost_cad: float
    location: str
    description: str
    # ... additional attributes
```

**Persona Model**
```python
@dataclass
class Persona:
    id: str
    name: str
    personality_type: PersonalityType
    energy_pattern: str
    social_style: str
    # ... additional attributes
```

**Schedule Model**
```python
@dataclass
class Schedule:
    date: str
    time_slots: List[TimeSlot]
    schedule_type: str
    notes: str
```

### Service Layer (`src/features/`)

Each feature has its own service layer:

- **PersonaService**: Manages persona CRUD operations
- **ActivityService**: Handles activity selection and filtering
- **ConfigurationService**: Manages application settings
- **LifePlannerApp**: Orchestrates all services

### Repository Pattern (`src/features/*/`)

Data access is abstracted through repository classes:

```python
class PersonaRepository:
    def load_all(self) -> List[Persona]
    def load_by_id(self, persona_id: str) -> Optional[Persona]
    def save(self, persona: Persona) -> bool
    def delete(self, persona_id: str) -> bool
```

## 🔧 Adding New Features

### 1. Create Feature Module

```bash
mkdir src/features/new_feature
touch src/features/new_feature/__init__.py
touch src/features/new_feature/new_feature_service.py
touch src/features/new_feature/new_feature_repository.py
```

### 2. Implement Repository

```python
# src/features/new_feature/new_feature_repository.py
from typing import List, Optional
from ...shared.models import NewFeatureModel

class NewFeatureRepository:
    def __init__(self, data_file: str = "data/new_feature.json"):
        self.data_file = Path(data_file)
    
    def load_all(self) -> List[NewFeatureModel]:
        # Implementation
        pass
    
    def save(self, model: NewFeatureModel) -> bool:
        # Implementation
        pass
```

### 3. Implement Service

```python
# src/features/new_feature/new_feature_service.py
from .new_feature_repository import NewFeatureRepository

class NewFeatureService:
    def __init__(self, repository: Optional[NewFeatureRepository] = None):
        self.repository = repository or NewFeatureRepository()
    
    def get_all(self) -> List[NewFeatureModel]:
        return self.repository.load_all()
    
    def create(self, model: NewFeatureModel) -> bool:
        return self.repository.save(model)
```

### 4. Add to Main Application

```python
# src/features/application/life_planner_app.py
from ...features.new_feature import NewFeatureService

class LifePlannerApp:
    def __init__(self, config_file: str = "data/settings.json"):
        # ... existing code ...
        self.new_feature_service = NewFeatureService()
    
    def new_feature_method(self):
        return self.new_feature_service.get_all()
```

### 5. Add Tests

```python
# tests/unit/test_new_feature_service.py
import pytest
from src.features.new_feature import NewFeatureService

class TestNewFeatureService:
    def test_get_all(self):
        service = NewFeatureService()
        result = service.get_all()
        assert isinstance(result, list)
```

## 🧪 Testing Guidelines

### Test Structure

```
tests/
├── unit/                   # Unit tests
│   ├── test_models.py
│   ├── test_services.py
│   └── test_utils.py
├── integration/            # Integration tests
│   ├── test_planner.py
│   └── test_app.py
├── performance/            # Performance tests
│   └── test_performance.py
└── fixtures/               # Test fixtures
    ├── sample_personas.json
    └── sample_activities.json
```

### Unit Testing

```python
import pytest
from src.shared.models import Activity, ActivityType

class TestActivity:
    def test_activity_creation(self):
        activity = Activity(
            name="Test Activity",
            activity_type=ActivityType.SOCIAL,
            duration_hours=2.0,
            cost_cad=50.0,
            location="Test Location",
            description="Test Description"
        )
        assert activity.name == "Test Activity"
        assert activity.activity_type == ActivityType.SOCIAL
    
    def test_activity_to_dict(self):
        activity = Activity(
            name="Test Activity",
            activity_type=ActivityType.SOCIAL,
            duration_hours=2.0,
            cost_cad=50.0,
            location="Test Location",
            description="Test Description"
        )
        data = activity.to_dict()
        assert data["name"] == "Test Activity"
        assert data["activity_type"] == "social"
```

### Integration Testing

```python
import pytest
from src.features.application import LifePlannerApp

class TestLifePlannerApp:
    def test_generate_schedule(self):
        app = LifePlannerApp()
        result = app.generate_schedule(
            start_date="2024-01-15",
            duration="1 week",
            schedule_type="integrated"
        )
        assert "schedule" in result
        assert "acknowledgment" in result
        assert "summary" in result
```

### Performance Testing

```python
import pytest
import time
from src.features.application import LifePlannerApp

class TestPerformance:
    def test_schedule_generation_performance(self):
        app = LifePlannerApp()
        
        start_time = time.time()
        result = app.generate_schedule(
            start_date="2024-01-15",
            duration="1 week",
            schedule_type="integrated"
        )
        end_time = time.time()
        
        duration = (end_time - start_time) * 1000  # Convert to milliseconds
        assert duration < 1000  # Should complete in under 1 second
```

## ⚡ Performance Considerations

### Data Loading

- Use lazy loading for large datasets
- Implement caching for frequently accessed data
- Consider database migration for large-scale deployments

### Memory Management

- Clear unused data structures
- Use generators for large iterations
- Monitor memory usage in production

### Algorithm Optimization

- Use efficient data structures (sets for lookups)
- Implement early termination in loops
- Cache expensive calculations

### Example Optimization

```python
class OptimizedActivityService:
    def __init__(self):
        self._activity_cache = {}
        self._type_index = {}
    
    def get_activities_by_type(self, activity_type: ActivityType):
        # Use index for O(1) lookup instead of O(n) filtering
        if activity_type not in self._type_index:
            self._type_index[activity_type] = [
                a for a in self.activities if a.activity_type == activity_type
            ]
        return self._type_index[activity_type]
```

## 🤝 Contributing

### Code Style

- Follow PEP 8 guidelines
- Use type hints for all functions
- Write docstrings for all public methods
- Keep functions small and focused

### Commit Messages

Use conventional commit format:

```
feat: add new activity type for outdoor activities
fix: resolve time conflict detection bug
docs: update API reference for new methods
test: add unit tests for persona service
refactor: simplify activity selection logic
```

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Update documentation
7. Submit pull request

### Code Review Checklist

- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No breaking changes (or properly documented)
- [ ] Performance impact is considered
- [ ] Error handling is appropriate

## 🔍 Debugging

### Logging

Use the built-in logging system:

```python
from src.shared.logging import get_logger

logger = get_logger(__name__)

def my_function():
    logger.info("Starting function")
    try:
        # Function logic
        logger.debug("Processing data")
    except Exception as e:
        logger.error(f"Error in function: {e}")
        raise
```

### Debug Mode

Enable debug logging:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Common Issues

1. **Import Errors**: Check PYTHONPATH and module structure
2. **Data Loading**: Verify file paths and JSON format
3. **Persona Matching**: Check persona data structure
4. **Time Conflicts**: Use TimeUtils for time calculations

## 📚 Additional Resources

- [Python Type Hints](https://docs.python.org/3/library/typing.html)
- [Pytest Documentation](https://docs.pytest.org/)
- [Black Code Formatter](https://black.readthedocs.io/)
- [MyPy Type Checker](https://mypy.readthedocs.io/)

---

**Happy Coding! 🚀**

