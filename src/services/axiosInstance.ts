import axios, {
  type AxiosInstance,
  type AxiosResponse,
  AxiosError,
  type CancelTokenSource
} from 'axios'

/**
 * Axios instance with base URL, interceptors and cancellation token
 * we use this instance to make all the API requests
 * this will make requests configurable in one place (singleton)
 * and will cancel ongoing pending requests to preseve the latest state from being
 * modified by the previous promises that might resolve in a complete different order
 */

const axiosInstance: AxiosInstance = axios.create({
  baseURL: '/',
  withCredentials: true
})

// Map to store cancel tokens for each URL
const cancelTokens: Map<string, CancelTokenSource> = new Map()

axiosInstance.interceptors.request.use((config: any) => {
  // Check if there's already a cancel token for the URL
  if (cancelTokens.has(config.url!)) {
    const source = cancelTokens.get(config.url!)!
    // Cancel the previous request
    source?.cancel('Request canceled by new request')
  }

  // Create a new cancel token and store it for the URL
  const source = axios.CancelToken.source()
  config.cancelToken = source.token
  cancelTokens.set(config.url!, source)

  return config
})

// Axios response interceptor to handle cancellation
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    cancelTokens.delete(response.config.url!)
    return response
  },
  (error: AxiosError) => {
    if (axios.isCancel(error)) {
      cancelTokens.delete(error?.config?.url!)
    }
  }
)

export default axiosInstance
