#!/usr/bin/env node

// Static build script for Hostinger deployment
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to copy directories recursively
async function copyFolderRecursive(source, target) {
  try {
    await fs.mkdir(target, { recursive: true });
    const entries = await fs.readdir(source, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(source, entry.name);
      const destPath = path.join(target, entry.name);

      if (entry.isDirectory()) {
        await copyFolderRecursive(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (error) {
    console.error(`Error copying ${source} to ${target}:`, error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting static site build...');
  
  const distPath = path.resolve('./dist');
  const clientPath = path.resolve('./client');
  const clientPublicPath = path.join(clientPath, 'public');
  const indexPath = path.join(clientPath, 'index.html');

  try {
    // Clean dist directory
    console.log('🧹 Cleaning dist directory...');
    try {
      await fs.rm(distPath, { recursive: true, force: true });
    } catch (error) {
      console.log('No existing dist directory to clean');
    }

    // Create dist directory
    console.log('📂 Creating dist directory...');
    await fs.mkdir(distPath, { recursive: true });
    
    // Copy public files if they exist
    try {
      console.log('📦 Copying public files...');
      const publicExists = await fs.access(clientPublicPath).then(() => true).catch(() => false);
      
      if (publicExists) {
        console.log(`📁 Found public directory at ${clientPublicPath}, copying...`);
        await copyFolderRecursive(clientPublicPath, distPath);
      } else {
        console.log('⚠️  Public directory not found, skipping...');
      }
    } catch (error) {
      console.error('Error copying public files:', error);
    }
    
    // Copy index.html if it exists
    try {
      console.log(`🔍 Looking for index.html at: ${indexPath}`);
      await fs.access(indexPath);
      console.log('📄 Copying index.html...');
      await fs.copyFile(indexPath, path.join(distPath, 'index.html'));
    } catch (error) {
      console.error('⚠️  index.html not found or error copying:', error.message);
    }

    // Create .htaccess for SPA routing
    console.log('📋 Creating .htaccess file...');
    const htaccess = `# AfterhoursHVAC Hostinger config
RewriteEngine On

# Bypass SPA rewrite for real files/dirs and key endpoints
RewriteCond %{REQUEST_URI} ^/(sitemap\.xml|robots\.txt|contact\.php)$ [OR]
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# SPA fallback to index.html
RewriteRule . /index.html [L]

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static assets aggressively
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresDefault "access plus 1 month"
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType application/json "access plus 1 day"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
</IfModule>`;

    await fs.writeFile(path.join(distPath, '.htaccess'), htaccess);

    // Generate sitemap.xml
    console.log('🗺️  Generating sitemap.xml...');
    const baseUrl = 'https://afterhourshvac.ca';
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${baseUrl}/about</loc><changefreq>weekly</changefreq></url>
  <url><loc>${baseUrl}/services</loc><changefreq>weekly</changefreq></url>
  <url><loc>${baseUrl}/services/furnace-install</loc><changefreq>weekly</changefreq></url>
  <url><loc>${baseUrl}/services/ac-repair</loc><changefreq>weekly</changefreq></url>
  <url><loc>${baseUrl}/services/maintenance</loc><changefreq>weekly</changefreq></url>
  <url><loc>${baseUrl}/contact</loc><changefreq>weekly</changefreq></url>
  <url><loc>${baseUrl}/blog</loc><changefreq>daily</changefreq></url>
</urlset>`;

    await fs.writeFile(path.join(distPath, 'sitemap.xml'), sitemap);

    // Generate robots.txt
    console.log('🤖 Generating robots.txt...');
    const robotsTxt = `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml`;
    await fs.writeFile(path.join(distPath, 'robots.txt'), robotsTxt);

    console.log('\n✅ Static build complete!\n');
    console.log(`📁 Upload the contents of ${distPath} to your Hostinger public_html directory`);
    console.log('🌐 Your site will be live at your domain\n');
    console.log('🗺️  Generated: sitemap.xml and robots.txt');
    console.log('📧 Contact form will work with PHP email on Hostinger');
    console.log('💰 Total hosting cost: $0 (just your Hostinger plan)');

  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Execute the main function
main().catch(error => {
  console.error('Unhandled error in build process:', error);
  process.exit(1);
});
