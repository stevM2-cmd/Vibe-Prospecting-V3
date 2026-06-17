import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'gy-bg':       '#0A0F1E',
        'gy-surface':  '#111827',
        'gy-border':   '#1E2D45',
        'gy-blue':     '#1E3A5F',
        'gy-teal':     '#00D4AA',
        'gy-amber':    '#F4C842',
        'gy-text':     '#E5E7EB',
        'gy-muted':    '#6B7280',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
