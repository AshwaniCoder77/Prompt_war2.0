const isProduction = import.meta.env.PROD;

export const API_BASE_URL = isProduction 
  ? '' 
  : (import.meta.env.VITE_API_URL || 'http://localhost:8080');
