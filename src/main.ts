import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import clickOutside from '@/directives/clickOutside'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.directive('click-outside', clickOutside)

/**
 * because creating a application without network capabilities is a bit boring
 * we created a mock server to showcase few networks handling tricks
 */
async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return
  }
  const { worker } = await import('./mocks/browser.ts')
  return worker.start()
}

enableMocking().then(() => {
  app.mount('#app')
})
