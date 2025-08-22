import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    open: true
  },
  resolve: {
    alias: {
      'react-three-fiber': '@react-three/fiber',
      'src': '/src'
    }
  },
  define: {
    'process.env.NODE_ENV': '"development"',
    '__APP_VERSION__': JSON.stringify(process.env.npm_package_version)
  }
});