import { http, delay, HttpResponse } from 'msw'
import Fuse from 'fuse.js'
import { channelsList, config } from './db'
import { getRandomDelay } from './utils'
import { ChannelArraySchema, type ChannelSchema } from './schemas'

const channelsListWithLowerCase = channelsList.map((channel) => ({
  ...channel,
  lowerCaseName: channel.name.toLowerCase()
}))

/** helper to perform fuzzy search in the data set */
const fuse = new Fuse(channelsListWithLowerCase, {
  keys: ['name'],
  threshold: 0.3
})

export const handlers = [
  /* simulate getting suggestions list that are enabled by feature flag */
  http.get('/channels/suggestions', async ({ request }) => {
    const url = new URL(request.url)
    const searchQuery = url.searchParams.getAll('search')[0]
    await delay(getRandomDelay())
    const res = fuse.search(searchQuery).map((result) => result.item)
    return HttpResponse.json(res || [])
  }),

  /* simulate  saving the user selected channel list */
  http.post('/channels', async ({ request }) => {
    await delay(getRandomDelay(1000, 3000))
    try {
      // todo add type in the object array
      // ChannelArraySchema.parse(request)
      const newChannels = await request.json()
      config.userChannelsList = newChannels as ChannelSchema[]
    } catch (err) {
      console.error(err)
      return HttpResponse.json({ status: 500 })
    }
    return HttpResponse.json(config.userChannelsList, { status: 200 })
  }),
  /* simulate user selected channels that are already saved in he backend */
  http.get('/channels', async () => {
    await delay(getRandomDelay())
    return HttpResponse.json(config.userChannelsList)
  })
]
