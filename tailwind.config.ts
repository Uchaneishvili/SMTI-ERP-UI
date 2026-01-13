import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E9F2FF',
          100: '#CCE0FF',
          200: '#85B8FF',
          300: '#579DFF',
          400: '#388BFF',
          500: '#1D7AFC',
          600: '#0C66E4',
          700: '#0055CC',
          800: '#09326C',
          900: '#092957',
        },
        neutral: {
          50: '#FAFBFC',
          100: '#F4F5F7',
          200: '#EBECF0',
          300: '#DFE1E6',
          400: '#C1C7D0',
          500: '#A5ADBA',
          600: '#6B778C',
          700: '#505F79',
          800: '#344563',
          900: '#172B4D',
        },
        phase: {
          new: {
            bg: '#E3FCEF',
            border: '#57D9A3',
            text: '#006644',
          },
          sent: {
            bg: '#DEEBFF',
            border: '#4C9AFF',
            text: '#0747A6',
          },
          received: {
            bg: '#FFF0B3',
            border: '#FFE380',
            text: '#172B4D',
          },
          completed: {
            bg: '#E3FCEF',
            border: '#36B37E',
            text: '#006644',
          },
        },
      },
      animation: {
        'drag-pulse': 'drag-pulse 0.3s ease-in-out',
        'drop-bounce': 'drop-bounce 0.4s ease-out',
        'card-lift': 'card-lift 0.2s ease-out forwards',
        'fade-in': 'fade-in 0.2s ease-out',
      },
      keyframes: {
        'drag-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        'drop-bounce': {
          '0%': { transform: 'translateY(-8px)', opacity: '0.8' },
          '60%': { transform: 'translateY(2px)' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'card-lift': {
          '0%': {
            transform: 'rotate(0deg) scale(1)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          },
          '100%': {
            transform: 'rotate(2deg) scale(1.02)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(9, 30, 66, 0.25)',
        'card-hover': '0 4px 8px rgba(9, 30, 66, 0.25)',
        'card-dragging': '0 10px 30px rgba(9, 30, 66, 0.3)',
        column:
          '0 1px 1px rgba(9, 30, 66, 0.25), 0 0 1px rgba(9, 30, 66, 0.31)',
      },
    },
  },
  plugins: [],
};

export default config;
