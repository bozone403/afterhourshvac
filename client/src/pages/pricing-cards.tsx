import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Snowflake, Shield, Wrench, Clock, Phone, Check } from 'lucide-react';

// Stage-based furnace pricing with professional installation - Calgary market rates
const furnaceCards = [
  { 
    stage: "1-Stage", 
    model: "Ducane 92G1UH Series", 
    efficiency: "92% AFUE", 
    installPrice: 6999,
    category: "low",
    features: ["Single-stage heating", "Stainless steel heat exchanger", "10-year parts warranty", "Reliable operation"]
  },
  { 
    stage: "2-Stage", 
    model: "Daikin DM96VC Series", 
    efficiency: "96% AFUE", 
    installPrice: 8499,
    category: "mid",
    features: ["Two-stage heating", "Variable speed blower", "Enhanced comfort control", "15-year parts warranty"]
  },
  { 
    stage: "Variable/Modulating", 
    model: "Lennox SLP98V Series", 
    efficiency: "98% AFUE", 
    installPrice: 11999,
    category: "high",
    popular: true,
    features: ["Variable-speed blower", "Modulating gas valve", "Precise Comfort technology", "20-year heat exchanger warranty"]
  },
];

// Stage-based AC pricing with professional installation - Calgary market rates
const acCards = [
  { 
    stage: "1-Stage", 
    tonnage: "2-5 Ton", 
    model: "Ducane 13ACD Series", 
    seer: "16 SEER", 
    installPrice: 6499,
    category: "low",
    features: ["Single-stage cooling", "R-410A refrigerant", "10-year parts warranty", "Reliable performance"]
  },
  { 
    stage: "2-Stage", 
    tonnage: "2-5 Ton", 
    model: "Daikin DX18TC Series", 
    seer: "18 SEER", 
    installPrice: 7999,
    category: "mid",
    features: ["Two-stage cooling", "Enhanced humidity control", "Quieter operation", "12-year parts warranty"]
  },
  { 
    stage: "Variable Speed", 
    tonnage: "2-5 Ton", 
    model: "Lennox XC25 Series", 
    seer: "26 SEER", 
    installPrice: 11499,
    category: "high",
    popular: true,
    features: ["Variable-speed compressor", "Precise temperature control", "Energy Star certified", "10-year complete unit warranty"]
  },
];

const heatPumpCards = [
  { 
    tonnage: 2.5, 
    model: "Ducane 13HPD Series", 
    hspf: "8.5 HSPF", 
    seer: "14 SEER", 
    installPrice: 8990,
    category: "standard",
    features: ["Heat pump technology", "R-410A refrigerant", "10-year parts warranty", "Year-round comfort"]
  },
  { 
    tonnage: 3, 
    model: "Lennox XP16-036", 
    hspf: "9.0 HSPF", 
    seer: "16 SEER", 
    installPrice: 11490,
    category: "premium",
    popular: true,
    features: ["Two-stage operation", "Enhanced efficiency", "Precise Comfort technology", "Enhanced sound reduction"]
  },
];

const maintenanceCards = [
  {
    name: "Basic Plan",
    price: 1055,
    category: "basic",
    features: ["Annual tune-up", "Basic cleaning", "Safety inspection", "Priority scheduling", "10% discount on repairs"]
  },
  {
    name: "Premium Plan", 
    price: 1755,
    category: "premium",
    popular: true,
    features: ["Bi-annual tune-ups", "Comprehensive cleaning", "Detailed inspection", "Priority emergency service", "15% discount on repairs", "Free filter replacements"]
  },
  {
    name: "Commercial Plan",
    price: 2499,
    category: "commercial", 
    features: ["Quarterly maintenance", "Commercial-grade service", "24/7 emergency support", "Preventive maintenance", "20% discount on all services", "Customized service plan"]
  }
];

const serviceCards = [
  {
    name: "Service Diagnostic",
    price: 149,
    description: "Professional diagnosis of HVAC issues",
    features: ["Complete system inspection", "Detailed report", "Repair recommendations", "No obligation estimate"]
  },
  {
    name: "Duct Cleaning",
    price: 3199,
    description: "Premium air duct cleaning service", 
    features: ["Complete duct system cleaning", "Sanitization treatment", "Before/after photos", "Improved air quality"]
  },
  {
    name: "Thermostat Installation",
    price: 249,
    description: "Smart thermostat installation and setup",
    features: ["Professional installation", "WiFi setup", "Mobile app configuration", "Energy savings optimization"]
  },
  {
    name: "Emergency Service",
    price: 199,
    description: "24/7 emergency HVAC service call",
    urgent: true,
    features: ["24/7 availability", "Same-day service", "Emergency repairs", "Priority response"]
  }
];

