/**
 * Plugin options.
 */
interface Options {
  /**
   * api文件夹
   * @default 'src/service/apis'
   */
  apisDirs: string
  /**
   * 模板文件路径
   * @default ''
   */
  tpl: string
  /**
   * 生成的声明文件路径
   * @default 'src/service/api.d.ts'
   */
  dts: string
  /**
   * 有效的文件拓展名
   * @default ['ts']
   */
  extensions: string[]
  /**
   * 排除的文件
   */
  exclude: string[]
}

export type UserOptions = Partial<Options>

export interface ResolvedOptions extends Options {}
