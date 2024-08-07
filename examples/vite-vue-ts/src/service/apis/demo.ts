import type { AxiosRequestConfig } from 'axios'
import http from '@/service/axios.config'

interface IRequestConfig extends AxiosRequestConfig {
  params: {
    test: string
  }
}

interface IResponseData {
  code: string
  message: string
  body: string
}

/**
 * @description Demo API
 */
export default function api(ctx: IRequestConfig): Promise<IResponseData> {
  return http({
    method: 'get',
    url: '/demo.json',
    ...ctx,
  })
}
