import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Calculator, Plus, Minus, DollarSign, Percent, ShoppingCart } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface MaterialItem {
  id: string;
  name: string;
  category: string;
  partNumber: string;
  supplier: string;
  unitCost: number;
  customerPrice: number;
  unit: string;
  quantity: number;
  adjustedPrice?: number;
}

interface JobEstimate {
  materials: MaterialItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  total: number;
  laborCost: number;
  laborHours: number;
  laborRate: number;
}

const MULTIPLIER_RATES = {
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
  'Heating & Cooling Commercial': 0.525,
  'Heating & Cooling Residential': 0.525
};

const MaterialEstimator = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('Residential');
  const [searchTerm, setSearchTerm] = useState('');
  const [jobEstimate, setJobEstimate] = useState<JobEstimate>({
    materials: [],
    subtotal: 0,
    discountPercent: 0,
    discountAmount: 0,
    taxPercent: 8.25,
    taxAmount: 0,
    total: 0,
    laborCost: 0,
    laborHours: 0,
    laborRate: 85
  });

  // Fetch alggin data
  const { data: algginData, isLoading } = useQuery({
    queryKey: ['/api/fetch-alggin-data', selectedCategory],
    queryFn: async () => {
      const response = await apiRequest('POST', '/api/fetch-alggin-data', { category: selectedCategory });
      return response.json();
    }
  });

  const addMaterial = (material: any) => {
    const multiplier = MULTIPLIER_RATES[selectedCategory as keyof typeof MULTIPLIER_RATES] || 0.60;
    const newMaterial: MaterialItem = {
      id: `${material.partNumber}-${Date.now()}`,
      name: material.name,
      category: selectedCategory,
      partNumber: material.partNumber,
      supplier: 'Alggin',
      unitCost: material.yourCost || 0,
      customerPrice: material.customerPrice || (material.yourCost / multiplier),
      unit: 'each',
      quantity: 1,
      adjustedPrice: material.customerPrice || (material.yourCost / multiplier)
    };

    setJobEstimate(prev => ({
      ...prev,
      materials: [...prev.materials, newMaterial]
    }));

    toast({
      title: "Material Added",
      description: `${material.name} added to estimate`
    });
  };

  const updateMaterialQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeMaterial(id);
      return;
    }

    setJobEstimate(prev => ({
      ...prev,
      materials: prev.materials.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    }));
  };

  const updateMaterialPrice = (id: string, price: number) => {
    setJobEstimate(prev => ({
      ...prev,
      materials: prev.materials.map(item =>
        item.id === id ? { ...item, adjustedPrice: price } : item
      )
    }));
  };

  const removeMaterial = (id: string) => {
    setJobEstimate(prev => ({
      ...prev,
      materials: prev.materials.filter(item => item.id !== id)
    }));
  };

  const updateDiscount = (percent: number) => {
    setJobEstimate(prev => ({
      ...prev,
      discountPercent: percent
    }));
  };

  const updateLaborHours = (hours: number) => {
    setJobEstimate(prev => ({
      ...prev,
      laborHours: hours,
      laborCost: hours * prev.laborRate
    }));
  };

  const updateLaborRate = (rate: number) => {
    setJobEstimate(prev => ({
      ...prev,
      laborRate: rate,
      laborCost: prev.laborHours * rate
    }));
  };

  // Calculate totals
  useEffect(() => {
    const subtotal = jobEstimate.materials.reduce((sum, item) => 
      sum + ((item.adjustedPrice || item.customerPrice) * item.quantity), 0
    ) + jobEstimate.laborCost;

    const discountAmount = subtotal * (jobEstimate.discountPercent / 100);
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * (jobEstimate.taxPercent / 100);
    const total = afterDiscount + taxAmount;

    setJobEstimate(prev => ({
      ...prev,
      subtotal,
      discountAmount,
      taxAmount,
      total
    }));
  }, [jobEstimate.materials, jobEstimate.discountPercent, jobEstimate.taxPercent, jobEstimate.laborCost]);

  const filteredMaterials = algginData?.products?.filter((material: any) =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.partNumber.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <>
      <Helmet>
        <title>Material Cost Estimator | AfterHours HVAC</title>
        <meta name="description" content="Calculate accurate job costs with real supplier pricing and custom multipliers for on-site estimates." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Calculator className="h-10 w-10 text-blue-400" />
              Material Cost Estimator
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Professional job costing with real Alggin.com pricing and your custom multipliers
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Material Selection */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Material Selection</CardTitle>
                  <CardDescription>Choose category and add materials to your estimate</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="bg-slate-900 border-slate-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(MULTIPLIER_RATES).map(category => (
                            <SelectItem key={category} value={category}>
                              {category} ({(MULTIPLIER_RATES[category as keyof typeof MULTIPLIER_RATES] * 100).toFixed(1)}% multiplier)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="search">Search Materials</Label>
                      <Input
                        id="search"
                        placeholder="Search by name or part number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-slate-900 border-slate-600"
                      />
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                      <p className="mt-2 text-slate-400">Loading materials...</p>
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto space-y-2">
                      {filteredMaterials.map((material: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-600">
                          <div className="flex-1">
                            <h4 className="font-medium text-white">{material.name}</h4>
                            <p className="text-sm text-slate-400">Part: {material.partNumber}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-green-400">
                                Cost: ${material.yourCost?.toFixed(2) || '0.00'}
                              </span>
                              <span className="text-sm text-blue-400">
                                Price: ${material.customerPrice?.toFixed(2) || '0.00'}
                              </span>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => addMaterial(material)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Job Estimate */}
            <div>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Job Estimate
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Materials List */}
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {jobEstimate.materials.map((item) => (
                      <div key={item.id} className="p-3 bg-slate-900/50 rounded border border-slate-600">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-white text-sm">{item.name}</h5>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => removeMaterial(item.id)}
                            className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">Quantity</Label>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateMaterialQuantity(item.id, parseInt(e.target.value) || 0)}
                              className="bg-slate-800 border-slate-600 h-8 text-sm"
                              min="1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Price</Label>
                            <Input
                              type="number"
                              value={item.adjustedPrice || item.customerPrice}
                              onChange={(e) => updateMaterialPrice(item.id, parseFloat(e.target.value) || 0)}
                              className="bg-slate-800 border-slate-600 h-8 text-sm"
                              step="0.01"
                            />
                          </div>
                        </div>
                        
                        <div className="text-right mt-2">
                          <span className="text-sm font-medium text-blue-400">
                            ${((item.adjustedPrice || item.customerPrice) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-slate-600" />

                  {/* Labor */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Labor</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Hours</Label>
                        <Input
                          type="number"
                          value={jobEstimate.laborHours}
                          onChange={(e) => updateLaborHours(parseFloat(e.target.value) || 0)}
                          className="bg-slate-900 border-slate-600 h-8"
                          step="0.5"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Rate/Hour</Label>
                        <Input
                          type="number"
                          value={jobEstimate.laborRate}
                          onChange={(e) => updateLaborRate(parseFloat(e.target.value) || 0)}
                          className="bg-slate-900 border-slate-600 h-8"
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-blue-400">
                        Labor: ${jobEstimate.laborCost.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Separator className="bg-slate-600" />

                  {/* Pricing Adjustments */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Adjustments</h4>
                    <div>
                      <Label className="text-xs">Discount %</Label>
                      <Input
                        type="number"
                        value={jobEstimate.discountPercent}
                        onChange={(e) => updateDiscount(parseFloat(e.target.value) || 0)}
                        className="bg-slate-900 border-slate-600 h-8"
                        step="0.1"
                        max="100"
                      />
                    </div>
                  </div>

                  <Separator className="bg-slate-600" />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Subtotal:</span>
                      <span className="text-white">${jobEstimate.subtotal.toFixed(2)}</span>
                    </div>
                    {jobEstimate.discountAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Discount:</span>
                        <span className="text-red-400">-${jobEstimate.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Tax ({jobEstimate.taxPercent}%):</span>
                      <span className="text-white">${jobEstimate.taxAmount.toFixed(2)}</span>
                    </div>
                    <Separator className="bg-slate-600" />
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-white">Total:</span>
                      <span className="text-green-400">${jobEstimate.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 mt-4"
                    disabled={jobEstimate.materials.length === 0}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Process Payment
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MaterialEstimator;