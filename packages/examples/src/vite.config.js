import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
      'vue-upform': path.join(__dirname, '../../lib/dist/vue-upform.esm.js'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        nested: path.resolve(__dirname, 'initial-value/index.html')
      }
    }
  },
  publicDir: path.resolve(__dirname, '../public'),
  server: {
    hmr: !process.env.CI
  }
})
