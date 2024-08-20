import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'


// https://vitejs.dev/config/
export default defineConfig({
  
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ['router-vue'].includes(tag),
        }
      }
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build:{
    //targets: ['es2020'],
    //root: 'src',
    //outDir:'C:/wamp64/www',
    //emptyOutDir: false,
  },
  server: {
    watch: {
      usePolling: true,
    },
  },

})
