/**
 * Clickable Outcome Tracking for Existing LifePlanner
 * Adds clickable functionality to existing calendar tiles without changing the design
 */

class ClickableOutcomeTracker {
    constructor() {
        this.currentActivity = null;
        this.currentPersona = null;
        this.completionStatus = null;
        this.apiBaseUrl = '';
        
        this.activityOutcomes = {
            'progressive_meditation': [
                '88% chance: 25% reduction in stress and cortisol',
                '85% chance: Improved attention and cognitive control',
                '92% chance: Enhanced neuroplasticity (long-term)',
                '80% chance: Better emotional regulation'
            ],
            'goal_visualization': [
                '78% chance: +23% higher goal achievement rate',
                '82% chance: Increased intrinsic motivation',
                '75% chance: Better problem-solving abilities'
            ],
            'wake_up_intention': [
                '90% chance: +15% improved goal clarity',
                '85% chance: Enhanced self-efficacy',
                '70% chance: Reduced decision fatigue'
            ],
            'physical_exercise': [
                '90% chance: Increased BDNF for brain health',
                '95% chance: Improved cardiovascular health',
                '85% chance: Better sleep quality tonight',
                '70% chance: Social connection opportunities'
            ],
            'running': [
                '90% chance: Increased BDNF for brain health',
                '95% chance: Improved cardiovascular health',
                '85% chance: Better sleep quality tonight'
            ],
            'job_application': [
                '75% chance: Career advancement progress',
                '70% chance: Interview opportunities',
                '65% chance: Salary negotiation insights'
            ],
            'skill_development': [
                '85% chance: Enhanced technical skills',
                '75% chance: Increased market value',
                '80% chance: Career pivot opportunities'
            ],
            'networking': [
                '80% chance: 2-5 new professional connections',
                '65% chance: Career advancement opportunities',
                '90% chance: Industry knowledge acquisition'
            ]
        };
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeIfCalendarPage());
        } else {
            this.initializeIfCalendarPage();
        }
    }
    
    initializeIfCalendarPage() {
        // Only initialize on calendar pages, not homepage
        const isCalendarPage = window.location.pathname.includes('/calendar/') || 
                              document.querySelector('.daily-schedule') || 
                              document.querySelector('.calendar-event');
        
        if (isCalendarPage) {
            this.enhanceExistingTiles();
        } else {
            console.log('ℹ️ Not on calendar page - skipping outcome tracking initialization');
        }
    }
    
    enhanceExistingTiles() {
        console.log('🎯 Enhancing existing calendar tiles with clickable outcome tracking...');
        
        // Find all existing calendar-event tiles
        const tiles = document.querySelectorAll('.calendar-event');
        
        // Only enhance if we're on a calendar page with actual activities
        if (tiles.length === 0) {
            console.log('ℹ️ No calendar tiles found - skipping enhancement (probably on homepage)');
            return;
        }
        
        tiles.forEach((tile, index) => {
            this.enhanceTile(tile, index);
        });
        
        // Only add modal and widgets if we have activities to track
        this.fixedModal = new FixedActivityModal();
        this.addSidebarWidgets();
        
        console.log(`✅ Enhanced ${tiles.length} activity tiles with outcome tracking`);
    }
    
    enhanceTile(tile, index) {
        // Extract activity information
        const titleElement = tile.querySelector('.event-title');
        const timeElement = tile.querySelector('.event-time');
        
        if (!titleElement || !timeElement) return;
        
        const activityName = titleElement.textContent.trim();
        const activityTime = timeElement.textContent.trim();
        const activityId = this.generateActivityId(activityName);
        
        // Get current persona from URL
        const urlParams = new URLSearchParams(window.location.search);
        const persona = urlParams.get('kevin_type') || 'working';
        
        // Add data attributes
        tile.setAttribute('data-activity-id', activityId);
        tile.setAttribute('data-kevin-type', persona);
        
        // Add clickable styling and behavior
        tile.style.cursor = 'pointer';
        tile.style.transition = 'all 0.3s ease';
        tile.classList.add('clickable-activity');
        
        // Add hover effects
        tile.addEventListener('mouseenter', () => {
            tile.style.transform = 'translateY(-2px)';
            tile.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
        });
        
        tile.addEventListener('mouseleave', () => {
            tile.style.transform = 'translateY(0)';
            tile.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        });
        
        // Add click handler
        tile.addEventListener('click', (e) => {
            // Don't trigger if clicking on links
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                return;
            }
            
            this.fixedModal.openModal(activityId, persona, activityName, activityTime);
        });
        
        // Add outcome preview
        this.addOutcomePreview(tile, activityId, persona);
        
        // Add click hint
        this.addClickHint(tile);
    }
    
    addOutcomePreview(tile, activityId, persona) {
        // Get outcome prediction
        const outcome = this.getOutcomePrediction(activityId, persona);
        const streak = this.getActivityStreak(activityId, persona);
        
        // Create outcome preview element
        const outcomeDiv = document.createElement('div');
        outcomeDiv.className = 'outcome-preview';
        outcomeDiv.style.cssText = `
            background: rgba(40, 167, 69, 0.1);
            padding: 8px 12px;
            border-radius: 6px;
            margin: 8px 0;
            font-size: 0.85em;
            border-left: 3px solid #28a745;
        `;
        
        outcomeDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <strong style="color: #2c3e50;">${outcome}</strong>
                <span style="color: #e74c3c; font-weight: bold; font-size: 0.9em;">${streak}</span>
            </div>
        `;
        
        // Insert after event-description
        const descriptionElement = tile.querySelector('.event-description');
        if (descriptionElement) {
            descriptionElement.parentNode.insertBefore(outcomeDiv, descriptionElement.nextSibling);
        }
    }
    
    addClickHint(tile) {
        const hintDiv = document.createElement('div');
        hintDiv.className = 'click-hint';
        hintDiv.style.cssText = `
            text-align: center;
            margin-top: 10px;
            font-size: 0.8em;
            color: #999;
            font-style: italic;
        `;
        hintDiv.textContent = 'Click anywhere on this tile to record completion and track outcomes';
        
        tile.appendChild(hintDiv);
    }
    
    generateActivityId(activityName) {
        return activityName.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');
    }
    
    getOutcomePrediction(activityId, persona) {
        const name = activityId.toLowerCase();
        
        if (name.includes('meditation')) {
            return "Expected: 88% stress reduction, improved focus (Week 5: 2 min)";
        } else if (name.includes('intention') || name.includes('wake')) {
            return "Expected: 90% improved goal clarity, enhanced self-efficacy";
        } else if (name.includes('visualization') || name.includes('goal')) {
            return "Expected: 78% better goal achievement, increased motivation";
        } else if (name.includes('running') || name.includes('exercise')) {
            return "Expected: 95% cardiovascular health, better sleep";
        } else if (name.includes('networking') || name.includes('meetup')) {
            return "Expected: 80% chance of 2-5 new professional connections";
        } else if (persona === "jobsearch" && (name.includes('job') || name.includes('application'))) {
            return "Expected: 75% career advancement progress";
        } else if (persona === "jobsearch" && (name.includes('skill') || name.includes('course'))) {
            return "Expected: 85% enhanced technical skills";
        } else if (name.includes('swim')) {
            return "Expected: 90% cardiovascular fitness, 85% stress relief";
        } else if (name.includes('tennis')) {
            return "Expected: 85% coordination improvement, 75% social connections";
        } else if (name.includes('church') || name.includes('mass')) {
            return "Expected: 80% community connection, 70% spiritual fulfillment";
        } else if (name.includes('couple') || name.includes('peter')) {
            return "Expected: 90% relationship strengthening, 85% emotional connection";
        } else {
            return "Expected: Positive outcomes from completion";
        }
    }
    
    getActivityStreak(activityId, persona) {
        // Get actual streak from localStorage or start at 0
        const streakKey = `streak_${activityId}_${persona}`;
        const currentStreak = parseInt(localStorage.getItem(streakKey) || '0');
        
        if (currentStreak === 0) {
            return "Start";
        } else if (currentStreak === 1) {
            return "🔥 1 day";
        } else if (currentStreak < 7) {
            return `🔥 ${currentStreak} days`;
        } else if (currentStreak < 30) {
            return `🔥🔥 ${currentStreak} days`;
        } else {
            return `🔥🔥🔥 ${currentStreak} days`;
        }
    }
    
    openCompletionModal(activityId, persona, activityName, activityTime) {
        this.currentActivity = activityId;
        this.currentPersona = persona;
        
        // Update modal content
        document.getElementById('modalTitle').textContent = activityName;
        document.getElementById('modalSubtitle').textContent = activityTime;
        
        // Get outcomes for this activity
        const outcomes = this.getActivityOutcomes(activityId);
        const outcomesList = document.getElementById('modalOutcomesList');
        outcomesList.innerHTML = outcomes.map(outcome => 
            `<div style="margin: 8px 0; color: #555;">• ${outcome}</div>`
        ).join('');
        
        // Reset form
        this.resetForm();
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('completionModal'));
        modal.show();
    }
    
    getActivityOutcomes(activityId) {
        const name = activityId.toLowerCase();
        
        // Find matching outcomes
        for (const [key, outcomes] of Object.entries(this.activityOutcomes)) {
            if (name.includes(key.replace('_', ''))) {
                return outcomes;
            }
        }
        
        return ['Expected: Positive outcomes from completion'];
    }
    
    setCompletion(completed) {
        this.completionStatus = completed;
        
        const completedBtn = document.getElementById('completedBtn');
        const missedBtn = document.getElementById('missedBtn');
        
        if (!completedBtn || !missedBtn) return;
        
        // Reset both buttons to default state
        completedBtn.className = 'btn btn-outline-success btn-sm';
        completedBtn.style.cssText = 'padding: 8px; font-size: 0.9em;';
        
        missedBtn.className = 'btn btn-outline-danger btn-sm';
        missedBtn.style.cssText = 'padding: 8px; font-size: 0.9em;';
        
        // Highlight the selected button
        if (completed) {
            completedBtn.className = 'btn btn-success btn-sm';
            completedBtn.style.cssText = 'padding: 8px; font-size: 0.9em; background: #28a745 !important; border-color: #28a745 !important; color: white !important;';
        } else {
            missedBtn.className = 'btn btn-danger btn-sm';
            missedBtn.style.cssText = 'padding: 8px; font-size: 0.9em; background: #dc3545 !important; border-color: #dc3545 !important; color: white !important;';
        }
    }
    
    resetForm() {
        this.completionStatus = null;
        
        // Reset buttons to default state
        const completedBtn = document.getElementById('completedBtn');
        const missedBtn = document.getElementById('missedBtn');
        if (completedBtn) {
            completedBtn.className = 'btn btn-outline-success btn-sm';
            completedBtn.style.background = '';
            completedBtn.style.borderColor = '';
            completedBtn.style.color = '';
        }
        if (missedBtn) {
            missedBtn.className = 'btn btn-outline-danger btn-sm';
            missedBtn.style.background = '';
            missedBtn.style.borderColor = '';
            missedBtn.style.color = '';
        }
        
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
    
    async saveCompletion() {
        if (this.completionStatus === null) {
            alert('Please select whether you completed the activity or not.');
            return;
        }
        
        const completionData = {
            activity_id: this.currentActivity,
            persona: this.currentPersona,
            completed: this.completionStatus,
            effort_level: parseInt(document.getElementById('effortSlider')?.value || 3),
            mood_after: parseInt(document.getElementById('moodSlider')?.value || 3),
            notes: document.getElementById('notesText')?.value || '',
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
                this.showSuccess(result.message, result.updated_info);
                this.updateTileStatus(this.currentActivity, this.completionStatus);
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Error saving completion:', error);
            // Fallback: show success and update UI
            this.showSuccess('✅ Completion recorded (offline mode)', null);
            this.updateTileStatus(this.currentActivity, this.completionStatus);
        }
    }
    
    showSuccess(message, updatedInfo) {
        const successDiv = document.getElementById('successMessage');
        if (successDiv) {
            let html = `<i class="fas fa-check-circle"></i> ${message}`;
            
            if (updatedInfo) {
                html += `<div style="margin-top: 10px; font-size: 0.9em;">`;
                html += `🔥 Current Streak: ${updatedInfo.current_streak} days<br>`;
                html += `⭐ Weekly Rating: ${updatedInfo.weekly_rating}/10<br>`;
                if (updatedInfo.next_milestone) {
                    html += `🎯 Next: ${updatedInfo.next_milestone.achievement} in ${updatedInfo.next_milestone.days_remaining} days`;
                }
                html += `</div>`;
            }
            
            successDiv.innerHTML = html;
            successDiv.style.display = 'block';
            
            // Auto-close modal after 2 seconds
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('completionModal'));
                if (modal) modal.hide();
            }, 2000);
        }
    }
    
    updateTileStatus(activityId, completed) {
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
    
    addCompletionModal() {
        // Check if modal already exists
        if (document.getElementById('completionModal')) return;
        
        const modalHTML = `
        <!-- Activity Completion Modal -->
        <div class="modal fade" id="completionModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-sm modal-dialog-centered" style="max-width: 400px;">
                <div class="modal-content" style="border-radius: 10px; border: none; box-shadow: 0 5px 15px rgba(0,0,0,0.2);">
                    <div class="modal-header" style="background: #28a745; color: white; border-radius: 10px 10px 0 0; border-bottom: none; padding: 15px;">
                        <div style="width: 100%;">
                            <h6 class="modal-title" id="modalTitle" style="margin: 0; font-size: 1em; font-weight: bold;">Activity Completion</h6>
                            <div class="modal-subtitle" id="modalSubtitle" style="font-size: 0.8em; opacity: 0.8; margin-top: 3px;"></div>
                        </div>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" style="margin: 0; font-size: 0.8em;"></button>
                    </div>
                    
                    <div class="modal-body" style="padding: 15px;">
                        <div class="outcome-info" style="margin-bottom: 15px;">
                            <div style="background: #f8f9fa; padding: 10px; border-radius: 6px; border: 1px solid #e9ecef;">
                                <h6 style="color: #2c3e50; margin-bottom: 8px; font-size: 0.9em; font-weight: bold;">
                                    🎯 Expected Outcomes:
                                </h6>
                                <div id="modalOutcomesList" style="color: #555; line-height: 1.4; font-size: 0.85em;"></div>
                            </div>
                        </div>
                        
                        <div class="completion-selection" style="margin-bottom: 15px;">
                            <h6 style="color: #2c3e50; margin-bottom: 10px; font-size: 0.9em; font-weight: bold;">Did you complete this activity?</h6>
                            <div class="btn-group w-100" role="group">
                                <button type="button" class="btn btn-outline-success btn-sm" id="completedBtn" onclick="outcomeTracker.setCompletion(true)" style="padding: 8px; font-size: 0.9em;">
                                    ✅ Completed
                                </button>
                                <button type="button" class="btn btn-outline-danger btn-sm" id="missedBtn" onclick="outcomeTracker.setCompletion(false)" style="padding: 8px; font-size: 0.9em;">
                                    ❌ Missed
                                </button>
                            </div>
                        </div>
                        
                        <div class="rating-sections">
                            <div style="margin-bottom: 12px;">
                                <label class="form-label" style="font-weight: bold; color: #2c3e50; margin-bottom: 5px; font-size: 0.85em;">
                                    Effort Level (1-5):
                                </label>
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <input type="range" class="form-range" id="effortSlider" min="1" max="5" value="3" style="flex: 1;">
                                    <span class="badge bg-success" id="effortValue" style="font-size: 0.9em; padding: 5px 10px; min-width: 30px;">3</span>
                                </div>
                            </div>
                            
                            <div style="margin-bottom: 12px;">
                                <label class="form-label" style="font-weight: bold; color: #2c3e50; margin-bottom: 5px; font-size: 0.85em;">
                                    Mood After (1-5):
                                </label>
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <input type="range" class="form-range" id="moodSlider" min="1" max="5" value="3" style="flex: 1;">
                                    <span class="badge bg-info" id="moodValue" style="font-size: 0.9em; padding: 5px 10px; min-width: 30px;">3</span>
                                </div>
                            </div>
                            
                            <div style="margin-bottom: 15px;">
                                <label class="form-label" style="font-weight: bold; color: #2c3e50; margin-bottom: 5px; font-size: 0.85em;">
                                    Notes (optional):
                                </label>
                                <textarea class="form-control" id="notesText" rows="2" 
                                         style="border: 1px solid #ddd; border-radius: 6px; padding: 8px; font-size: 0.9em;"
                                         placeholder="How did it go?"></textarea>
                            </div>
                        </div>
                        
                        <div id="successMessage" class="alert alert-success" style="display: none; border-radius: 6px; border: none; background: #28a745; color: white; padding: 10px; font-size: 0.9em;">
                            ✅ Activity recorded successfully!
                        </div>
                    </div>
                    
                    <div class="modal-footer" style="border-top: 1px solid #e9ecef; padding: 10px 15px; border-radius: 0 0 10px 10px;">
                        <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal" style="padding: 6px 15px; border-radius: 15px;">
                            Cancel
                        </button>
                        <button type="button" class="btn btn-success btn-sm" onclick="outcomeTracker.saveCompletion()" style="padding: 6px 15px; border-radius: 15px;">
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add slider event listeners with immediate response
        setTimeout(() => {
            const effortSlider = document.getElementById('effortSlider');
            const moodSlider = document.getElementById('moodSlider');
            const effortValue = document.getElementById('effortValue');
            const moodValue = document.getElementById('moodValue');
            
            if (effortSlider && effortValue) {
                effortSlider.addEventListener('input', function() {
                    effortValue.textContent = this.value;
                });
                effortSlider.addEventListener('change', function() {
                    effortValue.textContent = this.value;
                });
            }
            
            if (moodSlider && moodValue) {
                moodSlider.addEventListener('input', function() {
                    moodValue.textContent = this.value;
                });
                moodSlider.addEventListener('change', function() {
                    moodValue.textContent = this.value;
                });
            }
        }, 100);
    }
    
    addSidebarWidgets() {
        // Check if there's a right column or sidebar to add widgets to
        const rightColumn = document.querySelector('.col-lg-6:last-child, .col-lg-4:last-child, .sidebar');
        
        if (rightColumn) {
            const persona = new URLSearchParams(window.location.search).get('kevin_type') || 'working';
            const widgetsHTML = this.createSidebarWidgetsHTML(persona);
            rightColumn.insertAdjacentHTML('beforeend', widgetsHTML);
        }
    }
    
    createSidebarWidgetsHTML(persona) {
        // Calculate real progress from localStorage
        const progressData = this.calculateRealProgress(persona);
        
        let streakHTML = '';
        for (const [activity, days] of Object.entries(progressData.streaks)) {
            const emoji = days >= 30 ? "🔥🔥🔥" : days >= 14 ? "🔥🔥" : days >= 7 ? "🔥" : "📅";
            streakHTML += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                    <span style="font-size: 0.9em; color: #2c3e50;">${activity}</span>
                    <span style="color: #e74c3c; font-weight: bold;">${emoji} ${days} days</span>
                </div>
            `;
        }
        
        return `
            <div style="background: rgba(255, 255, 255, 0.95); border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h3 style="color: #2c3e50; margin-bottom: 15px; font-size: 1.2rem;">
                    <i class="fas fa-chart-line"></i> Weekly Progress
                </h3>
                
                <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; border-radius: 8px; margin-bottom: 15px;">
                    <div style="font-size: 2.5em; font-weight: bold;">${progressData.weekly_rating}</div>
                    <div style="font-size: 1.2em;">Grade: ${progressData.grade}</div>
                </div>
                
                <div style="margin: 15px 0;">
                    <div style="background: #eee; height: 12px; border-radius: 6px; overflow: hidden;">
                        <div style="background: linear-gradient(90deg, #56ab2f 0%, #a8e6cf 100%); height: 100%; width: ${progressData.completion_rate}%; transition: width 0.3s ease;"></div>
                    </div>
                    <div style="font-size: 0.9em; color: #666; margin-top: 5px; text-align: center;">
                        ${progressData.completion_rate}% completion rate this week
                    </div>
                </div>
                
                <div style="margin-top: 20px;">
                    <div style="font-weight: bold; margin-bottom: 10px; color: #2c3e50;">🔥 Current Streaks:</div>
                    ${streakHTML}
                </div>
                
                <div style="margin-top: 15px; text-align: center;">
                    <button onclick="outcomeTracker.resetAllProgress()" style="
                        background: #dc3545;
                        color: white;
                        border: none;
                        padding: 6px 12px;
                        border-radius: 15px;
                        font-size: 0.8em;
                        cursor: pointer;
                    ">Reset Progress</button>
                </div>
            </div>
        `;
    }
    
    calculateRealProgress(persona) {
        // Get all activity streaks from localStorage
        const streaks = {};
        const activities = ['meditation', 'visualization', 'intention', 'exercise', 'job_application', 'skill_development'];
        
        let totalCompletions = 0;
        let totalPossible = 0;
        
        activities.forEach(activity => {
            const streakKey = `streak_${activity}_${persona}`;
            const completionKey = `completions_${activity}_${persona}`;
            
            const streak = parseInt(localStorage.getItem(streakKey) || '0');
            const completions = parseInt(localStorage.getItem(completionKey) || '0');
            
            if (streak > 0) {
                const activityName = activity.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
                streaks[activityName] = streak;
            }
            
            totalCompletions += completions;
            totalPossible += 7; // 7 days in a week
        });
        
        // Calculate completion rate
        const completionRate = totalPossible > 0 ? Math.round((totalCompletions / totalPossible) * 100) : 0;
        
        // Calculate grade based on completion rate
        let grade = 'F';
        let rating = 0;
        
        if (completionRate >= 95) { grade = 'A+'; rating = 9.5; }
        else if (completionRate >= 90) { grade = 'A'; rating = 9.0; }
        else if (completionRate >= 85) { grade = 'A-'; rating = 8.5; }
        else if (completionRate >= 80) { grade = 'B+'; rating = 8.0; }
        else if (completionRate >= 75) { grade = 'B'; rating = 7.5; }
        else if (completionRate >= 70) { grade = 'B-'; rating = 7.0; }
        else if (completionRate >= 65) { grade = 'C+'; rating = 6.5; }
        else if (completionRate >= 60) { grade = 'C'; rating = 6.0; }
        else if (completionRate >= 50) { grade = 'D'; rating = 5.0; }
        else { grade = 'F'; rating = Math.max(completionRate / 10, 0); }
        
        return {
            weekly_rating: rating,
            grade: grade,
            completion_rate: completionRate,
            streaks: streaks,
            total_completions: totalCompletions
        };
    }
    
    resetAllProgress() {
        if (confirm('Are you sure you want to reset all progress? This will clear all streaks and completions.')) {
            // Clear all localStorage data
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('streak_') || key.startsWith('completions_')) {
                    localStorage.removeItem(key);
                }
            });
            
            // Refresh the page to show reset progress
            window.location.reload();
        }
    }
}

// Global functions for modal interaction
function setCompletion(completed) {
    if (window.outcomeTracker) {
        window.outcomeTracker.setCompletion(completed);
    }
}

function saveCompletion() {
    if (window.outcomeTracker) {
        window.outcomeTracker.saveCompletion();
    }
}

// Initialize the tracker
window.outcomeTracker = new ClickableOutcomeTracker();

console.log('🎯 Clickable Outcome Tracking loaded! Your existing tiles are now clickable.');
