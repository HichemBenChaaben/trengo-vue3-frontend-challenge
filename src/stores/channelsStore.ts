import { acceptHMRUpdate, defineStore } from 'pinia'
import { debounce } from 'lodash'
import { ref } from 'vue'
import api from '@/services/api'
import axios from 'axios'
import type { Channel } from 'types'

interface ChannelState extends Channel {
  deleteProgress?: boolean
}
export const useChannelsStore = defineStore(
  'channels',
  () => {
    const channels = ref<ChannelState[]>([])
    const suggestions = ref<Channel[]>([])
    const error = ref<string>()
    const isAsyncSearchLoading = ref(false)
    const userChannelsLoading = ref(false)
    const isUpdateLoading = ref(false)
    const isUserChannelsListUpdated = ref(true)
    const isUserChannelsListChanged = ref(false)

    const debounceSearchDelay = 100

    const debouncedSearch = debounce(async (searchQuery: string) => {
      if (searchQuery.trim() !== '' && searchQuery.length > 2) {
        isAsyncSearchLoading.value = true
        try {
          const response = await api.channels.getSuggestions(searchQuery)
          suggestions.value = response.data.filter((suggestion) => {
            return !channels.value.some((channel) => channel.id === suggestion.id)
          })
        } catch (err: unknown | Error | typeof axios.AxiosError) {
          if (axios.isAxiosError(err)) {
            error.value = err.response?.data.message
          }
          error.value = 'Unknwon error occured'
        } finally {
          isAsyncSearchLoading.value = false
        }
      }
    }, debounceSearchDelay)

    const fetchChannels = (searchQuery: string) => {
      debouncedSearch(searchQuery)
    }

    // add a channel to the channels list
    const addChannel = (channel: Channel) => {
      channels.value = [channel, ...channels.value]
      isUserChannelsListUpdated.value = false
      isUserChannelsListChanged.value = true
    }

    // delete a channel from the channels list
    const deleteChannel = async (channelId: number | string) => {
      setUserChannelsStarted()
      /* removing the channel from the list - instead of refetching the list */
      channels.value = channels.value.filter(({ id }) => {
        return id !== channelId
      })
    }

    const updateChannels = async (channels: Channel[]) => {
      try {
        isUpdateLoading.value = true
        await api.channels.addChannels(channels)
      } catch (err) {
        if (axios.isAxiosError(err)) {
          error.value = err.response?.data.message
        }
        error.value = 'Unknwon error occured'
      } finally {
        isUpdateLoading.value = false
        setUserChannelsUpdateCompleted()
      }
    }

    /* get channels the user has selected */
    const fetchUserChannels = async () => {
      try {
        userChannelsLoading.value = true
        const response = await api.channels.getUserChannels()
        channels.value = response.data
      } catch (err) {
        if (axios.isAxiosError(err)) {
          error.value = err.response?.data.message
        }
        error.value = 'Unknwon error occured'
      } finally {
        userChannelsLoading.value = false
      }
    }

    const setUserChannelsStarted = () => {
      isUserChannelsListUpdated.value = false
      isUserChannelsListChanged.value = true
    }
    const setUserChannelsUpdateCompleted = () => {
      isUserChannelsListChanged.value = true
      isUserChannelsListUpdated.value = true
    }

    return {
      isAsyncSearchLoading,
      isUpdateLoading,
      isUserChannelsListUpdated,
      isUserChannelsListChanged,
      userChannelsLoading,
      channels,
      suggestions,
      fetchChannels,
      addChannel,
      deleteChannel,
      updateChannels,
      fetchUserChannels,
      setUserChannelsStarted,
      setUserChannelsUpdateCompleted
    }
  },
  {
    // persist the state on localstore
    // only for development purposes
    persist: false
  }
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChannelsStore, import.meta.hot))
}
