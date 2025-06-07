import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Calculator, 
  Crown, 
  Check, 
  Star, 
  Zap, 
  TrendingUp, 
  Shield,
  DollarSign,
  Clock,
  Infinity
} from 'lucide-react';

const membershipPlans = [
  {
    id: 'monthly',
    name: 'Monthly Pro',
    price: 49,
    interval: 'month',
    description: 'Perfect for occasional projects',
    features: [
      'Access to all pro calculators',
      'Advanced material cost estimator',
      'Commercial HVAC calculator',
      'Load calculation tools',
      'Project templates',
      'Export to PDF',
      'Email support'
    ],
    badge: 'Flexible',
    icon: Clock,
    popular: false
  },
  {
    id: 'yearly',
    name: 'Annual Pro',
    price: 499,
    interval: 'year',
    description: 'Best value for regular users',
    features: [
      'Everything in Monthly Pro',
      'Save $89 per year',
      'Priority support',
      'Advanced analytics',
      'Custom templates',
      'Bulk calculations',
      'Team sharing (up to 3 users)'
    ],
    badge: 'Best Value',
    icon: TrendingUp,
    popular: true,
    savings: 'Save $89/year'
  },
  {
    id: 'lifetime',
    name: 'Lifetime Pro',
    price: 1500,
    interval: 'lifetime',
    description: 'One-time payment, lifetime access',
    features: [
      'Everything in Annual Pro',
      'Lifetime access',
      'All future updates',
      'Premium support',
      'Custom integrations',
      'API access',
      'Unlimited team members',
      'White-label options'
    ],
    badge: 'Premium',
    icon: Infinity,
    popular: false,
    savings: 'Pay once, use forever'
  }
];

const proFeatures = [
  {
    title: 'Advanced Material Calculator',
    description: 'Real-time pricing from Alggin.com with custom multipliers',
    icon: Calculator
  },
  {
    title: 'Commercial HVAC Tools',
    description: 'Complex load calculations and tonnage estimators',
    icon: Crown
  },
  {
    title: 'Project Templates',
    description: 'Pre-built templates for common HVAC installations',
    icon: Star
  },
  {
    title: 'Export & Share',
    description: 'Generate professional PDFs and share with clients',
    icon: Shield
  }
];

