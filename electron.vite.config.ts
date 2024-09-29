import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import wasm from 'vite-plugin-wasm'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      react(),
      wasm(),
      viteStaticCopy({
        targets: [
          {
            src: 'index.html',
            dest: 'renderer', // This will copy to out/renderer
          },
        ],
      }),
      NodeGlobalsPolyfillPlugin({
        buffer: true
      }),
      NodeModulesPolyfillPlugin()
    ]
  }
})