// vite.config.ts
import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths(), tailwindcss()],
  server: {
    port: 4003,
  },
  ssr: {
    noExternal: ['node-appwrite'], // Bundle node-appwrite for SSR
    external: ['sharp'], // Let Node.js provide sharp at runtime
  },
  optimizeDeps: {
    exclude: ['node-appwrite', 'sharp'], // Prevent client pre-bundling
  },
});