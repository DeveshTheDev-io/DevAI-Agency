import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-core': ['react', 'react-dom', 'framer-motion'],
          'vendor-ui': ['lucide-react', 'clsx', 'tailwind-merge', '@radix-ui/react-accordion', '@radix-ui/react-slot'],
          'vendor-backend': ['@supabase/supabase-js']
        }
      }
    }
  },
  server: {
    port: 3000,
  },
});