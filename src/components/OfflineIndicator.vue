<template>
  <div v-if="!isOnline" class="offline-indicator">
    <slot>You are offline </slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

const isOnline = ref(navigator.onLine)

const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine
}

window.addEventListener('online', updateOnlineStatus)
window.addEventListener('offline', updateOnlineStatus)

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})
</script>

<style scoped>
.offline-indicator {
  @apply bg-orange-400 text-2xl text-white w-full text-center left-0 p-4 font-semibold bottom-0 fixed;
}
</style>
