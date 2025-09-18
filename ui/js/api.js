/**
 * LifePlanner UI - API Communication Module
 * Phase 1: API connection, error handling, and basic endpoint calls
 */

/**
 * API configuration and communication module
 */
const API = {
    // Configuration
    config: {
        baseUrl: 'http://localhost:5000/api/v1',
        timeout: 30000, // 30 seconds
        retries: 3,
        retryDelay: 1000 // 1 second
    },

    // Connection status
    status: {
        connected: false,
        lastCheck: null,
        error: null
    },

    /**
     * Make HTTP request with error handling and retries
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise<Object>} - Response data
     */
    async request(endpoint, options = {}) {
        const url = `${this.config.baseUrl}${endpoint}`;
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: this.config.timeout
        };

        const requestOptions = { ...defaultOptions, ...options };

        // Add body if provided
        if (requestOptions.body && typeof requestOptions.body === 'object') {
            requestOptions.body = JSON.stringify(requestOptions.body);
        }

        let lastError;
        
        // Retry logic
        for (let attempt = 1; attempt <= this.config.retries; attempt++) {
            try {
                console.log(`🌐 API Request (attempt ${attempt}): ${requestOptions.method} ${url}`);
                
                // Create AbortController for timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
                
                const response = await fetch(url, {
                    ...requestOptions,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                // Log response
                console.log(`📡 API Response: ${response.status} ${response.statusText}`);

                // Handle different response types
                if (!response.ok) {
                    const errorData = await this.parseResponse(response);
                    const error = new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
                    error.status = response.status;
                    error.data = errorData;
                    throw error;
                }

                // Parse successful response
                const data = await this.parseResponse(response);
                
                // Update connection status
                this.status.connected = true;
                this.status.lastCheck = new Date();
                this.status.error = null;

                return data;

            } catch (error) {
                lastError = error;
                console.error(`❌ API Request failed (attempt ${attempt}):`, error);

                // Update connection status
                this.status.connected = false;
                this.status.error = error.message;
                this.status.lastCheck = new Date();

                // Don't retry on certain errors
                if (error.name === 'AbortError') {
                    throw new Error('Request timeout');
                }
                
                if (error.status && error.status >= 400 && error.status < 500) {
                    // Client errors - don't retry
                    throw error;
                }

                // Wait before retry
                if (attempt < this.config.retries) {
                    await this.delay(this.config.retryDelay * attempt);
                }
            }
        }

        // All retries failed
        throw lastError || new Error('Request failed after all retries');
    },

    /**
     * Parse response based on content type
     * @param {Response} response - Fetch response
     * @returns {Promise<*>} - Parsed data
     */
    async parseResponse(response) {
        const contentType = response.headers.get('content-type');
        
        try {
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else if (contentType && contentType.includes('text/')) {
                return await response.text();
            } else {
                return await response.blob();
            }
        } catch (error) {
            console.warn('Failed to parse response:', error);
            return null;
        }
    },

    /**
     * Delay utility for retries
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise} - Delay promise
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Test API connection
     * @returns {Promise<boolean>} - Connection status
     */
    async testConnection() {
        try {
            console.log('🔍 Testing API connection...');
            await this.request('/health');
            console.log('✅ API connection successful');
            return true;
        } catch (error) {
            console.error('❌ API connection failed:', error);
            return false;
        }
    },

    /**
     * Get application status
     * @returns {Promise<Object>} - Application status
     */
    async getStatus() {
        return await this.request('/status');
    },

    /**
     * Get available personas
     * @returns {Promise<Object>} - Personas data
     */
    async getPersonas() {
        return await this.request('/personas');
    },

    /**
     * Set active persona
     * @param {string} personaId - Persona ID
     * @returns {Promise<Object>} - Response data
     */
    async setPersona(personaId) {
        return await this.request(`/personas/${personaId}`, {
            method: 'POST'
        });
    },

    /**
     * Generate schedule
     * @param {Object} scheduleData - Schedule parameters
     * @returns {Promise<Object>} - Schedule data
     */
    async generateSchedule(scheduleData) {
        return await this.request('/schedule', {
            method: 'POST',
            body: scheduleData
        });
    },

    /**
     * Get activities
     * @returns {Promise<Object>} - Activities data
     */
    async getActivities() {
        return await this.request('/activities');
    },

    /**
     * Get activity recommendations
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} - Recommendations data
     */
    async getRecommendations(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/activities/recommendations?${queryString}` : '/activities/recommendations';
        return await this.request(endpoint);
    },

    /**
     * Get analytics data
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} - Analytics data
     */
    async getAnalytics(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/analytics?${queryString}` : '/analytics';
        return await this.request(endpoint);
    },

    /**
     * Get weather information
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} - Weather data
     */
    async getWeather(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/weather?${queryString}` : '/weather';
        return await this.request(endpoint);
    },

    /**
     * Get current settings
     * @returns {Promise<Object>} - Settings data
     */
    async getSettings() {
        return await this.request('/settings');
    },

    /**
     * Update settings
     * @param {Object} settings - Settings to update
     * @returns {Promise<Object>} - Response data
     */
    async updateSettings(settings) {
        return await this.request('/settings', {
            method: 'PUT',
            body: settings
        });
    },

    /**
     * Get cache statistics
     * @returns {Promise<Object>} - Cache stats
     */
    async getCacheStats() {
        return await this.request('/cache/stats');
    },

    /**
     * Clear application cache
     * @returns {Promise<Object>} - Response data
     */
    async clearCache() {
        return await this.request('/cache/clear', {
            method: 'POST'
        });
    },

    /**
     * Get API documentation
     * @returns {Promise<Object>} - API docs
     */
    async getApiDocs() {
        return await this.request('/docs');
    },

    /**
     * Initialize API module
     */
    async init() {
        console.log('🚀 Initializing API module...');
        
        // Test initial connection
        const connected = await this.testConnection();
        
        if (connected) {
            console.log('✅ API module initialized successfully');
        } else {
            console.warn('⚠️ API module initialized but connection failed');
        }

        return connected;
    },

    /**
     * Get connection status with details
     * @returns {Object} - Detailed status
     */
    getConnectionStatus() {
        return {
            ...this.status,
            baseUrl: this.config.baseUrl,
            timeout: this.config.timeout,
            retries: this.config.retries
        };
    },

    /**
     * Update API configuration
     * @param {Object} newConfig - New configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        console.log('⚙️ API configuration updated:', this.config);
    },

    /**
     * Test all API endpoints
     * @returns {Object} - Test results
     */
    async testAllEndpoints() {
        console.log('🧪 Testing all API endpoints...');
        
        const results = {
            passed: 0,
            failed: 0,
            tests: []
        };

        const endpoints = [
            { name: 'Health Check', method: 'testConnection' },
            { name: 'Get Status', method: 'getStatus' },
            { name: 'Get Personas', method: 'getPersonas' },
            { name: 'Get Activities', method: 'getActivities' },
            { name: 'Get Settings', method: 'getSettings' },
            { name: 'Get Cache Stats', method: 'getCacheStats' },
            { name: 'Get API Docs', method: 'getApiDocs' }
        ];

        for (const endpoint of endpoints) {
            try {
                const result = await this[endpoint.method]();
                results.tests.push({
                    name: endpoint.name,
                    passed: true,
                    result: result
                });
                results.passed++;
                console.log(`✅ ${endpoint.name}`);
            } catch (error) {
                results.tests.push({
                    name: endpoint.name,
                    passed: false,
                    error: error.message
                });
                results.failed++;
                console.log(`❌ ${endpoint.name}:`, error.message);
            }

            // Small delay between tests
            await this.delay(100);
        }

        console.log(`\n📊 API Test Results: ${results.passed} passed, ${results.failed} failed`);
        return results;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
}

// Global availability
window.API = API;

