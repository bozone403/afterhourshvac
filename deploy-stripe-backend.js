const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing to deploy Stripe backend to Render...');

// Create a temporary directory for the deployment
const tempDir = path.join(process.cwd(), 'stripe-deploy-temp');
const backendFiles = [
  'stripe-backend/index.js',
  'stripe-backend/package.json',
  'stripe-backend/package-lock.json'
];

// Create temp directory and copy files
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

console.log('📦 Copying files...');
backendFiles.forEach(file => {
  const source = path.join(process.cwd(), file);
  const dest = path.join(tempDir, path.basename(file));
  fs.copyFileSync(source, dest);
});

// Create a .env file with the Stripe secret key
const envContent = `STRIPE_SECRET_KEY=${process.env.STRIPE_SECRET_KEY}\nNODE_ENV=production\nPORT=10000`;
fs.writeFileSync(path.join(tempDir, '.env'), envContent);

console.log('🔑 Created .env file with Stripe credentials');

console.log('\n✅ Deployment package ready!');
console.log('\nNext steps:');
console.log('1. Go to https://dashboard.render.com/');
console.log('2. Click "New" -> "Web Service"');
console.log('3. Connect your GitHub repository');
console.log('4. Select the repository and click "Connect"');
console.log('5. Configure the service:');
console.log('   - Name: afterhours-stripe-backend');
console.log('   - Region: Oregon (or your preferred region)');
console.log('   - Branch: main (or your branch)');
console.log('   - Build Command: npm install');
console.log('   - Start Command: node index.js');
console.log('6. Add environment variables:');
console.log('   - NODE_ENV = production');
console.log('   - PORT = 10000');
console.log('   - STRIPE_SECRET_KEY = (your Stripe secret key)');
console.log('7. Click "Create Web Service"');
console.log('\nAfter deployment, update the API_BASE_URL in client/src/lib/stripe.ts with your new Render URL');
