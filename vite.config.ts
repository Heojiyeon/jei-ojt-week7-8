import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import VitePluginWindicss from 'vite-plugin-windicss';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePluginWindicss()],
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, './src') }],
  },
});
