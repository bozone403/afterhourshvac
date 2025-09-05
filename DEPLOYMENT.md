# AfterHours HVAC - Deployment Guide

This document provides step-by-step instructions for deploying the AfterHours HVAC application to a production environment.

## Prerequisites

- Node.js 16+ installed
- npm 8+ installed
- Stripe account with API keys
- Render account (for hosting)

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Application
NODE_ENV=production
PORT=3001
SESSION_SECRET=your-session-secret
DATABASE_URL=file:./data/prod.db
COMPANY_EMAIL=your-email@example.com

# Stripe Configuration
VITE_STRIPE_PUBLIC_KEY=pk_live_your_public_key
STRIPE_SECRET_KEY=sk_live_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## Deployment Steps

### 1. Build the Application

Run the deployment script to prepare the application for production:

```bash
./scripts/deploy.sh
```

This will:
1. Install dependencies
2. Build the application
3. Create necessary directories
4. Copy required files
5. Configure the production environment

### 2. Deploy to Render

#### Option A: Using Render Dashboard

1. Log in to your [Render Dashboard](https://dashboard.render.com/)
2. Click "New" and select "Web Service"
3. Connect your GitHub/GitLab repository or upload the `dist` directory
4. Configure the service:
   - **Name**: afterhourshvac
   - **Region**: Choose the closest to your users
   - **Branch**: main (or your production branch)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server/index.js`
   - **Environment Variables**: Add all variables from `.env.local`

#### Option B: Using Render CLI

1. Install the Render CLI:
   ```bash
   npm install -g @renderinc/cli
   ```

2. Log in to Render:
   ```bash
   render login
   ```

3. Deploy the application:
   ```bash
   cd dist
   render deploy
   ```

### 3. Configure Webhooks

1. Go to the [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Create a new endpoint with the URL: `https://your-render-url.com/api/webhooks/stripe`
3. Select the following events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
4. Add your webhook signing secret to the environment variables as `STRIPE_WEBHOOK_SECRET`

### 4. Verify Deployment

1. Access your application at the provided Render URL
2. Test the following:
   - Homepage loading
   - Admin login
   - Payment flow (test mode)
   - Webhook delivery

## Post-Deployment

1. **Update DNS**: If using a custom domain, update your DNS settings to point to your Render URL
2. **Enable HTTPS**: Render provides automatic HTTPS for all services
3. **Monitor Logs**: Check the Render dashboard for any errors
4. **Set Up Backups**: Configure automatic backups for your database

## Maintenance

### Updating the Application

1. Make your changes locally
2. Test thoroughly
3. Commit and push to your repository
4. Render will automatically redeploy the application

### Accessing Logs

```bash
# Using Render Dashboard
- Go to your service
- Click on "Logs"

# Using Render CLI
render logs --service afterhourshvac
```

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure all variables are set in the Render dashboard
   - Check for typos in variable names
   - Restart the service after making changes

2. **Database Connection Issues**
   - Verify the database file exists and has correct permissions
   - Check the `DATABASE_URL` in your environment variables

3. **Stripe Integration**
   - Verify API keys are correct and active
   - Check Stripe dashboard for failed webhook events
   - Ensure webhook signing secret matches

## Support

For additional help, contact:
- Email: support@afterhourshvac.ca
- Phone: (555) 123-4567
