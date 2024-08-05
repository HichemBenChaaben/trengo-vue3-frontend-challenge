<template>
  <form
    @onSubmit="handleAddChannel"
    @focus="handleFocus"
    v-click-outside="handleClickOutSide"
    class="form"
  >
    <span class="mx-2">
      <Loading v-if="props.isLoading" />
      <FontAwesomeIcon v-else :icon="faMagnifyingGlass" class="text-gray-400" />
    </span>
    <input
      data-testid="suggestions-input"
      type="text"
      :placeholder="props.placeholder"
      class="w-full focus:outline-none"
      v-model="modelValue"
      @keydown.up.prevent="onArrowUp"
      @keydown.down.prevent="onArrowDown"
      @keydown.enter.prevent="onEnterKeydown"
      @change="$emit('update:modelValue', modelValue as string)"
    />
    <ul
      data-testid="suggestions-list"
      ref="suggestionsList"
      tabindex="-1"
      class="list js-cypress-list-suggestions"
      v-if="props.items && props.items.length > 0 && !hideSuggestions"
    >
      <li
        v-for="(item, index) in props.items"
        :key="index"
        :class="{ highlighted: index === highlightedIndex }"
        class="pointer-events-auto cursor-pointer text-gray-700 hover:font-semibold hover:bg-gray-100 hover:text-black py-2 px-1 rounded-md"
        @click="handleClickItem(item)"
      >
        <slot name="suggestion" :item="item" :index="index"></slot>
      </li>
    </ul>
  </form>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Loading from '@/components/ui/LoadingAtom.vue'
import type { Nullable, Channel } from 'types'

const modelValue = defineModel<string>()
const emits = defineEmits(['onClickItem', 'selectItem', 'onAdd'])
const hideSuggestions = ref(false)

interface Props {
  isLoading: boolean
  placeholder?: string
  itemValue: string
  items: Nullable<Channel[]>
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  placeholder: 'Search',
  itemValue: 'name',
  items: null
})

const highlightedIndex = ref(0)
const suggestionsList = ref<HTMLElement | null>(null)

const handleFocus = () => {
  hideSuggestions.value = !hideSuggestions.value
}
const handleClickItem = (channel: Channel) => {
  highlightedIndex.value = -1
  hideSuggestions.value = true
  emits('onClickItem', channel)
  modelValue.value = ''
}
const handleClickOutSide = () => {
  if (!hideSuggestions.value) {
    hideSuggestions.value = true
  }
}

watch(
  () => props.items,
  (newValue) => {
    if (newValue) {
      hideSuggestions.value = false
    }
  }
)

const handleAddChannel = () => {
  emits('onAdd', modelValue.value)
  modelValue.value = ''
}

const onEnterKeydown = () => {
  if (highlightedIndex.value === -1) {
    return
  }
  const selelectedItem = props.items && props.items[highlightedIndex.value]
  if (selelectedItem) {
    handleClickItem(selelectedItem)
  }
}
const onArrowUp = () => {
  if (highlightedIndex.value > 0) {
    highlightedIndex.value--
    scrollToHighlighted()
  }
}
const onArrowDown = () => {
  if (props.items && highlightedIndex.value < props.items.length - 1) {
    highlightedIndex.value++
    scrollToHighlighted()
  }
}

const scrollToHighlighted = async () => {
  await nextTick()
  const list = suggestionsList.value
  if (!list) return

  const items = list.children
  if (!items || items.length === 0) return

  const item = items[highlightedIndex.value] as HTMLElement
  const itemTop = item.offsetTop
  const itemBottom = itemTop + item.clientHeight
  const listScrollTop = list.scrollTop
  const listClientHeight = list.clientHeight

  if (itemTop < listScrollTop) {
    list.scrollTop = itemTop
  } else if (itemBottom > listScrollTop + listClientHeight) {
    list.scrollTop = itemBottom - listClientHeight
  }
}
</script>
<style scoped>
.list {
  @apply rounded-2xl px-2 absolute w-full flex-col top-1 left-0 mt-[40px] flex border border-gray-300 bg-white py-2 h-[240px] z-10 overflow-scroll;
}
.highlighted {
  @apply bg-gray-100 text-black;
}
.form {
  @apply relative flex border border-solid border-gray-400 rounded-3xl p-2 mb-4;
}
</style>
