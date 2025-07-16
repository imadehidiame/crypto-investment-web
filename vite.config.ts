// vite.config.ts
import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { websocket_chat } from './websocket-chat';
import { wb_chat } from './wb-chat';

export default defineConfig({
  plugins: [wb_chat(),reactRouter(), tsconfigPaths(), tailwindcss(), /*websocket_plugin(),websocket_chat()*/],
  server: {
    port: 4003,
    hmr:{
      port:4004
    }
  },
  
  ssr: {
    noExternal: ['node-appwrite'], // Bundle node-appwrite for SSR
    external: ['sharp'], // Let Node.js provide sharp at runtime
  },
  optimizeDeps: {
    exclude: ['node-appwrite', 'sharp'], // Prevent client pre-bundling
  },
});