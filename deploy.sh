#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting AfterhoursHVAC static site deployment...${NC}"

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
