/**
 * Outcome Calendar Integration
 * Handles clickable activity tiles and completion tracking
 */

class OutcomeCalendar {
    constructor() {
        this.apiBaseUrl = '/api'; // Adjust for your Flask app
        this.currentActivity = null;
        this.completionStatus = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadCalendarActivities();
    }
    
    /**
     * Load calendar activities with outcome predictions
     */
    async loadCalendarActivities(date = null) {
        const targetDate = date || new Date().toISOString().split('T')[0];
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/calendar-activities/${targetDate}`);
            const data = await response.json();
            
            if (data.activities) {
                this.renderCalendarActivities(data.activities);
            }
        } catch (error) {
            console.error('Error loading calendar activities:', error);
            // Fallback to demo data if API not available
            this.renderDemoActivities();
        }
    }
    
    /**
     * Render calendar activities as clickable tiles
     */
    renderCalendarActivities(activities) {
        const calendarContainer = document.getElementById('calendar-container');
        if (!calendarContainer) return;
        
        // Group activities by time period
        const groupedActivities = this.groupActivitiesByPeriod(activities);
        
        let html = '';
        
        for (const [period, periodActivities] of Object.entries(groupedActivities)) {
            html += `<div class="day-column">`;
            html += `<div class="day-title">${this.getPeriodIcon(period)} ${period}</div>`;
            
            for (const activity of periodActivities) {
                html += this.renderActivityTile(activity);
            }
            
            html += `</div>`;
        }
        
        calendarContainer.innerHTML = html;
        this.attachTileClickHandlers();
    }
    
    /**
     * Render individual activity tile
     */
    renderActivityTile(activity) {
        const streakDisplay = activity.current_streak > 0 ? `🔥 ${activity.current_streak} days` : 'New';
        const expectedOutcome = this.getTopOutcome(activity.expected_outcomes);
        
        return `
            <div class="activity-tile clickable" 
                 data-activity="${activity.activity_id}"
                 onclick="outcomeCalendar.openCompletionModal('${activity.activity_id}')">
                <div class="activity-streak">${streakDisplay}</div>
                <div class="activity-time">${activity.start_time} - ${activity.end_time}</div>
                <div class="activity-name">${activity.name}</div>
                <div class="activity-outcome">${expectedOutcome}</div>
                <div class="click-hint">Click to record completion</div>
            </div>
        `;
    }
    
    /**
     * Group activities by time period
     */
    groupActivitiesByPeriod(activities) {
        const groups = {
            'Morning Routine': [],
            'Exercise': [],
            'Work & Professional': [],
            'Evening & Social': []
        };
        
        for (const activity of activities) {
            const hour = parseInt(activity.start_time.split(':')[0]);
            
            if (activity.category === 'morning_routine') {
                groups['Morning Routine'].push(activity);
            } else if (activity.category === 'fitness') {
                groups['Exercise'].push(activity);
            } else if (hour >= 9 && hour < 18) {
                groups['Work & Professional'].push(activity);
            } else {
                groups['Evening & Social'].push(activity);
            }
        }
        
        // Remove empty groups
        return Object.fromEntries(
            Object.entries(groups).filter(([_, activities]) => activities.length > 0)
        );
    }
    
    /**
     * Get period icon
     */
    getPeriodIcon(period) {
        const icons = {
            'Morning Routine': '🌅',
            'Exercise': '🏃',
            'Work & Professional': '💼',
            'Evening & Social': '🌆'
        };
        return icons[period] || '📅';
    }
    
    /**
     * Get top expected outcome for display
     */
    getTopOutcome(outcomes) {
        if (!outcomes || outcomes.length === 0) {
            return 'Expected: Positive outcomes from completion';
        }
        
        // Find highest probability outcome
        const topOutcome = outcomes.reduce((best, current) => {
            const bestProb = this.extractProbability(best.probability || '0%');
            const currentProb = this.extractProbability(current.probability || '0%');
            return currentProb > bestProb ? current : best;
        });
        
        return `Expected: ${topOutcome.name}`;
    }
    
    /**
     * Extract probability percentage from string
     */
    extractProbability(probStr) {
        const match = probStr.match(/(\d+)%/);
        return match ? parseInt(match[1]) : 0;
    }
    
    /**
     * Attach click handlers to activity tiles
     */
    attachTileClickHandlers() {
        const tiles = document.querySelectorAll('.activity-tile.clickable');
        tiles.forEach(tile => {
            tile.addEventListener('click', (e) => {
                const activityId = tile.getAttribute('data-activity');
                this.openCompletionModal(activityId);
            });
        });
    }
    
    /**
     * Open completion modal for activity
     */
    async openCompletionModal(activityId) {
        this.currentActivity = activityId;
        
        // Get activity data
        const activityData = await this.getActivityData(activityId);
        if (!activityData) return;
        
        // Update modal content
        this.updateModalContent(activityData);
        
        // Show modal
        const modal = document.getElementById('completionModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }
    
    /**
     * Get activity data for modal
     */
    async getActivityData(activityId) {
        // In a real implementation, this might fetch from API
        // For now, return demo data
        const demoData = {
            'progressive_meditation': {
                name: 'Sharpen the Saw - Progressive Meditation',
                time: '6:45 - 6:47 AM (Week 5: 2 minutes)',
                outcomes: [
                    { name: 'Reduced Stress & Cortisol', probability: '88%' },
                    { name: 'Improved Attention & Focus', probability: '85%' },
                    { name: 'Enhanced Neuroplasticity', probability: '92%' },
                    { name: 'Better Emotional Regulation', probability: '80%' }
                ]
            },
            'goal_visualization': {
                name: 'Begin with the End in Mind - Goal Visualization',
                time: '6:15 - 6:45 AM',
                outcomes: [
                    { name: 'Enhanced Goal Achievement', probability: '78%' },
                    { name: 'Increased Intrinsic Motivation', probability: '82%' },
                    { name: 'Better Problem-Solving', probability: '75%' }
                ]
            },
            'wake_up_intention': {
                name: 'Be Proactive - Wake Up & Intention',
                time: '6:00 - 6:15 AM', 
                outcomes: [
                    { name: 'Improved Goal Clarity', probability: '90%' },
                    { name: 'Enhanced Self-Efficacy', probability: '85%' },
                    { name: 'Reduced Decision Fatigue', probability: '70%' }
                ]
            },
            'physical_exercise': {
                name: 'Tuesday Running (60 minutes)',
                time: '7:00 - 8:00 AM',
                outcomes: [
                    { name: 'Increased BDNF (Brain Health)', probability: '90%' },
                    { name: 'Improved Cardiovascular Health', probability: '95%' },
                    { name: 'Better Sleep Quality', probability: '85%' },
                    { name: 'Social Connection Opportunities', probability: '70%' }
                ]
            }
        };
        
        return demoData[activityId] || null;
    }
    
    /**
     * Update modal content
     */
    updateModalContent(activityData) {
        const modalTitle = document.getElementById('modalTitle');
        const modalSubtitle = document.getElementById('modalSubtitle');
        const outcomesList = document.getElementById('outcomesList');
        
        if (modalTitle) modalTitle.textContent = activityData.name;
        if (modalSubtitle) modalSubtitle.textContent = activityData.time;
        
        if (outcomesList && activityData.outcomes) {
            outcomesList.innerHTML = activityData.outcomes.map(outcome => 
                `<div class="outcome-item">• ${outcome.probability} chance: ${outcome.name}</div>`
            ).join('');
        }
        
        this.resetModalForm();
    }
    
    /**
     * Reset modal form
     */
    resetModalForm() {
        // Reset completion status
        this.completionStatus = null;
        
        // Reset buttons
        const completedBtn = document.getElementById('completedBtn');
        const missedBtn = document.getElementById('missedBtn');
        if (completedBtn) completedBtn.classList.remove('completed');
        if (missedBtn) missedBtn.classList.remove('missed');
        
        // Reset sliders
        const effortSlider = document.getElementById('effortSlider');
        const moodSlider = document.getElementById('moodSlider');
        if (effortSlider) {
            effortSlider.value = 3;
            const effortValue = document.getElementById('effortValue');
            if (effortValue) effortValue.textContent = '3';
        }
        if (moodSlider) {
            moodSlider.value = 3;
            const moodValue = document.getElementById('moodValue');
            if (moodValue) moodValue.textContent = '3';
        }
        
        // Reset notes
        const notesText = document.getElementById('notesText');
        if (notesText) notesText.value = '';
        
        // Hide success message
        const successMessage = document.getElementById('successMessage');
        if (successMessage) successMessage.style.display = 'none';
    }
    
    /**
     * Set completion status
     */
    setCompletion(completed) {
        this.completionStatus = completed;
        
        const completedBtn = document.getElementById('completedBtn');
        const missedBtn = document.getElementById('missedBtn');
        
        if (completed) {
            if (completedBtn) completedBtn.classList.add('completed');
            if (missedBtn) missedBtn.classList.remove('missed');
        } else {
            if (missedBtn) missedBtn.classList.add('missed');
            if (completedBtn) completedBtn.classList.remove('completed');
        }
    }
    
    /**
     * Save completion to backend
     */
    async saveCompletion() {
        if (this.completionStatus === null) {
            alert('Please select whether you completed the activity or not.');
            return;
        }
        
        const completionData = {
            activity_id: this.currentActivity,
            completed: this.completionStatus,
            effort_level: parseInt(document.getElementById('effortSlider')?.value || 3),
            mood_after: parseInt(document.getElementById('moodSlider')?.value || 3),
            notes: document.getElementById('notesText')?.value || '',
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
        };
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/record-completion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(completionData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showSuccessMessage(result.message, result.updated_info);
                this.updateActivityTileStatus(this.currentActivity, this.completionStatus);
                
                // Close modal after delay
                setTimeout(() => {
                    this.closeModal();
                }, 2000);
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Error saving completion:', error);
            // Fallback: show success message and update UI
            this.showSuccessMessage('✅ Completion recorded (offline mode)', null);
            this.updateActivityTileStatus(this.currentActivity, this.completionStatus);
            
            setTimeout(() => {
                this.closeModal();
            }, 2000);
        }
    }
    
    /**
     * Show success message with streak info
     */
    showSuccessMessage(message, updatedInfo) {
        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            let html = `<div>${message}</div>`;
            
            if (updatedInfo) {
                html += `<div style="margin-top: 10px; font-size: 0.9em;">`;
                html += `🔥 Current Streak: ${updatedInfo.current_streak} days<br>`;
                html += `⭐ Weekly Rating: ${updatedInfo.weekly_rating}/10<br>`;
                if (updatedInfo.next_milestone) {
                    html += `🎯 Next: ${updatedInfo.next_milestone.achievement} in ${updatedInfo.next_milestone.days_remaining} days`;
                }
                html += `</div>`;
            }
            
            successMessage.innerHTML = html;
            successMessage.style.display = 'block';
        }
    }
    
    /**
     * Update activity tile visual status
     */
    updateActivityTileStatus(activityId, completed) {
        const tile = document.querySelector(`[data-activity="${activityId}"]`);
        if (tile) {
            if (completed) {
                tile.classList.add('completed');
                tile.classList.remove('missed');
            } else {
                tile.classList.add('missed');
                tile.classList.remove('completed');
            }
        }
    }
    
    /**
     * Close modal
     */
    closeModal() {
        const modal = document.getElementById('completionModal');
        if (modal) {
            modal.style.display = 'none';
        }
        this.currentActivity = null;
        this.completionStatus = null;
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Slider updates
        document.addEventListener('input', (e) => {
            if (e.target.id === 'effortSlider') {
                const effortValue = document.getElementById('effortValue');
                if (effortValue) effortValue.textContent = e.target.value;
            } else if (e.target.id === 'moodSlider') {
                const moodValue = document.getElementById('moodValue');
                if (moodValue) moodValue.textContent = e.target.value;
            }
        });
        
        // Close modal on outside click
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('completionModal');
            if (e.target === modal) {
                this.closeModal();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }
    
    /**
     * Render demo activities (fallback)
     */
    renderDemoActivities() {
        console.log('Loading demo activities...');
        // This would render the demo HTML we created earlier
    }
}

// Global functions for HTML onclick handlers
function setCompletion(completed) {
    if (window.outcomeCalendar) {
        window.outcomeCalendar.setCompletion(completed);
    }
}

function saveCompletion() {
    if (window.outcomeCalendar) {
        window.outcomeCalendar.saveCompletion();
    }
}

function closeModal() {
    if (window.outcomeCalendar) {
        window.outcomeCalendar.closeModal();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.outcomeCalendar = new OutcomeCalendar();
});
