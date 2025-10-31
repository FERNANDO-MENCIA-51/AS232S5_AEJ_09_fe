export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  apiVersion: 'v1',
  endpoints: {
    aiDetection: '/api/ai-detection',
    nasaApod: '/api/nasa-apod'
  },
  features: {
    autoRefresh: true,
    refreshInterval: 30000, // 30 seconds
    enableHistory: true,
    enableAnalytics: false
  }
};
