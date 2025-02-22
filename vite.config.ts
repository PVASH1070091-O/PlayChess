import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { config } from 'dotenv';

config();

// https://vite.dev/config/
export default defineConfig({
  server:{
    port:3000
  },
  plugins: [react()],
  define: {
    'process.env': process.env
  },
  build: {
    outDir: 'dist', 
  },
})
