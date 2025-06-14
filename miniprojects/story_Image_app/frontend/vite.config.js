import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default {
  server: {
    proxy: {
      '/upload-story': 'http://localhost:8000',
      '/upload-character': 'http://localhost:8000'
    }
  }
}
