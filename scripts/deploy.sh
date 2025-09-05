#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting AfterHours HVAC Deployment...${NC}"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
  echo -e "${RED}❌ Error: .env.local file not found. Please create one based on .env.example${NC}"
  exit 1
fi

# Load environment variables
export $(grep -v '^#' .env.local | xargs)

# Check for required environment variables
required_vars=(
  "VITE_STRIPE_PUBLIC_KEY"
  "STRIPE_SECRET_KEY"

# Clean previous builds
echo -e "${YELLOW}🧹 Cleaning previous builds...${NC}"
rm -rf dist

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

# Run the static build script
echo -e "${YELLOW}🏗️  Building static site...${NC}"
node build-static-new.js

echo -e "\n${GREEN}✅ Static build complete!${NC}"
echo -e "${YELLOW}📦 Upload the contents of the 'dist' directory to your Hostinger public_html folder${NC}"
echo -e "${YELLOW}🌐 Your site will be live at your domain\n${NC}"

echo -e "${YELLOW}📋 Deployment Summary:${NC}"
echo -e "  - Static site built in /dist directory"
echo -e "  - SPA routing configured in .htaccess"
echo -e "  - SEO files (sitemap.xml, robots.txt) generated"
echo -e "  - Contact form ready for PHP email on Hostinger"
echo -e "  - Total hosting cost: ${GREEN}$0 (Hostinger plan only)${NC}\n"

echo -e "${GREEN}✨ Deployment package is ready in the 'dist' directory!${NC}"
cp .env.local dist/.env

# Update environment for production
echo -e "${YELLOW}⚙️  Configuring environment...${NC}"
sed -i '' 's/NODE_ENV=development/NODE_ENV=production/g' dist/.env
# Install production dependencies
echo -e "${YELLOW}📦 Installing production dependencies...${NC}"
cd dist
npm install --only=production
cd ..

echo -e "${GREEN}✅ Deployment package is ready in the 'dist' directory!${NC}"
echo -e "${YELLOW}🚀 You can now deploy to your hosting provider.${NC}"

# Check if Render CLI is installed
if command -v render &> /dev/null; then
  echo -e "\n${YELLOW}🚀 Deploying to Render...${NC}"
  render deploy
else
  echo -e "\n${YELLOW}ℹ️  To deploy using Render CLI:"
  echo "1. Install Render CLI: npm install -g @renderinc/cli"
  echo "2. Login: render login"
  echo "3. Deploy: render deploy"
  echo -e "${NC}"
fi

echo -e "${GREEN}✨ Deployment process completed!${NC}"
