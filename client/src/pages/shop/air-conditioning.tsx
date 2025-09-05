import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Snowflake, Star, Award, Shield, Zap, CheckCircle, ArrowRight, ShoppingCart, Thermometer } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';

const AirConditioningShop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();

  const handleBuyNow = async (ac: any) => {
    try {
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: ac.price * 100, // Convert to cents
          currency: 'cad',
          description: `${ac.name} Installation`,
          metadata: {
            service: 'ac-purchase',
            model: ac.name,
            price: ac.price.toString()
          }
        }),
      });

      const { clientSecret } = await response.json();
      
      // Store payment data for checkout page
      sessionStorage.setItem('pendingPayment', JSON.stringify({
        clientSecret,
        productId: 'air-conditioning',
        totalAmount: ac.price,
        service: ac.name
      }));
      
      // Redirect to checkout
      window.location.href = '/stripe-checkout';
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const acModels = [
    {
      id: 1,
      name: "Ducane 4AC16L Single Stage",
      category: "single-stage",
      efficiency: "16 SEER",
      price: 5999,
      originalPrice: null,
      image: "/api/placeholder/300/200",
      features: [
        "Single stage compressor",
        "100% capacity cooling",
        "Reliable summer performance",
        "Standard electrical hookup",
        "10-year parts & compressor warranty"
      ],
      specs: {
        capacity: "1.5 - 5 tons",
        efficiency: "16 SEER",
        warranty: "10 years parts & compressor"
      },
      badge: "Good Value",
      popular: false,
      description: "Cost-effective choice for reliable cooling during Calgary summers"
    },
    {
      id: 2,
      name: "Lennox EL18XCV Two Stage",
      category: "two-stage",
      efficiency: "18 SEER",
      price: 7999,
      originalPrice: null,
      image: "/api/placeholder/300/200",
      features: [
        "Two stage compressor operation",
        "Superior humidity removal",
        "Quieter operation",
        "Enhanced comfort control",
        "10-year parts & compressor warranty"
      ],
      specs: {
        capacity: "1.5 - 5 tons",
        efficiency: "18 SEER",
        warranty: "10 years parts & compressor"
      },
      badge: "Most Popular",
      popular: true,
      description: "Significant upgrade in comfort with longer, quieter operation"
    },
    {
      id: 3,
      name: "Lennox SL28XCV Variable Capacity",
      category: "variable-capacity",
      efficiency: "28 SEER",
      price: 12499,
      originalPrice: null,
      image: "/api/placeholder/300/200",
      features: [
        "Variable capacity compressor",
        "Communicating smart thermostat included",
        "Quietest operation available",
        "Ultimate energy efficiency",
        "10-year parts & compressor warranty"
      ],
      specs: {
        capacity: "1.5 - 5 tons",
        efficiency: "28 SEER",
        warranty: "10 years parts & compressor"
      },
      badge: "Premium",
      popular: false,
      description: "The quietest and most energy-efficient central AC available"
    }
  ];

  const filteredACs = selectedCategory === 'all' 
    ? acModels 
    : acModels.filter(ac => ac.category === selectedCategory);

  return (
    <>
      <Helmet>
        <title>Central Air Conditioning Systems - Calgary AC Installation | AfterHours HVAC</title>
        <meta name="description" content="Shop premium central air conditioning systems with professional installation. Choose from single stage, two stage, and variable capacity models." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl">
                  <Snowflake className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900">
                  Central Air Conditioning
                </h1>
              </div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Premium central air conditioning systems with professional installation. Beat Calgary's summer heat with energy-efficient cooling solutions.
              </p>
            </div>

            {/* Category Tabs */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-12">
              <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto bg-white shadow-lg">
                <TabsTrigger value="all">All Models</TabsTrigger>
                <TabsTrigger value="single-stage">Single Stage</TabsTrigger>
                <TabsTrigger value="two-stage">Two Stage</TabsTrigger>
                <TabsTrigger value="variable-capacity">Variable Capacity</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* AC Units Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredACs.map((ac) => (
                <Card key={ac.id} className="relative bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  {ac.badge && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className={`${ac.popular ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'} text-white font-bold`}>
                        {ac.badge}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="relative h-48 bg-gradient-to-br from-blue-100 to-cyan-200">
                    <img 
                      src={ac.image} 
                      alt={ac.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        {ac.efficiency}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">{ac.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-blue-600">${ac.price.toLocaleString()}</span>
                      <span className="text-sm text-gray-500">installed</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{ac.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {ac.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="font-semibold">Capacity:</span>
                          <div className="text-gray-600">{ac.specs.capacity}</div>
                        </div>
                        <div>
                          <span className="font-semibold">Warranty:</span>
                          <div className="text-gray-600">10 years</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="w-full">
                        Learn More
                      </Button>
                      <Button 
                        onClick={() => handleBuyNow(ac)}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Buy Now - ${ac.price.toLocaleString()}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Installation Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
              <h2 className="text-3xl font-bold text-center mb-8">What's Included in Installation</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-blue-600">Standard Installation Includes:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      New outdoor condensing unit
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      New indoor evaporator coil
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      Composite pad installation
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      Standard lineset run (up to 25ft)
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      Electrical hookup from existing disconnect
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      System evacuation and refrigerant charging
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4 text-orange-600">Additional Costs May Apply For:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-orange-200 flex-shrink-0 mt-0.5"></div>
                      Electrical upgrades or new disconnect
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-orange-200 flex-shrink-0 mt-0.5"></div>
                      Lineset runs over 25 feet
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-orange-200 flex-shrink-0 mt-0.5"></div>
                      Complex installation scenarios
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-orange-200 flex-shrink-0 mt-0.5"></div>
                      Ductwork modifications
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
              <h2 className="text-3xl font-bold text-center mb-8">Why Choose Professional AC Installation?</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Thermometer className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Optimal Performance</h3>
                  <p className="text-gray-600">Proper sizing and installation ensures maximum efficiency and comfort for your home.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Energy Savings</h3>
                  <p className="text-gray-600">Professional installation maximizes energy efficiency, reducing your monthly utility bills.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Warranty Protection</h3>
                  <p className="text-gray-600">Professional installation protects your manufacturer warranty and ensures reliable operation.</p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Beat the Summer Heat?</h2>
              <p className="text-xl mb-6 opacity-90">
                Professional installation included with every central air conditioner. Get your free quote today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Call (403) 613-6014
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-white text-blue-600 hover:bg-gray-100">
                  <Link href="/quote">
                    Get Free Quote
                    <ArrowRight className="w-5 h-5 ml-2" />
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

export default AirConditioningShop;