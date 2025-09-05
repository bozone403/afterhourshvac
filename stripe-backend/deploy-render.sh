#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to display error messages
error_exit() {
    echo -e "${RED}❌ Error: $1${NC}" >&2
    exit 1
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo -e "${YELLOW}🚀 Afterhours HVAC - Stripe Backend Deployment${NC}"
echo -e "${YELLOW}==========================================${NC}\n"

# Check for required environment variables
if [ -z "$STRIPE_SECRET_KEY" ]; then
    error_exit "STRIPE_SECRET_KEY environment variable is not set. Please set it with 'export STRIPE_SECRET_KEY=your_key_here'"
fi

# Check for required commands
for cmd in node npm git; do
    if ! command_exists "$cmd"; then
        error_exit "$cmd is required but not installed"
    fi
done

# Check Node version
NODE_VERSION=$(node -v)
if [[ $NODE_VERSION != v16.* && $NODE_VERSION != v18.* && $NODE_VERSION != v20.* ]]; then
    echo -e "${YELLOW}⚠️  Warning: Node.js version 16, 18, or 20 is recommended. Found: $NODE_VERSION${NC}"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install || error_exit "Failed to install dependencies"

# Build the TypeScript code
echo -e "${YELLOW}🔨 Building TypeScript code...${NC}"
npx tsc || error_exit "TypeScript compilation failed"

echo -e "\n${GREEN}✅ Build successful!${NC}\n"

# Check if Render CLI is installed
if ! command_exists render; then
    echo -e "${YELLOW}Render CLI not found. Installing...${NC}"
    npm install -g @renderinc/cli || error_exit "Failed to install Render CLI"
    
    echo -e "\n${YELLOW}Please log in to Render:${NC}"
    render login || error_exit "Render login failed"
fi

# Deploy to Render
echo -e "\n${YELLOW}🚀 Deploying to Render...${NC}"

# Create a temporary directory for deployment
TEMP_DIR=$(mktemp -d)
cp -r . "$TEMP_DIR"
cd "$TEMP_DIR" || error_exit "Failed to enter temp directory"

# Create render.yaml
cat > render.yaml <<EOL
services:
  - type: web
    name: afterhours-stripe-backend
    env: node
    region: oregon
    plan: free
    buildCommand: npm install && npm run build
    startCommand: node dist/index.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: STRIPE_SECRET_KEY
        value: $STRIPE_SECRET_KEY
EOL

# Deploy using Render CLI
echo -e "${YELLOW}🚀 Starting deployment to Render...${NC}"
render services create --file render.yaml --yes || error_exit "Deployment failed"

echo -e "\n${GREEN}✅ Deployment initiated!${NC}"
echo -e "${YELLOW}Your Stripe backend will be available at:${NC} https://afterhours-stripe-backend.onrender.com"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Update your frontend to use the new backend URL"
echo "2. Test the payment flow"

# Clean up
cd - >/dev/null
rm -rf "$TEMP_DIR"
render services create node \
  --name afterhours-stripe-backend \
  --env STRIPE_SECRET_KEY="$STRIPE_SECRET_KEY" \
  --env NODE_ENV=production \
  --build-command "npm install" \
  --start-command "node index.js" \
  --region oregon \
  --plan free

echo -e "\n${GREEN}✅ Render service created!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Go to your Render dashboard"
echo "2. Find the service 'afterhours-stripe-backend'"
echo "3. Connect your GitHub repository"
echo "4. Deploy!"

echo -e "\n${YELLOW}After deployment, update your frontend to use the new backend URL:${NC}"
echo "const API_URL = 'https://afterhours-stripe-backend.onrender.com';"
