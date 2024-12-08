import type { AxiosRequestConfig } from 'axios'
import http from '@/service/axios.config'

interface IRequestConfig extends AxiosRequestConfig {
  params: {
    id: number
    name: string
  }
  data: {
    id: number
    name: string
  }
}

export interface UserInfo {
  id: number
  name?: string
  age?: number
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
