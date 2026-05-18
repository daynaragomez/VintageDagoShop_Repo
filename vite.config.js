import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    include: ['tests/unit/**/*.test.{js,jsx}', 'tests/integration/**/*.test.{js,jsx}'],
    coverage: {
      reporter: ['text', 'lcov'],
      exclude: ['node_modules/', 'tests/e2e/'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/presentation/components'),
      '@pages': path.resolve(__dirname, './src/presentation/pages'),
      '@hooks': path.resolve(__dirname, './src/presentation/hooks'),
      '@services': path.resolve(__dirname, './src/application/services'),
      '@usecases': path.resolve(__dirname, './src/application/usecases'),
      '@validators': path.resolve(__dirname, './src/application/validators'),
      '@entities': path.resolve(__dirname, './src/domain/entities'),
      '@repositories': path.resolve(__dirname, './src/domain/repositories'),
      '@infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@context': path.resolve(__dirname, './src/context'),
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});

