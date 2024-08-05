import { setActivePinia, createPinia } from 'pinia'
import { useChannelsStore } from '@/stores/channelsStore'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import api from '@/services/api'
import { nextTick } from 'vue'
import type { Channel } from 'types'

vi.mock('@/services/api')

describe('Channels Store', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    setActivePinia(createPinia())
  })

  it('initializes with correct state', () => {
    const store = useChannelsStore()
    expect(store.$state).toMatchInlineSnapshot(`
      {
        "channels": [],
        "isAsyncSearchLoading": false,
        "isUpdateLoading": false,
        "isUserChannelsListChanged": false,
        "isUserChannelsListUpdated": true,
        "suggestions": [],
        "userChannelsLoading": false,
      }
    `)
    expect(store.channels).toEqual([])
    expect(store.suggestions).toEqual([])
    expect(store.isAsyncSearchLoading).toBe(false)
    expect(store.userChannelsLoading).toBe(false)
    expect(store.isUpdateLoading).toBe(false)
    expect(store.isUserChannelsListUpdated).toBe(true)
    expect(store.isUserChannelsListChanged).toBe(false)
  })

  it('adds a channel', () => {
    const store = useChannelsStore()
    const newChannel: Channel = { id: '123', name: 'Test Channel', type: 'chat' }
    store.addChannel(newChannel)
    expect(store.channels.length).toBe(1)
    expect(store.channels.includes(newChannel)).toBe(true)
    expect(store.isUserChannelsListUpdated).toBe(false)
    expect(store.isUserChannelsListChanged).toBe(true)
  })

  it('deletes a channel and flag for list changed', () => {
    const store = useChannelsStore()
    const newChannel: Channel = { id: '123', name: 'Test Channel', type: 'chat' }
    store.addChannel(newChannel)
    expect(store.channels.length).toBe(1)
    store.deleteChannel('123')
    expect(store.channels.length).toBe(0)
    expect(store.isUserChannelsListChanged).toBe(true)
  })

  it('fetches user channels', async () => {
    const store = useChannelsStore()
    const mockChannels: Channel[] = [{ id: '123', name: 'Test Channel', type: 'chat' }]
    api.channels.getUserChannels = vi.fn().mockResolvedValue({ data: mockChannels })
    await nextTick()
    await store.fetchUserChannels()
    expect(store.channels).toEqual(mockChannels)
    expect(store.userChannelsLoading).toBe(false)
  })

  it('fetches channel suggestions', async () => {
    const store = useChannelsStore()
    const searchQuery = 'test'
    const mockSuggestions: Channel[] = [{ id: '123', name: 'Test Channel 2', type: 'chat' }]
    api.channels.getSuggestions = vi.fn().mockResolvedValue({ data: mockSuggestions })

    expect(store.isAsyncSearchLoading).toBe(false)
    store.fetchChannels(searchQuery)
    await nextTick()

    // Wait for debounce delay
    await new Promise((resolve) => setTimeout(resolve, 200))
    await nextTick()
    expect(store.suggestions).toEqual(mockSuggestions)
    expect(store.isAsyncSearchLoading).toBe(false)
  })

  it('updates channels', async () => {
    const store = useChannelsStore()
    const mockChannels: Channel[] = [{ id: '123', name: 'Updated Channel', type: 'chat' }]
    api.channels.addChannels = vi.fn().mockResolvedValue({})

    await store.updateChannels(mockChannels)
    expect(store.isUpdateLoading).toBe(false)
    expect(store.isUserChannelsListUpdated).toBe(true)
  })
})
