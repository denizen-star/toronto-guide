# LifePlanner v1.1 Cleanup Plan

## 🧹 Files to Remove (Safe to Delete)

### 1. Backup Files (8 files)
```bash
rm dual_kevin_app_backup.py
rm -rf backups/phase2_removed_files/
rm -rf snapshots/phase3_complete_20250915_224727/
rm -rf snapshots/working_kevin_20250917/
```

### 2. Demo/Test Files (14 files)
```bash
rm habit_completion_demo.html
rm clickable_calendar_demo.html
rm integrated_lifeplanner_demo.html
rm test_slider_functionality.html
rm test_*.py
rm manual_completion_demo.py
rm -rf ui/tests/
rm -rf tests/
```

### 3. Favicon Variations (20+ files)
```bash
rm favicon_option_*.svg
rm growth_favicon_*.svg
rm journey_favicon_*.svg
rm chart_arrow_favicon.svg
rm meditation_growth_fullsize.svg
rm circular_favicon_preview.html
rm favicon_preview.html
rm personal_growth_favicon_preview.html
rm upward_journey_favicon_preview.html
rm favicon_cache_buster.html
```

### 4. Temporary Generated Files
```bash
rm kevin_adaptive_schedule_*.md
rm kevin_updated_schedule.md
rm test_schedule.md
rm completion_message.txt
rm time_allocation_*.json
```

### 5. Development Documentation (Keep Core, Remove Duplicates)
```bash
rm PHASE1_*.md
rm FAVICON_IMPLEMENTATION_COMPLETE.md
rm SLIDER_ISSUES_TO_FIX.md
rm CLICKABLE_CALENDAR_INTEGRATION.md
```

## 📁 Core Files to Keep

### Essential Web Interface
- `index.html` - Main Kevin selection interface
- `kevin_yearly_plan_working.html` - Working Kevin schedule
- `kevin_yearly_plan_job_search.html` - Job Search Kevin schedule

### Core Python Engine
- `app.py` - Main Flask application
- `time_allocation_tuner.py` - Time allocation engine
- `enhanced_schedule_generator.py` - Schedule generation
- `dual_kevin_app.py` - Dual persona system

### Essential Assets
- `static/` - CSS, JS, core favicons
- `assets/branding/favicons/transparent/` - Final favicon set
- `templates/` - HTML templates

### Documentation
- `README.md` - Main documentation
- `LIFEPLANNER_README.md` - Application guide
- `requirements.txt` - Dependencies
- `netlify.toml` - Deployment config

### Data & Configuration
- `data/` - Core data files
- `ui_config.json` - UI configuration
- `activity_usage_tracker.json` - Usage tracking

## 📊 Cleanup Impact

### Before Cleanup
- **Total Files**: ~400 files
- **Python Files**: 163 files
- **HTML Files**: 40 files
- **SVG Files**: 21 files

### After Cleanup (Estimated)
- **Total Files**: ~200 files (50% reduction)
- **Python Files**: ~50 files (core functionality)
- **HTML Files**: ~15 files (essential interfaces)
- **SVG Files**: ~5 files (final favicons only)

### Lines of Code Reduction
- **Before**: ~85,000 lines
- **After**: ~30,000 lines (65% reduction)
- **Focus**: Keep only production-ready code

## 🎯 Cleanup Benefits

1. **Faster Development**: Easier to navigate codebase
2. **Clearer Architecture**: Remove confusing duplicates
3. **Better Performance**: Smaller deployment size
4. **Easier Maintenance**: Focus on core functionality
5. **Cleaner Git History**: Remove experimental code

## ⚠️ Safety Notes

- All cleanup is done in v1.1-dev branch (v1.0 production untouched)
- Backup important files before deletion
- Test core functionality after cleanup
- Document any breaking changes
