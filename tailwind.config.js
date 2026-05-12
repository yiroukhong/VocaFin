/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'bg-base':    '#1A1A1A',
        'bg-surface': '#2A2A2A',
        'bg-card':    '#222222',

        'cyan':       '#00D4FF',
        'beige':      '#E8C49A',

        'text-primary':   '#FFFFFF',
        'text-secondary': '#AAAAAA',
        'text-muted':     '#666666',

        'save-green':  '#4CAF50',
        'cancel-red':  '#E05252',
        'error-coral': '#E8A090',

        'cat-food':      '#E8C49A',
        'cat-transport': '#4A90D9',
        'cat-health':    '#E05252',
        'cat-coffee':    '#A0784A',
        'cat-others':    '#888888',
      },

      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        'display':   ['2rem',   { lineHeight: '1.1', fontWeight: '800' }],
        'h1':        ['1.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2':        ['1.1rem', { lineHeight: '1.3', fontWeight: '600' }],
        'body':      ['1rem',   { lineHeight: '1.5', fontWeight: '400' }],
        'caption':   ['0.8rem', { lineHeight: '1.4', fontWeight: '400' }],
        'amount':    ['2.5rem', { lineHeight: '1.0', fontWeight: '800' }],
        'amount-sm': ['1.2rem', { lineHeight: '1.2', fontWeight: '700' }],
      },

      borderRadius: {
        'card': '12px',
        'btn':  '8px',
        'pill': '9999px',
        'icon': '50%',
      },

      keyframes: {
        'ring-pulse': {
          '0%, 100%': { transform: 'scale(1)',    opacity: '0.6' },
          '50%':       { transform: 'scale(1.15)', opacity: '0.2' },
        },
        'spin-slow': {
          '0%':   { transform: 'rotate(0deg)'   },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'ring-1':    'ring-pulse 2s ease-in-out infinite',
        'ring-2':    'ring-pulse 2s ease-in-out infinite 0.4s',
        'ring-3':    'ring-pulse 2s ease-in-out infinite 0.8s',
        'spin-slow': 'spin-slow 1.5s linear infinite',
      },
    },
  },
  plugins: [],
}
