/**
 * LifePlanner UI - State Management
 * Phase 1: Simple state management with persistence and event system
 */

/**
 * Simple state management system
 */
const State = {
    // Internal state storage
    _state: {
        // App state
        app: {
            initialized: false,
            loading: false,
            error: null,
            lastUpdated: null
        },
        
        // API state
        api: {
            connected: false,
            baseUrl: 'http://localhost:5000/api/v1',
            lastCheck: null,
            error: null
        },
        
        // User state
        user: {
            activePersona: null,
            preferences: {},
            settings: {}
        },
        
        // UI state
        ui: {
            activeTab: 'dashboard',
            modalsOpen: [],
            notifications: []
        },
        
        // Data state
        data: {
            personas: [],
            activities: [],
            schedules: [],
            analytics: null,
            weather: null
        }
    },

    // Event listeners
    _listeners: {},

    // Storage key for persistence
    _storageKey: 'lifeplanner-state',

    /**
     * Get state value by path
     * @param {string} path - Dot-separated path (e.g., 'user.activePersona')
     * @param {*} defaultValue - Default value if path not found
     * @returns {*} - State value
     */
    get(path, defaultValue = null) {
        try {
            const keys = path.split('.');
            let current = this._state;
            
            for (const key of keys) {
                if (current === null || current === undefined || !(key in current)) {
                    return defaultValue;
                }
                current = current[key];
            }
            
            return current;
        } catch (error) {
            console.error(`Error getting state path ${path}:`, error);
            return defaultValue;
        }
    },

    /**
     * Set state value by path
     * @param {string} path - Dot-separated path
     * @param {*} value - Value to set
     * @param {boolean} persist - Whether to persist to localStorage
     * @param {boolean} notify - Whether to notify listeners
     */
    set(path, value, persist = true, notify = true) {
        try {
            const keys = path.split('.');
            const lastKey = keys.pop();
            let current = this._state;
            
            // Navigate to parent object
            for (const key of keys) {
                if (!(key in current) || typeof current[key] !== 'object') {
                    current[key] = {};
                }
                current = current[key];
            }
            
            // Store old value for comparison
            const oldValue = current[lastKey];
            
            // Set new value
            current[lastKey] = value;
            
            // Update lastUpdated
            this.set('app.lastUpdated', new Date().toISOString(), false, false);
            
            // Persist to localStorage if requested
            if (persist) {
                this.persist();
            }
            
            // Notify listeners if requested and value changed
            if (notify && oldValue !== value) {
                this.notify(path, value, oldValue);
            }
            
            console.log(`📝 State updated: ${path} =`, value);
            
        } catch (error) {
            console.error(`Error setting state path ${path}:`, error);
        }
    },

    /**
     * Update multiple state values at once
     * @param {Object} updates - Object with path-value pairs
     * @param {boolean} persist - Whether to persist to localStorage
     * @param {boolean} notify - Whether to notify listeners
     */
    update(updates, persist = true, notify = true) {
        try {
            Object.entries(updates).forEach(([path, value]) => {
                this.set(path, value, false, notify);
            });
            
            if (persist) {
                this.persist();
            }
        } catch (error) {
            console.error('Error updating state:', error);
        }
    },

    /**
     * Reset state to initial values
     * @param {boolean} persist - Whether to persist the reset
     */
    reset(persist = true) {
        console.log('🔄 Resetting state...');
        
        this._state = {
            app: {
                initialized: false,
                loading: false,
                error: null,
                lastUpdated: new Date().toISOString()
            },
            api: {
                connected: false,
                baseUrl: 'http://localhost:5000/api/v1',
                lastCheck: null,
                error: null
            },
            user: {
                activePersona: null,
                preferences: {},
                settings: {}
            },
            ui: {
                activeTab: 'dashboard',
                modalsOpen: [],
                notifications: []
            },
            data: {
                personas: [],
                activities: [],
                schedules: [],
                analytics: null,
                weather: null
            }
        };
        
        if (persist) {
            this.persist();
        }
        
        this.notify('*', this._state, null);
    },

    /**
     * Add event listener for state changes
     * @param {string} path - Path to listen to ('*' for all changes)
     * @param {Function} callback - Callback function
     * @returns {Function} - Unsubscribe function
     */
    subscribe(path, callback) {
        if (!this._listeners[path]) {
            this._listeners[path] = [];
        }
        
        this._listeners[path].push(callback);
        
        // Return unsubscribe function
        return () => {
            const index = this._listeners[path].indexOf(callback);
            if (index > -1) {
                this._listeners[path].splice(index, 1);
            }
        };
    },

    /**
     * Remove event listener
     * @param {string} path - Path to stop listening to
     * @param {Function} callback - Callback function to remove
     */
    unsubscribe(path, callback) {
        if (this._listeners[path]) {
            const index = this._listeners[path].indexOf(callback);
            if (index > -1) {
                this._listeners[path].splice(index, 1);
            }
        }
    },

    /**
     * Notify listeners of state changes
     * @param {string} path - Path that changed
     * @param {*} newValue - New value
     * @param {*} oldValue - Old value
     */
    notify(path, newValue, oldValue) {
        try {
            // Notify specific path listeners
            if (this._listeners[path]) {
                this._listeners[path].forEach(callback => {
                    try {
                        callback(newValue, oldValue, path);
                    } catch (error) {
                        console.error(`Error in state listener for ${path}:`, error);
                    }
                });
            }
            
            // Notify global listeners
            if (this._listeners['*']) {
                this._listeners['*'].forEach(callback => {
                    try {
                        callback(newValue, oldValue, path);
                    } catch (error) {
                        console.error('Error in global state listener:', error);
                    }
                });
            }
        } catch (error) {
            console.error('Error notifying state listeners:', error);
        }
    },

    /**
     * Persist state to localStorage
     */
    persist() {
        try {
            const stateToSave = Utils.deepClone(this._state);
            Utils.storage.set(this._storageKey, stateToSave);
        } catch (error) {
            console.error('Error persisting state:', error);
        }
    },

    /**
     * Load state from localStorage
     * @returns {boolean} - Whether state was loaded successfully
     */
    load() {
        try {
            const savedState = Utils.storage.get(this._storageKey);
            
            if (savedState) {
                // Merge saved state with current state to handle new properties
                this._state = this.mergeDeep(this._state, savedState);
                console.log('📂 State loaded from localStorage');
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error loading state:', error);
            return false;
        }
    },

    /**
     * Deep merge objects
     * @param {Object} target - Target object
     * @param {Object} source - Source object
     * @returns {Object} - Merged object
     */
    mergeDeep(target, source) {
        const result = { ...target };
        
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.mergeDeep(target[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
        
        return result;
    },

    /**
     * Get entire state (for debugging)
     * @returns {Object} - Complete state object
     */
    getAll() {
        return Utils.deepClone(this._state);
    },

    /**
     * Check if state has been initialized
     * @returns {boolean} - Whether state is initialized
     */
    isInitialized() {
        return this.get('app.initialized', false);
    },

    /**
     * Initialize state management
     * @returns {boolean} - Whether initialization was successful
     */
    init() {
        console.log('🚀 Initializing state management...');
        
        try {
            // Load persisted state
            this.load();
            
            // Mark as initialized
            this.set('app.initialized', true, true, false);
            
            console.log('✅ State management initialized');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize state management:', error);
            return false;
        }
    },

    /**
     * Clear all persisted state
     */
    clearPersisted() {
        Utils.storage.remove(this._storageKey);
        console.log('🗑️ Persisted state cleared');
    },

    /**
     * Test state management functionality
     * @returns {Object} - Test results
     */
    test() {
        console.log('🧪 Testing State management...');
        
        const results = {
            passed: 0,
            failed: 0,
            tests: []
        };

        const addTest = (name, passed, error = null) => {
            results.tests.push({ name, passed, error });
            if (passed) {
                results.passed++;
                console.log(`✅ ${name}`);
            } else {
                results.failed++;
                console.log(`❌ ${name}:`, error);
            }
        };

        // Test get/set
        try {
            this.set('test.value', 'hello', false, false);
            const value = this.get('test.value');
            addTest('get/set', value === 'hello');
        } catch (error) {
            addTest('get/set', false, error);
        }

        // Test nested paths
        try {
            this.set('test.nested.deep.value', 42, false, false);
            const value = this.get('test.nested.deep.value');
            addTest('nested paths', value === 42);
        } catch (error) {
            addTest('nested paths', false, error);
        }

        // Test listeners
        try {
            let listenerCalled = false;
            const unsubscribe = this.subscribe('test.listener', () => {
                listenerCalled = true;
            });
            
            this.set('test.listener', 'trigger', false, true);
            unsubscribe();
            
            addTest('listeners', listenerCalled);
        } catch (error) {
            addTest('listeners', false, error);
        }

        // Test persistence
        try {
            const testValue = { test: 'persistence' };
            this.set('test.persist', testValue, true, false);
            
            const savedState = Utils.storage.get(this._storageKey);
            const persistedValue = savedState?.test?.persist;
            
            addTest('persistence', 
                persistedValue && 
                JSON.stringify(persistedValue) === JSON.stringify(testValue)
            );
        } catch (error) {
            addTest('persistence', false, error);
        }

        console.log(`\n📊 State Test Results: ${results.passed} passed, ${results.failed} failed`);
        return results;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = State;
}

// Global availability
window.State = State;

