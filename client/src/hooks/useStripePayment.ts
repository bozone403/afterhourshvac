import { useState } from 'react';
import { stripeService } from '../services/stripeService';

export const useStripePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processPayment = async (amount: number, paymentMethod: any, metadata = {}) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await stripeService.handlePayment(amount, paymentMethod, metadata);
      return { success: true, data: result };
    } catch (err: any) {
      setError(err.message || 'Payment failed');
      return { success: false, error: err };
    } finally {
      setIsProcessing(false);
    }
  };

  const redirectToCheckout = async (priceId: string, successPath: string, cancelPath: string, metadata = {}) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      await stripeService.redirectToCheckout(
        priceId,
        successPath,
        cancelPath,
        metadata
      );
      return { success: true };
    } catch (err: any) {
      setError(err.message || 'Failed to redirect to checkout');
      return { success: false, error: err };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processPayment,
    redirectToCheckout,
    isProcessing,
    error,
    clearError: () => setError(null)
  };
};
