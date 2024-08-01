import fs from 'node:fs'
import { parse, posix } from 'node:path'
import {
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
  const typeImport: string[] = []
  files.forEach((file) => {
    const parseFile = parse(file)
    const importName = toCamelCase(posix.join(parseFile.dir, parseFile.name))
    const importPath = posix.join(options.apisDirs, file)
    const keyName = pathToKey(posix.join(parseFile.dir, parseFile.name))
    set(dirStructure, keyName, `==typeof ${importName}==`)
    typeImport.push(`export type * from '${importPath}'`)
    apiImport.push(`import type ${importName} from '${importPath}'`)
  })

  const apisTypesContent = `/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck

${apiImport.join('\n')}

declare module 'virtual:normalizing-apis' {
  interface Apis ${JSON.stringify(dirStructure, null, 2)}
  export const apis:Apis

  ${typeImport.join('\n')}
}

`.replace(/=="|"==/g, '')

  fs.writeFileSync(posix.join(options.dts), apisTypesContent)
}
