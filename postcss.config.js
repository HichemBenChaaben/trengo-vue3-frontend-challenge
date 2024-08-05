export default {
  plugins: {
    tailwindcss: {
      jit: false,
      purge: ['./src/**/*.vue']
    },
    autoprefixer: {}
  }
}
