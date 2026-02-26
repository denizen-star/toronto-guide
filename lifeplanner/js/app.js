/**
 * LifePlanner UI - Main Application
 * Phase 1: Application initialization, tab management, and basic functionality
 */

/**
 * Main application class
 */
class LifePlannerApp {
    constructor() {
        this.initialized = false;
        this.components = {};
        this.eventListeners = [];
    }

    /**
     * Initialize the application
     */
    async init() {
        console.log('🚀 Initializing LifePlanner UI...');
        
        try {
            // Show loading
            Utils.showLoading(true, 'Initializing application...');

            // Initialize core modules
            await this.initializeModules();

            // Initialize UI components
            this.initializeUI();

            // Set up event listeners
            this.setupEventListeners();

            // Load initial data
            await this.loadInitialData();

            // Hide loading
            Utils.showLoading(false);

            // Mark as initialized
            this.initialized = true;
            State.set('app.initialized', true);

            console.log('✅ LifePlanner UI initialized successfully');

        } catch (error) {
            console.error('❌ Failed to initialize LifePlanner UI:', error);
            Utils.showLoading(false);
            Utils.showError('Failed to initialize the application. Please refresh and try again.');
        }
    }

    /**
     * Initialize core modules
     */
    async initializeModules() {
        console.log('📦 Initializing core modules...');

        // Initialize state management
        State.init();

        // Initialize API connection
        const apiConnected = await API.init();
        State.set('api.connected', apiConnected);

        if (!apiConnected) {
            console.warn('⚠️ API connection failed - running in offline mode');
        }
    }

    /**
     * Initialize UI components
     */
    initializeUI() {
        console.log('🎨 Initializing UI components...');

        // Initialize tab system
        this.initializeTabs();

        // Initialize modals
        this.initializeModals();

        // Initialize status indicators
        this.initializeStatusIndicators();

        // Initialize forms
        this.initializeForms();

        // Set default date
        this.setDefaultDate();
    }

