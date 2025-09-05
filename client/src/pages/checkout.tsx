import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, CheckCircle } from "lucide-react";
import { stripeService } from '@/lib/stripe';

// Initialize Stripe with the public key from environment variables
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';
const stripePromise = loadStripe(stripePublicKey, {
  apiVersion: '2023-10-16',
});

const CheckoutForm = ({ amount, metadata = {} }: { amount: number, metadata?: Record<string, any> }): JSX.Element => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  // Create payment intent when component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const { clientSecret } = await stripeService.createPaymentIntent({
          amount,
          metadata
        });
        setClientSecret(clientSecret);
      } catch (err) {
        setMessage('Failed to initialize payment');
        console.error(err);
      }
    };

    createPaymentIntent();
  }, [amount, metadata]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-confirmation`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setMessage(error.message || 'An error occurred');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Handle successful payment
        const paymentIntentWithMetadata = paymentIntent as any; // Type assertion for metadata
        if (paymentIntentWithMetadata.metadata?.service) {
          const scheduleData = {
            jobType: 'installation',
            serviceType: 'hvac',
            scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            startTime: '09:00',
            endTime: '15:00',
            estimatedDuration: 6,
            status: 'scheduled',
            priority: 'normal',
            specialInstructions: 'Payment completed - ready to schedule installation',
            paymentStatus: 'paid'
          };

          // Schedule job if quote number exists in metadata
          if (paymentIntentWithMetadata.metadata.quoteNumber) {
            try {
              const response = await fetch('/api/quotes');
              const quotes = await response.json();
              const quote = quotes.find((q: any) => q.quoteNumber === paymentIntentWithMetadata.metadata.quoteNumber);
              
              if (quote) {
                await fetch(`/api/quotes/${quote.id}/schedule`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(scheduleData)
                });
              }
            } catch (err) {
              console.error('Error scheduling job:', err);
              // Don't fail the payment if scheduling fails
            }
          }
        }
        
        setIsComplete(true);
      }
    } catch (err) {
      setMessage('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isComplete) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-green-700 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-4">Thank you for your purchase. A confirmation has been sent to your email.</p>
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg">
        <PaymentElement 
          options={{
            layout: "tabs",
            defaultValues: {
              billingDetails: {
                address: {
                  country: 'CA'
                }
              }
            }
          }}
        />
      </div>
      
      {message && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {message}
        </div>
      )}
      
      <Button 
        type="submit" 
        disabled={!stripe || !elements || isLoading}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4 mr-2" />
            Complete Payment
          </>
        )}
      </Button>
    </form>
  );
};

const CheckoutPage = (): JSX.Element => {
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(0);
  const [metadata, setMetadata] = useState<Record<string, any>>({});
  const [error, setError] = useState("");
  
  useEffect(() => {
    // Get client secret and metadata from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const secret = urlParams.get('client_secret');
    const amountParam = urlParams.get('amount');
    const metadataParam = urlParams.get('metadata');
    
    if (!secret) {
      setError("Missing payment information. Please try again from the checkout page.");
      return;
    }
    
    setClientSecret(secret);
    
    if (amountParam) {
      setAmount(Number(amountParam));
    }
    
    if (metadataParam) {
      try {
        setMetadata(JSON.parse(decodeURIComponent(metadataParam)));
      } catch (e) {
        console.error('Failed to parse metadata', e);
      }
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Payment Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">{error}</p>
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Payment Setup Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-red-600 mb-4">
              <p>Payment processing is not properly configured.</p>
            </div>
            <Button asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Complete Your Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <Elements stripe={stripePromise} options={{
            clientSecret,
            appearance: {
              theme: 'stripe',
            },
          }}>
            <CheckoutForm amount={amount} metadata={metadata} />
          </Elements>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutPage;