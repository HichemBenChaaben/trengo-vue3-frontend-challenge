import type { Channel } from 'types'

export const getPersistedData = (key: string, defaultValue: Channel[]) => {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : defaultValue
}

export const setPersistedData = (key: string, value: Channel[]) => {
  localStorage.setItem(key, JSON.stringify(value))
}
