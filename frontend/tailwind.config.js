/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          light: '#FAFAFA',
          ivory: '#FFFFFF'
        },
        charcoal: '#111111',
        slateMuted: '#71717A',
        goldAccent: '#D4AF37'
      },
      fontFamily: {
        serifBrand: ['"Playfair Display"', 'Georgia', 'serif'],
        sansSystem: ['Montserrat', 'Inter', 'sans-serif']
      },
      letterSpacing: {
        widestLuxe: '0.15em'
      }
    },
  },
  plugins: [],
}
