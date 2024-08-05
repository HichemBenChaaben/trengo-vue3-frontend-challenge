<template>
  <div class="flex justify-end gap-2 pt-3">
    <Button @click="emits('onCancel')" variant="secondary"> cancel </Button>
    <Button
      data-testid="apply-button"
      @click="emits('onApply')"
      :busy="props.busy"
      busyText="Apply..."
    >
      Apply
    </Button>
  </div>
</template>
<script lang="ts" setup>
import Button from '@/components/ui/ButtonAtom.vue'

interface Props {
  busy: boolean
}

const props = defineProps<Props>()
const emits = defineEmits(['onCancel', 'onApply'])
</script>
