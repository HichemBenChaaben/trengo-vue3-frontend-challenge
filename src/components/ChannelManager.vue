<template>
  <h1 class="text-3xl font-bold m-4" data-testid="channel-manager-title">Channels</h1>
  <div class="bg-white border-solid-1 border rounded-xl shadow-sm px-4 py-4">
    <InputSearchMolecule
      v-model="searchInput"
      :isLoading="isAsyncSearchLoading"
      placeholder="Add channel"
      :items="suggestions"
      itemValue="name"
      @onClickItem="handleAddChannel"
      @onAdd="handleAddChannel"
    >
      <template #suggestion="{ item }">
        <div class="flex gap-2 justify-start items-center">
          <IconAtom :type="item.type" class="text-xs text-gray-300" />
          <span v-html="highlightName(item.name, searchInput)"></span>
        </div>
      </template>
    </InputSearchMolecule>
    <div class="text-gray-400 text-center" v-if="channels.length === 0 && !userChannelsLoading">
      No channels added
    </div>
    <div ref="scrollContainer" v-if="!userChannelsLoading">
      <draggable
        tag="ul"
        v-model="reArrangeChannels"
        handle=".js-handle"
        item-key="id"
        v-bind="dragOptions"
        @change="onDragUpdate"
        class="max-h-[300px] overflow-scroll py-2"
      >
        <template #item="{ element, id, index }">
          <transition name="fade">
            <ChannelRowMolecule
              data-testid="channels-row"
              :key="id"
              :name="element.name"
              :channelType="element.type"
              :idx="element.id"
              @onRemove="handleRemove(element)"
              :canDelete="reorderEnabled"
              :deleteProgress="element?.deleteProgress"
              :class="{ 'bg-pulse': index === 0 && highlightFirstItem }"
            />
          </transition>
        </template>
      </draggable>
    </div>
    <div v-if="userChannelsLoading">
      <ChannelRowLoaderMolecule v-for="i in 4" :key="i" :idx="i" />
    </div>
    <div class="overflow-hidden">
      <transition name="toast">
        <ActionsMolecule
          data-testid="channel-manager-actions"
          @onCancel="handleCancel"
          @onApply="handleApply"
          :busy="isUpdateLoading"
          v-if="isUserChannelsListChanged && !isUserChannelsListUpdated"
        />
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import draggable from 'vuedraggable'
import InputSearchMolecule from '@ui/InputSearchMolecule.vue'
import ChannelRowMolecule from '@ui/ChannelRowMolecule.vue'
import ActionsMolecule from '@ui/ActionsMolecule.vue'
import ChannelRowLoaderMolecule from '@ui/ChannelRowLoaderMolecule.vue'
import { useChannelsStore } from '@/stores/channelsStore'
import IconAtom from '@ui/IconAtom.vue'
import type { Channel } from 'types'

const store = useChannelsStore()

const {
  isAsyncSearchLoading,
  suggestions,
  channels,
  userChannelsLoading,
  isUpdateLoading,
  isUserChannelsListUpdated,
  isUserChannelsListChanged
} = storeToRefs(store)

const scrollContainer = ref<HTMLElement | null>(null)
const searchInput = ref('')
const reorderEnabled = ref(false)
/** creating a copy to not mess up the reactivity system */
const reArrangeChannels = ref([...channels.value])
const highlightFirstItem = ref(false)

/* fetch the channels user has selected previously */
store.fetchUserChannels()

watch(
  () => channels.value,
  (newValue) => {
    reArrangeChannels.value = [...newValue]
  }
)

/* Watch for changes to searchInput and call fetch suggestions */
watch(searchInput, (newValue) => {
  store.fetchChannels(newValue)
})

const handleRemove = (channel: Channel) => {
  store.deleteChannel(channel.id)
}

const handleCancel = () => {
  reArrangeChannels.value = channels.value
}

const handleApply = () => {
  channels.value = reArrangeChannels.value
  store.updateChannels(channels.value)
}

const handleAddChannel = (channel: Channel) => {
  store.addChannel(channel)
  /* scroll up when the user adds a channel to make the add function noticeable */
  if (scrollContainer.value) {
    const listElement = scrollContainer.value.querySelector('ul')
    if (listElement) {
      highlightFirstItem.value = true
      listElement.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }
}

const onDragUpdate = () => {
  store.setUserChannelsStarted()
}

const dragOptions = computed(() => {
  return {
    animation: 200,
    group: 'description',
    disabled: false,
    ghostClass: 'ghost'
  }
})

const highlightName = (name: string, searchInput: string) => {
  const s = searchInput.trim()
  /* No search input, return the name as-is */
  if (!s) {
    return name
  }

  /* Escape special characters in the search input to use in regex */
  const escapedSearchInput = s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedSearchInput})`, 'gi')

  /* Split the name into parts based on matches */
  const parts = name.split(regex)

  /* Highlight the non-matching parts */
  return parts.map((part) => (regex.test(part) ? part : `<b>${part}</b>`)).join('')
}

watchEffect(() => {
  if (highlightFirstItem.value) {
    setTimeout(() => {
      highlightFirstItem.value = false
    }, 1200)
  }
})
</script>
<style scoped>
.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

@keyframes pulse {
  0% {
    background-color: #ffffff; /* Initial color */
  }
  50% {
    background-color: #f5f4ff; /* Pulse color */
  }
  100% {
    background-color: #f5f6fe; /* Final color */
  }
}

.bg-pulse {
  animation: pulse 0.4s ease-in-out infinite;
}

/* Define the transition classes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.toast {
  position: fixed;
  top: -10px;
  z-index: 1;
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.toast-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.toast-enter-to {
  transform: translateY(0);
  opacity: 1;
}

.toast-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.toast-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
