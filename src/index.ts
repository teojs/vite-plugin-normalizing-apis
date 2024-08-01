import { resolve } from 'node:path'
import type { Plugin, ResolvedConfig } from 'vite'
import { resolveDirs } from './utils'
import generatedTypes from './generated-types'
import generatedImport from './generated-import'

import type { ResolvedOptions, UserOptions } from './types'
import generatedTemplate from './generated-template'

const virtualModuleId = 'virtual:normalizing-apis'
const resolvedVirtualModuleId = `\0${virtualModuleId}`

export default function normalizingApis (userOptions: UserOptions = {}): Plugin {
  let config: ResolvedConfig

  const options: ResolvedOptions = {
    apisDirs: 'src/service/apis',
    dts: 'src/service/types/api.d.ts',
    tpl: '',
    extensions: ['ts'],
    exclude: [],
    ...userOptions,
  }

  let apisDirs: string

  return {
    name: 'vite-plugin-axios',
    enforce: 'pre',
    configResolved (_config) {
      config = _config
      apisDirs = resolveDirs(options.apisDirs, config.root)
    },
    buildStart() {
      generatedTypes(options, apisDirs)
    },
    configureServer ({ watcher }) {
      watcher.add(options.apisDirs)

      generatedTypes(options, apisDirs)

      watcher.on('add', (path) => {
        if (path.startsWith(apisDirs)) {
          generatedTypes(options, apisDirs)
          generatedTemplate(options, path, config.root)
        }
      })

      watcher.on('unlink', (path) => {
        if (path.startsWith(apisDirs)) {
          generatedTypes(options, apisDirs)
        }
      })

      watcher.on('change', async (path) => {
        if (path.startsWith(apisDirs)) {
          generatedTypes(options, apisDirs)
        }
      })
    },
    resolveId (id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    async load (id) {
      if (id === resolvedVirtualModuleId) {
        const importCode = generatedImport(options, apisDirs, config.root)

        return importCode
      }
    },
  }
}

export * from './types'
