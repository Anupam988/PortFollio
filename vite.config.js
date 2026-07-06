import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { submissionsApi } from './vite-submissions-plugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), submissionsApi()],
  server: {
    // Don't trigger a full page reload when submissions are written.
    watch: {
      ignored: ['**/public/message.json'],
    },
  },
})
