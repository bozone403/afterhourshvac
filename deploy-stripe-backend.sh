#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Stripe Backend Deployment to Render${NC}"
echo -e "${YELLOW}==================================${NC}\n"

# Check if STRIPE_SECRET_KEY is set
if [ -z "$STRIPE_SECRET_KEY" ]; then
    echo -e "${YELLOW}❌ STRIPE_SECRET_KEY environment variable is not set${NC}"
    echo "Please set it with:"
    echo "export STRIPE_SECRET_KEY='your-stripe-secret-key'"
    exit 1
fi

# Create a zip file of the backend
echo -e "${YELLOW}📦 Creating deployment package...${NC}"
ZIP_FILE="stripe-backend-$(date +%s).zip"
zip -r $ZIP_FILE stripe-backend/

echo -e "\n${GREEN}✅ Deployment package created: $ZIP_FILE${NC}"

# Generate deployment instructions
cat <<EOL

${YELLOW}🚀 Deployment Instructions:${NC}

1. Go to your Render Dashboard:
   https://dashboard.render.com/

2. Click "New" -> "Web Service"

3. Connect your GitHub account if not already connected

4. Select your repository: ${YELLOW}afterhourshvac${NC}

5. Configure the service:
   - Name: ${YELLOW}afterhours-stripe-backend${NC}
   - Region: ${YELLOW}Oregon${NC} (or your preferred region)
   - Branch: ${YELLOW}main${NC} (or your branch)
   - Root Directory: ${YELLOW}stripe-backend${NC}
   - Build Command: ${YELLOW}npm install${NC}
   - Start Command: ${YELLOW}node index.js${NC}
   - Plan: ${YELLOW}Free${NC}

6. Add Environment Variables:
   - ${YELLOW}NODE_ENV${NC} = production
   - ${YELLOW}PORT${NC} = 10000
   - ${YELLOW}STRIPE_SECRET_KEY${NC} = ${STRIPE_SECRET_KEY:0:12}... (your key)

7. Click "Create Web Service"

8. After deployment, update your frontend with the new URL:
   - Open: ${YELLOW}client/src/lib/stripe.ts${NC}
   - Update: ${YELLOW}const API_BASE_URL = 'YOUR_RENDER_URL'${NC}

${GREEN}✅ Done! Your Stripe backend will be live at: https://afterhours-stripe-backend.onrender.com${NC}
EOL
