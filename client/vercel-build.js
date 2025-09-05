import { execSync } from 'child_process';
import fs from 'fs-extra';
const { copySync, existsSync, readdirSync, removeSync } = fs;
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Running vercel-build script...');

// Ensure shared directory exists
const sharedDir = resolve(__dirname, 'shared');
const srcSharedDir = resolve(__dirname, '../shared');

// Run the copy-shared script
console.log('Copying shared files...');
try {
  if (existsSync(sharedDir)) {
    removeSync(sharedDir);
  }
  
  copySync(srcSharedDir, sharedDir, {
    overwrite: true,
    errorOnExist: false,
    preserveTimestamps: true,
    recursive: true
  });
  
  console.log('Successfully copied shared files');
  console.log('Copied files:', readdirSync(sharedDir));
} catch (error) {
  console.error('Error copying shared files:', error);
  process.exit(1);
}

// Run the build
console.log('Running build...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build completed successfully');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
