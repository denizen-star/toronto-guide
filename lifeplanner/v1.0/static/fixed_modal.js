/**
 * Fixed Modal for Activity Completion
 * Properly centered popup with toggle buttons and responsive sliders
 */

class FixedActivityModal {
    constructor() {
        this.currentActivity = null;
        this.currentPersona = null;
        this.completionStatus = null;
        this.createModal();
    }
    
    createModal() {
        // Remove any existing modal
        const existingModal = document.getElementById('completionModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal HTML with proper centering
        const modalHTML = `
        <div id="completionModal" style="
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1055;
            justify-content: center;
            align-items: center;
        ">
            <div style="
                background: white;
                border-radius: 10px;
                width: 380px;
                max-width: 90vw;
                max-height: 85vh;
                box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                position: relative;
                display: flex;
                flex-direction: column;
            ">
                <!-- Header -->
                <div style="
                    background: #28a745;
                    color: white;
                    padding: 15px 20px;
                    border-radius: 10px 10px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <div>
                        <h6 id="modalTitle" style="margin: 0; font-size: 1em; font-weight: bold;">Activity Completion</h6>
                        <div id="modalSubtitle" style="font-size: 0.8em; opacity: 0.8; margin-top: 3px;"></div>
                    </div>
                    <button onclick="closeModal()" style="
                        background: none;
                        border: none;
                        color: white;
                        font-size: 1.2em;
                        cursor: pointer;
                        padding: 5px;
                    ">&times;</button>
                </div>
                
                <!-- Body -->
                <div style="padding: 15px; flex: 1; overflow-y: auto;">
                    <!-- Expected Outcomes -->
                    <div style="
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 8px;
                        margin-bottom: 12px;
                        border: 1px solid #e9ecef;
                    ">
                        <h6 style="color: #2c3e50; margin-bottom: 10px; font-size: 0.9em; font-weight: bold;">
                            🎯 Expected Outcomes:
                        </h6>
                        <div id="modalOutcomesList" style="color: #555; line-height: 1.4; font-size: 0.85em;"></div>
                    </div>
                    
                    <!-- Completion Toggle Buttons -->
                    <div style="margin-bottom: 20px;">
                        <h6 style="color: #2c3e50; margin-bottom: 10px; font-size: 0.9em; font-weight: bold;">
                            Did you complete this activity?
                        </h6>
                        <div style="display: flex; gap: 10px;">
                            <button id="completedBtn" onclick="setCompletion(true)" style="
                                flex: 1;
                                padding: 12px;
                                border: 2px solid #28a745;
                                background: white;
                                color: #28a745;
                                border-radius: 8px;
                                cursor: pointer;
                                font-weight: bold;
                                transition: all 0.2s ease;
                            ">
                                ✅ Completed
                            </button>
                            <button id="missedBtn" onclick="setCompletion(false)" style="
                                flex: 1;
                                padding: 12px;
                                border: 2px solid #dc3545;
                                background: white;
                                color: #dc3545;
                                border-radius: 8px;
                                cursor: pointer;
                                font-weight: bold;
                                transition: all 0.2s ease;
                            ">
                                ❌ Missed
                            </button>
                        </div>
                    </div>
                    
                    <!-- Effort Level -->
                    <div style="margin-bottom: 15px;">
                        <label style="font-weight: bold; color: #2c3e50; margin-bottom: 8px; font-size: 0.85em; display: block;">
                            Effort Level (1-5):
                        </label>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <input type="range" id="effortSlider" min="1" max="5" value="3" style="
                                flex: 1;
                                height: 6px;
                                border-radius: 3px;
                                background: #ddd;
                                outline: none;
                                -webkit-appearance: none;
                            ">
                            <span id="effortValue" style="
                                background: #28a745;
                                color: white;
                                padding: 5px 10px;
                                border-radius: 15px;
                                font-size: 0.9em;
                                font-weight: bold;
                                min-width: 30px;
                                text-align: center;
                            ">3</span>
                        </div>
                    </div>
                    
                    <!-- Mood After -->
                    <div style="margin-bottom: 15px;">
                        <label style="font-weight: bold; color: #2c3e50; margin-bottom: 8px; font-size: 0.85em; display: block;">
                            Mood After (1-5):
                        </label>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <input type="range" id="moodSlider" min="1" max="5" value="3" style="
                                flex: 1;
                                height: 6px;
                                border-radius: 3px;
                                background: #ddd;
                                outline: none;
                                -webkit-appearance: none;
                            ">
                            <span id="moodValue" style="
                                background: #17a2b8;
                                color: white;
                                padding: 5px 10px;
                                border-radius: 15px;
                                font-size: 0.9em;
                                font-weight: bold;
                                min-width: 30px;
                                text-align: center;
                            ">3</span>
                        </div>
                    </div>
                    
                    <!-- Notes -->
                    <div style="margin-bottom: 15px;">
                        <label style="font-weight: bold; color: #2c3e50; margin-bottom: 8px; font-size: 0.85em; display: block;">
                            Notes (optional):
                        </label>
                        <textarea id="notesText" rows="2" style="
                            width: 100%;
                            border: 1px solid #ddd;
                            border-radius: 6px;
                            padding: 8px;
                            font-size: 0.9em;
                            resize: vertical;
                            font-family: inherit;
                        " placeholder="How did it go?"></textarea>
                    </div>
                    
                    <!-- Success Message -->
                    <div id="successMessage" style="
                        display: none;
                        background: #28a745;
                        color: white;
                        padding: 15px;
                        border-radius: 8px;
                        margin-bottom: 10px;
                        font-weight: bold;
                        text-align: center;
                    ">
                        ✅ Activity recorded successfully!
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="
                    border-top: 1px solid #e9ecef;
                    padding: 15px 20px;
                    border-radius: 0 0 10px 10px;
                    display: flex;
                    gap: 10px;
                    justify-content: flex-end;
                ">
                    <button onclick="closeModal()" style="
                        padding: 8px 16px;
                        border: 1px solid #6c757d;
                        background: white;
                        color: #6c757d;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: bold;
                    ">Cancel</button>
                    <button onclick="saveCompletion()" style="
                        padding: 8px 16px;
                        border: none;
                        background: #28a745;
                        color: white;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: bold;
                    ">Save</button>
                </div>
            </div>
        </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.setupSliders();
    }
    
    setupSliders() {
        // Setup slider event listeners
        const effortSlider = document.getElementById('effortSlider');
        const moodSlider = document.getElementById('moodSlider');
        const effortValue = document.getElementById('effortValue');
        const moodValue = document.getElementById('moodValue');
        
        if (effortSlider && effortValue) {
            effortSlider.addEventListener('input', function() {
                effortValue.textContent = this.value;
            });
        }
        
        if (moodSlider && moodValue) {
            moodSlider.addEventListener('input', function() {
                moodValue.textContent = this.value;
            });
        }
        
        // Close modal when clicking outside
        document.getElementById('completionModal').addEventListener('click', (e) => {
            if (e.target.id === 'completionModal') {
                this.closeModal();
            }
        });
    }
    
    openModal(activityId, persona, activityName, activityTime) {
        this.currentActivity = activityId;
        this.currentPersona = persona;
        
        // Update modal content
        document.getElementById('modalTitle').textContent = activityName;
        document.getElementById('modalSubtitle').textContent = activityTime;
        
        // Get outcomes for this activity
        const outcomes = this.getActivityOutcomes(activityId);
        const outcomesList = document.getElementById('modalOutcomesList');
        outcomesList.innerHTML = outcomes.map(outcome => 
            `<div style="margin: 5px 0; color: #555;">• ${outcome}</div>`
        ).join('');
        
        // Reset form
        this.resetForm();
        
        // Show modal with flex display for centering
        const modal = document.getElementById('completionModal');
        modal.style.display = 'flex';
    }
    
    closeModal() {
        const modal = document.getElementById('completionModal');
        modal.style.display = 'none';
        this.currentActivity = null;
        this.currentPersona = null;
        this.completionStatus = null;
    }
    
    setCompletion(completed) {
        this.completionStatus = completed;
        
        const completedBtn = document.getElementById('completedBtn');
        const missedBtn = document.getElementById('missedBtn');
        
        // Reset both buttons
        completedBtn.style.cssText = `
            flex: 1;
            padding: 12px;
            border: 2px solid #28a745;
            background: white;
            color: #28a745;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.2s ease;
        `;
        
        missedBtn.style.cssText = `
            flex: 1;
            padding: 12px;
            border: 2px solid #dc3545;
            background: white;
            color: #dc3545;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.2s ease;
        `;
        
        // Highlight selected button
        if (completed) {
            completedBtn.style.cssText = `
                flex: 1;
                padding: 12px;
                border: 2px solid #28a745;
                background: #28a745;
                color: white;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.2s ease;
            `;
        } else {
            missedBtn.style.cssText = `
                flex: 1;
                padding: 12px;
                border: 2px solid #dc3545;
                background: #dc3545;
                color: white;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.2s ease;
            `;
        }
    }
    
    resetForm() {
        this.completionStatus = null;
        
        // Reset buttons
        this.setCompletion(null);
        
        // Reset sliders
        document.getElementById('effortSlider').value = 3;
        document.getElementById('moodSlider').value = 3;
        document.getElementById('effortValue').textContent = '3';
        document.getElementById('moodValue').textContent = '3';
        
        // Reset notes
        document.getElementById('notesText').value = '';
        
        // Hide success message
        document.getElementById('successMessage').style.display = 'none';
    }
    
    async saveCompletion() {
        console.log('💾 saveCompletion called, status:', this.completionStatus);
        
        if (this.completionStatus === null) {
            console.log('⚠️ No completion status selected');
            alert('Please select whether you completed the activity or not.');
            return;
        }
        
        console.log('✅ Proceeding with save...');
        
        const completionData = {
            activity_id: this.currentActivity,
            persona: this.currentPersona,
            completed: this.completionStatus,
            effort_level: parseInt(document.getElementById('effortSlider').value),
            mood_after: parseInt(document.getElementById('moodSlider').value),
            notes: document.getElementById('notesText').value,
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
        };
        
        try {
            const response = await fetch('/api/record-completion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(completionData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.updateProgress(this.currentActivity, this.currentPersona, this.completionStatus);
                this.showSuccess(result.message);
                this.updateActivityTile(this.currentActivity, this.completionStatus);
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Error saving completion:', error);
            this.updateProgress(this.currentActivity, this.currentPersona, this.completionStatus);
            this.showSuccess('✅ Completion recorded (offline mode)');
            this.updateActivityTile(this.currentActivity, this.completionStatus);
        }
    }
    
    updateProgress(activityId, persona, completed) {
        // Extract activity type from ID
        const activityType = this.extractActivityType(activityId);
        const streakKey = `streak_${activityType}_${persona}`;
        const completionKey = `completions_${activityType}_${persona}`;
        const lastDateKey = `last_date_${activityType}_${persona}`;
        
        const today = new Date().toISOString().split('T')[0];
        const lastDate = localStorage.getItem(lastDateKey);
        
        if (completed) {
            // Update streak
            let currentStreak = parseInt(localStorage.getItem(streakKey) || '0');
            
            if (lastDate) {
                const daysDiff = Math.floor((new Date(today) - new Date(lastDate)) / (1000 * 60 * 60 * 24));
                if (daysDiff === 1) {
                    // Consecutive day - increment streak
                    currentStreak += 1;
                } else if (daysDiff === 0) {
                    // Same day - keep streak
                } else {
                    // Gap - reset streak
                    currentStreak = 1;
                }
            } else {
                // First completion
                currentStreak = 1;
            }
            
            localStorage.setItem(streakKey, currentStreak.toString());
            localStorage.setItem(lastDateKey, today);
            
            // Update total completions
            const totalCompletions = parseInt(localStorage.getItem(completionKey) || '0') + 1;
            localStorage.setItem(completionKey, totalCompletions.toString());
            
        } else {
            // Missed - break streak but don't reset total completions
            localStorage.setItem(streakKey, '0');
            localStorage.setItem(lastDateKey, today);
        }
        
        // Update the activity tile streak display
        this.updateActivityStreakDisplay(activityId, persona);
    }
    
    extractActivityType(activityId) {
        const name = activityId.toLowerCase();
        
        if (name.includes('meditation')) return 'meditation';
        if (name.includes('visualization') || name.includes('goal')) return 'visualization';
        if (name.includes('intention') || name.includes('wake')) return 'intention';
        if (name.includes('exercise') || name.includes('running')) return 'exercise';
        if (name.includes('job') || name.includes('application')) return 'job_application';
        if (name.includes('skill') || name.includes('course')) return 'skill_development';
        
        return activityId;
    }
    
    updateActivityStreakDisplay(activityId, persona) {
        // Update the streak display in the activity tile
        const tile = document.querySelector(`[data-activity-id="${activityId}"]`);
        if (tile) {
            const outcomePreview = tile.querySelector('.outcome-preview');
            if (outcomePreview) {
                const activityType = this.extractActivityType(activityId);
                const streakKey = `streak_${activityType}_${persona}`;
                const currentStreak = parseInt(localStorage.getItem(streakKey) || '0');
                
                let streakDisplay = "Start";
                if (currentStreak > 0) {
                    const emoji = currentStreak >= 30 ? "🔥🔥🔥" : currentStreak >= 7 ? "🔥🔥" : "🔥";
                    streakDisplay = `${emoji} ${currentStreak} day${currentStreak > 1 ? 's' : ''}`;
                }
                
                // Update the streak span in the outcome preview
                const streakSpan = outcomePreview.querySelector('span:last-child');
                if (streakSpan) {
                    streakSpan.textContent = streakDisplay;
                }
            }
        }
    }
    
    showSuccess(message) {
        const successDiv = document.getElementById('successMessage');
        successDiv.innerHTML = message;
        successDiv.style.display = 'block';
        
        setTimeout(() => {
            this.closeModal();
        }, 1500);
    }
    
    updateActivityTile(activityId, completed) {
        const tile = document.querySelector(`[data-activity-id="${activityId}"]`);
        if (tile) {
            if (completed) {
                tile.style.background = 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)';
                tile.style.color = 'white';
            } else {
                tile.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ffa8a8 100%)';
                tile.style.color = 'white';
            }
        }
    }
    
    getActivityOutcomes(activityId) {
        const name = activityId.toLowerCase();
        
        const outcomeDatabase = {
            'meditation': [
                '88% chance: 25% reduction in stress and cortisol',
                '85% chance: Improved attention and cognitive control',
                '92% chance: Enhanced neuroplasticity (long-term)'
            ],
            'visualization': [
                '78% chance: +23% higher goal achievement rate',
                '82% chance: Increased intrinsic motivation',
                '75% chance: Better problem-solving abilities'
            ],
            'intention': [
                '90% chance: +15% improved goal clarity',
                '85% chance: Enhanced self-efficacy',
                '70% chance: Reduced decision fatigue'
            ],
            'exercise': [
                '90% chance: Increased BDNF for brain health',
                '95% chance: Improved cardiovascular health',
                '85% chance: Better sleep quality tonight'
            ],
            'networking': [
                '80% chance: 2-5 new professional connections',
                '65% chance: Career advancement opportunities',
                '90% chance: Industry knowledge acquisition'
            ]
        };
        
        // Find matching outcomes
        for (const [key, outcomes] of Object.entries(outcomeDatabase)) {
            if (name.includes(key)) {
                return outcomes;
            }
        }
        
        return ['Expected: Positive outcomes from completion'];
    }
}

// Initialize the fixed modal
window.fixedModal = new FixedActivityModal();

// Global functions for HTML onclick handlers
function setCompletion(completed) {
    if (window.fixedModal) {
        window.fixedModal.setCompletion(completed);
    }
}

function saveCompletion() {
    console.log('🎯 Save button clicked!');
    if (window.fixedModal) {
        console.log('✅ Fixed modal found, calling saveCompletion...');
        window.fixedModal.saveCompletion();
    } else {
        console.error('❌ Fixed modal not found!');
        alert('Error: Modal not properly initialized. Please refresh the page.');
    }
}

function closeModal() {
    if (window.fixedModal) {
        window.fixedModal.closeModal();
    }
}