    /**
     * Initialize tab system
     */
    initializeTabs() {
        const tabButtons = Utils.selectAll('.nav-btn');
        const tabContents = Utils.selectAll('.tab-content');

        tabButtons.forEach(button => {
            Utils.addEventListener(button, 'click', (e) => {
                const tabId = e.target.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });

        // Set initial tab
        const initialTab = State.get('ui.activeTab', 'dashboard');
        this.switchTab(initialTab);
    }

    /**
     * Switch to a specific tab
     * @param {string} tabId - Tab ID to switch to
     */
    switchTab(tabId) {
        // Update nav buttons
        Utils.selectAll('.nav-btn').forEach(btn => {
            if (btn.getAttribute('data-tab') === tabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update tab content
        Utils.selectAll('.tab-content').forEach(content => {
            if (content.id === `${tabId}-tab`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        // Update state
        State.set('ui.activeTab', tabId);

        console.log(`📑 Switched to tab: ${tabId}`);
    }

    /**
     * Initialize modals
     */
    initializeModals() {
        // Modal close buttons
        Utils.selectAll('.modal-close').forEach(closeBtn => {
            Utils.addEventListener(closeBtn, 'click', () => {
                Utils.closeModals();
            });
        });

        // Close modals when clicking overlay
        Utils.selectAll('.modal').forEach(modal => {
            Utils.addEventListener(modal, 'click', (e) => {
                if (e.target === modal) {
                    Utils.closeModals();
                }
            });
        });

        // Close modals with Escape key
        Utils.addEventListener(document, 'keydown', (e) => {
            if (e.key === 'Escape') {
                Utils.closeModals();
            }
        });
    }

    /**
     * Initialize status indicators
     */
    initializeStatusIndicators() {
        // Subscribe to API status changes
        State.subscribe('api.connected', (connected) => {
            this.updateApiStatus(connected);
        });

        // Subscribe to persona changes
        State.subscribe('user.activePersona', (persona) => {
            this.updatePersonaStatus(persona);
        });

        // Initial status update
        this.updateApiStatus(State.get('api.connected'));
        this.updatePersonaStatus(State.get('user.activePersona'));
    }

    /**
     * Update API status indicator
     * @param {boolean} connected - Connection status
     */
    updateApiStatus(connected) {
        const indicator = Utils.select('#api-status');
        const statusText = Utils.select('#api-connection-status');
        
        if (indicator) {
            indicator.className = `status-indicator ${connected ? 'connected' : 'error'}`;
            
            if (statusText) {
                statusText.textContent = connected ? 'Connected' : 'Disconnected';
            }
        }
    }

    /**
     * Update persona status indicator
     * @param {Object} persona - Active persona
     */
    updatePersonaStatus(persona) {
        const indicator = Utils.select('#persona-status');
        
        if (indicator) {
            if (persona) {
                indicator.className = 'status-indicator connected';
                indicator.querySelector('.status-text').textContent = persona.name;
            } else {
                indicator.className = 'status-indicator';
                indicator.querySelector('.status-text').textContent = 'No Persona';
            }
        }
    }

    /**
     * Initialize forms
     */
    initializeForms() {
        // Schedule form
        const scheduleForm = Utils.select('#schedule-form');
        if (scheduleForm) {
            Utils.addEventListener(scheduleForm, 'submit', (e) => {
                e.preventDefault();
                this.handleScheduleGeneration();
            });
        }

        // Persona selector
        const personaSelector = Utils.select('#persona-selector');
        if (personaSelector) {
            Utils.addEventListener(personaSelector, 'change', (e) => {
                this.handlePersonaChange(e.target.value);
            });
        }
    }

    /**
     * Set default date in date inputs
     */
    setDefaultDate() {
        const startDateInput = Utils.select('#start-date');
        if (startDateInput && !startDateInput.value) {
            startDateInput.value = Utils.formatDateForInput();
        }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Quick action buttons
        const generateBtn = Utils.select('#generate-schedule-btn');
        if (generateBtn) {
            Utils.addEventListener(generateBtn, 'click', () => {
                this.switchTab('schedule');
            });
        }

        const recommendationsBtn = Utils.select('#get-recommendations-btn');
        if (recommendationsBtn) {
            Utils.addEventListener(recommendationsBtn, 'click', () => {
                this.getRecommendations();
            });
        }

        const weatherBtn = Utils.select('#check-weather-btn');
        if (weatherBtn) {
            Utils.addEventListener(weatherBtn, 'click', () => {
                this.checkWeather();
            });
        }

        // Footer buttons
        const testAllBtn = Utils.select('#test-all-btn');
        if (testAllBtn) {
            Utils.addEventListener(testAllBtn, 'click', () => {
                this.runAllTests();
            });
        }

        const clearCacheBtn = Utils.select('#clear-cache-btn');
        if (clearCacheBtn) {
            Utils.addEventListener(clearCacheBtn, 'click', () => {
                this.clearCache();
            });
        }

        // Export and regenerate buttons
        const exportBtn = Utils.select('#export-schedule-btn');
        if (exportBtn) {
            Utils.addEventListener(exportBtn, 'click', () => {
                this.exportSchedule();
            });
        }

        const regenerateBtn = Utils.select('#regenerate-schedule-btn');
        if (regenerateBtn) {
            Utils.addEventListener(regenerateBtn, 'click', () => {
                this.handleScheduleGeneration();
            });
        }
    }

    /**
     * Load initial data
     */
    async loadInitialData() {
        console.log('📊 Loading initial data...');

        try {
            // Load personas
            await this.loadPersonas();

            // Load app status
            await this.loadAppStatus();

            // Update last updated time
            this.updateLastUpdated();

        } catch (error) {
            console.error('Error loading initial data:', error);
        }
    }

    /**
     * Load personas from API
     */
    async loadPersonas() {
        try {
            const response = await API.getPersonas();
            const personas = response.personas || [];
            
            State.set('data.personas', personas);
            this.populatePersonaSelector(personas);
            
            console.log(`📋 Loaded ${personas.length} personas`);
            
        } catch (error) {
            console.error('Error loading personas:', error);
        }
    }

    /**
     * Populate persona selector dropdown
     * @param {Array} personas - Array of persona objects
     */
    populatePersonaSelector(personas) {
        const selector = Utils.select('#persona-selector');
        if (!selector) return;

        // Clear existing options (except first)
        const firstOption = selector.firstElementChild;
        selector.innerHTML = '';
        selector.appendChild(firstOption);

        // Add persona options
        personas.forEach(persona => {
            const option = document.createElement('option');
            option.value = persona.id;
            option.textContent = `${persona.name} - ${persona.personality_type}`;
            selector.appendChild(option);
        });
    }

    /**
     * Load app status
     */
    async loadAppStatus() {
        try {
            const status = await API.getStatus();
            
            // Update UI with status info
            const totalActivities = Utils.select('#total-activities');
            if (totalActivities) {
                totalActivities.textContent = status.status?.total_activities || '-';
            }

            const totalPersonas = Utils.select('#total-personas');
            if (totalPersonas) {
                totalPersonas.textContent = status.status?.available_personas || '-';
            }

        } catch (error) {
            console.error('Error loading app status:', error);
        }
    }

    /**
     * Update last updated timestamp
     */
    updateLastUpdated() {
        const lastUpdatedEl = Utils.select('#last-updated');
        if (lastUpdatedEl) {
            lastUpdatedEl.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
        }
    }

    /**
     * Handle persona selection change
     * @param {string} personaId - Selected persona ID
     */
    async handlePersonaChange(personaId) {
        if (!personaId) {
            State.set('user.activePersona', null);
            this.hidePersonaInfo();
            return;
        }

        try {
            Utils.showLoading(true, 'Setting persona...');
            
            // Set persona via API
            await API.setPersona(personaId);
            
            // Find persona in state
            const personas = State.get('data.personas', []);
            const persona = personas.find(p => p.id === personaId);
            
            if (persona) {
                State.set('user.activePersona', persona);
                this.showPersonaInfo(persona);
                Utils.showSuccess(`Persona set to: ${persona.name}`);
            }
            
        } catch (error) {
            console.error('Error setting persona:', error);
            Utils.showError('Failed to set persona. Please try again.');
        } finally {
            Utils.showLoading(false);
        }
    }

    /**
     * Show persona information
     * @param {Object} persona - Persona object
     */
    showPersonaInfo(persona) {
        const personaInfo = Utils.select('#persona-info');
        const personaDetails = Utils.select('.persona-details');
        
        if (personaInfo && personaDetails) {
            personaDetails.innerHTML = `
                <div class="persona-detail-item">
                    <span class="persona-detail-label">Name:</span>
                    <span class="persona-detail-value">${persona.name}</span>
                </div>
                <div class="persona-detail-item">
                    <span class="persona-detail-label">Type:</span>
                    <span class="persona-detail-value">${persona.personality_type}</span>
                </div>
                <div class="persona-detail-item">
                    <span class="persona-detail-label">Networking Priority:</span>
                    <span class="persona-detail-value">${persona.networking_priority}/10</span>
                </div>
                <div class="persona-detail-item">
                    <span class="persona-detail-label">Description:</span>
                    <span class="persona-detail-value">${persona.description}</span>
                </div>
            `;
            
            personaInfo.classList.remove('hidden');
        }
    }

    /**
     * Hide persona information
     */
    hidePersonaInfo() {
        const personaInfo = Utils.select('#persona-info');
        if (personaInfo) {
            personaInfo.classList.add('hidden');
        }
    }

    /**
     * Handle schedule generation
     */
    async handleScheduleGeneration() {
        const form = Utils.select('#schedule-form');
        if (!form) return;

        try {
            Utils.showLoading(true, 'Generating schedule...');

            // Get form data
            const formData = new FormData(form);
            const focusAreas = Array.from(form.querySelectorAll('input[type="checkbox"]:checked'))
                .map(cb => cb.value);

            const scheduleData = {
                start_date: formData.get('start-date'),
                duration: formData.get('duration'),
                schedule_type: formData.get('schedule-type'),
                focus_areas: focusAreas
            };

            // Validate required fields
            if (!scheduleData.start_date || !scheduleData.duration || !scheduleData.schedule_type) {
                Utils.showError('Please fill in all required fields.');
                return;
            }

            // Check if persona is set
            if (!State.get('user.activePersona')) {
                Utils.showError('Please select a persona first.');
                return;
            }

            // Generate schedule
            const result = await API.generateSchedule(scheduleData);
            
            // Store in state
            State.set('data.schedules', [result]);
            
            // Display schedule
            this.displaySchedule(result);
            
            Utils.showSuccess('Schedule generated successfully!');

        } catch (error) {
            console.error('Error generating schedule:', error);
            Utils.showError('Failed to generate schedule. Please try again.');
        } finally {
            Utils.showLoading(false);
        }
    }

    /**
     * Display generated schedule
     * @param {Object} scheduleResult - Schedule result from API
     */
    displaySchedule(scheduleResult) {
        const scheduleDisplay = Utils.select('#schedule-display');
        const scheduleContent = Utils.select('#schedule-content');
        
        if (!scheduleDisplay || !scheduleContent) return;

        // Show acknowledgment
        let html = `<div class="alert alert-success">${scheduleResult.acknowledgment}</div>`;

        // Show schedule items
        const timeSlots = scheduleResult.schedule?.time_slots || [];
        if (timeSlots.length > 0) {
            html += '<div class="schedule-items">';
            
            timeSlots.slice(0, 10).forEach(slot => { // Show first 10 items
                const activity = slot.activity;
                html += `
                    <div class="schedule-item">
                        <div class="schedule-item-header">
                            <span class="schedule-item-time">${slot.start_time} - ${slot.end_time}</span>
                            <span class="schedule-item-cost">${Utils.formatCurrency(activity.cost_cad)}</span>
                        </div>
                        <div class="schedule-item-title">${activity.name}</div>
                        <div class="schedule-item-description">${activity.description}</div>
                        <div class="schedule-item-location">${activity.location}</div>
                    </div>
                `;
            });
            
            if (timeSlots.length > 10) {
                html += `<div class="alert alert-info">... and ${timeSlots.length - 10} more activities</div>`;
            }
            
            html += '</div>';
        }

        // Show summary
        if (scheduleResult.summary) {
            html += `<div class="schedule-summary">${scheduleResult.summary}</div>`;
        }

        scheduleContent.innerHTML = html;
        scheduleDisplay.classList.remove('hidden');

        // Scroll to schedule
        Utils.scrollTo(scheduleDisplay);
    }

    /**
     * Get AI recommendations
     */
    async getRecommendations() {
        if (!State.get('user.activePersona')) {
            Utils.showError('Please select a persona first.');
            return;
        }

        try {
            Utils.showLoading(true, 'Getting recommendations...');
            
            const recommendations = await API.getRecommendations({ limit: 5 });
            
            // For now, just show a success message
            // In Phase 5, we'll implement a proper recommendations display
            Utils.showSuccess(`Got ${recommendations.recommendations?.length || 0} recommendations!`);
            
        } catch (error) {
            console.error('Error getting recommendations:', error);
            Utils.showError('Failed to get recommendations. Please try again.');
        } finally {
            Utils.showLoading(false);
        }
    }

    /**
     * Check weather
     */
    async checkWeather() {
        try {
            Utils.showLoading(true, 'Checking weather...');
            
            const weather = await API.getWeather();
            
            // For now, just show current temperature
            // In Phase 6, we'll implement a proper weather display
            const temp = weather.weather?.current?.temperature;
            if (temp) {
                Utils.showSuccess(`Current temperature: ${temp}°C`);
            } else {
                Utils.showSuccess('Weather data retrieved successfully!');
            }
            
        } catch (error) {
            console.error('Error checking weather:', error);
            Utils.showError('Failed to get weather information.');
        } finally {
            Utils.showLoading(false);
        }
    }

    /**
     * Export schedule
     */
    exportSchedule() {
        const schedules = State.get('data.schedules', []);
        if (schedules.length === 0) {
            Utils.showError('No schedule to export. Generate a schedule first.');
            return;
        }

        try {
            const schedule = schedules[0];
            const dataStr = JSON.stringify(schedule, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `lifeplanner-schedule-${Utils.formatDateForInput()}.json`;
            link.click();
            
            Utils.showSuccess('Schedule exported successfully!');
            
        } catch (error) {
            console.error('Error exporting schedule:', error);
            Utils.showError('Failed to export schedule.');
        }
    }

    /**
     * Clear cache
     */
    async clearCache() {
        try {
            Utils.showLoading(true, 'Clearing cache...');
            
            await API.clearCache();
            
            Utils.showSuccess('Cache cleared successfully!');
            
        } catch (error) {
            console.error('Error clearing cache:', error);
            Utils.showError('Failed to clear cache.');
        } finally {
            Utils.showLoading(false);
        }
    }

    /**
     * Run all tests
     */
    async runAllTests() {
        console.log('🧪 Running all tests...');
        
        try {
            Utils.showLoading(true, 'Running tests...');

            // Test core modules
            const utilsResults = Utils.test();
            const stateResults = State.test();
            const apiResults = await API.testAllEndpoints();

            // Combine results
            const totalPassed = utilsResults.passed + stateResults.passed + apiResults.passed;
            const totalFailed = utilsResults.failed + stateResults.failed + apiResults.failed;

            const message = `Test Results:\n✅ ${totalPassed} passed\n❌ ${totalFailed} failed`;
            
            if (totalFailed === 0) {
                Utils.showSuccess(message);
            } else {
                Utils.showError(message);
            }

        } catch (error) {
            console.error('Error running tests:', error);
            Utils.showError('Failed to run tests.');
        } finally {
            Utils.showLoading(false);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new LifePlannerApp();
    window.app.init();
});

// Export for global access
window.LifePlannerApp = LifePlannerApp;

