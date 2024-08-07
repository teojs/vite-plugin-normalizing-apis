/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck

import type demo from 'src/service/apis/demo.ts'

declare module 'virtual:normalizing-apis' {
  interface Apis {
  "demo": typeof demo
}
  export const apis:Apis

  export type * from 'src/service/apis/demo.ts'
}

