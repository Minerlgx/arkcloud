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
        primary: '#0066FF',
        secondary: '#00D4AA',
        accent: '#FF6B35',
        dark: {
          bg: '#0A0F1C',
          card: '#111827',
          border: '#1F2937',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', 'Noto Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