// Water tank pricing
const waterTankCards = [
  {
    name: "Standard Electric",
    size: "40-50 Gallon",
    model: "Standard Electric Water Heater",
    installPrice: 2399,
    category: "standard",
    features: ["Electric heating element", "Standard efficiency", "6-year warranty", "Professional installation"]
  },
  {
    name: "High Efficiency Gas",
    size: "40-50 Gallon", 
    model: "High Efficiency Gas Water Heater",
    installPrice: 2899,
    category: "premium",
    popular: true,
    features: ["Natural gas operation", "High efficiency rating", "8-year warranty", "Faster recovery time"]
  },
  {
    name: "Tankless Gas",
    size: "On-Demand",
    model: "Tankless Gas Water Heater",
    installPrice: 4799,
    category: "premium",
    features: ["Endless hot water", "Space-saving design", "High efficiency", "12-year warranty"]
  }
];

// HRV/ERV pricing
const hrvCards = [
  {
    name: "Basic HRV",
    model: "Heat Recovery Ventilator",
    cfm: "100-150 CFM",
    installPrice: 3799,
    category: "standard",
    features: ["Heat recovery", "Fresh air ventilation", "Energy efficient", "Improved air quality"]
  },
  {
    name: "Premium ERV",
    model: "Energy Recovery Ventilator", 
    cfm: "150-200 CFM",
    installPrice: 4999,
    category: "premium",
    popular: true,
    features: ["Heat & moisture recovery", "Advanced controls", "Variable speed", "HEPA filtration"]
  }
];

// Humidifier pricing
const humidifierCards = [
  {
    name: "Bypass Humidifier",
    model: "Whole House Bypass Humidifier",
    coverage: "Up to 4,000 sq ft",
    installPrice: 1299,
    category: "standard",
    features: ["Whole house coverage", "Automatic operation", "Low maintenance", "Professional installation"]
  },
  {
    name: "Steam Humidifier",
    model: "Whole House Steam Humidifier",
    coverage: "Up to 6,000 sq ft",
    installPrice: 2199,
    category: "premium",
    popular: true,
    features: ["Steam technology", "Precise humidity control", "Self-cleaning", "Advanced controls"]
  }
];

