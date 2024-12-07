/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck

import type demo from 'src/service/apis/demo.ts'
import type userList from 'src/service/apis/user/list.ts'

declare module 'virtual:normalizing-apis' {
  // API函数接口
  interface Apis {
  "demo": typeof demo,
  "user": {
    "list": typeof userList
  }
}
  export const apis: Apis

  // 导出全局Apis命名空间
  export namespace Apis {
    
    export namespace demo {
      export * from 'src/service/apis/demo.ts'
    }

    export namespace user.list {
      export * from 'src/service/apis/user/list.ts'
    }
  }
}
