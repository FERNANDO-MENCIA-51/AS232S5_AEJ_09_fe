module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        php: {
          purple: '#777BB4',
          'dark-purple': '#4F5B93',
          'light-purple': '#8892BF',
        },
        bg: {
          primary: '#1A1B23',
          secondary: '#252631',
          tertiary: '#2D2E3F',
        },
        text: {
          primary: '#E2E8F0',
          secondary: '#A0AEC0',
          muted: '#718096',
        },
        card: {
          green: '#10B981',
          'green-dark': '#059669',
          orange: '#F59E0B',
          'orange-dark': '#D97706',
          blue: '#3B82F6',
          'blue-dark': '#2563EB',
          purple: '#8B5CF6',
          'purple-dark': '#7C3AED',
          pink: '#EC4899',
          'pink-dark': '#DB2777',
          cyan: '#06B6D4',
          'cyan-dark': '#0891B2',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(119, 123, 180, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(119, 123, 180, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
