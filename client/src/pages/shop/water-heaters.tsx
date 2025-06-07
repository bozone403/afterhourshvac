import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Droplets, Star, Award, Shield, Zap, CheckCircle, ArrowRight, ShoppingCart, Clock } from 'lucide-react';
import { Link } from 'wouter';

const WaterHeatersShop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const waterHeaterModels = [
    {
      id: 1,
      name: "Power Vented Gas Water Heater",
      category: "tank",
      capacity: "40 Gallon",
      priceRange: "2300 - 3200",
      price: 2300,
      image: "/api/placeholder/300/200",
      features: [
        "Power vented for safety",
        "Side-wall venting capability",
        "Energy efficient operation",
        "Standard tank installation",
        "Connection to existing lines"
      ],
      specs: {
        capacity: "40-50 Gallons",
        recovery: "Fast recovery rate",
        warranty: "6-8 years tank warranty"
      },
      badge: "Standard",
      popular: true,
      description: "Modern standard for safety and reliability with flexible installation"
    },
    {
      id: 2,
      name: "Tankless On-Demand Gas Water Heater",
      category: "tankless",
      capacity: "Unlimited",
      priceRange: "4500 - 6500+",
      price: 4500,
      image: "/api/placeholder/300/200",
      features: [
        "Instant hot water on-demand",
        "Endless hot water supply",
        "Significant energy savings",
        "Compact wall-mounted design",
        "Advanced digital controls"
      ],
      specs: {
        capacity: "Unlimited flow",
        recovery: "Instant heating",
        warranty: "10-15 years warranty"
      },
      badge: "Premium",
      popular: false,
      description: "Heats water instantly with endless supply and energy savings"
    }
  ];

  const filteredHeaters = selectedCategory === 'all' 
    ? waterHeaterModels 
    : waterHeaterModels.filter(heater => heater.category === selectedCategory);

  return (
    <>
      <Helmet>
        <title>Gas Water Heaters - Calgary Installation Service | AfterHours HVAC</title>
        <meta name="description" content="Shop power vented tank and tankless gas water heaters with professional installation. Energy efficient hot water solutions for Calgary homes." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl">
                  <Droplets className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900">
                  Gas Water Heaters
                </h1>
              </div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Reliable hot water solutions for Calgary homes. Choose from efficient tank or space-saving tankless models with professional installation.
              </p>
            </div>

            {/* Category Tabs */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-12">
              <TabsList className="grid grid-cols-3 w-full max-w-lg mx-auto bg-white shadow-lg">
                <TabsTrigger value="all">All Models</TabsTrigger>
                <TabsTrigger value="tank">Tank Models</TabsTrigger>
                <TabsTrigger value="tankless">Tankless</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Water Heater Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {filteredHeaters.map((heater) => (
                <Card key={heater.id} className="relative bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  {heater.badge && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className={`${heater.popular ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-blue-500 to-teal-500'} text-white font-bold`}>
                        {heater.badge}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="relative h-48 bg-gradient-to-br from-blue-100 to-teal-200">
                    <img 
                      src={heater.image} 
                      alt={heater.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        {heater.capacity}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">{heater.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-blue-600">${heater.priceRange}</span>
                      <span className="text-sm text-gray-500">installed</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{heater.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {heater.features.slice(0, 4).map((feature, idx) => (
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
                          <div className="text-gray-600">{heater.specs.capacity}</div>
                        </div>
                        <div>
                          <span className="font-semibold">Recovery:</span>
                          <div className="text-gray-600">{heater.specs.recovery}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="w-full">
                        Learn More
                      </Button>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Get Quote
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Installation Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
              <h2 className="text-3xl font-bold text-center mb-8">Installation Details</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-blue-600">Tank Water Heater Installation:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      New water heater unit
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      Connection to existing water/gas lines
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      Power venting installation
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      Removal and disposal of old tank
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4 text-teal-600">Tankless Installation May Include:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-orange-200 flex-shrink-0 mt-0.5"></div>
                      Specialized venting systems
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-orange-200 flex-shrink-0 mt-0.5"></div>
                      Gas line upgrades for higher BTU
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-orange-200 flex-shrink-0 mt-0.5"></div>
                      Electrical upgrades for power
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-orange-200 flex-shrink-0 mt-0.5"></div>
                      Additional water line modifications
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Benefits Comparison */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
              <h2 className="text-3xl font-bold text-center mb-8">Tank vs Tankless Comparison</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="border border-blue-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-blue-600">Tank Water Heaters</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Lower upfront cost</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Simpler installation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Familiar technology</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-orange-500" />
                      <span>Limited hot water capacity</span>
                    </div>
                  </div>
                </div>
                <div className="border border-teal-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-teal-600">Tankless Water Heaters</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Endless hot water supply</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Space-saving design</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Energy efficient operation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-orange-500" />
                      <span>Higher installation cost</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Need Reliable Hot Water?</h2>
              <p className="text-xl mb-6 opacity-90">
                Professional installation with every water heater. Get your personalized quote today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Call (403) 613-6014
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-white text-blue-600 hover:bg-gray-100">
                  <Link href="/checkout/water-heater-premium">
                    Buy Water Heater
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

export default WaterHeatersShop;