/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        monopoly: {
          green: '#cde6d0',
          darkGreen: '#1f363d',
          red: '#f01b1b',
          blue: '#0072bb',
          yellow: '#ffed00',
          pink: '#d93a96',
          orange: '#f7941d',
          brown: '#955436',
          lightBlue: '#aae0fa',
        }
      },
      gridTemplateColumns: {
        '11': 'repeat(11, minmax(0, 1fr))',
      },
      gridTemplateRows: {
        '11': 'repeat(11, minmax(0, 1fr))',
      }
    },
  },
  plugins: [],
}
