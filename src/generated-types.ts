import fs from 'node:fs'
import { parse, posix } from 'node:path'
import {
  formatInterface,
  getFilesFromPath,
  pathToKey,
  set,
  toCamelCase,
} from './utils'
import type { ResolvedOptions } from './types'

interface DirStructure {
  [x: string]: string | DirStructure
}

export default async function generatedTypes(
  options: ResolvedOptions,
  apisDirs: string,
) {
  const files = await getFilesFromPath(apisDirs, options)
  const dirStructure: DirStructure = {}
  const apiImport: string[] = []
  const namespaceContent: string[] = []

  files.forEach((file) => {
    const parseFile = parse(file)
    const importName = toCamelCase(posix.join(parseFile.dir, parseFile.name))
    const importPath = posix.join(options.apisDirs, file)
    const keyName = pathToKey(posix.join(parseFile.dir, parseFile.name))

    // 构建API函数类型结构
    set(dirStructure, keyName, `==typeof ${importName}==`)

    // 导入API模块
    apiImport.push(`import type ${importName} from '${importPath}'`)

    // 构建命名空间路径
    const namespacePath = parseFile.dir
      .split('/')
      .filter(Boolean)
      .concat(parseFile.name)
      .map(toCamelCase)
      .join('.')

    // 为每个API文件生成对应的命名空间声明
    namespaceContent.push(`
    export namespace ${namespacePath} {
      export * from '${importPath}'
    }`)
  })

  const apisTypesContent = `/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck

${apiImport.join('\n')}

declare module 'virtual:normalizing-apis' {
  interface Apis ${formatInterface(dirStructure)}
  
  export const apis: Apis

  export namespace Apis {
    ${namespaceContent.join('\n')}
  }
}
`

  fs.writeFileSync(posix.join(options.dts), apisTypesContent)
}
