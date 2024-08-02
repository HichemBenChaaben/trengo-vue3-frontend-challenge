export default {
  plugins: {
    tailwindcss: {
      jit: false,
      purge: ['./client/src/**/*.vue']
    },
    autoprefixer: {}
  }
}
