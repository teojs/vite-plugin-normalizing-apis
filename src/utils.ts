import { resolve } from 'node:path'
import fs from 'node:fs'
import Debug from 'debug'
import fg from 'fast-glob'
import type { ResolvedOptions } from './types'

export const debug = Debug('vite-plugin-layouts')

export function extensionsToGlob(extensions: string[]) {
  return extensions.length > 1
    ? `{${extensions.join(',')}}`
    : extensions[0] || ''
}

export function normalizePath(str: string): string {
  return str.replace(/\\/g, '/')
}

export function pathToKey(filepath: string) {
  return filepath.replace(/[\\/]/g, '.').split('.').map(toCamelCase).join('.')
}

export function resolveDirs(dir: string, root: string) {
  return normalizePath(resolve(root, dir))
}

/**
 * 校验是否空文件
 *
 * @export
 * @param {string} filePath
 * @return {*}  {boolean}
 */
export function isEmptyFile(filePath: string): boolean {
  try {
    const file = fs.readFileSync(filePath, {
      encoding: 'utf-8',
    })
    return Boolean(!file)
  }
  catch (error) {
    debug(error)

    return false
  }
}

/**
 * 校验文件是否存在
 * @param filePath 文件路径
 * @returns 文件是否存在
 */
export async function isExistsFile(filePath: string): Promise<boolean> {
  try {
    await fs.promises.access(filePath)
    return true
  }
  catch (error) {
    debug(error)

    return false
  }
}

/**
 * 字符串转驼峰
 *
 * @export
 * @param {string} input
 * @return {*}  {string}
 */
export function toCamelCase(input: string): string {
  return input
    .split(/[^a-z0-9]/i) // 使用正则表达式按非字母和非数字字符分割字符串
    .map((word, index) => {
      if (index === 0) {
        // 第一个词全小写
        return word
      }
      // 其他词首字母大写
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join('')
}

/**
 * 设置对象属性值
 * @param obj 要修改的对象
 * @param path 属性路径，可以是字符串或数组
 * @param value 要设置的值
 * @returns 修改后的对象
 */
export function set<T extends object, V>(
  obj: T,
  path: string | Array<string | number>,
  value: V,
): T {
  if (!obj || typeof obj !== 'object') {
    throw new Error('The first argument must be an object.')
  }
  if (typeof path === 'string') {
    path = path
      .split('.')
      .map(key => (Number.isNaN(Number(key)) ? key : Number(key)))
  }
  if (!Array.isArray(path)) {
    debug('The path must be a string or an array.')
  }
  let current: any = obj
  for (let i = 0; i < path.length; i++) {
    const key = path[i]
    if (i === path.length - 1) {
      current[key] = value
    }
    else {
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = typeof path[i + 1] === 'number' ? [] : {}
      }
      current = current[key]
    }
  }
  return obj
}

/**
 * 读取指定路径中的文件
 */
export async function getFilesFromPath(
  path: string,
  options: ResolvedOptions,
): Promise<string[]> {
  try {
    const { exclude, extensions } = options

    const ext = extensionsToGlob(extensions)

    const files = await fg(`**/*.${ext}`, {
      ignore: ['node_modules', '.git', '**/__*__/*', ...exclude],
      onlyFiles: true,
      cwd: path,
    })

    return files
  }
  catch (error) {
    debug(error)

    return []
  }
}

interface DirStructure {
  [x: string]: string | DirStructure
}

/**
 * 格式化接口结构
 * @param structure 目录结构对象
 * @param indent 缩进空格数
 * @returns 格式化后的接口字符串
 */
export function formatInterface(structure: DirStructure, indent = 2): string {
  const spaces = ' '.repeat(indent)
  const entries = Object.entries(structure)

  if (entries.length === 0)
    return '{}'

  const lines = entries.map(([key, value]) => {
    if (typeof value === 'string') {
      // 处理函数类型
      return `${spaces}${JSON.stringify(key)}: ${value.replace(/==/g, '')}`
    }
    else {
      // 处理嵌套对象
      return `${spaces}${JSON.stringify(key)}: ${formatInterface(value, indent + 2)}`
    }
  })

  return `{\n${lines.join(',\n')}\n${' '.repeat(indent - 2)}}`
}
