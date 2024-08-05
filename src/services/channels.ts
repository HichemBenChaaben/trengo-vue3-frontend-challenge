import type { AxiosResponse } from 'axios'
import axiosInstance from './axiosInstance'
import type { Channel } from 'types'

export function getUserChannels(): Promise<AxiosResponse<Channel[]>> {
  return axiosInstance.get('/channels')
}

export function getSuggestions(searchQuery: string): Promise<AxiosResponse<Channel[]>> {
  return axiosInstance.get('/channels/suggestions', {
    params: {
      search: searchQuery
    }
  })
}

export function addChannels(channels: Channel[]): Promise<AxiosResponse<void>> {
  return axiosInstance.post('/channels', channels)
}
