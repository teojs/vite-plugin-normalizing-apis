import type { AxiosRequestConfig } from 'axios'
import http from '@/service/axios.config'

interface IRequestConfig extends AxiosRequestConfig {
  params: {
    test: string
  }
}

export interface UserInfo {
  id: number
  name: string
}

interface IResponseData {
  code: string
  message: string
  body: UserInfo[]
}

/**
 * @description 用户列表API
 */
export default function api(ctx: IRequestConfig): Promise<IResponseData> {
  return http({
    method: 'get',
    url: '/api/user/list',
    ...ctx,
  })
}
