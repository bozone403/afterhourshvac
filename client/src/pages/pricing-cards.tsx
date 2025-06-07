import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Snowflake, Shield, Wrench, Clock, Phone, Check } from 'lucide-react';

// Alggin catalog pricing data for minimum standards (92% AFUE, 16+ SEER)
const furnaceCards = [
  { 
    btu: 40000, 
    model: "Goodman GMH80403ANBA", 
    efficiency: "92% AFUE", 
    price: 2850, 
    installPrice: 4990,
    category: "economy",
    features: ["2-stage heating", "Stainless steel heat exchanger", "10-year parts warranty"]
  },
  { 
    btu: 60000, 
    model: "Goodman GMH80603ANBA", 
    efficiency: "92% AFUE", 
    price: 3150, 
    installPrice: 5490,
    category: "economy",
    features: ["2-stage heating", "Stainless steel heat exchanger", "10-year parts warranty"]
  },
  { 
    btu: 80000, 
    model: "Goodman GMH80803ANBA", 
    efficiency: "92% AFUE", 
    price: 3450, 
    installPrice: 5990,
    category: "economy",
    features: ["2-stage heating", "Stainless steel heat exchanger", "10-year parts warranty"]
  },
  { 
    btu: 100000, 
    model: "Goodman GMH801003ANBA", 
    efficiency: "92% AFUE", 
    price: 3750, 
    installPrice: 6490,
    category: "economy",
    features: ["2-stage heating", "Stainless steel heat exchanger", "10-year parts warranty"]
  },
  { 
    btu: 60000, 
    model: "Lennox EL296V-060", 
    efficiency: "96% AFUE", 
    price: 4650, 
    installPrice: 7990,
    category: "premium",
    popular: true,
    features: ["Variable-speed blower", "Modulating gas valve", "Precise Comfort technology", "20-year heat exchanger warranty"]
  },
  { 
    btu: 80000, 
    model: "Lennox EL296V-080", 
    efficiency: "96% AFUE", 
    price: 5150, 
    installPrice: 8790,
    category: "premium",
    features: ["Variable-speed blower", "Modulating gas valve", "Precise Comfort technology", "20-year heat exchanger warranty"]
  },
];

const acCards = [
  { 
    tonnage: 2, 
    model: "Goodman GSX160241", 
    seer: "16 SEER", 
    price: 2950, 
    installPrice: 4990,
    category: "standard",
    features: ["Single-stage cooling", "R-410A refrigerant", "10-year parts warranty"]
  },
  { 
    tonnage: 2.5, 
    model: "Goodman GSX160301", 
    seer: "16 SEER", 
    price: 3250, 
    installPrice: 5490,
    category: "standard",
    features: ["Single-stage cooling", "R-410A refrigerant", "10-year parts warranty"]
  },
  { 
    tonnage: 3, 
    model: "Goodman GSX160361", 
    seer: "16 SEER", 
    price: 3550, 
    installPrice: 5990,
    category: "standard",
    features: ["Single-stage cooling", "R-410A refrigerant", "10-year parts warranty"]
  },
  { 
    tonnage: 3.5, 
    model: "Goodman GSX160421", 
    seer: "16 SEER", 
    price: 3850, 
    installPrice: 6490,
    category: "standard",
    features: ["Single-stage cooling", "R-410A refrigerant", "10-year parts warranty"]
  },
  { 
    tonnage: 3, 
    model: "Lennox XC18-036", 
    seer: "18 SEER", 
    price: 4450, 
    installPrice: 7490,
    category: "premium",
    popular: true,
    features: ["Two-stage cooling", "Variable-speed condenser fan", "Precise Comfort technology", "10-year complete unit warranty"]
  },
  { 
    tonnage: 3.5, 
    model: "Lennox XC18-042", 
    seer: "18 SEER", 
    price: 4850, 
    installPrice: 7990,
    category: "premium",
    features: ["Two-stage cooling", "Variable-speed condenser fan", "Precise Comfort technology", "10-year complete unit warranty"]
  },
];

const heatPumpCards = [
  { 
    tonnage: 2.5, 
    model: "Goodman GSZ160301", 
    seer: "16 SEER", 
    hspf: "9.5 HSPF",
    price: 4650, 
    installPrice: 7490,
    category: "standard",
    features: ["Year-round comfort", "R-410A refrigerant", "10-year parts warranty"]
  },
  { 
    tonnage: 3, 
    model: "Goodman GSZ160361", 
    seer: "16 SEER", 
    hspf: "9.5 HSPF",
    price: 5050, 
    installPrice: 7990,
    category: "standard",
    features: ["Year-round comfort", "R-410A refrigerant", "10-year parts warranty"]
  },
  { 
    tonnage: 3.5, 
    model: "Goodman GSZ160421", 
    seer: "16 SEER", 
    hspf: "9.5 HSPF",
    price: 5450, 
    installPrice: 8490,
    category: "standard",
    popular: true,
    features: ["Year-round comfort", "R-410A refrigerant", "10-year parts warranty"]
  },
];

