/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: '#050505',
        bgSecondary: '#0A0A0A',
        bgCard: '#121212',
        bgElevated: '#1A1A1A',
        accent: {
          DEFAULT: '#D4AF37', // Refined Metallic Gold
          light: '#F3E5AB',
          dark: '#998100',
          glow: 'rgba(212, 175, 55, 0.15)',
          border: 'rgba(212, 175, 55, 0.3)',
        },
        glass: {
          bg: 'rgba(255, 255, 255, 0.02)',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.05)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Outfit', 'sans-serif'], // We'll map serif to Outfit for headings
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.68, -0.6, 0.32, 1.6) both',
        'fade-in': 'fadeIn 0.8s ease both',
        'slide-right': 'slideInRight 0.8s cubic-bezier(0.68, -0.6, 0.32, 1.6) both',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(40px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0', filter: 'blur(10px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(1deg)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201, 168, 76, 0.15)', transform: 'scale(1)' },
          '50%': { boxShadow: '0 0 50px rgba(201, 168, 76, 0.4)', transform: 'scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
}
