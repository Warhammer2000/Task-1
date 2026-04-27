import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves at https://<user>.github.io/<repo>/
// Repo: Task-1 → app served at /Task-1/
// https://vite.dev/config/
export default defineConfig({
  base: '/Task-1/',
  plugins: [react()],
})
