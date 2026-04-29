/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue-main': '#0B3A75',
        'blue-light': '#1553A8',
        'blue-pale': '#E8F0FD',
        'saffron': '#F59E0B',
        'saffron-dark': '#D97706',
        'ink': '#1A1A2E',
        'muted': '#6B7280',
        'border-gray': '#E5E7EB',
        'green-main': '#16A34A',
        'red-main': '#DC2626',
        'amber-main': '#D97706',
        'bg-main': '#F9FAFB',
      },
      spacing: {
        '1.5': '6px', // 1.5 units in tailwind typically means 6px
      },
      borderRadius: {
        'radius': '12px',
        'radius-sm': '8px',
      },
      borderWidth: {
        '1.5': '1.5px',
      },
      boxShadow: {
        'main': '0 4px 16px rgba(11,58,117,0.10)',
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'dm-sans': ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