const maintenancePlans = [
  {
    name: "Basic Maintenance",
    price: 199,
    features: ["Annual furnace inspection", "Filter replacement", "Basic cleaning", "Safety check"],
    popular: false
  },
  {
    name: "Premium Maintenance", 
    price: 349,
    features: ["Bi-annual tune-ups", "Priority service", "15% discount on repairs", "Extended warranty", "Emergency service"],
    popular: true
  },
  {
    name: "Commercial Maintenance",
    price: 599,
    features: ["Quarterly inspections", "24/7 emergency service", "20% discount on parts", "Preventive maintenance", "System monitoring"],
    popular: false
  }
];

const emergencyServices = [
  {
    name: "Evening Service",
    time: "5pm - 12am",
    price: 150,
    description: "After-hours service for urgent HVAC issues"
  },
  {
    name: "Overnight Service", 
    time: "12am - 8am",
    price: 200,
    description: "Emergency overnight service for critical repairs"
  }
];

export default function PricingCards() {
  const [, setLocation] = useLocation();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount);
  };

  const handlePurchase = (service: string, amount: number, description: string, plan?: string, time?: string) => {
    const queryParams = new URLSearchParams({
      service,
      amount: amount.toString(),
      description,
      ...(plan && { plan }),
      ...(time && { time })
    });
    setLocation(`/checkout?${queryParams.toString()}`);
  };

  return (
    <>
      <Helmet>
        <title>HVAC Equipment & Service Pricing | AfterHours HVAC</title>
        <meta name="description" content="Professional HVAC equipment and service pricing. Quality furnaces starting at 92% AFUE and AC units at 16+ SEER. Get transparent pricing with professional installation included." />
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-dark via-black to-dark">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-header mb-6">
              Transparent HVAC Pricing
            </h1>
            <p className="text-xl text-lightgray mb-8 max-w-3xl mx-auto">
              Quality equipment with professional installation. Minimum 92% AFUE furnaces and 16+ SEER AC units.
              All pricing includes professional installation and warranty coverage.
            </p>
            <Badge className="bg-primary text-black font-semibold px-4 py-2 text-lg">
              Professional Installation Included
            </Badge>
          </div>
        </section>

        {/* Furnaces Section */}
        <section className="py-16 bg-dark">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Thermometer className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold font-header mb-4">Gas Furnaces</h2>
              <p className="text-lightgray max-w-2xl mx-auto">
                High-efficiency furnaces starting at 92% AFUE. Professional installation and warranty included.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {furnaceCards.map((furnace, index) => (
                <Card key={index} className={`bg-black border-gray-700 relative ${furnace.popular ? 'ring-2 ring-primary' : ''}`}>
                  {furnace.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-black font-semibold px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl font-bold">
                      {furnace.btu.toLocaleString()} BTU
                    </CardTitle>
                    <CardDescription className="text-primary font-semibold text-lg">
                      {furnace.efficiency}
                    </CardDescription>
                    <p className="text-sm text-lightgray">{furnace.model}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {formatCurrency(furnace.installPrice)}
                      </div>
                      <p className="text-sm text-lightgray">
                        Equipment: {formatCurrency(furnace.price)} + Installation
                      </p>
                    </div>

                    <ul className="space-y-2">
                      {furnace.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button 
                      onClick={() => handlePurchase(
                        'furnace-install',
                        furnace.installPrice,
                        `${furnace.btu.toLocaleString()} BTU ${furnace.efficiency} Furnace Installation - ${furnace.model}`
                      )}
                      className={`w-full font-semibold ${furnace.popular ? 'bg-primary hover:bg-primary/90 text-black' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                    >
                      Buy Now - {formatCurrency(furnace.installPrice)}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Air Conditioning Section */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Snowflake className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold font-header mb-4">Central Air Conditioning</h2>
              <p className="text-lightgray max-w-2xl mx-auto">
                High-efficiency cooling systems starting at 16 SEER. Professional installation and warranty included.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {acCards.map((ac, index) => (
                <Card key={index} className={`bg-dark border-gray-700 relative ${ac.popular ? 'ring-2 ring-primary' : ''}`}>
                  {ac.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-black font-semibold px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl font-bold">
                      {ac.tonnage} Ton
                    </CardTitle>
                    <CardDescription className="text-primary font-semibold text-lg">
                      {ac.seer}
                    </CardDescription>
                    <p className="text-sm text-lightgray">{ac.model}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {formatCurrency(ac.installPrice)}
                      </div>
                      <p className="text-sm text-lightgray">
                        Equipment: {formatCurrency(ac.price)} + Installation
                      </p>
                    </div>

                    <ul className="space-y-2">
                      {ac.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button 
                      onClick={() => handlePurchase(
                        'ac-install',
                        ac.installPrice,
                        `${ac.tonnage} Ton ${ac.seer} AC Installation - ${ac.model}`
                      )}
                      className={`w-full font-semibold ${ac.popular ? 'bg-primary hover:bg-primary/90 text-black' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                    >
                      Buy Now - {formatCurrency(ac.installPrice)}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Heat Pump Section */}
        <section className="py-16 bg-dark">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold font-header mb-4">Heat Pump Systems</h2>
              <p className="text-lightgray max-w-2xl mx-auto">
                Year-round comfort with efficient heat pump technology. Heating and cooling in one system.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {heatPumpCards.map((hp, index) => (
                <Card key={index} className={`bg-black border-gray-700 relative ${hp.popular ? 'ring-2 ring-primary' : ''}`}>
                  {hp.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-black font-semibold px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl font-bold">
                      {hp.tonnage} Ton Heat Pump
                    </CardTitle>
                    <CardDescription className="text-primary font-semibold text-lg">
                      {hp.seer} / {hp.hspf}
                    </CardDescription>
                    <p className="text-sm text-lightgray">{hp.model}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {formatCurrency(hp.installPrice)}
                      </div>
                      <p className="text-sm text-lightgray">
                        Equipment: {formatCurrency(hp.price)} + Installation
                      </p>
                    </div>

                    <ul className="space-y-2">
                      {hp.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button 
                      onClick={() => handlePurchase(
                        'heatpump-install',
                        hp.installPrice,
                        `${hp.tonnage} Ton Heat Pump Installation - ${hp.model}`
                      )}
                      className={`w-full font-semibold ${hp.popular ? 'bg-primary hover:bg-primary/90 text-black' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                    >
                      Buy Now - {formatCurrency(hp.installPrice)}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Maintenance Plans */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Wrench className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold font-header mb-4">Maintenance Plans</h2>
              <p className="text-lightgray max-w-2xl mx-auto">
                Keep your HVAC system running efficiently with our professional maintenance plans
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {maintenancePlans.map((plan, index) => (
                <Card key={index} className={`bg-dark border-gray-700 relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-black font-semibold px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <CardDescription>
                      <span className="text-3xl font-bold text-primary">{formatCurrency(plan.price)}</span>
                      <span className="text-lightgray">/year</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      onClick={() => handlePurchase(
                        'maintenance-plan',
                        plan.price,
                        `${plan.name} - Annual Plan`,
                        plan.name.toLowerCase().replace(' ', '-')
                      )}
                      className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90 text-black' : 'bg-gray-700 hover:bg-gray-600 text-white'} font-semibold`}
                    >
                      Buy Now - {formatCurrency(plan.price)}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Emergency Services */}
        <section className="py-16 bg-dark">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Clock className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold font-header mb-4">Emergency Services</h2>
              <p className="text-lightgray max-w-2xl mx-auto">
                24/7 emergency HVAC repair services when you need them most
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {emergencyServices.map((service, index) => (
                <Card key={index} className="bg-black border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-primary">{service.name}</CardTitle>
                    <CardDescription className="text-lg">{service.time}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lightgray mb-4">{service.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-primary">{formatCurrency(service.price)}</span>
                      <span className="text-lightgray">Service call fee</span>
                    </div>
                    <Button 
                      onClick={() => handlePurchase(
                        'emergency-service',
                        service.price,
                        `${service.name} - ${service.time}`,
                        undefined,
                        service.time.includes('Evening') ? 'evening' : 'overnight'
                      )}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
                    >
                      Book Emergency Service
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-lightgray mb-4">Need immediate assistance?</p>
              <a href="tel:4036136014" className="inline-flex items-center bg-primary hover:bg-primary/90 text-black px-6 py-3 rounded-md font-semibold transition-all">
                <Phone className="w-5 h-5 mr-2" />
                Call (403) 613-6014
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}