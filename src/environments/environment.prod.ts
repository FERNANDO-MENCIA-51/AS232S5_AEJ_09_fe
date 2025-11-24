export const environment = {
  production: true,
  apiUrl: 'http://localhost:8080', // Docker will replace this with APIURL from .env
  apiVersion: 'v1',
  endpoints: {
    aiDetection: '/api/ai-detection',
    nasaApod: '/api/nasa-apod'
  },
  features: {
    autoRefresh: true,
    refreshInterval: 60000, // 60 seconds in production
    enableHistory: true,
    enableAnalytics: true
  }
};