const Membership = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string>('yearly');

  const subscribeMutation = useMutation({
    mutationFn: async (planId: string) => {
      const response = await apiRequest('POST', '/api/create-subscription', { planId });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    },
    onError: () => {
      toast({
        title: "Subscription Error",
        description: "Failed to create subscription. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubscribe = (planId: string) => {
    if (!user) {
      // Store the intended plan in sessionStorage to redirect after auth
      sessionStorage.setItem('pendingSubscription', planId);
      // Redirect to registration/login with return URL
      window.location.href = `/auth?returnUrl=${encodeURIComponent('/membership')}`;
      return;
    }

    subscribeMutation.mutate(planId);
  };

  return (
    <>
      <Helmet>
        <title>Pro Membership | AfterHours HVAC</title>
        <meta name="description" content="Unlock professional HVAC calculation tools with real supplier pricing and advanced features for contractors and engineers." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="container mx-auto px-4 py-12">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-orange-100 border border-orange-200 rounded-full px-4 py-2 mb-6">
              <Crown className="h-4 w-4 text-orange-600 mr-2" />
              <span className="text-orange-600 text-sm font-medium">Professional Tools</span>
            </div>
            
            <h1 className="text-5xl font-bold mb-6 text-gray-900">
              Unlock Pro <span className="text-orange-600">HVAC Tools</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Access advanced calculators with real supplier pricing, commercial load calculations, 
              and professional templates designed for HVAC contractors and engineers.
            </p>

            {user?.hasPro && (
              <div className="inline-flex items-center bg-orange-100 border border-orange-200 rounded-lg px-6 py-3 mb-8">
                <Crown className="h-5 w-5 text-orange-600 mr-2" />
                <span className="text-orange-600 font-medium">You have Pro access!</span>
                <Link href="/pro-calculator">
                  <Button className="ml-4 bg-orange-600 hover:bg-orange-700 text-white">
                    Access Pro Tools
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Pro Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {proFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="bg-slate-800/50 border-slate-700 text-center">
                  <CardHeader className="pb-4">
                    <div className="mx-auto mb-4 p-3 bg-green-600/10 rounded-full w-fit">
                      <IconComponent className="h-8 w-8 text-green-400" />
                    </div>
                    <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pricing Plans */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Choose Your Pro Plan</h2>
              <p className="text-slate-300 text-lg">
                Start with any plan and upgrade or cancel anytime
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {membershipPlans.map((plan) => {
                const IconComponent = plan.icon;
                return (
                  <Card 
                    key={plan.id} 
                    className={`relative bg-white border-gray-200 hover:border-orange-300 transition-all shadow-sm ${
                      plan.popular ? 'ring-2 ring-orange-200 scale-105' : ''
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-orange-600 text-white px-4 py-1">
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pb-4">
                      <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full w-fit">
                        <IconComponent className="h-8 w-8 text-orange-600" />
                      </div>
                      
                      <Badge variant="outline" className="w-fit mx-auto mb-2 border-orange-500 text-orange-600">
                        {plan.badge}
                      </Badge>
                      
                      <CardTitle className="text-gray-900 text-2xl">{plan.name}</CardTitle>
                      <CardDescription className="text-gray-600">
                        {plan.description}
                      </CardDescription>
                      
                      <div className="mt-4">
                        <div className="flex items-baseline justify-center">
                          <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                          {plan.interval !== 'lifetime' && (
                            <span className="text-gray-500 ml-1">/{plan.interval}</span>
                          )}
                        </div>
                        {plan.savings && (
                          <p className="text-orange-600 text-sm mt-1">{plan.savings}</p>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <ul className="space-y-3">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-sm">
                            <Check className="h-4 w-4 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-300">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button 
                        onClick={() => handleSubscribe(plan.id)}
                        className={`w-full mt-6 ${
                          plan.popular 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                        disabled={subscribeMutation.isPending || user?.hasPro}
                      >
                        {user?.hasPro ? (
                          'Current Plan'
                        ) : (
                          <>
                            <DollarSign className="h-4 w-4 mr-2" />
                            Buy Now
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Free vs Pro Comparison */}
          <div className="bg-slate-800/30 rounded-xl p-8 mb-16">
            <h3 className="text-2xl font-bold text-center mb-8">Free vs Pro Comparison</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-4 text-slate-300">Feature</th>
                    <th className="text-center py-4 text-slate-300">Free</th>
                    <th className="text-center py-4 text-green-400">Pro</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  <tr className="border-b border-slate-800">
                    <td className="py-3 text-white">Basic BTU Calculator</td>
                    <td className="text-center py-3"><Check className="h-4 w-4 text-green-400 mx-auto" /></td>
                    <td className="text-center py-3"><Check className="h-4 w-4 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-3 text-white">Simple Material Estimator</td>
                    <td className="text-center py-3"><Check className="h-4 w-4 text-green-400 mx-auto" /></td>
                    <td className="text-center py-3"><Check className="h-4 w-4 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-3 text-white">Advanced Material Calculator</td>
                    <td className="text-center py-3"><span className="text-slate-500">✗</span></td>
                    <td className="text-center py-3"><Check className="h-4 w-4 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-3 text-white">Commercial Load Calculator</td>
                    <td className="text-center py-3"><span className="text-slate-500">✗</span></td>
                    <td className="text-center py-3"><Check className="h-4 w-4 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-3 text-white">Real Supplier Pricing</td>
                    <td className="text-center py-3"><span className="text-slate-500">✗</span></td>
                    <td className="text-center py-3"><Check className="h-4 w-4 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-3 text-white">PDF Export</td>
                    <td className="text-center py-3"><span className="text-slate-500">✗</span></td>
                    <td className="text-center py-3"><Check className="h-4 w-4 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 text-white">Project Templates</td>
                    <td className="text-center py-3"><span className="text-slate-500">✗</span></td>
                    <td className="text-center py-3"><Check className="h-4 w-4 text-green-400 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA Section */}
          {!user?.hasPro && (
            <div className="text-center bg-gradient-to-r from-green-600/10 to-green-400/10 border border-green-600/20 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Upgrade?</h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Join thousands of HVAC professionals who trust our pro tools for accurate estimates and professional calculations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => handleSubscribe('yearly')}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={subscribeMutation.isPending}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Start Free Trial
                </Button>
                <Link href="/contact">
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Membership;