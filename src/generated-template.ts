import fs from 'node:fs'
import { extname, posix } from 'node:path'
import type { ResolvedOptions } from './types'
import { isEmptyFile, isExistsFile } from './utils'

/**
 * 自动写入模板
 *
 * @export
 * @param {string} targetPath
 */
export default async function generatedTemplate(
  options: ResolvedOptions,
  targetPath: string,
  root: string,
) {
  try {
    const templateFilePath = posix.resolve(root, options.tpl)
    const ext = extname(targetPath).substring(1)

    if (
      !(await isExistsFile(templateFilePath))
      || !(await isExistsFile(targetPath))
      || !isEmptyFile(targetPath)
    ) {
      return
    }

    if (!options.extensions.includes(ext)) {
      return
    }

    const template = fs.readFileSync(posix.resolve(root, options.tpl), {
      encoding: 'utf-8',
    })
    fs.writeFileSync(targetPath, template)
  }
  catch (error) {
    console.error(error)
  }
}
