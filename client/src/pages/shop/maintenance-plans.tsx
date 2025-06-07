import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Settings, Shield, Clock, Wrench, CheckCircle, Star, Phone, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

const MaintenancePlansShop = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const maintenancePlans = [
    {
      id: 1,
      name: "Essential Care",
      type: "basic",
      monthlyPrice: 29,
      annualPrice: 299,
      savings: 49,
      popular: false,
      features: [
        "Annual system inspection",
        "Filter replacement reminder",
        "10% discount on repairs",
        "Priority scheduling",
        "Basic system cleaning"
      ],
      includes: [
        "1 Annual Visit",
        "Safety Inspection",
        "Filter Check",
        "Basic Tune-up"
      ],
      badge: null
    },
    {
      id: 2,
      name: "Premium Protection",
      type: "premium",
      monthlyPrice: 49,
      annualPrice: 499,
      savings: 89,
      popular: true,
      features: [
        "Bi-annual system maintenance",
        "Free filter replacements (4/year)",
        "15% discount on repairs",
        "Priority emergency service",
        "Complete system cleaning",
        "Thermostat optimization"
      ],
      includes: [
        "2 Annual Visits",
        "Complete Inspection",
        "4 Free Filters",
        "System Optimization",
        "Performance Report"
      ],
      badge: "Most Popular"
    },
    {
      id: 3,
      name: "Ultimate Coverage",
      type: "ultimate",
      monthlyPrice: 79,
      annualPrice: 799,
      savings: 149,
      popular: false,
      features: [
        "Quarterly system maintenance",
        "Free premium filter replacements",
        "20% discount on repairs",
        "24/7 emergency priority",
        "Advanced diagnostics",
        "Smart thermostat upgrade",
        "Indoor air quality testing"
      ],
      includes: [
        "4 Annual Visits",
        "Advanced Diagnostics",
        "Premium Filters",
        "Smart Controls",
        "Air Quality Testing",
        "Extended Warranty"
      ],
      badge: "Best Value"
    }
  ];

  const addOns = [
    {
      name: "Duct Cleaning Service",
      price: 199,
      description: "Professional ductwork cleaning and sanitization"
    },
    {
      name: "Indoor Air Quality Package",
      price: 149,
      description: "UV lights, air purification, and humidity control"
    },
    {
      name: "Smart Thermostat Upgrade",
      price: 299,
      description: "Professional installation of WiFi-enabled smart thermostat"
    }
  ];

  return (
    <>
      <Helmet>
        <title>HVAC Maintenance Plans - Calgary Service Plans | AfterHours HVAC</title>
        <meta name="description" content="Protect your HVAC investment with our comprehensive maintenance plans. Annual service, priority repairs, and extended warranties available." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900">
                  HVAC Maintenance Plans
                </h1>
              </div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Keep your HVAC system running efficiently year-round with our comprehensive maintenance plans. 
                Save money on repairs and extend your equipment's lifespan.
              </p>
              
              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-4 bg-white rounded-full p-2 shadow-lg max-w-xs mx-auto">
                <span className={`text-sm font-medium ${!isAnnual ? 'text-blue-600' : 'text-gray-500'}`}>
                  Monthly
                </span>
                <Switch
                  checked={isAnnual}
                  onCheckedChange={setIsAnnual}
                  className="data-[state=checked]:bg-blue-600"
                />
                <span className={`text-sm font-medium ${isAnnual ? 'text-blue-600' : 'text-gray-500'}`}>
                  Annual
                </span>
                {isAnnual && (
                  <Badge className="bg-green-500 text-white text-xs">Save up to 20%</Badge>
                )}
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {maintenancePlans.map((plan) => (
                <Card key={plan.id} className={`relative bg-white shadow-lg transition-all duration-300 overflow-hidden ${plan.popular ? 'ring-2 ring-blue-500 scale-105' : 'hover:shadow-xl'}`}>
                  {plan.badge && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className={`${plan.popular ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'} text-white font-bold`}>
                        {plan.badge}
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</CardTitle>
                    <div className="mb-4">
                      <div className="text-4xl font-black text-blue-600">
                        ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                      </div>
                      <div className="text-gray-500">
                        {isAnnual ? '/year' : '/month'}
                      </div>
                      {isAnnual && plan.savings > 0 && (
                        <div className="text-green-600 font-semibold text-sm">
                          Save ${plan.savings}/year
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 mb-3">Plan Features:</h4>
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">What's Included:</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        {plan.includes.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                      size="lg"
                    >
                      Choose This Plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add-Ons Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
              <h2 className="text-3xl font-bold text-center mb-8">Optional Add-Ons</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {addOns.map((addon, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-lg">{addon.name}</h3>
                      <span className="text-xl font-bold text-blue-600">${addon.price}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{addon.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Add to Plan
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
              <h2 className="text-3xl font-bold text-center mb-8">Why Choose Our Maintenance Plans?</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Extended Equipment Life</h3>
                  <p className="text-gray-600 text-sm">Regular maintenance can extend your system's life by 5-10 years</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Priority Service</h3>
                  <p className="text-gray-600 text-sm">Skip the line with priority scheduling for repairs and emergencies</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wrench className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Repair Discounts</h3>
                  <p className="text-gray-600 text-sm">Save 10-20% on all repair services and replacement parts</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Energy Savings</h3>
                  <p className="text-gray-600 text-sm">Well-maintained systems use up to 15% less energy</p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-gray-50 rounded-2xl p-8 mb-12">
              <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold mb-2">What's included in a maintenance visit?</h3>
                  <p className="text-gray-600 text-sm mb-4">Complete system inspection, cleaning, filter replacement, safety checks, and performance optimization.</p>
                  
                  <h3 className="font-bold mb-2">Can I cancel my plan anytime?</h3>
                  <p className="text-gray-600 text-sm">Yes, you can cancel with 30 days notice. Annual plans are pro-rated for refunds.</p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Do you service all HVAC brands?</h3>
                  <p className="text-gray-600 text-sm mb-4">Yes, we service all major HVAC brands including Ducane, Carrier, Trane, Lennox, and more.</p>
                  
                  <h3 className="font-bold mb-2">What if I need emergency service?</h3>
                  <p className="text-gray-600 text-sm">Maintenance plan members get priority emergency service with reduced rates.</p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Protect Your Investment?</h2>
              <p className="text-xl mb-6 opacity-90">
                Join thousands of satisfied customers who trust us with their HVAC maintenance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  <Phone className="w-5 h-5 mr-2" />
                  Call (403) 613-6014
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-white text-blue-600 hover:bg-gray-100">
                  <Link href="/quote">
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Service
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MaintenancePlansShop;