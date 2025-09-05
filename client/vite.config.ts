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

// Ensure shared directory exists and copy files if needed
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import fsExtra from 'fs-extra';
const { copySync } = fsExtra;

console.log('Ensuring shared files are available...');
try {
  // Always copy shared files to ensure they're up to date
  if (!existsSync(sharedPath)) {
    console.log('Creating shared directory:', sharedPath);
    mkdirSync(sharedPath, { recursive: true });
  }
  
  console.log('Copying shared files from:', srcSharedPath);
  copySync(srcSharedPath, sharedPath, { 
    overwrite: true,
    errorOnExist: false,
    preserveTimestamps: true,
    recursive: true
  });
  
  console.log('Successfully synchronized shared files');
  console.log('Shared directory contents:', readdirSync(sharedPath));
} catch (error) {
  console.error('Failed to synchronize shared files:', error);
  process.exit(1);
}

export default defineConfig(({ mode }) => ({
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
      {
        find: '@shared',
        replacement: sharedPath
      },
      {
        find: /^@shared\/(.*)/,
        replacement: path.join(sharedPath, '/$1')
      }
    ],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
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
  build: {
    outDir: '../dist/public',
    emptyOutDir: true,
    sourcemap: mode === 'development',
    rollupOptions: {
      // Handle @shared imports
      external: (id) => {
        // Don't externalize @shared imports
        if (id.startsWith('@shared/') || id === '@shared') {
          return false;
        }
        // Only externalize node_modules that shouldn't be bundled
        return /node_modules/.test(id);
      },
      preserveEntrySignatures: 'strict',
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
