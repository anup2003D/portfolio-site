import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  // '/' in dev so localhost works normally
  // '/portfolio-site/' in production builds for GitHub Pages
  // base:/ command === 'build' ? '/portfolio-site/' : '/',
  base: '/',
  plugins: [react()],
  server: {
    port: 3000,
  },
}));
