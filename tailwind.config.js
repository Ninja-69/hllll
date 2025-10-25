/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: '#0a0a0a',
        surface: '#1a1a1a',
        'surface-elevated': '#2a2a2a',
        card: '#1e1e1e',
        border: '#333333',
        text: '#ffffff',
        'text-muted': '#a0a0a0',
        'text-secondary': '#d0d0d0',
        primary: {
          DEFAULT: '#ff8c42',
          dark: '#e67c3a',
          light: '#ffb366',
        },
        secondary: {
          DEFAULT: '#ffe066',
          dark: '#e6c75a',
          light: '#fff299',
        },
        accent: '#66ff66',
        success: '#4ade80',
        warning: '#fbbf24',
        error: '#ef4444',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #ff8c42 0%, #ffe066 100%)',
        'gradient-surface': 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        'gradient-card': 'linear-gradient(135deg, #1e1e1e 0%, #2e2e2e 100%)',
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 140, 66, 0.3)',
        'glow-lg': '0 0 40px rgba(255, 140, 66, 0.4)',
        'dark-sm': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'dark-md': '0 4px 16px rgba(0, 0, 0, 0.4)',
        'dark-lg': '0 8px 32px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'progress-ring': 'progress-ring 2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
        'progress-ring': {
          '0%': { strokeDashoffset: '283' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}