/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E8EDF5',
          100: '#C5D0E6',
          200: '#9EB3D6',
          300: '#7795C5',
          400: '#5A7EB9',
          500: '#3D67AD',
          600: '#355FA5',
          700: '#2B549B',
          800: '#224A92',
          900: '#0F1B2D',
          950: '#080E19'
        },
        accent: {
          50: '#FFF8E1',
          100: '#FFECB3',
          200: '#FFE082',
          300: '#FFD54F',
          400: '#FFCA28',
          500: '#F5A623',
          600: '#F09819',
          700: '#E88A0E',
          800: '#E07C03',
          900: '#CC6600'
        },
        surface: {
          DEFAULT: '#0A0F1C',
          secondary: '#111827',
          tertiary: '#1F2937',
          card: '#162032',
          hover: '#1E293B'
        },
        border: { DEFAULT: '#2A3A52', light: '#374151' }
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(245, 166, 35, 0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(245, 166, 35, 0.25)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern':
          'linear-gradient(to right, rgba(42, 58, 82, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(42, 58, 82, 0.3) 1px, transparent 1px)'
      },
      backgroundSize: {
        grid: '60px 60px'
      }
    }
  },
  plugins: []
};
