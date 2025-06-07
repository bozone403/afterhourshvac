import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Shield, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const Pricing = () => {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('pro-membership');
  const { user } = useAuth();
  const { toast } = useToast();

  // Pro membership payment mutation
  const createPaymentMutation = useMutation({
    mutationFn: async (plan: 'monthly' | 'yearly' | 'lifetime') => {
      const amounts = {
        monthly: 4900, // $49.00 in cents
        yearly: 49900, // $499.00 in cents
        lifetime: 150000 // $1500.00 in cents
      };
      
      const response = await apiRequest("POST", "/api/create-payment-intent", {
        amount: amounts[plan],
        planType: plan
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Redirect to checkout page with client secret
      setLocation(`/checkout?client_secret=${data.clientSecret}&plan=${data.planType}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Payment Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSelectProPlan = (plan: 'monthly' | 'yearly' | 'lifetime') => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access Pro features.",
        variant: "destructive",
      });
      setLocation('/auth');
      return;
    }
    
    if (user.hasPro) {
      toast({
        title: "Already a Pro Member",
        description: "You already have Pro access!",
      });
      return;
    }
    
    createPaymentMutation.mutate(plan);
  };
  
  const handlePayDeposit = () => {
    setLocation('/checkout?service=deposit&amount=175');
  };
  
  const handlePayEmergency = (time: string) => {
    const amount = time === 'evening' ? 250 : 275;
    setLocation(`/checkout?service=emergency&amount=${amount}&time=${time}`);
  };
  
  const handleSelectMaintenancePlan = (plan: string) => {
    const amounts = {
      basic: 399,
      premium: 799,
      commercial: 1200
    };
    setLocation(`/checkout?service=maintenance&plan=${plan}&amount=${amounts[plan as keyof typeof amounts]}`);
  };

  // HVAC service payment handler - separate from Pro membership
  const hvacServiceMutation = useMutation({
    mutationFn: async (data: { serviceType: string; amount: number }) => {
      const response = await apiRequest("POST", "/api/create-payment-intent", {
        amount: data.amount,
        serviceType: data.serviceType,
        service: data.serviceType
      });
      return response.json();
    },
    onSuccess: (data, variables) => {
      setLocation(`/checkout?client_secret=${data.clientSecret}&service=${variables.serviceType}&amount=${variables.amount}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Payment Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePayForService = (serviceType: string, amount: number) => {
    hvacServiceMutation.mutate({ serviceType, amount });
  };

  return (
    <>
      <Helmet>
        <title>Pricing - AfterHours HVAC | Competitive Rates & Service Plans</title>
        <meta name="description" content="Transparent pricing for all HVAC services including installations, repairs, maintenance plans, and emergency service. Get quotes for residential and commercial HVAC solutions." />
        <meta property="og:title" content="HVAC Service Pricing - AfterHours HVAC" />
        <meta property="og:description" content="Competitive pricing for HVAC installations, repairs, maintenance, and emergency services. Pro membership available for advanced calculator access." />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-dark text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold font-header mb-6">Transparent Pricing</h1>
            <p className="text-lightgray max-w-3xl mx-auto">We offer competitive pricing and flexible payment options for all our HVAC services.</p>
          </div>
        </div>
      </div>
      
      {/* Pricing Section */}
      <section className="bg-dark py-16">
        <div className="container mx-auto px-4">
          {/* Pricing Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center space-x-2 mb-8">
              <button 
                onClick={() => setActiveTab('pro-membership')} 
                className={`${activeTab === 'pro-membership' ? 'bg-primary text-white' : 'bg-dark text-white border border-gray-700'} py-2 px-6 rounded-md font-medium mb-2`}
              >
                Pro Membership
              </button>
              <button 
                onClick={() => setActiveTab('residential')} 
                className={`${activeTab === 'residential' ? 'bg-primary text-white' : 'bg-dark text-white border border-gray-700'} py-2 px-6 rounded-md font-medium mb-2`}
              >
                Residential
              </button>
              <button 
                onClick={() => setActiveTab('commercial')} 
                className={`${activeTab === 'commercial' ? 'bg-primary text-white' : 'bg-dark text-white border border-gray-700'} py-2 px-6 rounded-md font-medium mb-2`}
              >
                Commercial
              </button>
              <button 
                onClick={() => setActiveTab('maintenance')} 
                className={`${activeTab === 'maintenance' ? 'bg-primary text-white' : 'bg-dark text-white border border-gray-700'} py-2 px-6 rounded-md font-medium mb-2`}
              >
                Maintenance
              </button>
              <button 
                onClick={() => setActiveTab('emergency')} 
                className={`${activeTab === 'emergency' ? 'bg-primary text-white' : 'bg-dark text-white border border-gray-700'} py-2 px-6 rounded-md font-medium mb-2`}
              >
                Emergency
              </button>
            </div>
            
            {/* Pro Membership Tab Content */}
            {activeTab === 'pro-membership' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Monthly Plan */}
                <Card className="bg-darkgray border-gray-700 relative">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      Monthly Plan
                      <Zap className="h-6 w-6 text-primary" />
                    </CardTitle>
                    <CardDescription className="text-lightgray">
                      Perfect for trying out Pro features
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-white mb-2">$49</div>
                      <div className="text-lightgray">per month</div>
                    </div>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center text-white">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        Advanced material calculators
                      </li>
                      <li className="flex items-center text-white">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        Real-time Alggin.com pricing
                      </li>
                      <li className="flex items-center text-white">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        Custom multiplier rates
                      </li>
                      <li className="flex items-center text-white">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        Export quotes to PDF
                      </li>
                      <li className="flex items-center text-white">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        Priority support
                      </li>
                    </ul>
                    <Button 
                      className="w-full bg-primary hover:bg-primary/80"
                      onClick={() => handleSelectProPlan('monthly')}
                      disabled={createPaymentMutation.isPending}
                    >
                      {createPaymentMutation.isPending ? "Processing..." : "Choose Monthly"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Yearly Plan - Most Popular */}
                <Card className="bg-darkgray border-primary relative transform scale-105">
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      Yearly Plan
                      <Shield className="h-6 w-6 text-primary" />
                    </CardTitle>
                    <CardDescription className="text-lightgray">
                      Save $89 compared to monthly
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-white mb-2">$499</div>
                      <div className="text-lightgray">per year</div>
                      <div className="text-sm text-primary mt-1">$41.58/month</div>
                    </div>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center text-white">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        All Monthly features
                      </li>
                      <li className="flex items-center text-white">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        Advanced analytics dashboard
                      </li>
                      <li className="flex items-center text-white">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        Bulk quote generation
                      </li>
                      <li className="flex items-center text-white">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        Custom branding options
                      </li>
                      <li className="flex items-center text-white">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        API access for integrations
                      </li>
                    </ul>
                    <Button 
                      className="w-full bg-primary hover:bg-primary/80"
                      onClick={() => handleSelectProPlan('yearly')}
                      disabled={createPaymentMutation.isPending}
                    >
                      {createPaymentMutation.isPending ? "Processing..." : "Choose Yearly"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Lifetime Plan */}
                <Card className="bg-darkgray border-gray-700 relative">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      Lifetime Plan
                      <Clock className="h-6 w-6 text-primary" />
                    </CardTitle>
                    <CardDescription className="text-lightgray">
                      One-time payment, lifetime access
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-white mb-2">$1,500</div>
                      <div className="text-lightgray">one-time</div>
                      <div className="text-sm text-primary mt-1">Best long-term value</div>
                    </div>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center text-white">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        All Yearly features
                      </li>
                      <li className="flex items-center text-white">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        Lifetime updates included
                      </li>
                      <li className="flex items-center text-white">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        Priority feature requests
                      </li>
                      <li className="flex items-center text-white">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        Direct access to developers
                      </li>
                      <li className="flex items-center text-white">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        Exclusive beta features
                      </li>
                    </ul>
                    <Button 
                      className="w-full bg-primary hover:bg-primary/80"
                      onClick={() => handleSelectProPlan('lifetime')}
                      disabled={createPaymentMutation.isPending}
                    >
                      {createPaymentMutation.isPending ? "Processing..." : "Choose Lifetime"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Residential Tab Content */}
            {activeTab === 'residential' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Residential Furnace */}
                <div className="bg-darkgray rounded-lg overflow-hidden border border-gray-700">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold font-header">Furnace Systems</h3>
                      <span className="text-primary"><i className="fas fa-fire text-2xl"></i></span>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">High-Efficiency (96%+)</span>
                        <span className="font-semibold">$5,500 - $9,800</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">Standard Installation</span>
                        <span className="font-semibold">Included</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">Removal of Old Unit</span>
                        <span className="font-semibold">Included</span>
                      </div>
                      <div className="flex justify-between items-center pb-2">
                        <span className="font-medium">10-Year Parts Warranty</span>
                        <span className="font-semibold">Included</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-lightgray mb-4">
                      * Financing available with approved credit
                    </div>
                    
                    <Button 
                      className="w-full bg-primary hover:bg-primary/80"
                      onClick={() => handlePayForService('furnace', 7150)}
                      disabled={hvacServiceMutation.isPending}
                    >
                      {hvacServiceMutation.isPending ? "Processing..." : "Schedule Installation"}
                    </Button>
                  </div>
                </div>

                {/* Air Conditioning */}
                <div className="bg-darkgray rounded-lg overflow-hidden border border-gray-700">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold font-header">AC Systems</h3>
                      <span className="text-primary"><i className="fas fa-snowflake text-2xl"></i></span>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">Central Air (16+ SEER)</span>
                        <span className="font-semibold">$4,800 - $8,500</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">Heat Pump System</span>
                        <span className="font-semibold">$6,200 - $12,000</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">Ductwork Modification</span>
                        <span className="font-semibold">$2,500 - $4,000</span>
                      </div>
                      <div className="flex justify-between items-center pb-2">
                        <span className="font-medium">Smart Thermostat</span>
                        <span className="font-semibold">Included</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-lightgray mb-4">
                      * Energy rebates may apply
                    </div>
                    
                    <Button 
                      className="w-full bg-primary hover:bg-primary/80"
                      onClick={() => handlePayForService('ac-system', 6650)}
                      disabled={hvacServiceMutation.isPending}
                    >
                      {hvacServiceMutation.isPending ? "Processing..." : "Schedule Installation"}
                    </Button>
                  </div>
                </div>

                {/* Service & Repairs */}
                <div className="bg-darkgray rounded-lg overflow-hidden border border-gray-700">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold font-header">Service & Repairs</h3>
                      <span className="text-primary"><i className="fas fa-tools text-2xl"></i></span>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">Diagnostic Fee</span>
                        <span className="font-semibold">$125</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">Standard Repair</span>
                        <span className="font-semibold">$200 - $800</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">Thermostat Replacement</span>
                        <span className="font-semibold">$350 - $650</span>
                      </div>
                      <div className="flex justify-between items-center pb-2">
                        <span className="font-medium">Duct Cleaning</span>
                        <span className="font-semibold">$400 - $800</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-lightgray mb-4">
                      * Diagnostic fee waived with repair
                    </div>
                    
                    <Button 
                      className="w-full bg-primary hover:bg-primary/80"
                      onClick={() => handlePayForService('service-repair', 500)}
                      disabled={hvacServiceMutation.isPending}
                    >
                      {hvacServiceMutation.isPending ? "Processing..." : "Schedule Service"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Commercial Tab Content */}
            {activeTab === 'commercial' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Light Commercial */}
                <div className="bg-darkgray rounded-lg overflow-hidden border border-gray-700">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold font-header">Light Commercial</h3>
                      <span className="text-primary"><i className="fas fa-building text-2xl"></i></span>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">Rooftop Units (RTU)</span>
                        <span className="font-semibold">$8,500 - $25,000</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">Split System</span>
                        <span className="font-semibold">$6,000 - $18,000</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">VRF Systems</span>
                        <span className="font-semibold">$15,000 - $45,000</span>
                      </div>
                      <div className="flex justify-between items-center pb-2">
                        <span className="font-medium">Building Automation</span>
                        <span className="font-semibold">$5,000 - $15,000</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-primary hover:bg-primary/80"
                      onClick={() => handlePayForService('light-commercial', 16750)}
                      disabled={hvacServiceMutation.isPending}
                    >
                      {hvacServiceMutation.isPending ? "Processing..." : "Request Proposal"}
                    </Button>
                  </div>
                </div>

                {/* Industrial */}
                <div className="bg-darkgray rounded-lg overflow-hidden border border-gray-700">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold font-header">Industrial</h3>
                      <span className="text-primary"><i className="fas fa-industry text-2xl"></i></span>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">Process Cooling</span>
                        <span className="font-semibold">$50,000+</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">Chiller Systems</span>
                        <span className="font-semibold">$75,000+</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">Custom Fabrication</span>
                        <span className="font-semibold">Custom Quote</span>
                      </div>
                      <div className="flex justify-between items-center pb-2">
                        <span className="font-medium">24/7 Service Contract</span>
                        <span className="font-semibold">$2,000+/month</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-primary hover:bg-primary/80"
                      onClick={() => handlePayForService('industrial', 75000)}
                      disabled={hvacServiceMutation.isPending}
                    >
                      {hvacServiceMutation.isPending ? "Processing..." : "Contact Engineer"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Maintenance Tab Content */}
            {activeTab === 'maintenance' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Basic Plan */}
                <div className="bg-darkgray rounded-lg overflow-hidden border border-gray-700">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold font-header">Basic Plan</h3>
                      <span className="text-primary"><i className="fas fa-tools text-2xl"></i></span>
                    </div>
                    
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-white mb-2">$399</div>
                      <div className="text-lightgray">per year</div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        <span>2 tune-ups per year</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        <span>Filter replacements</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        <span>20% off repairs</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        <span>Priority scheduling</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-primary hover:bg-primary/80"
                      onClick={() => handleSelectMaintenancePlan('basic')}
                    >
                      Select Basic
                    </Button>
                  </div>
                </div>

                {/* Premium Plan */}
                <div className="bg-darkgray rounded-lg overflow-hidden border border-primary transform scale-105">
                  <div className="bg-primary text-white text-center py-2 text-sm font-medium">
                    MOST POPULAR
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold font-header">Premium Plan</h3>
                      <span className="text-primary"><i className="fas fa-star text-2xl"></i></span>
                    </div>
                    
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-white mb-2">$799</div>
                      <div className="text-lightgray">per year</div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        <span>All Basic features</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        <span>Indoor air quality check</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        <span>Duct inspection</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        <span>Emergency service calls</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        <span>30% off repairs</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-primary hover:bg-primary/80"
                      onClick={() => handleSelectMaintenancePlan('premium')}
                    >
                      Select Premium
                    </Button>
                  </div>
                </div>

                {/* Commercial Plan */}
                <div className="bg-darkgray rounded-lg overflow-hidden border border-gray-700">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold font-header">Commercial Plan</h3>
                      <span className="text-primary"><i className="fas fa-building text-2xl"></i></span>
                    </div>
                    
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-white mb-2">$1,200</div>
                      <div className="text-lightgray">per unit/year</div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        <span>Quarterly inspections</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        <span>Detailed reporting</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        <span>Energy optimization</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        <span>24/7 emergency service</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        <span>Account manager</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-primary hover:bg-primary/80"
                      onClick={() => handleSelectMaintenancePlan('commercial')}
                    >
                      Select Commercial
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Emergency Tab Content */}
            {activeTab === 'emergency' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Evening/Weekend */}
                <div className="bg-darkgray rounded-lg overflow-hidden border border-gray-700">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold font-header">Evening/Weekend</h3>
                      <span className="text-primary"><i className="fas fa-clock text-2xl"></i></span>
                    </div>
                    
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-white mb-2">$250</div>
                      <div className="text-lightgray">service call + labor</div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        <span>Mon-Fri 6PM-8AM</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        <span>Weekends & Holidays</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        <span>4-hour response time</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        <span>$175 deposit required</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Button 
                        className="w-full bg-primary hover:bg-primary/80"
                        onClick={() => handlePayEmergency('evening')}
                      >
                        Book Evening Service
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handlePayDeposit}
                      >
                        Pay Deposit Only
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Late Night */}
                <div className="bg-darkgray rounded-lg overflow-hidden border border-gray-700">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold font-header">Late Night</h3>
                      <span className="text-primary"><i className="fas fa-moon text-2xl"></i></span>
                    </div>
                    
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-white mb-2">$275</div>
                      <div className="text-lightgray">service call + labor</div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        <span>11PM-6AM daily</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        <span>True 24/7 coverage</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        <span>2-hour response time</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        <span>$175 deposit required</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Button 
                        className="w-full bg-primary hover:bg-primary/80"
                        onClick={() => handlePayEmergency('night')}
                      >
                        Book Night Service
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handlePayDeposit}
                      >
                        Pay Deposit Only
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-header mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact us today for a free estimate on your HVAC needs. Our experienced team is ready to help you stay comfortable year-round.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Get Free Quote
              </Button>
            </Link>
            <Link href="/pro-calculator">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Try Pro Calculator
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Pricing;