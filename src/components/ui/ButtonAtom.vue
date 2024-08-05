<template>
  <button :class="[buttonClasses]" :disabled="props.busy" class="base">
    <div v-if="props.busy" class="gap-2 items-center flex">
      <Loading :class="{ 'text-black': props.variant === 'secondary' }" />
      <div>{{ props.busyText || 'loading...' }}</div>
    </div>
    <div><slot v-if="!props.busy"></slot></div>
  </button>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import Loading from '@ui/LoadingAtom.vue'

interface Props {
  busy?: boolean
  busyText?: string
  variant?: 'primary' | 'secondary' | 'subtle'
}
const props = withDefaults(defineProps<Props>(), {
  variant: 'primary'
})

const buttonClasses = computed((): string => {
  switch (props.variant) {
    case 'secondary':
      return `bg-white text-black hover:bg-gray-100`
    case 'subtle':
      return `bg-white text-gray-500 border-none hover:bg-text-700 bg-transparent hover:bg-transparent`
    case 'primary':
      return 'bg-gray-800 text-white hover:bg-white hover:text-black :hover:border-black'
    default:
      // will never happen - default is always primary
      return ''
  }
})
</script>

<style scoped>
.base {
  @apply flex justify-between border py-2 px-6 h-10 items-center capitalize rounded-full gap-2 cursor-pointer;
}
</style>
