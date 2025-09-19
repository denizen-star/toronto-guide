/**
 * PersonaService - API communication for persona onboarding
 * Handles all API calls to the persona matching backend
 */

class PersonaService {
  static BASE_URL = process.env.REACT_APP_PERSONA_API_URL || 'http://localhost:5001';

  /**
   * Get all onboarding questions
   */
  static async getQuestions() {
    try {
      const response = await fetch(`${this.BASE_URL}/api/questions`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  }

  /**
   * Submit user responses and get persona match
   */
  static async submitResponses(responses) {
    try {
      const response = await fetch(`${this.BASE_URL}/api/match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responses }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting responses:', error);
      throw error;
    }
  }

  /**
   * Get characteristics for a specific persona type
   */
  static async getPersonaCharacteristics(personaType) {
    try {
      const response = await fetch(`${this.BASE_URL}/api/characteristics/${personaType}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching persona characteristics:', error);
      throw error;
    }
  }

  /**
   * Test API connectivity
   */
  static async testConnection() {
    try {
      const response = await fetch(`${this.BASE_URL}/api/test`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error testing connection:', error);
      throw error;
    }
  }

  /**
   * Save persona result to local storage
   */
  static savePersonaResult(result) {
    try {
      localStorage.setItem('lifeplanner_persona_result', JSON.stringify({
        ...result,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error saving persona result:', error);
    }
  }

  /**
   * Get saved persona result from local storage
   */
  static getSavedPersonaResult() {
    try {
      const saved = localStorage.getItem('lifeplanner_persona_result');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error getting saved persona result:', error);
      return null;
    }
  }

  /**
   * Clear saved persona result
   */
  static clearSavedPersonaResult() {
    try {
      localStorage.removeItem('lifeplanner_persona_result');
    } catch (error) {
      console.error('Error clearing saved persona result:', error);
    }
  }
}

export default PersonaService;
