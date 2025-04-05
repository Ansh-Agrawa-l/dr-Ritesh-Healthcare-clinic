const config = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  UPLOADS_URL: import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000/uploads',
};

export default config;

// Export individual values for backward compatibility
export const { API_URL, UPLOADS_URL } = config;

// Other configuration values can be added here
export const APP_NAME = 'Healthcare Management System';
export const APP_VERSION = '1.0.0';

// Add any other configuration constants as needed 