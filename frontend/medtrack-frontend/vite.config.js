import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],

  // Enable source maps for both dev server and build
  build: {
    sourcemap: true
  },
  server: {
    // for HTTPS local certs
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem')
    },
    port: 5173,
    // (Vite ≥4.4) also enable sourcemaps on the dev server
    sourcemap: true
  }
});
