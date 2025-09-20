import tailwindScrollbar from 'tailwind-scrollbar'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        floatSlow: 'float 20s ease-in-out infinite',
        floatSlowReverse: 'floatReverse 25s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-30px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        floatReverse: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(30px)' },
          '100%': { transform: 'translateY(0px)' },
        },
      },
    },
  },
  theme: {
  extend: {
    animation: {
      marquee: 'marquee 20s linear infinite',
    },
    keyframes: {
      marquee: {
        '0%': { transform: 'translateX(0%)' },
        '100%': { transform: 'translateX(-50%)' },
      },
    },
  },
},
  plugins: [tailwindScrollbar()],
}
