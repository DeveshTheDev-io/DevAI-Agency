import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-utils': ['framer-motion', 'lucide-react', 'clsx', 'tailwind-merge'],
          'vendor-3d': ['@splinetool/react-spline'],
          'vendor-appwrite': ['appwrite']
        }
      }
    }
  },
  server: {
    port: 3000,
  },
});