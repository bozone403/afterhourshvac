import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Lock, CheckCircle, Star, Wrench, Snowflake, Flame } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  tier: string;
  features: string[];
  isActive: boolean;
}

interface UserAccess {
  productId: number;
  category: string;
  tier: string;
}

const ProCalculator = () => {
  const { user, isLoading } = useAuth();
  const [selectedCalculator, setSelectedCalculator] = useState<string | null>(null);

  // Fetch available products
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Fetch user's product access
  const { data: userAccess = [] } = useQuery<UserAccess[]>({
    queryKey: ['/api/user/product-access'],
    enabled: !!user,
  });

  const furnaceProducts = products.filter(p => p.category === 'furnace');
  const acProducts = products.filter(p => p.category === 'ac');
  const maintenanceProducts = products.filter(p => p.category === 'maintenance');

  const hasAccess = (category: string, tier: string) => {
    return userAccess.some(access => access.category === category && access.tier === tier);
  };

  const getProductIcon = (category: string) => {
    switch (category) {
      case 'furnace': return <Flame className="h-6 w-6" />;
      case 'ac': return <Snowflake className="h-6 w-6" />;
      case 'maintenance': return <Wrench className="h-6 w-6" />;
      default: return <Calculator className="h-6 w-6" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'economy': return 'bg-blue-500';
      case 'mid_range': return 'bg-purple-500';
      case 'premium': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const hasUserAccess = hasAccess(product.category, product.tier);
    
    return (
      <Card className={`relative border-2 ${hasUserAccess ? 'border-green-500' : 'border-gray-700'} bg-dark`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getProductIcon(product.category)}
              <CardTitle className="text-white">{product.name}</CardTitle>
            </div>
            <Badge className={`${getTierColor(product.tier)} text-white`}>
              {product.tier.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          <CardDescription className="text-lightgray">
            {product.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">${product.price}</span>
              {hasUserAccess && (
                <Badge variant="outline" className="border-green-500 text-green-500">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Owned
                </Badge>
              )}
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-white">Features Included:</h4>
              <ul className="space-y-1">
                {product.features?.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-lightgray">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              <Button 
                onClick={() => setSelectedCalculator(`${product.category}_${product.tier}`)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Open Calculator
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-darkgray border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-white flex items-center justify-center gap-2">
              <Lock className="h-6 w-6" />
              Authentication Required
            </CardTitle>
            <CardDescription className="text-lightgray">
              Please log in to access the Pro Calculator tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth">
              <Button className="w-full bg-primary hover:bg-primary/80">
                Login to Continue
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedCalculator) {
    return (
      <div className="min-h-screen bg-dark">
        <Helmet>
          <title>Pro Calculator | AfterHours HVAC</title>
          <meta name="description" content="Professional HVAC calculation tools for accurate quotes and system sizing" />
        </Helmet>
        
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              onClick={() => setSelectedCalculator(null)}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              ← Back to Calculator Selection
            </Button>
          </div>
          
          <Card className="bg-darkgray border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-center">
                {selectedCalculator.replace('_', ' ').toUpperCase()} Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calculator className="h-24 w-24 mx-auto text-primary mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">Calculator Coming Soon</h3>
                <p className="text-lightgray max-w-2xl mx-auto">
                  This professional calculator is currently under development. It will provide detailed 
                  system sizing, cost estimates, and energy efficiency calculations specific to your 
                  selected tier and system type.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <Helmet>
        <title>Pro Calculator | AfterHours HVAC</title>
        <meta name="description" content="Professional HVAC calculation tools for accurate quotes and system sizing" />
      </Helmet>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-header text-white mb-6">
            Pro Calculator <span className="text-primary">Suite</span>
          </h1>
          <p className="text-xl text-lightgray max-w-3xl mx-auto">
            Professional HVAC calculation tools with detailed pricing, system sizing, and efficiency analysis. 
            Choose your access level for each system type.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="furnace" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-darkgray">
            <TabsTrigger value="furnace" className="data-[state=active]:bg-primary">
              <Flame className="h-4 w-4 mr-2" />
              Furnace Tools
            </TabsTrigger>
            <TabsTrigger value="ac" className="data-[state=active]:bg-primary">
              <Snowflake className="h-4 w-4 mr-2" />
              AC Tools
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="data-[state=active]:bg-primary">
              <Wrench className="h-4 w-4 mr-2" />
              Maintenance Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="furnace" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Furnace Calculator Tools</h2>
              <p className="text-lightgray">
                Professional furnace sizing, efficiency calculations, and cost estimation tools
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {furnaceProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ac" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Air Conditioning Calculator Tools</h2>
              <p className="text-lightgray">
                Cooling load calculations, efficiency analysis, and system recommendations
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {acProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Maintenance Calculator Tools</h2>
              <p className="text-lightgray">
                Service scheduling, cost planning, and maintenance optimization tools
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {maintenanceProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Info Section */}
        <div className="mt-16 text-center">
          <Card className="bg-darkgray border-gray-700 max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-center gap-2">
                <Star className="h-6 w-6 text-primary" />
                Why Choose Our Pro Tools?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="bg-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Calculator className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Accurate Calculations</h3>
                  <p className="text-lightgray text-sm">
                    Industry-standard formulas and up-to-date efficiency ratings
                  </p>
                </div>
                <div>
                  <div className="bg-secondary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Professional Results</h3>
                  <p className="text-lightgray text-sm">
                    Generate detailed reports and quotes for your clients
                  </p>
                </div>
                <div>
                  <div className="bg-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Tiered Access</h3>
                  <p className="text-lightgray text-sm">
                    Choose the level of detail and features that match your needs
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProCalculator;