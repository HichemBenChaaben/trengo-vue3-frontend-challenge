import { worker } from './src/mocks/browser.js'

worker.start().then(() => {
  console.log('MSW worker started')
})
