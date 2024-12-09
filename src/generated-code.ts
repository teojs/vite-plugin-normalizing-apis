import type { ResolvedOptions } from './types'
import fs from 'node:fs'
import { parse, posix } from 'node:path'
import {
  getFilesFromPath,
  pathToKey,
  set,
  toCamelCase,
} from './utils'

interface DirStructure {
  [x: string]: string | DirStructure
}

export default async function generatedImport(
  options: ResolvedOptions,
  apisDirs: string,
  root: string,
) {
  const files = await getFilesFromPath(apisDirs, options)
  const dirStructure: DirStructure = {}
  const apiImport: string[] = []
  files.forEach((file) => {
    const parseFile = parse(file)
    const importName = toCamelCase(posix.join(parseFile.dir, parseFile.name))
    const importPath = posix.join(root, options.apisDirs, file)
    const keyName = pathToKey(posix.join(parseFile.dir, parseFile.name))
    set(dirStructure, keyName, `==${importName}==`)
    apiImport.push(`import ${importName} from '${importPath}'`)
  })

  const apisCodeContent = `
${apiImport.join('\n')}

export const apis = ${JSON.stringify(dirStructure, null, 2)}
`.replace(/=="|"==/g, '')

  return apisCodeContent
}
