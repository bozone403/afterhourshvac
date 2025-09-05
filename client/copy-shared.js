import fs from 'fs-extra';
const { copySync, existsSync, mkdirSync, readdirSync, removeSync } = fs;
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure shared directory exists in the client build
const sharedDir = resolve(__dirname, 'shared');
const srcSharedDir = resolve(__dirname, '../shared');

console.log('Copying shared files...');
console.log(`From: ${srcSharedDir}`);
console.log(`To: ${sharedDir}`);

// Create directory if it doesn't exist
if (!existsSync(sharedDir)) {
  mkdirSync(sharedDir, { recursive: true });
}

// Copy files synchronously to ensure they're available before build starts
try {
  copySync(srcSharedDir, sharedDir, { 
    overwrite: true,
    errorOnExist: false,
    preserveTimestamps: true,
    recursive: true
  });
  
  console.log('Successfully copied shared files!');
  console.log('Copied files:', readdirSync(sharedDir));
} catch (err) {
  console.error('Error copying shared files:', err);
  process.exit(1);
}
