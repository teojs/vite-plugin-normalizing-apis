import type { AxiosError } from 'axios'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: '/',
  withCredentials: true,
  timeout: 120000,
  validateStatus: status => status >= 200 && status < 300,
})

axiosInstance.interceptors.request.use((config) => {
  return config
})

axiosInstance.interceptors.response.use(
  async (response) => {
    return response.data
  },
  (error: AxiosError) => {
    return {
      code: error.code,
      message: error.message,
      body: null,
    }
  },
)

export default axiosInstance
