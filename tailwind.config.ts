import type { Config } from 'tailwindcss'

const config: Config = {
  // This content array MUST be correct.
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', // This line is crucial for the App Router
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config