import { defineConfig } from 'vite';

export default defineConfig({
  base: '/zoes-ata-dojo/',
  server: {
    port: 8080,
    open: true,
  },
  build: {
    minify: 'terser',
    target: 'es2015',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
        },
      },
    },
    chunkSizeWarningLimit: 1500,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
