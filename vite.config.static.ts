import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Static build configuration for Hostinger deployment
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react({
      jsxRuntime: 'automatic'
    })],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    root: path.resolve(import.meta.dirname, "client"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist"),
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['@radix-ui/react-dialog'],
          }
        }
      }
    },
    define: {
      'process.env.NODE_ENV': '"production"',
      'process.env.VITE_STATIC_BUILD': 'true',
      // Include Stripe key from environment
      'import.meta.env.VITE_STRIPE_PUBLIC_KEY': JSON.stringify(env.VITE_STRIPE_PUBLIC_KEY || ''),
      // Ensure proper React JSX runtime
      '__DEV__': false
    },
    esbuild: {
      jsxDev: false
    }
  }
});