export default function PricingCards() {
  const [, setLocation] = useLocation();

  const handleBuyNow = (service: string, amount: number, description: string) => {
    // Check if user is authenticated first
    fetch('/api/user')
      .then(res => {
        if (res.status === 401) {
          // User not authenticated, redirect to login with return URL
          const returnUrl = encodeURIComponent(`/checkout?service=${service}&amount=${amount}&description=${encodeURIComponent(description)}`);
          setLocation(`/auth?returnUrl=${returnUrl}`);
        } else {
          // User is authenticated, proceed to checkout
          const params = new URLSearchParams({
            service,
            amount: amount.toString(),
            description: encodeURIComponent(description)
          });
          setLocation(`/checkout?${params.toString()}`);
        }
      })
      .catch(() => {
        // If there's an error, assume not authenticated
        const returnUrl = encodeURIComponent(`/checkout?service=${service}&amount=${amount}&description=${encodeURIComponent(description)}`);
        setLocation(`/auth?returnUrl=${returnUrl}`);
      });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'low':
      case 'basic':
      case 'standard':
        return 'bg-blue-50 border-blue-200';
      case 'mid':
      case 'premium':
        return 'bg-orange-50 border-orange-200';
      case 'high':
      case 'commercial':
        return 'bg-blue-100 border-blue-300';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'low':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Economy</Badge>;
      case 'mid':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Popular</Badge>;
      case 'high':
        return <Badge variant="secondary" className="bg-blue-200 text-blue-900">Premium</Badge>;
      case 'basic':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Basic</Badge>;
      case 'premium':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Premium</Badge>;
      case 'commercial':
        return <Badge variant="secondary" className="bg-blue-200 text-blue-900">Commercial</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <Helmet>
        <title>HVAC Equipment Pricing - AfterHours HVAC</title>
        <meta name="description" content="Professional HVAC equipment pricing including furnaces, air conditioners, heat pumps, and maintenance plans. Starting at $5,999 with professional installation." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Professional HVAC Equipment Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete HVAC solutions with professional installation, warranty coverage, and ongoing support
          </p>
        </div>

        {/* Furnace Installation */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Thermometer className="h-8 w-8 text-orange-600" />
              Furnace Installation
            </h2>
            <p className="text-gray-600">High-efficiency furnaces by heating stage with professional installation</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {furnaceCards.map((furnace, index) => (
              <Card key={index} className={`relative ${getCategoryColor(furnace.category)} ${furnace.popular ? 'ring-2 ring-primary' : ''}`}>
                {furnace.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary hover:bg-primary/90">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl font-bold">{furnace.stage}</CardTitle>
                    {getCategoryBadge(furnace.category)}
                  </div>
                  <CardDescription className="text-sm text-gray-600">
                    {furnace.model}
                  </CardDescription>
                  <div className="text-3xl font-bold text-gray-900">
                    Starting at ${furnace.installPrice.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500">{furnace.efficiency}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {furnace.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => handleBuyNow(
                      'furnace-install',
                      furnace.installPrice,
                      `${furnace.stage} Furnace Installation - ${furnace.model}`
                    )}
                  >
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Air Conditioning Installation */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Snowflake className="h-8 w-8 text-blue-600" />
              Air Conditioning Installation
            </h2>
            <p className="text-gray-600">High-efficiency air conditioners by cooling stage with professional installation</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {acCards.map((ac, index) => (
              <Card key={index} className={`relative ${getCategoryColor(ac.category)} ${ac.popular ? 'ring-2 ring-secondary' : ''}`}>
                {ac.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-secondary hover:bg-secondary/90">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl font-bold">{ac.stage}</CardTitle>
                    {getCategoryBadge(ac.category)}
                  </div>
                  <CardDescription className="text-sm text-gray-600">
                    {ac.model} • {ac.tonnage}
                  </CardDescription>
                  <div className="text-3xl font-bold text-gray-900">
                    Starting at ${ac.installPrice.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500">{ac.seer}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {ac.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full bg-secondary hover:bg-secondary/90"
                    onClick={() => handleBuyNow(
                      'ac-install',
                      ac.installPrice,
                      `${ac.stage} Air Conditioner Installation - ${ac.model}`
                    )}
                  >
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Heat Pump Installation */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Shield className="h-8 w-8 text-green-600" />
              Heat Pump Installation
            </h2>
            <p className="text-gray-600">Year-round comfort with efficient heat pump technology</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {heatPumpCards.map((heatPump, index) => (
              <Card key={index} className={`relative ${getCategoryColor(heatPump.category)} ${heatPump.popular ? 'ring-2 ring-primary' : ''}`}>
                {heatPump.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary hover:bg-primary/90">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl font-bold">{heatPump.tonnage} Ton Heat Pump</CardTitle>
                    {getCategoryBadge(heatPump.category)}
                  </div>
                  <CardDescription className="text-sm text-gray-600">
                    {heatPump.model}
                  </CardDescription>
                  <div className="text-3xl font-bold text-gray-900">
                    Starting at ${heatPump.installPrice.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500">{heatPump.seer} • {heatPump.hspf}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {heatPump.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => handleBuyNow(
                      'heatpump-install',
                      heatPump.installPrice,
                      `${heatPump.tonnage} Ton Heat Pump Installation - ${heatPump.model}`
                    )}
                  >
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Maintenance Plans */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Wrench className="h-8 w-8 text-purple-600" />
              Maintenance Plans
            </h2>
            <p className="text-gray-600">Keep your HVAC system running efficiently year-round</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {maintenanceCards.map((plan, index) => (
              <Card key={index} className={`relative ${getCategoryColor(plan.category)} ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary hover:bg-primary/90">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                    {getCategoryBadge(plan.category)}
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    ${plan.price}
                    <span className="text-lg font-normal text-gray-500">/year</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full bg-secondary hover:bg-secondary/90"
                    onClick={() => handleBuyNow(
                      `maintenance-${plan.category}`,
                      plan.price,
                      `${plan.name} - Annual Maintenance Plan`
                    )}
                  >
                    Choose Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Additional Services */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Clock className="h-8 w-8 text-indigo-600" />
              Additional Services
            </h2>
            <p className="text-gray-600">Professional HVAC services and emergency support</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCards.map((service, index) => (
              <Card key={index} className={`relative ${service.urgent ? 'bg-orange-50 border-orange-200 ring-2 ring-primary' : 'bg-gray-50 border-gray-200'}`}>
                {service.urgent && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary hover:bg-primary/90">
                    Emergency
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-lg font-bold">{service.name}</CardTitle>
                  <div className="text-2xl font-bold text-gray-900">
                    ${service.price}
                  </div>
                  <CardDescription className="text-sm text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 mb-4">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs">
                        <Check className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${service.urgent ? 'bg-primary hover:bg-primary/90' : 'bg-secondary hover:bg-secondary/90'}`}
                    onClick={() => handleBuyNow(
                      service.name.toLowerCase().replace(/\s+/g, '-'),
                      service.price,
                      service.name
                    )}
                  >
                    {service.urgent ? 'Emergency Call' : 'Book Service'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Water Tank Installation */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-white rounded-full"></div>
              </div>
              Water Heater Installation
            </h2>
            <p className="text-gray-600">Professional water heater installation with warranty coverage</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {waterTankCards.map((tank, index) => (
              <Card key={index} className={`relative ${getCategoryColor(tank.category)} ${tank.popular ? 'ring-2 ring-primary' : ''}`}>
                {tank.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary hover:bg-primary/90">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl font-bold">{tank.name}</CardTitle>
                    {getCategoryBadge(tank.category)}
                  </div>
                  <CardDescription className="text-sm text-gray-600">
                    {tank.size}
                  </CardDescription>
                  <div className="text-3xl font-bold text-gray-900">
                    Starting at ${tank.installPrice.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500">{tank.model}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {tank.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => handleBuyNow(
                      'water-tank-install',
                      tank.installPrice,
                      `${tank.name} Water Heater Installation - ${tank.size}`
                    )}
                  >
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* HRV/ERV Installation */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <div className="h-8 w-8 bg-green-600 rounded flex items-center justify-center">
                <div className="h-4 w-4 border-2 border-white rounded"></div>
              </div>
              Heat Recovery Ventilation
            </h2>
            <p className="text-gray-600">Energy-efficient ventilation systems for improved air quality</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {hrvCards.map((hrv, index) => (
              <Card key={index} className={`relative ${getCategoryColor(hrv.category)} ${hrv.popular ? 'ring-2 ring-primary' : ''}`}>
                {hrv.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary hover:bg-primary/90">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl font-bold">{hrv.name}</CardTitle>
                    {getCategoryBadge(hrv.category)}
                  </div>
                  <CardDescription className="text-sm text-gray-600">
                    {hrv.cfm}
                  </CardDescription>
                  <div className="text-3xl font-bold text-gray-900">
                    Starting at ${hrv.installPrice.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500">{hrv.model}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {hrv.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => handleBuyNow(
                      'hrv-install',
                      hrv.installPrice,
                      `${hrv.name} Installation - ${hrv.cfm}`
                    )}
                  >
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Humidifier Installation */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                <div className="h-3 w-3 bg-white rounded-full opacity-60"></div>
                <div className="h-2 w-2 bg-white rounded-full opacity-80 ml-1"></div>
              </div>
              Whole House Humidifiers
            </h2>
            <p className="text-gray-600">Maintain optimal humidity levels throughout your home</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {humidifierCards.map((humidifier, index) => (
              <Card key={index} className={`relative ${getCategoryColor(humidifier.category)} ${humidifier.popular ? 'ring-2 ring-primary' : ''}`}>
                {humidifier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary hover:bg-primary/90">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl font-bold">{humidifier.name}</CardTitle>
                    {getCategoryBadge(humidifier.category)}
                  </div>
                  <CardDescription className="text-sm text-gray-600">
                    {humidifier.coverage}
                  </CardDescription>
                  <div className="text-3xl font-bold text-gray-900">
                    Starting at ${humidifier.installPrice.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500">{humidifier.model}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {humidifier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => handleBuyNow(
                      'humidifier-install',
                      humidifier.installPrice,
                      `${humidifier.name} Installation - ${humidifier.coverage}`
                    )}
                  >
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="text-center bg-primary text-white rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
            <Phone className="h-8 w-8" />
            24/7 Emergency Service
          </h2>
          <p className="text-xl mb-6">
            HVAC emergency? We're here to help around the clock.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-gray-100 font-bold"
            onClick={() => window.location.href = 'tel:(403)613-6014'}
          >
            Call Now: (403) 613-6014
          </Button>
        </section>
      </div>
    </div>
  );
}