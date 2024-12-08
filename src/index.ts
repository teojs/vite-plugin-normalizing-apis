import { resolve } from 'node:path'
import type { Plugin, ResolvedConfig } from 'vite'
import { resolveDirs } from './utils'
import generatedTypes from './generated-types'
import generatedCode from './generated-code'
import type { ResolvedOptions, UserOptions } from './types'
import generatedTemplate from './generated-template'

const virtualModuleId = 'virtual:normalizing-apis'
const resolvedVirtualModuleId = `\0${virtualModuleId}`
const clientPathId = `/@id/__x00__${virtualModuleId}`

interface Api {
  get options (): ResolvedOptions
  set options (value: ResolvedOptions)
  version: string
}

export default function normalizingApis(userOptions: UserOptions = {}): Plugin<Api> {
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

    configResolved(_config) {
      config = _config
      apisDirs = resolveDirs(options.apisDirs, config.root)
    },

    buildStart() {
      generatedTypes(options, apisDirs)
    },

    configureServer(server) {
      if (!server.config.isProduction) {
        generatedTypes(options, apisDirs)

        const watcher = server.watcher.add(apisDirs)
        watcher.on('all', async (event, path) => {
          if (!path?.startsWith(apisDirs))
            return

          try {
            if (event === 'add') {
              await generatedTemplate(options, path, config.root)

              await generatedTypes(options, apisDirs)

              server.ws.send({
                type: 'update',
                updates: [{
                  type: 'js-update',
                  path: clientPathId,
                  acceptedPath: clientPathId,
                  timestamp: Date.now(),
                }],
              })

              return
            }

            if (event === 'unlink') {
              await generatedTypes(options, apisDirs)
            }

            const virtualModule = server.moduleGraph.getModuleById(resolvedVirtualModuleId)
            if (virtualModule) {
              server.moduleGraph.invalidateModule(virtualModule)
            }
          }
          catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            const errorStack = error instanceof Error ? error.stack || 'No stack available' : 'No stack available'

            server.ws.send({
              type: 'error',
              err: {
                message: `Failed to process ${event} event for ${path}: ${errorMessage}`,
                stack: errorStack,
              },
            })
          }
        })
      }
    },

    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },

    async load(id) {
      if (id === resolvedVirtualModuleId) {
        const importCode = await generatedCode(options, apisDirs, config.root)
        return `
          ${importCode}
          if (import.meta.hot) {
            import.meta.hot.accept()
          }
        `
      }
    },
  }
}

export * from './types'
