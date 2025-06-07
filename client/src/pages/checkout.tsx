import { useState, useEffect } from "react";
import { useLocation, useRoute, Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { 
  ShoppingCart, 
  ArrowLeft, 
  CheckCircle, 
  CreditCard,
  Shield,
  Truck,
  Phone,
  User,
  Lock
} from "lucide-react";

// Product configurations
const productConfigs = {
  'furnace-premium': {
    name: 'Premium High-Efficiency Furnace',
    price: 7999,
    description: '96% AFUE efficiency rating with advanced features',
    image: '/api/placeholder/300/200',
    features: [
      'Variable-speed blower motor',
      '10-year parts warranty',
      'Smart thermostat compatibility',
      'Professional installation included'
    ],
    category: 'Furnaces'
  },
  'ac-premium': {
    name: 'Premium Central Air Conditioning',
    price: 7499,
    description: '18+ SEER high-efficiency cooling system',
    image: '/api/placeholder/300/200',
    features: [
      'Two-stage compressor',
      '10-year warranty coverage',
      'Wi-Fi enabled thermostat',
      'Professional installation included'
    ],
    category: 'Air Conditioning'
  },
  'water-heater-premium': {
    name: 'Premium Gas Water Heater',
    price: 3200,
    description: 'High-efficiency 50-gallon capacity',
    image: '/api/placeholder/300/200',
    features: [
      'Energy Star certified',
      '12-year warranty',
      'Self-diagnostic system',
      'Professional installation included'
    ],
    category: 'Water Heaters'
  },
  'maintenance-quickshot': {
    name: 'QuickShot Diagnostic',
    price: 199,
    description: '20-point comprehensive HVAC system inspection',
    image: '/api/placeholder/300/200',
    features: [
      'Complete system evaluation',
      'Performance optimization',
      'Detailed report provided',
      'Same-day service available'
    ],
    category: 'Maintenance'
  },
  'maintenance-dominion': {
    name: 'Dominion Annual Plan',
    price: 659,
    description: 'Comprehensive yearly maintenance coverage',
    image: '/api/placeholder/300/200',
    features: [
      'Spring and fall tune-ups',
      '15% discount on repairs',
      'Priority scheduling',
      'Filter replacement included'
    ],
    category: 'Maintenance'
  }
};

const CheckoutPage = () => {
  const [, params] = useRoute("/checkout/:productId");
  const [location, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  
  const productId = params?.productId;
  const product = productId ? productConfigs[productId as keyof typeof productConfigs] : null;

  const maintenanceAddOns = [
    {
      id: 'quickshot',
      name: 'QuickShot Diagnostic',
      price: 199,
      description: 'Post-installation system verification'
    },
    {
      id: 'dominion',
      name: 'Annual Maintenance Plan',
      price: 659,
      description: 'Year-round protection and service'
    }
  ];

  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addOnId) 
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const calculateTotal = () => {
    if (!product) return 0;
    const addOnTotal = selectedAddOns.reduce((total, addOnId) => {
      const addOn = maintenanceAddOns.find(a => a.id === addOnId);
      return total + (addOn?.price || 0);
    }, 0);
    return product.price + addOnTotal;
  };

  const handleProceedToPayment = () => {
    if (!user) {
      // Redirect to login with return URL
      setLocation(`/auth?redirect=/checkout/${productId}`);
    } else {
      // Proceed to payment processing
      setLocation(`/payment/${productId}?addons=${selectedAddOns.join(',')}`);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">The requested product could not be found.</p>
            <Button asChild>
              <Link href="/">Return Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout - {product.name} | AfterHours HVAC</title>
        <meta name="description" content={`Purchase ${product.name} - ${product.description}`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Shop
                  </Link>
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Product Details */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Selected Product */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Your Selection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                        <Badge variant="outline">{product.category}</Badge>
                        <div className="text-2xl font-bold text-blue-600 mt-2">
                          ${product.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold">Included Features:</h4>
                      {product.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Add-On Services (only for equipment, not maintenance) */}
                {product.category !== 'Maintenance' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Add Maintenance Services</CardTitle>
                      <p className="text-sm text-gray-600">
                        Protect your investment with our professional maintenance services
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {maintenanceAddOns.map((addOn) => (
                        <div 
                          key={addOn.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedAddOns.includes(addOn.id) 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleAddOnToggle(addOn.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">{addOn.name}</h4>
                              <p className="text-sm text-gray-600">{addOn.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-blue-600">
                                +${addOn.price}
                              </div>
                              <div className={`w-5 h-5 rounded border-2 ${
                                selectedAddOns.includes(addOn.id)
                                  ? 'bg-blue-600 border-blue-600'
                                  : 'border-gray-300'
                              }`}>
                                {selectedAddOns.includes(addOn.id) && (
                                  <CheckCircle className="w-4 h-4 text-white" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Service Features */}
                <Card>
                  <CardHeader>
                    <CardTitle>Why Choose AfterHours HVAC?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <Truck className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Professional Installation</h4>
                          <p className="text-sm text-gray-600">Licensed technicians with full warranty coverage</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold">24/7 Support</h4>
                          <p className="text-sm text-gray-600">Emergency service available year-round</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Warranty Protection</h4>
                          <p className="text-sm text-gray-600">Comprehensive coverage on all installations</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Quality Guarantee</h4>
                          <p className="text-sm text-gray-600">100% satisfaction guaranteed</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    {/* Main Product */}
                    <div className="flex justify-between">
                      <span>{product.name}</span>
                      <span className="font-semibold">${product.price.toLocaleString()}</span>
                    </div>

                    {/* Selected Add-ons */}
                    {selectedAddOns.map(addOnId => {
                      const addOn = maintenanceAddOns.find(a => a.id === addOnId);
                      return addOn ? (
                        <div key={addOn.id} className="flex justify-between text-sm">
                          <span>{addOn.name}</span>
                          <span>+${addOn.price}</span>
                        </div>
                      ) : null;
                    })}

                    <Separator />
                    
                    {/* Total */}
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-blue-600">${calculateTotal().toLocaleString()}</span>
                    </div>

                    {/* Authentication Status */}
                    {isLoading ? (
                      <div className="bg-gray-100 p-4 rounded-lg text-center">
                        <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                        <p className="text-sm">Checking login status...</p>
                      </div>
                    ) : user ? (
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-800">Logged in as {user.username}</span>
                        </div>
                        <p className="text-xs text-green-700">Ready to complete your purchase</p>
                      </div>
                    ) : (
                      <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="w-4 h-4 text-orange-600" />
                          <span className="text-sm font-semibold text-orange-800">Login Required</span>
                        </div>
                        <p className="text-xs text-orange-700">You'll need to log in to complete your purchase</p>
                      </div>
                    )}

                    {/* Checkout Button */}
                    <Button 
                      onClick={handleProceedToPayment}
                      className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white"
                      size="lg"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      {user ? 'Proceed to Payment' : 'Login & Complete Purchase'}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      Secure checkout powered by Stripe. Your payment information is encrypted and protected.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;