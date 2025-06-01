// Simple admin authentication utility

const ADMIN_PASSWORD = 'toronto2024'; // You should change this to your desired password
const AUTH_KEY = 'admin_authenticated';

export const auth = {
  /**
   * Check if the current session is authenticated
   */
  isAuthenticated(): boolean {
    return localStorage.getItem(AUTH_KEY) === 'true';
  },

  /**
   * Attempt to login with password
   */
  login(password: string): boolean {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(AUTH_KEY, 'true');
      return true;
    }
    return false;
  },

  /**
   * Logout the current session
   */
  logout(): void {
    localStorage.removeItem(AUTH_KEY);
  }
}; 