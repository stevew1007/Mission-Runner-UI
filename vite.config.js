import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    host:'0.0.0.0',
    port:'8000'
  },

  assetsInclude: ['**/*.md'],
  define:  {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(packageJson.version)
  }
})
