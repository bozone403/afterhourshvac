import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useRoute, useLocation as useNavigation } from 'wouter';
import { useStripe, useElements, Elements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
let stripePromise: Promise<any> | null = null;

if (stripePublicKey) {
  stripePromise = loadStripe(stripePublicKey);
} else {
  console.warn('Stripe public key not found. Payment functionality will be disabled.');
}

type PaymentData = {
  service: string;
  amount: number;
  time?: string;
  plan?: string;
  description: string;
};

// Component for the checkout form after Stripe has been initialized
const CheckoutForm = ({ paymentData }: { paymentData: PaymentData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setLocation] = useNavigation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-confirmation`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message || "There was an issue with your payment. Please try again.",
        variant: "destructive",
      });
    } else {
      // Successful payment should redirect to return_url, but we'll handle it just in case
      toast({
        title: "Payment Processing",
        description: "Your payment is being processed. You'll be redirected shortly.",
      });
      
      // Redirect to confirmation page if the return_url doesn't work for some reason
      setTimeout(() => {
        setLocation('/payment-confirmation');
      }, 2000);
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-dark p-6 rounded-lg border border-gray-700 mb-6">
        <h3 className="text-xl font-bold font-header mb-4">Payment Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between pb-2 border-b border-gray-700">
            <span className="text-lightgray">Service:</span>
            <span className="font-medium">{paymentData.description}</span>
          </div>
          {paymentData.time && (
            <div className="flex justify-between pb-2 border-b border-gray-700">
              <span className="text-lightgray">Time:</span>
              <span className="font-medium">{paymentData.time === 'evening' ? 'Evening (5pm-12am)' : 'Overnight (12am-8am)'}</span>
            </div>
          )}
          {paymentData.plan && (
            <div className="flex justify-between pb-2 border-b border-gray-700">
              <span className="text-lightgray">Plan:</span>
              <span className="font-medium">
                {paymentData.plan === 'basic' ? 'Basic Maintenance Plan' : 
                 paymentData.plan === 'premium' ? 'Premium Maintenance Plan' : 
                 'Commercial Maintenance Plan'}
              </span>
            </div>
          )}
          <div className="flex justify-between pt-2">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-lg font-bold text-primary">{formatCurrency(paymentData.amount)}</span>
          </div>
        </div>
      </div>

      <div className="bg-dark p-6 rounded-lg border border-gray-700">
        <h3 className="text-xl font-bold font-header mb-4">Payment Information</h3>
        <PaymentElement />
      </div>

      <div className="flex justify-between items-center mt-6">
        <button 
          type="button" 
          onClick={() => window.history.back()}
          className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-md transition-all font-medium"
          disabled={isProcessing}
        >
          Back
        </button>
        <button 
          type="submit" 
          className="bg-primary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold disabled:opacity-50"
          disabled={!stripe || !elements || isProcessing}
        >
          {isProcessing ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : `Pay ${formatCurrency(paymentData.amount)}`}
        </button>
      </div>
    </form>
  );
};

// Main Checkout component
const Checkout = () => {
  const [location] = useLocation();
  const [, params] = useRoute("/checkout");
  const [clientSecret, setClientSecret] = useState("");
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Parse query parameters
    const queryParams = new URLSearchParams(location.split("?")[1]);
    const service = queryParams.get('service') || '';
    const amount = parseInt(queryParams.get('amount') || '0');
    const time = queryParams.get('time') || undefined;
    const plan = queryParams.get('plan') || undefined;
    
    if (!service || !amount) {
      toast({
        title: "Invalid Request",
        description: "Missing required payment information.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    let description = queryParams.get('description') || '';
    if (!description) {
      switch (service) {
        case 'pro':
          description = `Pro Calculator Access - ${plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : 'Unknown'} Plan`;
          break;
        case 'furnace-install':
          description = 'Furnace Installation Deposit';
          break;
        case 'ac-install':
          description = 'Air Conditioning Installation Deposit';
          break;
        case 'repair-service':
          description = 'Service Diagnostic Fee';
          break;
        case 'duct-cleaning':
          description = 'Duct Cleaning Service';
          break;
        case 'water-heater':
          description = 'Water Heater Installation Deposit';
          break;
        case 'thermostat':
          description = 'Thermostat Installation';
          break;
        case 'light-commercial':
          description = 'Light Commercial HVAC Consultation';
          break;
        case 'industrial':
          description = 'Industrial HVAC Engineering Consultation';
          break;
        case 'maintenance-basic':
          description = 'Basic Maintenance Plan';
          break;
        case 'maintenance-premium':
          description = 'Premium Maintenance Plan';
          break;
        case 'maintenance-commercial':
          description = 'Commercial Maintenance Plan';
          break;
        default:
          description = 'HVAC Service';
      }
    } else {
      description = decodeURIComponent(description);
    }

    const data = { 
      service,
      amount,
      time,
      plan,
      description 
    };
    
    setPaymentData(data);

    // Create a PaymentIntent as soon as the page loads
    apiRequest("POST", "/api/create-payment-intent", data)
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error creating payment intent:", error);
        toast({
          title: "Payment Setup Failed",
          description: "There was an issue setting up your payment. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      });
  }, [location, toast]);

  return (
    <>
      <Helmet>
        <title>Checkout - AfterHours HVAC</title>
        <meta name="description" content="Secure payment processing for AfterHours HVAC services. Pay for service deposits, maintenance plans, and more." />
      </Helmet>
      
      {/* Page Header */}
      <div className="relative pt-24 pb-10 bg-dark">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold font-header mb-4">Secure <span className="text-primary">Checkout</span></h1>
            <p className="text-lightgray max-w-3xl mx-auto">Complete your payment securely through our Stripe payment processing system.</p>
          </div>
        </div>
      </div>
      
      {/* Checkout Section */}
      <section className="bg-dark py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
                <p className="text-lightgray">Setting up secure payment...</p>
              </div>
            ) : !paymentData ? (
              <div className="bg-darkgray rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold font-header mb-4">Payment Information Missing</h2>
                <p className="text-lightgray mb-6">The required payment information is missing or invalid. Please return to the service page and try again.</p>
                <button 
                  onClick={() => window.history.back()}
                  className="bg-primary hover:bg-opacity-80 text-white py-2 px-4 rounded-md transition-all font-medium"
                >
                  Go Back
                </button>
              </div>
            ) : !clientSecret ? (
              <div className="bg-darkgray rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold font-header mb-4">Payment Setup Failed</h2>
                <p className="text-lightgray mb-6">There was an issue setting up the payment. Please try again or contact customer support.</p>
                <button 
                  onClick={() => window.history.back()}
                  className="bg-primary hover:bg-opacity-80 text-white py-2 px-4 rounded-md transition-all font-medium"
                >
                  Go Back
                </button>
              </div>
            ) : (
              <div className="bg-darkgray rounded-lg p-8">
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
                  <CheckoutForm paymentData={paymentData} />
                </Elements>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Security Info */}
      <section className="bg-darkgray py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-4">
                <i className="fas fa-lock text-2xl text-primary"></i>
                <h3 className="text-xl font-bold font-header">Secure Payment Processing</h3>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <i className="fas fa-shield-alt text-3xl text-primary mb-3"></i>
                <h4 className="font-semibold mb-2">SSL Encryption</h4>
                <p className="text-sm text-lightgray">Your payment information is encrypted using secure socket layer technology</p>
              </div>
              <div>
                <i className="fab fa-cc-stripe text-3xl text-primary mb-3"></i>
                <h4 className="font-semibold mb-2">Stripe Payments</h4>
                <p className="text-sm text-lightgray">We use Stripe for secure payment processing, trusted by millions</p>
              </div>
              <div>
                <i className="fas fa-credit-card text-3xl text-primary mb-3"></i>
                <h4 className="font-semibold mb-2">Never Stored</h4>
                <p className="text-sm text-lightgray">Your credit card details are never stored on our servers</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout;
