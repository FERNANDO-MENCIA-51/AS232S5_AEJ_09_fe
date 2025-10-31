export const environment = {
  production: true,
  apiUrl: 'https://api.production.com', // Update with your production URL
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
