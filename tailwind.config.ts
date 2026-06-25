import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './studio/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#050505',
        surface: '#111111',
        'surface-2': '#1A1A1A',
        gold: '#C9A24D',
        'gold-2': '#D8B86A',
        'gold-3': '#E6D3A3',
        border: '#2A2A2A',
        'text-muted': '#CFCFCF',
        'text-dim': '#888888',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A24D 0%, #D8B86A 50%, #C9A24D 100%)',
        'dark-gradient': 'linear-gradient(180deg, #050505 0%, #111111 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.6s ease forwards',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseGold: { '0%,100%': { boxShadow: '0 0 0 0 rgba(201,162,77,0)' }, '50%': { boxShadow: '0 0 0 8px rgba(201,162,77,0.1)' } },
      },
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [],
}

export default config
