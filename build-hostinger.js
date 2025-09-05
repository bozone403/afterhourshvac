#!/usr/bin/env node

// Hostinger Node.js deployment build script
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Building for Hostinger Node.js deployment...');

try {
  // Clean dist directory
  if (fs.existsSync('./dist')) {
    fs.rmSync('./dist', { recursive: true });
  }
  fs.mkdirSync('./dist');

  // Build frontend
  console.log('📦 Building frontend...');
  execSync('vite build', { stdio: 'inherit' });

  // Build backend
  console.log('🔧 Building backend...');
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });

  // Copy package.json for Hostinger
  console.log('📋 Creating deployment package.json...');
  const packageJson = {
    "name": "afterhourshvac",
    "version": "1.0.0",
    "type": "module",
    "main": "index.js",
    "scripts": {
      "start": "node index.js"
    },
    "dependencies": {
      "express": "^4.18.2",
      "cors": "^2.8.5",
      "drizzle-orm": "^0.29.0",
      "better-sqlite3": "^9.2.2",
      "bcrypt": "^5.1.1",
      "express-session": "^1.17.3",
      "stripe": "^14.10.0",
      "dotenv": "^16.3.1"
    }
  };
  fs.writeFileSync('./dist/package.json', JSON.stringify(packageJson, null, 2));

  // Copy environment file
  console.log('🔐 Copying environment configuration...');
  if (fs.existsSync('./.env.local')) {
    fs.copyFileSync('./.env.local', './dist/.env');
  }

  // Copy database
  console.log('💾 Copying SQLite database...');
  if (fs.existsSync('./database.sqlite')) {
    fs.copyFileSync('./database.sqlite', './dist/database.sqlite');
  }

  // Copy schema files
  console.log('📊 Copying database schema...');
  if (!fs.existsSync('./dist/shared')) {
    fs.mkdirSync('./dist/shared');
  }
  fs.copyFileSync('./shared/schema-sqlite.ts', './dist/shared/schema-sqlite.ts');

  // Create .htaccess for Hostinger Node.js
  const htaccess = `# Hostinger Node.js Application
RewriteEngine On

# Redirect all requests to Node.js app
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.js [L,QSA]

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
    AddOutputFilterByType DEFLATE application/json
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresDefault "access plus 1 month"
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
</IfModule>`;

  fs.writeFileSync('./dist/.htaccess', htaccess);

  // Create startup script for Hostinger
  const startupScript = `#!/bin/bash
# Hostinger startup script
cd "$(dirname "$0")"
export NODE_ENV=production
node index.js
`;
  fs.writeFileSync('./dist/start.sh', startupScript);
  execSync('chmod +x ./dist/start.sh');

  // Create deployment README
  const deploymentReadme = `# AfterhoursHVAC Hostinger Deployment

## Deployment Steps:

1. **Upload Files**: Upload entire /dist folder contents to your Hostinger public_html directory

2. **Install Dependencies**: In Hostinger File Manager or SSH:
   \`\`\`bash
   cd public_html
   npm install
   \`\`\`

3. **Set Node.js Version**: In Hostinger control panel:
   - Go to Advanced → Node.js
   - Select Node.js version 18 or higher
   - Set startup file to: index.js
   - Set working directory to: public_html

4. **Environment Variables**: Update .env file with your production values:
   - DATABASE_URL=./database.sqlite
   - STRIPE_SECRET_KEY=your_live_stripe_key
   - SESSION_SECRET=your_secure_session_secret

5. **Start Application**: 
   \`\`\`bash
   cd public_html
   npm start
   \`\`\`

## Features Included:
- ✅ Full SQLite database functionality
- ✅ Admin login and dashboard
- ✅ Contact form handling
- ✅ Blog management
- ✅ Stripe payment integration
- ✅ All frontend pages and components

## Cost: $0 (included in Hostinger plan)

## Important Notes:
- Always run from the public_html directory (where package.json is located)
- The server expects to find the 'public' folder in the same directory as index.js
- Database file should be in the same directory as the server
`;

  fs.writeFileSync('./dist/README-DEPLOYMENT.md', deploymentReadme);

  console.log('✅ Hostinger Node.js build complete!');
  console.log('\n📁 Upload /dist folder contents to Hostinger public_html');
  console.log('🔧 Run "npm install" in Hostinger');
  console.log('⚙️ Set Node.js startup file to: index.js');
  console.log('🚀 Your full-featured HVAC site will be live!');
  console.log('💰 Total cost: $0 (included in Hostinger plan)');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
