import type { FSWatcher } from 'chokidar'
import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import type { ResolvedOptions, UserOptions } from './types'
import chokidar from 'chokidar'
import generatedCode from './generated-code'
import generatedTemplate from './generated-template'
import generatedTypes from './generated-types'
import { resolveDirs } from './utils'

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
  let apisDirs: string

  const options: ResolvedOptions = {
    apisDirs: 'src/service/apis',
    dts: 'src/service/types/api.d.ts',
    tpl: '',
    extensions: ['ts'],
    exclude: [],
    ...userOptions,
  }

  async function handleWatch(dir: string, server?: ViteDevServer) {
    const watcher = chokidar.watch(dir, {
      ignoreInitial: true,
      persistent: true,
    })

    watcher.on('all', async (event, path) => {
      try {
        if (event === 'add' && typeof path === 'string') {
          await generatedTemplate(options, path, config.root)

          await generatedTypes(options, dir)

          server?.ws.send({
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
          await generatedTypes(options, dir)
        }

        if (server) {
          const virtualModule = server?.moduleGraph.getModuleById(resolvedVirtualModuleId)
          if (virtualModule) {
            server?.moduleGraph.invalidateModule(virtualModule)
          }
        }
      }
      catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        const errorStack = error instanceof Error ? error.stack || 'No stack available' : 'No stack available'

        if (server) {
          server.ws.send({
            type: 'error',
            err: {
              message: `Failed to process ${event} event for ${path}: ${errorMessage}`,
              stack: errorStack,
            },
          })
        }
      }
    })
  }

  return {
    name: 'vite-plugin-axios',
    enforce: 'pre',

    configResolved(_config) {
      config = _config
      apisDirs = resolveDirs(options.apisDirs, config.root)

      if (config.build.watch && config.command === 'build') {
        handleWatch(apisDirs)
      }
    },

    /**
     * @see https://cn.vite.dev/guide/api-plugin#configureserver
     */
    configureServer(server) {
      handleWatch(apisDirs, server)
    },

    buildStart() {
      generatedTypes(options, apisDirs)
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
