# 🧪 Persona System Testing Guide

This guide provides multiple ways to test the new persona selector framework, from quick demos to comprehensive testing.

## 🚀 Quick Start Testing

### 1. **Demo Script** (Recommended First Test)
```bash
# Run the interactive demo
python demo_persona_system.py

# Or run automated demo
python demo_persona_system.py interactive
```

**What this tests:**
- ✅ System initialization
- ✅ Context management
- ✅ Persona selection
- ✅ API simulation
- ✅ Interactive features

### 2. **Integration Test**
```bash
# Run full integration test
python test_persona_integration.py

# Test only Flask integration
python test_persona_integration.py flask-only

# Test only standalone manager
python test_persona_integration.py manager-only
```

**What this tests:**
- ✅ Flask app integration
- ✅ API endpoints
- ✅ Persona creation/selection
- ✅ Context application
- ✅ Error handling

## 🔬 Detailed Testing Options

### Unit Tests (Requires pytest)
```bash
# Install pytest if needed
pip install pytest

# Run unit tests
python -m pytest tests/test_persona_selector.py -v

# Run API tests
python -m pytest tests/test_persona_api.py -v

# Run all tests
python -m pytest tests/ -v
```

### Manual Testing Steps

#### **Step 1: Basic System Test**
```python
# In Python REPL or script
import sys
sys.path.append('src')

from core.persona_selector import PersonaSelectorManager

# Create manager
manager = PersonaSelectorManager()

# Check initialization
print(f"Personas: {len(manager.persona_manager.personas)}")
print(f"Contexts: {len(manager.contexts)}")
print(f"Families: {len(manager.families)}")
```

#### **Step 2: Context Management Test**
```python
# Add contexts
result1 = manager.add_context("work_focus")
result2 = manager.add_context("fitness_training")

print(f"Added work_focus: {result1}")
print(f"Added fitness_training: {result2}")
print(f"Active contexts: {manager.active_contexts}")

# Remove contexts
manager.remove_context("work_focus")
print(f"After removal: {manager.active_contexts}")
```

#### **Step 3: Persona Selection Test**
```python
# Get available personas
personas = manager.persona_manager.get_all_personas()
print(f"Available personas: {len(personas)}")

if personas:
    # Select first persona
    test_persona = personas[0]
    result = manager.select_persona(test_persona.persona_id)
    print(f"Selected {test_persona.persona_name}: {result}")
    print(f"Active persona: {manager.active_persona_id}")
```

## 🌐 Web Interface Testing

### Option 1: Standalone Persona Selector
1. **Add route to your Flask app:**
```python
from src.api.persona_routes import persona_bp
app.register_blueprint(persona_bp)
```

2. **Visit the persona selector:**
```
http://localhost:5000/api/persona-selector/selector
```

### Option 2: API Testing with curl

#### Get Selection Options
```bash
curl -X GET http://localhost:5000/api/persona-selector/options
```

#### Create New Persona
```bash
curl -X POST http://localhost:5000/api/persona-selector/create \
  -H "Content-Type: application/json" \
  -d '{
    "persona_name": "Test User",
    "description": "Test persona for API testing",
    "demographics": {
      "age_range": [25, 35],
      "life_stage": "mid_career",
      "income_level": "moderate"
    }
  }'
```

#### Apply Persona with Contexts
```bash
curl -X POST http://localhost:5000/api/persona-selector/apply \
  -H "Content-Type: application/json" \
  -d '{
    "persona_id": "kevin_head_of_data",
    "contexts": ["work_focus", "fitness_training"]
  }'
```

## 🎯 Testing Scenarios

### Scenario 1: New User Onboarding
```python
# Test creating persona from template
manager = PersonaSelectorManager()

# Simulate new user selecting template
template_data = {
    "persona_name": "Sarah Designer",
    "template": "creative_professional",
    "demographics": {"location_preference": "Toronto"}
}

# This would normally go through API
print("✅ Template-based creation ready")
```

### Scenario 2: Context Switching
```python
manager = PersonaSelectorManager()

# Select base persona
manager.select_persona("kevin_head_of_data")

# Test different context combinations
contexts_to_test = [
    ["work_focus"],
    ["job_search"],
    ["work_focus", "fitness_training"],
    ["social_building", "relationship_focus"]
]

for contexts in contexts_to_test:
    manager.active_contexts = []
    for context in contexts:
        manager.add_context(context)
    
    print(f"Testing contexts: {contexts}")
    effective = manager.get_effective_persona()
    print(f"Effective persona ready: {effective is not None}")
```

