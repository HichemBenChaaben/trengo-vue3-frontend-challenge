<template>
  <div class="p-1 rounded-md flex justify-between hover:bg-gray-100">
    <div class="flex gap-4 mx-3">
      <div class="js-handle my-2 py-1 rounded-md">
        <FontAwesomeIcon :icon="faGripVertical" class="text-gray-300 text-2xl cursor-move" />
      </div>
      <div class="flex justify-center items-center my-2 px-3 bg-gray-100 rounded-lg">
        <IconAtom :type="props.channelType" />
      </div>
      <div class="flex items-center truncate overflow-hidden">
        {{ props.name }}
      </div>
    </div>

    <div class="flex items-center justify-center text-center ml-2">
      <Loading v-if="deleteProgress" />
      <Button
        data-testid="remove-button"
        variant="subtle"
        v-else
        :class="{ 'opacity-40': props.canDelete }"
        @click="handleRemove"
        :disabled="props.canDelete"
        :aria-label="`Remove ${props.name}`"
      >
        remove
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGripVertical } from '@fortawesome/free-solid-svg-icons'
import Loading from '@ui/LoadingAtom.vue'
import Button from '@ui/ButtonAtom.vue'
import IconAtom from '@ui/IconAtom.vue'
import type { ContactType } from 'types'

interface Props {
  name: string
  idx: string | number
  channelType: ContactType
  canDelete?: boolean
  deleteProgress?: boolean
}

const emits = defineEmits(['onRemove'])
const props = withDefaults(defineProps<Props>(), {
  deleteProgress: false
})

const handleRemove = () => {
  emits('onRemove', { name: props.name, index: props.idx })
}
</script>
