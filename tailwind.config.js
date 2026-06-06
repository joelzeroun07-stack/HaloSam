/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#080C10',
        surface: '#0E1318',
        card: '#141B22',
        border: 'rgba(255,255,255,0.07)',
        primary: '#1FAF8F',
        'primary-dim': '#0D8A6F',
        accent: '#3B82F6',
        muted: '#8B9AAB',
        'on-primary': '#003025',
      },
      fontFamily: {
        display: ['var(--font-baskerville)', 'serif'],
        body: ['var(--font-baskerville)', 'serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
}
