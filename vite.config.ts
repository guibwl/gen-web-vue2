import path from 'path';
import { defineConfig } from 'vite'
import { createVuePlugin as Vue2 } from 'vite-plugin-vue2'
import ScriptSetup from 'unplugin-vue2-script-setup/vite'
import legacy from '@vitejs/plugin-legacy'
import usePluginImport from 'vite-plugin-importer'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve('src')
    }
  },
  plugins: [
    Vue2({
      jsx: true,
      jsxOptions: {
        vModel: false,
        compositionAPI: true,
      }
    }),
    ScriptSetup({ /* options */ }),
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    usePluginImport({
      libraryName: "ant-design-vue",
      libraryDirectory: "es",
      style: "css",
    }),
  ]
})
