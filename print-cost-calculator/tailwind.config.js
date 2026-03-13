/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0D0D12',
          secondary: '#13131A',
          card: '#1A1A24',
          hover: '#1F1F2E',
        },
        accent: {
          primary: '#FF6B2B',
          secondary: '#FF8F5A',
          muted: '#FF6B2B1A',
        },
        border: {
          subtle: '#ffffff0D',
          default: '#ffffff1A',
          focus: '#FF6B2B66',
        },
        text: {
          primary: '#F0F0F5',
          secondary: '#8888A0',
          muted: '#55556A',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'sans-serif'],
        mono: ['SF Mono', 'JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,107,43,0.2)',
        accent: '0 0 20px rgba(255,107,43,0.3)',
        glow: '0 0 40px rgba(255,107,43,0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,107,43,0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(255,107,43,0.4)' },
        },
      },
    },
  },
  plugins: [],
}
