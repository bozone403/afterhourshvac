import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the shared directory paths
const sharedPath = path.resolve(__dirname, 'shared');
const srcSharedPath = path.resolve(__dirname, '../shared');

// Import fs-extra for file operations
import fs from 'fs-extra';

// Ensure shared directory exists
if (!fs.existsSync(sharedPath)) {
  console.log('Shared directory not found, creating...');
  fs.mkdirSync(sharedPath, { recursive: true });
}

// Log shared directory contents for debugging
try {
  console.log('Shared directory contents:', fs.readdirSync(sharedPath));
} catch (error) {
  console.warn('Could not read shared directory:', error);
}

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'analyze' && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'AfterHours HVAC',
        short_name: 'AfterHoursHVAC',
        description: 'HVAC Services and Solutions',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
      // Handle @shared imports with explicit file extensions
      {
        find: /^@shared\/(.*)$/,
        replacement: `${sharedPath}/$1`,
      },
      // Fallback for @shared root
      {
        find: '@shared',
        replacement: sharedPath,
      },
    ],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  build: {
    outDir: '../dist/public',
    emptyOutDir: true,
    sourcemap: mode === 'development',
    rollupOptions: {
      // Don't externalize any modules to ensure everything is bundled
      external: (id) => {
        // Only externalize node_modules that shouldn't be bundled
        return /node_modules/.test(id) && !id.includes('@shared');
      },
      output: {
        manualChunks: (id) => {
          // Put shared code in a separate chunk
          if (id.includes('@shared')) {
            return 'shared';
          }
          // Group other dependencies
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('@stripe') || id.includes('date-fns') || id.includes('zod')) {
              return 'vendor-libs';
            }
            return 'vendor-other';
          }
        },
      },
    },
    commonjsOptions: {
      include: [/shared\/.*/, /node_modules/],
      esmExternals: true,
    },
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit
  },
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(
      process.env.VITE_API_BASE_URL || 'http://localhost:3001'
    ),
  },
  server: {
    port: 3000,
    open: true,
  },
  preview: {
    port: 3000,
  },
  optimizeDeps: {
    include: ['@shared/*'],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
  },
}));
