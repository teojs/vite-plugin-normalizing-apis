/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck

import type demo from 'src/service/apis/demo.ts'
import type userGetUserName from 'src/service/apis/user/get-user-name.ts'
import type userList from 'src/service/apis/user/list.ts'

declare module 'virtual:normalizing-apis' {
  interface Apis {
  "demo": typeof demo,
  "user": {
    "getUserName": typeof userGetUserName,
    "list": typeof userList
  }
}
  
  export const apis: Apis

  export namespace Apis {
    
    export namespace demo {
      export * from 'src/service/apis/demo.ts'
    }

    export namespace user.getUserName {
      export * from 'src/service/apis/user/get-user-name.ts'
    }

    export namespace user.list {
      export * from 'src/service/apis/user/list.ts'
    }
  }
}
