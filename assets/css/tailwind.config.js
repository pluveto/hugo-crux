module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Josefin Sans', 'ui-sans-serif', 'system-ui'],
      },
      typography: {
        DEFAULT: {
          css: {
            pre: { color: null, backgroundColor: '#f7f7f7' },
           'pre code': { color: null, backgroundColor: null },
           a: { textDecoration: 'none' }
          }
        }
      }
    }
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
  ]
}
