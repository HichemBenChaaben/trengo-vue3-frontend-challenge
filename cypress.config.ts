// import { defineConfig } from 'cypress'

// export default defineConfig({
//   e2e: {
//     specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
//     baseUrl: 'http://localhost:4173'
//   }
// })

const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:4173'
  }
})
