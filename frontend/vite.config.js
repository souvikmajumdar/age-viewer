import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'build',
  },
  resolve: {
    alias: {
      // Carbon's Sass uses Webpack's ~package-name syntax to reference IBM Plex fonts.
      // Vite/Rollup doesn't resolve ~ aliases, so we map them explicitly.
      // Without this, font references remain as ~@ibm/plex/... in the built CSS
      // and browsers fall back to system fonts.
      '~@ibm/plex': path.resolve(__dirname, 'node_modules/@ibm/plex'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
});
