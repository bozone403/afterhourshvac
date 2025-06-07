import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThermometerSun, Star, Award, Shield, Zap, CheckCircle, ArrowRight, ShoppingCart } from 'lucide-react';
import { Link } from 'wouter';

const FurnacesShop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const furnaceModels = [
    {
      id: 1,
      name: "Ducane 92G1UH Single Stage",
      category: "single-stage",
      efficiency: "92% AFUE",
      price: 5999,
      originalPrice: null,
      image: "/api/placeholder/300/200",
      features: [
        "Single stage gas valve",
        "Reliable on-demand heating",
        "Standard digital thermostat included",
        "Robust no-frills workhorse design",
        "10-year parts warranty"
      ],
      specs: {
        btuh: "40,000 - 120,000",
        efficiency: "92% AFUE",
        warranty: "10 years parts warranty"
      },
      badge: "Good Value",
      popular: false,
      description: "Perfect for budget-conscious clients or rental properties"
    },
    {
      id: 2,
      name: "Lennox EL296V Two Stage",
      category: "two-stage",
      efficiency: "96% AFUE",
      price: 7500,
      originalPrice: null,
      image: "/api/placeholder/300/200",
      features: [
        "Two stage gas valve operation",
        "Variable speed ECM blower motor",
        "Quiet low-stage operation",
        "Enhanced comfort and efficiency",
        "20-year heat exchanger warranty"
      ],
      specs: {
        btuh: "40,000 - 120,000",
        efficiency: "96% AFUE",
        warranty: "10 years parts, 20 years heat exchanger"
      },
      badge: "Most Popular",
      popular: true,
      description: "The new standard for modern homes with balanced temperatures"
    },
    {
      id: 3,
      name: "Lennox SLP98V Modulating",
      category: "modulating",
      efficiency: "98% AFUE",
      price: 11999,
      originalPrice: null,
      image: "/api/placeholder/300/200",
      features: [
        "Modulating gas valve (1% increments)",
        "Communicating smart thermostat included",
        "Quietest operation available",
        "Precise temperature control",
        "Lifetime heat exchanger warranty"
      ],
      specs: {
        btuh: "40,000 - 120,000",
        efficiency: "98% AFUE",
        warranty: "10 years parts, lifetime heat exchanger"
      },
      badge: "Premium",
      popular: false,
      description: "The pinnacle of heating technology for ultimate comfort"
    }
  ];

  const filteredFurnaces = selectedCategory === 'all' 
    ? furnaceModels 
    : furnaceModels.filter(furnace => furnace.category === selectedCategory);

  return (
    <>
      <Helmet>
        <title>High-Efficiency Furnaces - Shop Ducane Models | AfterHours HVAC</title>
        <meta name="description" content="Shop premium Ducane furnaces including single stage, two stage, modulating, and communicating models. Professional installation included." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl">
                  <ThermometerSun className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900">
                  High-Efficiency Furnaces
                </h1>
              </div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Premium Ducane furnaces with professional installation. Choose from single stage, two stage, modulating, and communicating models for maximum comfort and efficiency.
              </p>
            </div>

            {/* Category Tabs */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-12">
              <TabsList className="grid grid-cols-5 w-full max-w-2xl mx-auto bg-white shadow-lg">
                <TabsTrigger value="all">All Models</TabsTrigger>
                <TabsTrigger value="single-stage">Single Stage</TabsTrigger>
                <TabsTrigger value="two-stage">Two Stage</TabsTrigger>
                <TabsTrigger value="modulating">Modulating</TabsTrigger>
                <TabsTrigger value="communicating">Communicating</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Furnace Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredFurnaces.map((furnace) => (
                <Card key={furnace.id} className="relative bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  {furnace.badge && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className={`${furnace.popular ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'} text-white font-bold`}>
                        {furnace.badge}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                    <img 
                      src={furnace.image} 
                      alt={furnace.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        {furnace.efficiency}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">{furnace.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-blue-600">${furnace.price.toLocaleString()}</span>
                      {furnace.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">${furnace.originalPrice}</span>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {furnace.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="font-semibold">BTU/H:</span>
                          <div className="text-gray-600">{furnace.specs.btuh}</div>
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
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Buy Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Benefits Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
              <h2 className="text-3xl font-bold text-center mb-8">Why Choose Ducane Furnaces?</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
                  <p className="text-gray-600">Built with the highest quality materials and advanced engineering for lasting performance.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Energy Efficient</h3>
                  <p className="text-gray-600">High-efficiency ratings mean lower energy bills and reduced environmental impact.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Comprehensive Warranty</h3>
                  <p className="text-gray-600">Industry-leading warranty coverage for peace of mind and protection of your investment.</p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Upgrade Your Heating?</h2>
              <p className="text-xl mb-6 opacity-90">
                Get professional installation with every furnace purchase. Call us today for a free consultation.
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

export default FurnacesShop;