<template>
  <FontAwesomeIcon
    :icon="computedChannelTypeIcon"
    class="text-gray-500 flex items-center text-xl"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ContactType } from 'types'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPhone, faEnvelope, faGlobe } from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'

interface Props {
  type: ContactType
}

const props = defineProps<Props>()

const computedChannelTypeIcon = computed(() => {
  switch (props.type) {
    case 'sms':
      return faEnvelope
    case 'phone':
      return faPhone
    case 'chat':
      return faWhatsapp
    default:
      return faGlobe
  }
})
</script>
