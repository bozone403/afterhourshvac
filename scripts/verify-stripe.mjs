import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find all files that might contain Stripe integration
const findStripeFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and other large directories
      if (file === 'node_modules' || file === '.git' || file === 'dist') {
        return;
      }
      findStripeFiles(filePath, fileList);
    } else if (
      // Only check relevant file types
      ['.ts', '.tsx', '.js', '.jsx', '.json'].includes(path.extname(file)) &&
      // Skip large generated files
      !file.endsWith('-lock.json') &&
      !file.endsWith('.d.ts') &&
      !file.includes('node_modules')
    ) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('stripe') || content.includes('STRIPE_')) {
        fileList.push(filePath);
      }
    }
  });
  
  return fileList;
};

// Check Stripe configuration in files
const checkStripeConfig = (file) => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const issues = [];
  
  lines.forEach((line, index) => {
    // Check for hardcoded API keys
    if (line.match(/pk_(test|live)_[a-zA-Z0-9]+/) || 
        line.match(/sk_(test|live)_[a-zA-Z0-9]+/)) {
      issues.push({
        line: index + 1,
        issue: 'Hardcoded Stripe API key found',
        severity: 'high',
        fix: 'Use environment variables instead'
      });
    }
    
    // Check for test mode in production
    if (line.includes('process.env.NODE_ENV') && 
        line.includes('test') && 
        !line.includes('test') === false) {
      issues.push({
        line: index + 1,
        issue: 'Test mode detection in production code',
        severity: 'medium',
        fix: 'Use environment variables for mode switching'
      });
    }
    
    // Check for localhost URLs in production
    if (line.includes('localhost') || line.includes('127.0.0.1')) {
      issues.push({
        line: index + 1,
        issue: 'Localhost URL found in production code',
        severity: 'high',
        fix: 'Use environment variables for API endpoints'
      });
    }
  });
  
  return issues.length > 0 ? { file, issues } : null;
};

// Main function
const main = () => {
  console.log('🔍 Scanning for Stripe integration points...\n');
  
  const projectRoot = path.join(__dirname, '..');
  const stripeFiles = findStripeFiles(projectRoot);
  
  console.log(`Found ${stripeFiles.length} files with Stripe integration\n`);
  
  let hasIssues = false;
  stripeFiles.forEach(file => {
    const relativePath = path.relative(projectRoot, file);
    const issues = checkStripeConfig(file);
    
    if (issues) {
      hasIssues = true;
      console.log(`\n❌ ${relativePath}`);
      issues.issues.forEach(issue => {
        console.log(`  Line ${issue.line} (${issue.severity}): ${issue.issue}`);
        console.log(`  Fix: ${issue.fix}`);
      });
    } else {
      console.log(`✅ ${relativePath} - No issues found`);
    }
  });
  
  if (!hasIssues) {
    console.log('\n🎉 No Stripe configuration issues found!');
  } else {
    console.log('\n⚠️  Please fix the above issues before deploying to production');
    process.exit(1);
  }
};

main();
