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

  fs.writeFileSync('./dist/.htaccess', htaccess);

  // Copy attached assets
  if (fs.existsSync('./attached_assets')) {
    const assetsDir = './dist/assets';
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }
    execSync('cp -r ./attached_assets/* ./dist/assets/', { stdio: 'inherit' });
  }

  // Create contact form handler (PHP for Hostinger)
  const contactPhp = `<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

$name = filter_var($input['name'] ?? '', FILTER_SANITIZE_STRING);
$email = filter_var($input['email'] ?? '', FILTER_SANITIZE_EMAIL);
$phone = filter_var($input['phone'] ?? '', FILTER_SANITIZE_STRING);
$message = filter_var($input['message'] ?? '', FILTER_SANITIZE_STRING);
$service = filter_var($input['service'] ?? '', FILTER_SANITIZE_STRING);

if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit;
}

// Email configuration
$to = 'Jordan@Afterhourshvac.ca';
$subject = 'New Contact Form Submission - After Hours HVAC';
$headers = "From: noreply@afterhourshvac.ca\\r\\n";
$headers .= "Reply-To: $email\\r\\n";
$headers .= "Content-Type: text/html; charset=UTF-8\\r\\n";

$emailBody = "
<html>
<head><title>New Contact Form Submission</title></head>
<body>
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> $name</p>
    <p><strong>Email:</strong> $email</p>
    <p><strong>Phone:</strong> $phone</p>
    <p><strong>Service:</strong> $service</p>
    <p><strong>Message:</strong></p>
    <p>$message</p>
    <hr>
    <p><small>Submitted from After Hours HVAC website</small></p>
</body>
</html>
";

if (mail($to, $subject, $emailBody, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send email']);
}
}
?>`;

  fs.writeFileSync('./dist/contact.php', contactPhp);

  // Generate robots.txt
  const robotsTxt = `User-agent: *
Allow: /
Sitemap: https://afterhourshvac.ca/sitemap.xml
`;
  fs.writeFileSync('./dist/robots.txt', robotsTxt);

  // Generate sitemap.xml (basic static pages)
  const baseUrl = 'https://afterhourshvac.ca';
  const urls = [
    '/',
    '/about',
    '/services',
    '/contact',
    '/gallery',
    '/pro-portal',
    '/tools/ai-symptom-diagnoser',
    '/tools/pro-diagnostic-assistant',
    '/calculators/quote-builder',
    '/calculators/enhanced-quote-builder',
    '/calculators/load-calculator',
    '/calculators/btu',
    '/calculators/energy-savings',
    '/shop/residential',
    '/membership',
    '/corporate-membership',
    '/customer-dashboard',
    '/pro-dashboard',
    '/admin',
    '/emergency-service',
    '/emergency-tracker',
    '/blog',
    '/forum',
    '/sitemap'
  ];

  const now = new Date().toISOString();
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (p) => `  <url>\n    <loc>${baseUrl}${p}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${p === '/' ? '1.0' : '0.7'}</priority>\n  </url>`
  )
  .join('\n')}
</urlset>`;
  fs.writeFileSync('./dist/sitemap.xml', sitemapXml);

  console.log('✅ Static build complete!');
  console.log('\n📁 Upload the entire /dist folder to your Hostinger public_html directory');
  console.log('🌐 Your site will be live at your domain');
  console.log('\n🗺️ Generated: sitemap.xml and robots.txt');
  console.log('📧 Contact form will work with PHP email on Hostinger');
  console.log('💰 Total hosting cost: $0 (just your Hostinger plan)');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

    '/admin',
    '/emergency-service',
    '/emergency-tracker',
    '/blog',
    '/forum',
    // Generate sitemap.xml (basic static pages)
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
  
  console.log('✅ Static build complete!\n');
  console.log(`📁 Upload the contents of ${distPath} to your Hostinger public_html directory`);
  console.log('🌐 Your site will be live at your domain\n');
  console.log('🗺️ Generated: sitemap.xml and robots.txt');
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
