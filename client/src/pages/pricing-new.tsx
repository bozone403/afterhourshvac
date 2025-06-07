import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Shield, Clock, Wrench, Home, Building, Factory } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

const Pricing = () => {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('pro-membership');
  const { user } = useAuth();
  const { toast } = useToast();

  const handleProPayment = (plan: string) => {
    if (!user) {
      toast({
        title: "Please Sign In",
        description: "You need to create an account to purchase Pro membership.",
        variant: "destructive",
      });
      setLocation('/auth');
      return;
    }

    const amounts = {
      monthly: 49,
      yearly: 499,
      lifetime: 1500
    };

    setLocation(`/checkout?service=pro&plan=${plan}&amount=${amounts[plan as keyof typeof amounts]}`);
  };

  const handleServicePayment = (serviceType: string, amount: number, description: string) => {
    setLocation(`/checkout?service=${serviceType}&amount=${amount}&description=${encodeURIComponent(description)}`);
  };

  return (
    <>
      <Helmet>
        <title>Pricing - AfterHours HVAC | Professional HVAC Services & Pro Tools</title>
        <meta name="description" content="Transparent pricing for HVAC services, installations, repairs, and Pro calculator access. Get professional estimates for residential and commercial projects." />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold font-header mb-6">Professional Pricing</h1>
            <p className="text-slate-300 max-w-3xl mx-auto text-xl">
              Transparent rates for HVAC services and advanced Pro calculator tools
            </p>
          </div>
        </div>
      </div>
      
      {/* Pricing Tabs */}
      <section className="bg-slate-900 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button 
              onClick={() => setActiveTab('pro-membership')} 
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'pro-membership' 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Pro Calculator Access
            </button>
            <button 
              onClick={() => setActiveTab('residential')} 
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'residential' 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Residential Services
            </button>
            <button 
              onClick={() => setActiveTab('commercial')} 
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'commercial' 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Commercial Services
            </button>
            <button 
              onClick={() => setActiveTab('maintenance')} 
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'maintenance' 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Maintenance Plans
            </button>
          </div>

          {/* Pro Membership Tab */}
          {activeTab === 'pro-membership' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Monthly Plan */}
              <Card className="bg-slate-800/50 border-slate-700 hover:border-green-500 transition-colors">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    Monthly Access
                    <Zap className="h-6 w-6 text-green-400" />
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Perfect for occasional projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-white mb-2">$49</div>
                    <div className="text-slate-400">per month</div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center text-white">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      Real-time Alggin.com pricing
                    </li>
                    <li className="flex items-center text-white">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      Advanced material calculator
                    </li>
                    <li className="flex items-center text-white">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      Custom multiplier rates
                    </li>
                    <li className="flex items-center text-white">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      PDF quote generation
                    </li>
                  </ul>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleProPayment('monthly')}
                  >
                    Choose Monthly
                  </Button>
                </CardContent>
              </Card>

              {/* Yearly Plan - Most Popular */}
              <Card className="bg-slate-800/50 border-green-500 relative scale-105 shadow-xl">
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white">
                  <Star className="h-3 w-3 mr-1" />
                  Best Value
                </Badge>
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    Yearly Access
                    <Shield className="h-6 w-6 text-green-400" />
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Save $89 annually
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-white mb-2">$499</div>
                    <div className="text-slate-400">per year</div>
                    <div className="text-sm text-green-400 mt-1">$41.58/month</div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center text-white">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      All Monthly features
                    </li>
                    <li className="flex items-center text-white">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      Advanced analytics
                    </li>
                    <li className="flex items-center text-white">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      Bulk quote processing
                    </li>
                    <li className="flex items-center text-white">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      Priority support
                    </li>
                  </ul>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleProPayment('yearly')}
                  >
                    Choose Yearly
                  </Button>
                </CardContent>
              </Card>

              {/* Lifetime Plan */}
              <Card className="bg-slate-800/50 border-slate-700 hover:border-green-500 transition-colors">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    Lifetime Access
                    <Clock className="h-6 w-6 text-green-400" />
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    One-time investment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-white mb-2">$1,500</div>
                    <div className="text-slate-400">one-time</div>
                    <div className="text-sm text-green-400 mt-1">Best long-term value</div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center text-white">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      All Yearly features
                    </li>
                    <li className="flex items-center text-white">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      Lifetime updates
                    </li>
                    <li className="flex items-center text-white">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      No recurring fees
                    </li>
                    <li className="flex items-center text-white">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      VIP support access
                    </li>
                  </ul>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleProPayment('lifetime')}
                  >
                    Choose Lifetime
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Residential Services Tab */}
          {activeTab === 'residential' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Furnace Installation */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Home className="h-6 w-6 text-green-400 mr-2" />
                    Furnace Installation
                  </CardTitle>
                  <CardDescription>High-efficiency gas furnaces</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-white">
                      <span>80% AFUE Unit</span>
                      <span className="font-semibold">$3,500 - $4,500</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>90% AFUE Unit</span>
                      <span className="font-semibold">$4,200 - $5,800</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>95% AFUE Unit</span>
                      <span className="font-semibold">$5,500 - $7,200</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleServicePayment('furnace-install', 4000, 'Furnace Installation - Complete Service')}
                  >
                    Pay $4,000 - Mid-Efficiency Furnace
                  </Button>
                </CardContent>
              </Card>

              {/* Air Conditioning */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Zap className="h-6 w-6 text-green-400 mr-2" />
                    Air Conditioning
                  </CardTitle>
                  <CardDescription>Central air systems & heat pumps</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-white">
                      <span>13-14 SEER System</span>
                      <span className="font-semibold">$4,800 - $6,500</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>16 SEER System</span>
                      <span className="font-semibold">$6,200 - $8,200</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Heat Pump System</span>
                      <span className="font-semibold">$7,500 - $10,500</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleServicePayment('ac-install', 6500, 'Air Conditioning Installation - Complete System')}
                  >
                    Pay $6,500 - 16 SEER AC System
                  </Button>
                </CardContent>
              </Card>

              {/* Repairs & Service */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Wrench className="h-6 w-6 text-green-400 mr-2" />
                    Repairs & Service
                  </CardTitle>
                  <CardDescription>Diagnostic & repair services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-white">
                      <span>Diagnostic Fee</span>
                      <span className="font-semibold">$125</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Standard Repair</span>
                      <span className="font-semibold">$200 - $800</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Emergency Service</span>
                      <span className="font-semibold">$250 - $350</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleServicePayment('repair-service', 450, 'HVAC Repair Service - Complete Fix')}
                  >
                    Pay $450 - Standard Repair Service
                  </Button>
                </CardContent>
              </Card>

              {/* Duct Cleaning */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Duct Cleaning</CardTitle>
                  <CardDescription>Professional duct sanitization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-white">
                      <span>Basic Cleaning</span>
                      <span className="font-semibold">$400 - $600</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Deep Sanitization</span>
                      <span className="font-semibold">$650 - $900</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleServicePayment('duct-cleaning', 600, 'Professional Duct Cleaning Service')}
                  >
                    Pay $600 - Complete Duct Cleaning
                  </Button>
                </CardContent>
              </Card>

              {/* Water Heater */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Water Heater</CardTitle>
                  <CardDescription>Tank & tankless installations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-white">
                      <span>Tank Water Heater</span>
                      <span className="font-semibold">$1,200 - $2,200</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Tankless Unit</span>
                      <span className="font-semibold">$2,800 - $4,500</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleServicePayment('water-heater', 150, 'Water Heater Installation Deposit')}
                  >
                    Get Quote - $150 Deposit
                  </Button>
                </CardContent>
              </Card>

              {/* Thermostat */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Smart Thermostats</CardTitle>
                  <CardDescription>WiFi-enabled climate control</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-white">
                      <span>Basic Programmable</span>
                      <span className="font-semibold">$350 - $450</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Smart WiFi Model</span>
                      <span className="font-semibold">$450 - $650</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleServicePayment('thermostat', 350, 'Thermostat Installation')}
                  >
                    Install Smart Thermostat
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Commercial Services Tab */}
          {activeTab === 'commercial' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Light Commercial */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Building className="h-6 w-6 text-green-400 mr-2" />
                    Light Commercial
                  </CardTitle>
                  <CardDescription>Small to medium businesses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-white">
                      <span>Rooftop Units (RTU)</span>
                      <span className="font-semibold">$8,500 - $25,000</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Split System</span>
                      <span className="font-semibold">$6,000 - $18,000</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>VRF Systems</span>
                      <span className="font-semibold">$15,000 - $45,000</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleServicePayment('light-commercial', 500, 'Light Commercial HVAC Consultation')}
                  >
                    Request Proposal - $500
                  </Button>
                </CardContent>
              </Card>

              {/* Industrial */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Factory className="h-6 w-6 text-green-400 mr-2" />
                    Industrial
                  </CardTitle>
                  <CardDescription>Large facilities & manufacturing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-white">
                      <span>Process Cooling</span>
                      <span className="font-semibold">$25,000 - $100,000</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Industrial Ventilation</span>
                      <span className="font-semibold">$30,000 - $150,000</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Building Automation</span>
                      <span className="font-semibold">$15,000 - $75,000</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleServicePayment('industrial', 1000, 'Industrial HVAC Engineering Consultation')}
                  >
                    Engineering Consultation - $1,000
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Maintenance Plans Tab */}
          {activeTab === 'maintenance' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Basic Plan */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Basic Plan</CardTitle>
                  <CardDescription>Essential maintenance coverage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-white mb-2">$399</div>
                    <div className="text-slate-400">per year</div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center text-white">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      2 tune-ups per year
                    </li>
                    <li className="flex items-center text-white">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      Priority scheduling
                    </li>
                    <li className="flex items-center text-white">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      10% discount on repairs
                    </li>
                  </ul>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleServicePayment('maintenance-basic', 399, 'Basic Maintenance Plan')}
                  >
                    Choose Basic Plan
                  </Button>
                </CardContent>
              </Card>

              {/* Premium Plan */}
              <Card className="bg-slate-800/50 border-green-500 relative scale-105">
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white">
                  Most Popular
                </Badge>
                <CardHeader>
                  <CardTitle className="text-white">Premium Plan</CardTitle>
                  <CardDescription>Comprehensive coverage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-white mb-2">$799</div>
                    <div className="text-slate-400">per year</div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center text-white">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      4 tune-ups per year
                    </li>
                    <li className="flex items-center text-white">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      24/7 emergency service
                    </li>
                    <li className="flex items-center text-white">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      20% discount on repairs
                    </li>
                    <li className="flex items-center text-white">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      Free filter replacements
                    </li>
                  </ul>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleServicePayment('maintenance-premium', 799, 'Premium Maintenance Plan')}
                  >
                    Choose Premium Plan
                  </Button>
                </CardContent>
              </Card>

              {/* Commercial Plan */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Commercial Plan</CardTitle>
                  <CardDescription>Business facility coverage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-white mb-2">$1,200</div>
                    <div className="text-slate-400">per year</div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center text-white">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      Monthly inspections
                    </li>
                    <li className="flex items-center text-white">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      Emergency response
                    </li>
                    <li className="flex items-center text-white">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      25% discount on repairs
                    </li>
                    <li className="flex items-center text-white">
                      <Check className="h-4 w-4 text-green-400 mr-2" />
                      Compliance reporting
                    </li>
                  </ul>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleServicePayment('maintenance-commercial', 1200, 'Commercial Maintenance Plan')}
                  >
                    Choose Commercial Plan
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Pricing;