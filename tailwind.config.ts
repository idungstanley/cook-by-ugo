import type { Config } from 'tailwindcss'

/** Reads a design token from `src/styles/globals.css` and keeps Tailwind opacity modifiers working. */
const token = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        jollof: { DEFAULT: token('jollof'), dark: token('jollof-dark') },
        gold: { DEFAULT: token('gold'), soft: token('gold-soft') },
        ewedu: token('ewedu'),
        indigo: token('indigo'),
        cocoa: { DEFAULT: token('cocoa'), soft: token('cocoa-soft') },
        shea: token('shea'),
        paper: token('paper'),
        muted: token('muted'),
        line: token('line'),
        whatsapp: token('whatsapp'),
      },
      fontFamily: {
        display: ['var(--font-display)'],
        accent: ['var(--font-accent)'],
        body: ['var(--font-body)'],
      },
      maxWidth: {
        site: 'var(--site-max-width)',
      },
      borderRadius: {
        card: 'var(--radius-card)',
        panel: 'var(--radius-panel)',
      },
      boxShadow: {
        float: '0 18px 40px -16px rgb(var(--color-cocoa) / 0.35)',
        panel: '0 24px 70px -24px rgb(var(--color-cocoa) / 0.55)',
      },
      keyframes: {
        ticker: { to: { transform: 'translateX(-50%)' } },
        'fade-in': { from: { opacity: '0' } },
        'slide-in': { from: { transform: 'translateX(100%)' } },
        'sheet-in': { from: { transform: 'translateY(100%)' } },
        'pop-in': { from: { opacity: '0', transform: 'translateY(16px) scale(0.98)' } },
      },
      animation: {
        ticker: 'ticker 32s linear infinite',
        'fade-in': 'fade-in 200ms ease-out',
        'slide-in': 'slide-in 280ms cubic-bezier(0.22, 1, 0.36, 1)',
        'sheet-in': 'sheet-in 280ms cubic-bezier(0.22, 1, 0.36, 1)',
        'pop-in': 'pop-in 240ms cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config