### Scenario 3: Family-Based Selection
```python
manager = PersonaSelectorManager()

# Test family functionality
for family_id, family in manager.families.items():
    print(f"Family: {family.family_name}")
    personas = manager.get_personas_by_family(family_id)
    print(f"  Personas in family: {len(personas)}")
```

## 🐛 Troubleshooting

### Common Issues

#### Import Errors
```bash
# Make sure you're in the LifePlanner root directory
cd /path/to/LifePlanner

# Check Python path
python -c "import sys; print(sys.path)"

# Test imports manually
python -c "from src.core.persona_selector import PersonaSelectorManager; print('✅ Imports work')"
```

#### Missing Dependencies
```bash
# Install required packages
pip install flask pytest

# Or if you have requirements.txt
pip install -r requirements.txt
```

#### File Not Found Errors
```bash
# Create necessary directories
mkdir -p src/core
mkdir -p src/api
mkdir -p templates
mkdir -p tests

# Check file locations
ls -la src/core/persona_selector.py
ls -la src/api/persona_routes.py
ls -la templates/persona_selector.html
```

### Expected Test Results

#### ✅ **Successful Demo Output:**
```
🎭 LifePlanner Persona System Demo
==================================================

1️⃣ Initializing Persona System...
✅ System initialized
   📊 Found 2 existing personas
   🎯 Found 4 contexts
   👥 Found 3 persona families

2️⃣ Existing Personas...
   👤 Kevin - Head of Data
      📝 40-year-old gay married man...
      💰 Budget: $200.0/day

...

🎉 Demo completed successfully!
✨ The persona system is ready for integration!
```

#### ✅ **Successful Integration Test:**
```
🚀 LifePlanner Persona System Integration Test
============================================================

🧪 Testing PersonaSelectorManager Standalone
==================================================
✅ PersonaSelectorManager created
✅ Selection options: 2 personas
✅ Added context: True
✅ Added context: True
✅ Active contexts: ['work_focus', 'fitness_training']
✅ Selected persona: True (Kevin - Head of Data)
✅ Standalone manager test completed!

🧪 Testing Persona System Flask Integration
==================================================
✅ Flask app created with persona routes
✅ Basic Flask routing works

🔍 Testing Persona API Endpoints:
✅ Options endpoint: Found 2 personas
   🎯 Contexts: 4
   👥 Families: 3

🎉 ALL INTEGRATION TESTS PASSED!
```

## 📊 Performance Testing

### Load Testing (Optional)
```python
import time
from concurrent.futures import ThreadPoolExecutor

def test_concurrent_access():
    """Test multiple simultaneous persona operations"""
    manager = PersonaSelectorManager()
    
    def worker(i):
        start = time.time()
        manager.add_context("work_focus")
        manager.remove_context("work_focus")
        return time.time() - start
    
    # Test with 10 concurrent operations
    with ThreadPoolExecutor(max_workers=10) as executor:
        times = list(executor.map(worker, range(10)))
    
    avg_time = sum(times) / len(times)
    print(f"Average operation time: {avg_time:.3f}s")
    print(f"Max operation time: {max(times):.3f}s")

# Run performance test
test_concurrent_access()
```

## 🔄 Integration with Existing App

### Step 1: Add to Main Flask App
```python
# In your main app.py or __init__.py
from src.api.persona_routes import persona_bp

app.register_blueprint(persona_bp)
```

### Step 2: Update Navigation
```html
<!-- Add to your main navigation -->
<a href="/api/persona-selector/selector" class="nav-link">
    <i class="fas fa-user-circle"></i> Select Persona
</a>
```

### Step 3: Connect to Planning Logic
```python
# In your planning/recommendation code
from src.core.persona_selector import PersonaSelectorManager

manager = PersonaSelectorManager()
effective_persona = manager.get_effective_persona()

if effective_persona:
    # Use persona data for recommendations
    preferred_activities = effective_persona.preferences.preferred_activity_types
    budget_limit = effective_persona.constraints.max_daily_budget
    # ... apply to your planning logic
```

## ✅ Test Checklist

Before considering the system ready for production:

- [ ] Demo script runs without errors
- [ ] Integration tests pass
- [ ] Unit tests pass (if using pytest)
- [ ] API endpoints respond correctly
- [ ] Persona creation works
- [ ] Context switching works
- [ ] Family grouping works
- [ ] UI loads without errors
- [ ] No import errors
- [ ] File permissions correct
- [ ] Performance acceptable

## 🎉 Success Criteria

Your persona system is ready when:

1. ✅ All tests pass
2. ✅ Demo runs smoothly
3. ✅ API endpoints work
4. ✅ UI is functional
5. ✅ No critical errors
6. ✅ Performance is acceptable
7. ✅ Integration points identified

Ready to integrate with your main LifePlanner application! 🚀
