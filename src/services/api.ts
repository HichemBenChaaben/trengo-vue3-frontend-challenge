import * as channels from './channels'

/**
 * group services under api
 * the goal is to create a façade pattern for future iterations
 * where the api implementation details might be easily swapper and replaced
 * by something else if necessary
 * */

interface API {
  channels: typeof channels
}

const api: API = {
  channels
}

export default api
