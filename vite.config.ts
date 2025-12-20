import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Increase limit to 2MB to accommodate large 3D libraries and avoid the warning
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-utils': ['framer-motion', 'lucide-react', 'clsx', 'tailwind-merge'],
          'vendor-3d-engine': ['@splinetool/react-spline'],
          'vendor-appwrite': ['appwrite']
        }
      }
    }
  },
  server: {
    port: 3000,
  },
});