// Use environment variable for the backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

interface PaymentIntentParams {
  amount: number;
  description?: string;
  metadata?: Record<string, string>;
}

interface CheckoutSessionParams {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export const stripeService = {
  // Create a payment intent for custom payment flows
  async createPaymentIntent(params: PaymentIntentParams) {
    const response = await fetch(`${API_BASE_URL}/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: params.amount,
        metadata: params.metadata || {}
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }
    
    return response.json();
  },
  
  // Create a Stripe Checkout session
  async createCheckoutSession(params: CheckoutSessionParams) {
    const response = await fetch(`${API_BASE_URL}/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId: params.priceId,
        successUrl: params.successUrl,
        cancelUrl: params.cancelUrl,
        metadata: params.metadata || {}
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }
    
    return response.json();
  }
};
