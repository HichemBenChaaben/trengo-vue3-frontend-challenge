<template>
  <div role="status">
    <div v-html="loadingIcon"></div>
  </div>
</template>
<script lang="ts" setup>
import loadingIcon from '@/assets/loading.svg?raw'
</script>
