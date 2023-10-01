import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    proxy: {
      '/api': 'https://a4-amanda-blanchard.glitch.me/', // Assuming your Express server runs on port 3000
    },
  },
})