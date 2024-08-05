import { faker } from '@faker-js/faker'
import type { Channel, ContactType } from 'types'

import { getPersistedData, setPersistedData } from './storage'

const STORAGE_KEY = 'userChannelsList'

function getRandomContactType() {
  const contactTypes = ['sms', 'phone', 'chat', 'other']
  const randomIndex = Math.floor(Math.random() * contactTypes.length)
  return contactTypes[randomIndex]
}

const dataSetLength = 10000

export const channelsList: Channel[] = Array.from({ length: dataSetLength }, () => ({
  id: faker.string.uuid(),
  name: faker.company.buzzPhrase(),
  type: getRandomContactType() as ContactType
}))

/* just a dummy 1 item to start the state with something */
let userChannelsList: Channel[] = getPersistedData(STORAGE_KEY, [
  {
    id: '88fb1699-184c-47f8-81e5-fe307180cc40',
    name: 'brand ubiquitous synergies',
    type: 'other'
  }
])

export const config = {
  get userChannelsList() {
    return userChannelsList
  },
  set userChannelsList(value: Channel[]) {
    userChannelsList = value
    setPersistedData(STORAGE_KEY, value)
  }
}
