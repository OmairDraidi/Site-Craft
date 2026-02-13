/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#111111',
          lighter: '#1a1a1a'
        },
        gold: {
          DEFAULT: '#F6C453',
        }
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'bounce-horizontal': 'bounceHorizontal 2s ease-in-out infinite',
        'scan-line': 'scanLine 3s linear infinite',
      },
      keyframes: {
        scanLine: {
          '0%': { transform: 'translateY(0%)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(1000%)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
        bounceHorizontal: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(10px)' },
        }
      }
    },
  },
  plugins: [],
}
