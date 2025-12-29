export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary: blue
        primary: {
          DEFAULT: '#2563eb', // blue-600
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
        },
        // Secondary: slate
        secondary: {
          DEFAULT: '#64748b',
        },
        // Accent: teal
        accent: {
          DEFAULT: '#0ea5a4',
        },
        'card-background': '#111827',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.5s ease-out forwards',
        'pop-in': 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'slide-in-left': 'slideInLeft 0.4s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        'focus-pulse': 'focusPulse 1.5s cubic-bezier(0.4, 0, 0.6, 1)',
      },
      keyframes: {
        fadeIn: {
          from: {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeInUp: {
          from: {
            opacity: '0',
            transform: 'translateY(8px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeInDown: {
          from: {
            opacity: '0',
            transform: 'translateY(-8px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        popIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.5) translateY(10px)',
          },
          '50%': {
            opacity: '1',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1) translateY(0)',
          },
        },
        slideInLeft: {
          from: {
            opacity: '0',
            transform: 'translateX(-16px)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        slideInRight: {
          from: {
            opacity: '0',
            transform: 'translateX(16px)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        focusPulse: {
          '0%': {
            'box-shadow': '0 0 0 0 rgba(59, 130, 246, 0.7)',
          },
          '70%': {
            'box-shadow': '0 0 0 6px rgba(59, 130, 246, 0)',
          },
          '100%': {
            'box-shadow': '0 0 0 0 rgba(59, 130, 246, 0)',
          },
        },
      },
      transitionDuration: {
        250: '250ms',
        350: '350ms',
      },
    },
  },
  plugins: [],
};
