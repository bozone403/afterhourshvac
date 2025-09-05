# Stripe Backend for Afterhours HVAC

This is a lightweight backend service that handles Stripe payments for the Afterhours HVAC static website.

## Setup

1. Copy `.env.example` to `.env` and fill in your Stripe keys:
   ```bash
   cp .env.example .env
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run locally:
   ```bash
   npm start
   ```

## Deploy to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following environment variables in the Render dashboard:
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `PORT`: 10000 (or your preferred port)
4. Deploy!

## Available Endpoints

- `POST /create-payment-intent` - Create a payment intent
- `POST /create-checkout-session` - Create a Stripe Checkout session
- `POST /webhook` - Handle Stripe webhooks (for future use)

## Frontend Integration

Update your frontend to use the deployed backend URL:

```javascript
const API_URL = 'https://your-render-app.onrender.com';

// Example: Create a payment intent
const createPaymentIntent = async (amount, metadata = {}) => {
  const response = await fetch(`${API_URL}/create-payment-intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, metadata })
  });
  return response.json();
};
```
