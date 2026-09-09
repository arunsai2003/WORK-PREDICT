/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070d1e',
          900: '#0b1329',
          850: '#0e1a38',
          800: '#112246',
          750: '#152b57',
          700: '#1e3260',
        },
        brand: {
          blue: '#2563EB',
          cyan: '#06B6D4',
          purple: '#8B5CF6',
          green: '#22C55E',
          red: '#EF4444',
          yellow: '#F59E0B',
          orange: '#F97316'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.35)',
        'glow-blue': '0 0 20px -3px rgba(37, 99, 235, 0.35)',
        'glow-purple': '0 0 20px -3px rgba(139, 92, 246, 0.35)',
        'glow-red': '0 0 20px -3px rgba(239, 68, 68, 0.35)',
        'card-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'card-light': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
