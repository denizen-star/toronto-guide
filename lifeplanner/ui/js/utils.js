/**
 * LifePlanner UI - Utility Functions
 * Phase 1: Basic utility functions for DOM manipulation, validation, and helpers
 */

/**
 * Utility object containing helper functions
 */
const Utils = {
    /**
     * Safely select a DOM element
     * @param {string} selector - CSS selector
     * @returns {Element|null} - Selected element or null
     */
    select(selector) {
        try {
            return document.querySelector(selector);
        } catch (error) {
            console.error(`Error selecting element: ${selector}`, error);
            return null;
        }
    },

    /**
     * Safely select multiple DOM elements
     * @param {string} selector - CSS selector
     * @returns {NodeList} - Selected elements
     */
    selectAll(selector) {
        try {
            return document.querySelectorAll(selector);
        } catch (error) {
            console.error(`Error selecting elements: ${selector}`, error);
            return [];
        }
    },

    /**
     * Add event listener with error handling
     * @param {Element} element - Target element
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     * @param {Object} options - Event options
     */
    addEventListener(element, event, handler, options = {}) {
        if (!element) {
            console.error('Cannot add event listener: element is null');
            return;
        }

        try {
            element.addEventListener(event, (e) => {
                try {
                    handler(e);
                } catch (error) {
                    console.error(`Error in event handler for ${event}:`, error);
                    this.showError('An error occurred while processing your request.');
                }
            }, options);
        } catch (error) {
            console.error(`Error adding event listener for ${event}:`, error);
        }
    },

    /**
     * Show loading state
     * @param {boolean} show - Whether to show loading
     * @param {string} text - Loading text
     */
    showLoading(show = true, text = 'Loading...') {
        const overlay = this.select('#loading-overlay');
        const loadingText = this.select('.loading-text');
        
        if (overlay) {
            if (show) {
                if (loadingText) loadingText.textContent = text;
                overlay.classList.remove('hidden');
            } else {
                overlay.classList.add('hidden');
            }
        }
    },

    /**
     * Show error modal
     * @param {string} message - Error message
     */
    showError(message) {
        const modal = this.select('#error-modal');
        const messageEl = this.select('#error-message');
        
        if (modal && messageEl) {
            messageEl.textContent = message;
            modal.classList.remove('hidden');
        } else {
            // Fallback to alert if modal not available
            alert(`Error: ${message}`);
        }
    },

    /**
     * Show success modal
     * @param {string} message - Success message
     */
    showSuccess(message) {
        const modal = this.select('#success-modal');
        const messageEl = this.select('#success-message');
        
        if (modal && messageEl) {
            messageEl.textContent = message;
            modal.classList.remove('hidden');
        } else {
            // Fallback to alert if modal not available
            alert(`Success: ${message}`);
        }
    },

    /**
     * Close all modals
     */
    closeModals() {
        const modals = this.selectAll('.modal');
        modals.forEach(modal => modal.classList.add('hidden'));
    },

    /**
     * Format date for input fields
     * @param {Date} date - Date to format
     * @returns {string} - Formatted date string (YYYY-MM-DD)
     */
    formatDateForInput(date = new Date()) {
        return date.toISOString().split('T')[0];
    },

    /**
     * Format date for display
     * @param {string|Date} date - Date to format
     * @returns {string} - Formatted date string
     */
    formatDateForDisplay(date) {
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            return dateObj.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid Date';
        }
    },

    /**
     * Format time for display
     * @param {string} time - Time string (e.g., "14:30")
     * @returns {string} - Formatted time string
     */
    formatTime(time) {
        try {
            const [hours, minutes] = time.split(':');
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 || 12;
            return `${displayHour}:${minutes} ${ampm}`;
        } catch (error) {
            console.error('Error formatting time:', error);
            return time;
        }
    },

    /**
     * Format currency
     * @param {number} amount - Amount to format
     * @param {string} currency - Currency code
     * @returns {string} - Formatted currency string
     */
    formatCurrency(amount, currency = 'CAD') {
        try {
            return new Intl.NumberFormat('en-CA', {
                style: 'currency',
                currency: currency
            }).format(amount);
        } catch (error) {
            console.error('Error formatting currency:', error);
            return `$${amount.toFixed(2)}`;
        }
    },

    /**
     * Validate email address
     * @param {string} email - Email to validate
     * @returns {boolean} - Whether email is valid
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Validate date string
     * @param {string} dateString - Date string to validate
     * @returns {boolean} - Whether date is valid
     */
    validateDate(dateString) {
        try {
            const date = new Date(dateString);
            return date instanceof Date && !isNaN(date);
        } catch (error) {
            return false;
        }
    },

    /**
     * Debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} delay - Delay in milliseconds
     * @returns {Function} - Debounced function
     */
    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    /**
     * Throttle function calls
     * @param {Function} func - Function to throttle
     * @param {number} delay - Delay in milliseconds
     * @returns {Function} - Throttled function
     */
    throttle(func, delay) {
        let lastCall = 0;
        return function (...args) {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                func.apply(this, args);
            }
        };
    },

    /**
     * Deep clone an object
     * @param {Object} obj - Object to clone
     * @returns {Object} - Cloned object
     */
    deepClone(obj) {
        try {
            return JSON.parse(JSON.stringify(obj));
        } catch (error) {
            console.error('Error deep cloning object:', error);
            return obj;
        }
    },

    /**
     * Generate a random ID
     * @param {number} length - Length of ID
     * @returns {string} - Random ID
     */
    generateId(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },

    /**
     * Check if element is in viewport
     * @param {Element} element - Element to check
     * @returns {boolean} - Whether element is in viewport
     */
    isInViewport(element) {
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    /**
     * Smooth scroll to element
     * @param {Element|string} target - Target element or selector
     * @param {Object} options - Scroll options
     */
    scrollTo(target, options = {}) {
        const element = typeof target === 'string' ? this.select(target) : target;
        if (!element) return;

        const defaultOptions = {
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        };

        element.scrollIntoView({ ...defaultOptions, ...options });
    },

    /**
     * Local storage wrapper with error handling
     */
    storage: {
        /**
         * Set item in localStorage
         * @param {string} key - Storage key
         * @param {*} value - Value to store
         * @returns {boolean} - Whether operation succeeded
         */
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('Error setting localStorage item:', error);
                return false;
            }
        },

        /**
         * Get item from localStorage
         * @param {string} key - Storage key
         * @param {*} defaultValue - Default value if key not found
         * @returns {*} - Stored value or default
         */
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.error('Error getting localStorage item:', error);
                return defaultValue;
            }
        },

        /**
         * Remove item from localStorage
         * @param {string} key - Storage key
         * @returns {boolean} - Whether operation succeeded
         */
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('Error removing localStorage item:', error);
                return false;
            }
        },

        /**
         * Clear all localStorage
         * @returns {boolean} - Whether operation succeeded
         */
        clear() {
            try {
                localStorage.clear();
                return true;
            } catch (error) {
                console.error('Error clearing localStorage:', error);
                return false;
            }
        }
    },

    /**
     * Test all utility functions
     * @returns {Object} - Test results
     */
    test() {
        console.log('🧪 Testing Utils functions...');
        
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

        // Test date formatting
        try {
            const dateStr = this.formatDateForInput(new Date('2024-01-15'));
            addTest('formatDateForInput', dateStr === '2024-01-15');
        } catch (error) {
            addTest('formatDateForInput', false, error);
        }

        // Test currency formatting
        try {
            const currency = this.formatCurrency(123.45);
            addTest('formatCurrency', currency.includes('123.45'));
        } catch (error) {
            addTest('formatCurrency', false, error);
        }

        // Test email validation
        try {
            const validEmail = this.validateEmail('test@example.com');
            const invalidEmail = this.validateEmail('invalid-email');
            addTest('validateEmail', validEmail && !invalidEmail);
        } catch (error) {
            addTest('validateEmail', false, error);
        }

        // Test deep clone
        try {
            const original = { a: 1, b: { c: 2 } };
            const cloned = this.deepClone(original);
            cloned.b.c = 3;
            addTest('deepClone', original.b.c === 2 && cloned.b.c === 3);
        } catch (error) {
            addTest('deepClone', false, error);
        }

        // Test storage
        try {
            const testKey = 'test-key';
            const testValue = { test: 'value' };
            const setResult = this.storage.set(testKey, testValue);
            const getResult = this.storage.get(testKey);
            const removeResult = this.storage.remove(testKey);
            const getAfterRemove = this.storage.get(testKey);
            
            addTest('storage', 
                setResult && 
                JSON.stringify(getResult) === JSON.stringify(testValue) && 
                removeResult && 
                getAfterRemove === null
            );
        } catch (error) {
            addTest('storage', false, error);
        }

        console.log(`\n📊 Utils Test Results: ${results.passed} passed, ${results.failed} failed`);
        return results;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}

// Global availability
window.Utils = Utils;

