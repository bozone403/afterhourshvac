# Stripe Integration for Afterhours HVAC

This document outlines the Stripe payment integration for the Afterhours HVAC website.

## Architecture

- **Frontend**: React components that use the Stripe Elements for collecting payment details
- **Backend**: Node.js/Express server that handles Stripe API calls securely
- **Deployment**: Hosted on Render (free tier)

## Setup

### 1. Environment Variables

Create a `.env` file in the `stripe-backend` directory with:

```
STRIPE_SECRET_KEY=your_stripe_secret_key
NODE_ENV=development
PORT=3001
```

### 2. Install Dependencies

```bash
cd stripe-backend
npm install
```

### 3. Development

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## Deployment

### 1. Deploy to Render

```bash
# Set your Stripe secret key
export STRIPE_SECRET_KEY=your_stripe_secret_key

# Run the deployment script
./deploy-render.sh
```

### 2. Update Frontend

After deployment, update the `API_BASE_URL` in:

```
client/src/services/stripeService.ts
```

Set it to your Render URL (e.g., `https://afterhours-stripe-backend.onrender.com`)

## API Endpoints

### Create Payment Intent

```
POST /create-payment-intent
```

**Request Body:**
```json
{
  "amount": 1000,
  "description": "Furnace Installation",
  "metadata": {
    "order_id": "123"
  },
  "customer_email": "customer@example.com"
}
```

### Create Checkout Session

```
POST /create-checkout-session
```

**Request Body:**
```json
{
  "priceId": "price_123",
  "successUrl": "/success",
  "cancelUrl": "/cancel",
  "metadata": {
    "order_id": "123"
  }
}
```

## Testing

### Test Credit Cards

- **Success**: `4242 4242 4242 4242`
- **Requires Authentication**: `4000 0025 0000 3155`
- **Declined**: `4000 0000 0000 0002`

## Monitoring

Check the Render dashboard for logs and monitoring:
https://dashboard.render.com/

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the frontend URL is in the allowed origins
2. **Invalid API Key**: Verify your Stripe secret key is correct
3. **Webhook Failures**: Check the webhook secret and endpoint URL

## Support

For issues, please contact support@afterhourshvac.ca
