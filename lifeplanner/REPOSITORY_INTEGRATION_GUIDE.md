# Repository Integration Guide

This guide explains how to integrate the LifePlanner application into a multi-app GitHub repository without impacting other applications.

## Repository Structure Options

### Option 1: Monorepo with App Folders

```
my-apps-repository/
├── README.md                    # Main repository overview
├── .gitignore                  # Global gitignore
├── LICENSE                     # Repository license
├── lifeplanner/               # LifePlanner application
│   ├── [all current files]
│   └── README.md             # App-specific README
├── web-app/                  # Another web application
├── mobile-app/               # Mobile application
├── api-service/              # API service
└── shared/                   # Shared utilities and assets
    ├── utils/
    ├── assets/
    └── configs/
```

### Option 2: Categorized Structure

```
my-development-portfolio/
├── README.md
├── web-applications/
│   ├── lifeplanner/
│   └── other-web-app/
├── mobile-applications/
│   └── mobile-app/
├── api-services/
│   └── api-service/
├── tools-and-utilities/
│   └── utility-scripts/
└── shared/
    └── common-assets/
```

## Integration Steps

### Step 1: Prepare LifePlanner for Integration

1. **Clean up the current directory** (optional but recommended):
   ```bash
   cd /Users/kervinleacock/Documents/Development/LifePlanner
   
   # Remove temporary files
   rm -f *.tmp *.temp
   rm -f test_schedule.md
   rm -f kevin_adaptive_schedule_*.md
   
   # Clean up outputs (keep structure)
   mkdir -p outputs/.gitkeep
   mkdir -p snapshots/.gitkeep
   ```

2. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial LifePlanner commit before integration"
   ```

### Step 2: Integration Methods

#### Method A: Move into Existing Repository

If you already have a multi-app repository:

```bash
# 1. Navigate to your existing repository
cd /path/to/your/existing/repository

# 2. Create the lifeplanner directory
mkdir lifeplanner

# 3. Copy LifePlanner files
cp -r /Users/kervinleacock/Documents/Development/LifePlanner/* lifeplanner/

# 4. Update paths in configuration files (see Path Updates section)

# 5. Commit the changes
git add lifeplanner/
git commit -m "Add LifePlanner application

- Complete life planning and scheduling system
- Includes web UI, calendar integration, and activity tracking
- Self-contained with all dependencies in requirements.txt"

git push origin main
```

#### Method B: Create New Multi-App Repository

```bash
# 1. Create new repository directory
mkdir /Users/kervinleacock/Documents/Development/MyAppsPortfolio
cd /Users/kervinleacock/Documents/Development/MyAppsPortfolio

# 2. Initialize Git
git init

# 3. Create structure
mkdir lifeplanner shared

# 4. Move LifePlanner
cp -r /Users/kervinleacock/Documents/Development/LifePlanner/* lifeplanner/

# 5. Create main README (see Main README Template section)

# 6. Create shared resources
mkdir shared/utils shared/assets shared/configs

# 7. Initial commit
git add .
git commit -m "Initial commit: Multi-app repository with LifePlanner"

# 8. Connect to GitHub
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

#### Method C: Git Subtree Integration

For advanced users who want to maintain separate repositories:

```bash
# In your main repository
git subtree add --prefix=lifeplanner https://github.com/yourusername/lifeplanner.git main --squash

# To update later
git subtree pull --prefix=lifeplanner https://github.com/yourusername/lifeplanner.git main --squash
```

### Step 3: Path Updates

After moving LifePlanner into a subdirectory, update these files:

1. **Docker files**:
   - Update `Dockerfile` WORKDIR if needed
   - Update `docker-compose.yml` volume paths

2. **Python imports** (if any cross-references):
   - Update relative imports
   - Update file paths in configuration

3. **Web server configurations**:
   - Update static file paths
   - Update template paths

4. **Documentation links**:
   - Update internal documentation links
   - Update README file references

### Step 4: Main Repository README Template

```markdown
# My Development Portfolio

A collection of applications and tools I've developed.

## Applications

### 🗓️ LifePlanner
**Location**: `lifeplanner/`
**Description**: Comprehensive personal life planning and scheduling application
**Tech Stack**: Python, Flask, HTML/CSS/JavaScript
**Features**: Adaptive scheduling, activity tracking, goal management

[View LifePlanner README](lifeplanner/README.md)

### 🌐 [Other App Name]
**Location**: `other-app/`
**Description**: [App description]
**Tech Stack**: [Technologies used]

## Getting Started

Each application has its own README with specific setup instructions. Navigate to the application directory and follow the setup guide.

## Shared Resources

The `shared/` directory contains common utilities and assets used across multiple applications.

## Contributing

Each application follows its own contribution guidelines. Please refer to the individual README files for specific instructions.
```

### Step 5: Continuous Integration Considerations

If using CI/CD, update your workflows:

```yaml
# .github/workflows/lifeplanner.yml
name: LifePlanner CI

on:
  push:
    paths:
      - 'lifeplanner/**'
  pull_request:
    paths:
      - 'lifeplanner/**'

jobs:
  test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: lifeplanner
    
    steps:
    - uses: actions/checkout@v2
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: 3.9
    - name: Install dependencies
      run: |
        pip install -r requirements.txt
    - name: Run tests
      run: |
        python -m pytest tests/
```

## Best Practices

1. **Keep applications independent**: Each app should be self-contained
2. **Use consistent naming**: Follow a consistent naming convention
3. **Document everything**: Each app needs its own README
4. **Shared resources**: Use the shared directory for common utilities
5. **Environment variables**: Use environment variables for configuration
6. **Git ignore patterns**: Use appropriate .gitignore patterns for each app type

## Troubleshooting

### Common Issues

1. **Path errors**: Update all hardcoded paths after moving
2. **Import errors**: Fix Python import statements
3. **Static file issues**: Update web server static file configurations
4. **Database paths**: Update database file paths if using SQLite

### Quick Fixes

```bash
# Find and replace paths (example)
find lifeplanner/ -name "*.py" -exec sed -i 's/old-path/new-path/g' {} +

# Update requirements.txt paths if needed
# Update Docker configurations
# Test all entry points after integration
```

## Next Steps

After integration:

1. Test all application entry points
2. Update documentation links
3. Set up CI/CD if needed
4. Tag the integration commit
5. Update any external references to the repository

This structure allows you to maintain multiple applications in one repository while keeping them organized and independent.
