/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        // Futuristic Dark Theme Colors
        bg: '#050505', // Deep black background
        surface: 'rgba(255, 255, 255, 0.03)', // Glass panels
        surfaceHover: 'rgba(255, 255, 255, 0.08)',
        border: 'rgba(255, 255, 255, 0.1)',
        
        primary: '#ffffff', // Primary text
        secondary: '#cbd5e1', // Secondary text (slate-300) for better readability
        
        // Vibrant neon gradients/accents
        accent: {
          DEFAULT: '#8b5cf6', // Violet
          magenta: '#d946ef',
          blue: '#3b82f6',
          cyan: '#06b6d4',
          glow: 'rgba(139, 92, 246, 0.5)',
        },
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderWidth: {
        '1': '1px',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        'pill': '9999px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-hover': '0 8px 32px 0 rgba(139, 92, 246, 0.15)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.5)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-glass': 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
