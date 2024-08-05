<script setup lang="ts">
import { RouterView } from 'vue-router'
import OfflineIndicator from '@/components/OfflineIndicator.vue'
</script>

<template>
  <div class="container">
    <RouterView />
    <OfflineIndicator />
  </div>
</template>

<style scoped></style>
