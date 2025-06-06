import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Download, Upload, Search, Calculator, DollarSign, Package } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

// Alggin.com multiplier rates provided by user
const MULTIPLIER_RATES: { [key: string]: number } = {
  'Residential': 0.625,
  'Commercial': 0.616,
  'Spiral': 0.353,
  'B-Vent': 0.610,
  'Venting': 0.618,
  'Flexible Pipe': 0.618,
  'Grilles/Registers/Diffusers': 0.600,
  'Tools': 0.600,
  'Fans': 0.600,
  'Louvers & Dampers': 0.600,
  'Miscellaneous': 0.600,
  'Heating & Cooling - Commercial': 0.525,
  'Heating & Cooling - Residential': 0.525,
};

interface AlgginProduct {
  id: string;
  name: string;
  category: string;
  partNumber: string;
  listPrice: number;
  yourCost?: number;
  markup?: number;
  customerPrice?: number;
  description?: string;
  specifications?: any;
  availability?: string;
  manufacturer?: string;
}

const AlgginDataPage = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<AlgginProduct[]>([]);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch alggin.com data
  const fetchAlgginData = useMutation({
    mutationFn: async (category: string) => {
      const response = await apiRequest('POST', '/api/fetch-alggin-data', { category });
      return response.json();
    },
    onSuccess: (data) => {
      const processedProducts = data.products.map((product: any) => {
        const multiplier = MULTIPLIER_RATES[data.category] || 0.60;
        const yourCost = product.listPrice * multiplier;
        const markup = 35; // Default 35% markup
        const customerPrice = yourCost * (1 + markup / 100);
        
        return {
          ...product,
          yourCost,
          markup,
          customerPrice,
          category: data.category
        };
      });
      
      setProducts(prev => [...prev, ...processedProducts]);
      setProcessedCount(prev => prev + processedProducts.length);
      toast({ title: `Processed ${processedProducts.length} products from ${data.category}` });
    },
    onError: () => {
      toast({ title: 'Failed to fetch data', variant: 'destructive' });
    }
  });

  // Save processed data to database
  const saveToDatabase = useMutation({
    mutationFn: async (products: AlgginProduct[]) => {
      const response = await apiRequest('POST', '/api/save-alggin-products', { products });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Products saved to database successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to save products', variant: 'destructive' });
    }
  });

  const processAllCategories = async () => {
    setIsProcessing(true);
    setProducts([]);
    setProcessedCount(0);
    setTotalProducts(Object.keys(MULTIPLIER_RATES).length);

    for (const category of Object.keys(MULTIPLIER_RATES)) {
      try {
        await fetchAlgginData.mutateAsync(category);
        // Add delay to prevent overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to process category: ${category}`, error);
      }
    }
    
    setIsProcessing(false);
  };

  const calculatePricing = (listPrice: number, category: string, customMarkup?: number) => {
    const multiplier = MULTIPLIER_RATES[category] || 0.60;
    const yourCost = listPrice * multiplier;
    const markup = customMarkup || 35;
    const customerPrice = yourCost * (1 + markup / 100);
    
    return { yourCost, customerPrice, markup };
  };

  const exportToCSV = () => {
    const headers = ['Part Number', 'Name', 'Category', 'List Price', 'Your Cost', 'Markup %', 'Customer Price', 'Profit Margin'];
    const csvData = products.map(product => [
      product.partNumber,
      product.name,
      product.category,
      product.listPrice.toFixed(2),
      product.yourCost?.toFixed(2) || '',
      product.markup?.toString() || '',
      product.customerPrice?.toFixed(2) || '',
      ((product.customerPrice! - product.yourCost!) / product.customerPrice! * 100).toFixed(1) + '%'
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `afterhours-hvac-alggin-pricing-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({ title: 'Pricing data exported successfully' });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.partNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-darkgray border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Access Denied</CardTitle>
            <CardDescription className="text-lightgray">
              Admin access required
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <Helmet>
        <title>Alggin.com Data Integration | AfterHours HVAC</title>
        <meta name="description" content="Integrate supplier data from alggin.com with automated pricing calculations" />
      </Helmet>
      
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-header text-white mb-6">
            Alggin.com <span className="text-primary">Data Integration</span>
          </h1>
          <p className="text-xl text-lightgray max-w-3xl mx-auto">
            Import supplier data from alggin.com and automatically calculate your costs using configured multiplier rates
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Multiplier Rates Display */}
        <Card className="mb-8 bg-darkgray border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Your Multiplier Rates
            </CardTitle>
            <CardDescription>
              These rates are applied to alggin.com list prices to calculate your costs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(MULTIPLIER_RATES).map(([category, rate]) => (
                <div key={category} className="bg-dark p-3 rounded-lg border border-gray-700">
                  <div className="text-sm text-lightgray mb-1">{category}</div>
                  <div className="text-lg font-bold text-primary">{(rate * 100).toFixed(1)}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Control Panel */}
        <Card className="mb-8 bg-darkgray border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Data Processing Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={processAllCategories}
                disabled={isProcessing}
                className="bg-primary hover:bg-primary/80"
              >
                <Download className="h-4 w-4 mr-2" />
                {isProcessing ? 'Processing...' : 'Import All Categories'}
              </Button>
              
              <Button 
                onClick={() => saveToDatabase.mutate(products)}
                disabled={products.length === 0 || saveToDatabase.isPending}
                className="bg-secondary hover:bg-secondary/80"
              >
                <Upload className="h-4 w-4 mr-2" />
                Save to Database
              </Button>
              
              <Button 
                onClick={exportToCSV}
                disabled={products.length === 0}
                variant="outline"
                className="border-gray-600"
              >
                <Package className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-lightgray">Processing categories...</span>
                  <span className="text-white">{processedCount} products processed</span>
                </div>
                <Progress value={(processedCount / Math.max(totalProducts * 50, 1)) * 100} className="w-full" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-8 bg-darkgray border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Filter Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="search">Search Products</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="search"
                    placeholder="Search by name or part number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-dark border-gray-600"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Filter by Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-dark border-gray-600">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {Object.keys(MULTIPLIER_RATES).map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Display */}
        <Card className="bg-darkgray border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Product Pricing ({filteredProducts.length} items)</span>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Total Value: ${filteredProducts.reduce((sum, p) => sum + (p.customerPrice || 0), 0).toLocaleString()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredProducts.map((product, index) => (
                <div key={`${product.id}-${index}`} className="bg-dark p-4 rounded-lg border border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-center">
                    <div className="lg:col-span-2">
                      <div className="font-semibold text-white">{product.name}</div>
                      <div className="text-sm text-lightgray">{product.partNumber}</div>
                      <Badge variant="outline" className="mt-1 text-xs">{product.category}</Badge>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs text-lightgray">List Price</div>
                      <div className="font-semibold text-white">${product.listPrice.toFixed(2)}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs text-lightgray">Your Cost</div>
                      <div className="font-semibold text-secondary">${product.yourCost?.toFixed(2)}</div>
                      <div className="text-xs text-lightgray">
                        ({(MULTIPLIER_RATES[product.category] * 100).toFixed(1)}%)
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs text-lightgray">Customer Price</div>
                      <div className="font-semibold text-primary">${product.customerPrice?.toFixed(2)}</div>
                      <div className="text-xs text-lightgray">+{product.markup}% markup</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs text-lightgray">Profit</div>
                      <div className="font-semibold text-green-400">
                        ${((product.customerPrice! - product.yourCost!)).toFixed(2)}
                      </div>
                      <div className="text-xs text-lightgray">
                        {(((product.customerPrice! - product.yourCost!) / product.customerPrice!) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-8 text-lightgray">
                  {products.length === 0 ? 'No products imported yet. Click "Import All Categories" to get started.' : 'No products match your current filters.'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AlgginDataPage;