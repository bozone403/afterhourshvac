#!/bin/bash
set -e

# Check if render.yaml exists
if [ ! -f "render.yaml" ]; then
  echo "Error: render.yaml not found. Please run this script from the project root."
  exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building application..."
npm run build

# Create necessary directories
echo "Setting up directories..."
mkdir -p dist/data

# Copy necessary files
echo "Copying files..."
cp -r client/dist/* dist/public/
cp -r prisma dist/
cp package*.json dist/
cp .env.local dist/.env

# Update .env for production
sed -i '' 's/NODE_ENV=development/NODE_ENV=production/g' dist/.env

# Install production dependencies in dist
echo "Installing production dependencies..."
cd dist
npm install --only=production
cd ..

echo "Deployment package is ready in the 'dist' directory."
echo "You can now deploy to Render using the Render Dashboard or CLI."

# Instructions for deploying with Render CLI
if ! command -v render &> /dev/null; then
  echo "\nTo deploy using Render CLI:"
  echo "1. Install Render CLI: npm install -g @renderinc/cli"
  echo "2. Login: render login"
  echo "3. Deploy: render deploy"
else
  echo "\nTo deploy using Render CLI, run: render deploy"
fi
