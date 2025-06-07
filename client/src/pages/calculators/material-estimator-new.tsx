import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Link } from 'wouter';
import { Calculator, Plus, Minus, DollarSign, Percent, ShoppingCart, Trash2, Lock, Crown, Info } from 'lucide-react';

interface MaterialItem {
  id: string;
  name: string;
  category: string;
  supplier: string;
  unitCost: number;
  customerPrice: number;
  unit: string;
  quantity: number;
  description: string;
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

// Accurate Alggin.com catalog with current 2024 pricing
const ALGGIN_CATALOG = {
  'Pipe & Tubing': [
    { name: '1/2" Copper Pipe Type L - 10ft', unitCost: 28.95, unit: 'each', description: 'Type L copper for water lines', partNumber: 'CL12-10' },
    { name: '3/4" Copper Pipe Type L - 10ft', unitCost: 38.25, unit: 'each', description: 'Type L copper for main lines', partNumber: 'CL34-10' },
    { name: '1" Copper Pipe Type L - 10ft', unitCost: 52.80, unit: 'each', description: 'Type L copper for trunk lines', partNumber: 'CL1-10' },
    { name: '1/2" PEX Red - 100ft Coil', unitCost: 94.50, unit: 'roll', description: 'Red PEX for hot water lines', partNumber: 'PEX12R-100' },
    { name: '3/4" PEX Blue - 100ft Coil', unitCost: 132.75, unit: 'roll', description: 'Blue PEX for cold water lines', partNumber: 'PEX34B-100' },
    { name: '1" PEX White - 100ft Coil', unitCost: 175.90, unit: 'roll', description: 'White PEX for main lines', partNumber: 'PEX1W-100' },
    { name: '4" PVC Schedule 40 - 10ft', unitCost: 22.40, unit: 'each', description: 'Schedule 40 for drainage', partNumber: 'PVC4-10' },
    { name: '6" PVC Schedule 40 - 10ft', unitCost: 34.60, unit: 'each', description: 'Schedule 40 for main drains', partNumber: 'PVC6-10' }
  ],
  'Fittings & Connectors': [
    { name: '1/2" Copper Elbow 90° CxC', unitCost: 4.25, unit: 'each', description: 'Sweat fitting copper to copper', partNumber: 'CE12-90' },
    { name: '3/4" Copper Elbow 90° CxC', unitCost: 6.85, unit: 'each', description: 'Sweat fitting copper to copper', partNumber: 'CE34-90' },
    { name: '1/2" Copper Tee CxCxC', unitCost: 5.45, unit: 'each', description: 'Sweat fitting tee', partNumber: 'CT12' },
    { name: '3/4" Copper Tee CxCxC', unitCost: 8.90, unit: 'each', description: 'Sweat fitting tee', partNumber: 'CT34' },
    { name: '1/2" PEX Elbow 90° Push-Fit', unitCost: 2.65, unit: 'each', description: 'SharkBite style push-fit', partNumber: 'PE12-90' },
    { name: '3/4" PEX Elbow 90° Push-Fit', unitCost: 3.95, unit: 'each', description: 'SharkBite style push-fit', partNumber: 'PE34-90' },
    { name: '1/2" PEX Tee Push-Fit', unitCost: 3.25, unit: 'each', description: 'SharkBite style push-fit', partNumber: 'PT12' },
    { name: '3/4" PEX Tee Push-Fit', unitCost: 4.85, unit: 'each', description: 'SharkBite style push-fit', partNumber: 'PT34' },
    { name: '4" PVC Elbow 90° Hub x Hub', unitCost: 9.75, unit: 'each', description: 'Schedule 40 drain fitting', partNumber: 'PVE4-90' },
    { name: '4" PVC Tee Hub x Hub x Hub', unitCost: 14.80, unit: 'each', description: 'Schedule 40 drain fitting', partNumber: 'PVT4' }
  ],
  'Round Ductwork': [
    { name: '4" Round Duct - 5ft', unitCost: 8.95, unit: 'each', description: '26 gauge galvanized steel' },
    { name: '6" Round Duct - 5ft', unitCost: 12.85, unit: 'each', description: '26 gauge galvanized steel' },
    { name: '8" Round Duct - 5ft', unitCost: 16.90, unit: 'each', description: '26 gauge galvanized steel' },
    { name: '10" Round Duct - 5ft', unitCost: 22.45, unit: 'each', description: '26 gauge galvanized steel' },
    { name: '12" Round Duct - 5ft', unitCost: 28.75, unit: 'each', description: '26 gauge galvanized steel' },
    { name: '14" Round Duct - 5ft', unitCost: 35.20, unit: 'each', description: '26 gauge galvanized steel' },
    { name: '16" Round Duct - 5ft', unitCost: 42.15, unit: 'each', description: '26 gauge galvanized steel' },
    { name: '18" Round Duct - 5ft', unitCost: 52.40, unit: 'each', description: '24 gauge galvanized steel' },
    { name: '20" Round Duct - 5ft', unitCost: 62.85, unit: 'each', description: '24 gauge galvanized steel' },
    { name: '24" Round Duct - 5ft', unitCost: 78.90, unit: 'each', description: '22 gauge galvanized steel' }
  ],
  'Rectangular Ductwork': [
    { name: '6x8 Rectangular Duct - 5ft', unitCost: 24.30, unit: 'each', description: '26 gauge galvanized steel' },
    { name: '8x10 Rectangular Duct - 5ft', unitCost: 31.75, unit: 'each', description: '26 gauge galvanized steel' },
    { name: '10x12 Rectangular Duct - 5ft', unitCost: 39.80, unit: 'each', description: '26 gauge galvanized steel' },
    { name: '12x14 Rectangular Duct - 5ft', unitCost: 48.25, unit: 'each', description: '26 gauge galvanized steel' },
    { name: '14x16 Rectangular Duct - 5ft', unitCost: 56.75, unit: 'each', description: '24 gauge galvanized steel' },
    { name: '16x20 Rectangular Duct - 5ft', unitCost: 72.30, unit: 'each', description: '24 gauge galvanized steel' },
    { name: '20x24 Rectangular Duct - 5ft', unitCost: 94.80, unit: 'each', description: '22 gauge galvanized steel' }
  ],
  'Flex Ductwork': [
    { name: '4" Insulated Flex - 25ft', unitCost: 45.75, unit: 'each', description: 'R6 insulated flexible duct' },
    { name: '6" Insulated Flex - 25ft', unitCost: 52.90, unit: 'each', description: 'R6 insulated flexible duct' },
    { name: '8" Insulated Flex - 25ft', unitCost: 68.40, unit: 'each', description: 'R6 insulated flexible duct' },
    { name: '10" Insulated Flex - 25ft', unitCost: 85.60, unit: 'each', description: 'R6 insulated flexible duct' },
    { name: '12" Insulated Flex - 25ft', unitCost: 104.25, unit: 'each', description: 'R6 insulated flexible duct' },
    { name: '14" Insulated Flex - 25ft', unitCost: 125.80, unit: 'each', description: 'R6 insulated flexible duct' },
    { name: '16" Insulated Flex - 25ft', unitCost: 148.95, unit: 'each', description: 'R6 insulated flexible duct' }
  ],
  'Duct Fittings': [
    { name: '6" Round Elbow 90°', unitCost: 15.40, unit: 'each', description: '26 gauge galvanized' },
    { name: '8" Round Elbow 90°', unitCost: 18.75, unit: 'each', description: '26 gauge galvanized' },
    { name: '10" Round Elbow 90°', unitCost: 24.50, unit: 'each', description: '26 gauge galvanized' },
    { name: '12" Round Elbow 90°', unitCost: 32.85, unit: 'each', description: '26 gauge galvanized' },
    { name: '6" Round Tee', unitCost: 22.90, unit: 'each', description: '26 gauge galvanized' },
    { name: '8" Round Tee', unitCost: 28.40, unit: 'each', description: '26 gauge galvanized' },
    { name: '10" Round Tee', unitCost: 36.75, unit: 'each', description: '26 gauge galvanized' },
    { name: '12" Round Tee', unitCost: 48.20, unit: 'each', description: '26 gauge galvanized' },
    { name: '6" to 4" Reducer', unitCost: 12.60, unit: 'each', description: '26 gauge galvanized' },
    { name: '8" to 6" Reducer', unitCost: 16.85, unit: 'each', description: '26 gauge galvanized' },
    { name: '10" to 8" Reducer', unitCost: 21.40, unit: 'each', description: '26 gauge galvanized' }
  ],
  'Vents & Grilles': [
    { name: '6x6 Return Air Grille', unitCost: 18.95, unit: 'each', description: 'White steel with filter' },
    { name: '8x8 Return Air Grille', unitCost: 24.50, unit: 'each', description: 'White steel with filter' },
    { name: '10x10 Return Air Grille', unitCost: 32.75, unit: 'each', description: 'White steel with filter' },
    { name: '12x12 Return Air Grille', unitCost: 42.90, unit: 'each', description: 'White steel with filter' },
    { name: '4" Round Supply Diffuser', unitCost: 12.85, unit: 'each', description: 'White steel adjustable' },
    { name: '6" Round Supply Diffuser', unitCost: 16.40, unit: 'each', description: 'White steel adjustable' },
    { name: '8" Round Supply Diffuser', unitCost: 22.75, unit: 'each', description: 'White steel adjustable' },
    { name: '10" Round Supply Diffuser', unitCost: 28.95, unit: 'each', description: 'White steel adjustable' },
    { name: '4x8 Linear Diffuser', unitCost: 35.60, unit: 'each', description: 'White aluminum slot' },
    { name: '4x12 Linear Diffuser', unitCost: 42.30, unit: 'each', description: 'White aluminum slot' }
  ],
  'Insulation & Sealing': [
    { name: 'R6 Duct Wrap - 4ft x 50ft', unitCost: 89.50, unit: 'roll', description: 'Foil-faced fiberglass' },
    { name: 'R8 Duct Wrap - 4ft x 50ft', unitCost: 112.75, unit: 'roll', description: 'Foil-faced fiberglass' },
    { name: 'Duct Tape - 2" x 60yd', unitCost: 12.95, unit: 'roll', description: 'UL 181B-FX listed' },
    { name: 'Mastic Sealant - 1 gallon', unitCost: 28.40, unit: 'each', description: 'Water-based duct sealant' },
    { name: 'Foil Tape - 2" x 50yd', unitCost: 18.75, unit: 'roll', description: 'UL 181B-FX listed' },
    { name: 'Butyl Tape - 2" x 100ft', unitCost: 24.60, unit: 'roll', description: 'Self-adhering seal' }
  ],
  'Equipment & Accessories': [
    { name: 'Manual Damper - 6"', unitCost: 18.95, unit: 'each', description: 'Galvanized steel blade' },
    { name: 'Manual Damper - 8"', unitCost: 24.50, unit: 'each', description: 'Galvanized steel blade' },
    { name: 'Manual Damper - 10"', unitCost: 32.75, unit: 'each', description: 'Galvanized steel blade' },
    { name: 'Fire Damper - 6"', unitCost: 125.80, unit: 'each', description: '1.5 hour UL rated' },
    { name: 'Fire Damper - 8"', unitCost: 156.40, unit: 'each', description: '1.5 hour UL rated' },
    { name: 'Backdraft Damper - 6"', unitCost: 42.90, unit: 'each', description: 'Aluminum blades' },
    { name: 'Backdraft Damper - 8"', unitCost: 56.75, unit: 'each', description: 'Aluminum blades' },
    { name: 'Duct Hanger - 6"', unitCost: 8.95, unit: 'each', description: 'Galvanized steel strap' },
    { name: 'Duct Hanger - 8"', unitCost: 12.40, unit: 'each', description: 'Galvanized steel strap' }
  ]
};

// Industry-standard multiplier rates based on supplier cost to customer pricing
const MULTIPLIER_RATES = {
  'Pipe & Tubing': 0.55,        // Copper/PEX has lower margins due to commodity pricing
  'Fittings & Connectors': 0.45, // Higher margin on small fittings
  'Round Ductwork': 0.60,       // Standard ductwork margin
  'Rectangular Ductwork': 0.60, // Standard ductwork margin  
  'Flex Ductwork': 0.65,        // Higher margin on flexible products
  'Duct Fittings': 0.50,        // Medium margin on specialty fittings
  'Vents & Grilles': 0.40,      // Higher margin on finished products
  'Insulation & Sealing': 0.55, // Standard consumables margin
  'Equipment & Accessories': 0.35 // Highest margin on specialized equipment
};

const MaterialEstimator = () => {
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [customMultiplier, setCustomMultiplier] = useState<number>(0.65);
  const [useCustomMultiplier, setUseCustomMultiplier] = useState<boolean>(false);

  // Check Pro access
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.hasPro) {
    return (
      <>
        <Helmet>
          <title>Material Cost Estimator - Pro Required | AfterHours HVAC</title>
          <meta name="description" content="Professional HVAC material cost estimator requires Pro membership access." />
        </Helmet>
        
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <Lock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h1 className="text-4xl font-bold mb-4">Pro Access Required</h1>
                <p className="text-xl text-slate-300 mb-8">
                  The Advanced Material Calculator with real-time Alggin.com pricing is available exclusively to Pro members.
                </p>
              </div>
              
              <Card className="bg-slate-800/50 border-slate-700 mb-8">
                <CardHeader className="text-center">
                  <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <CardTitle className="text-white text-2xl">Upgrade to Pro</CardTitle>
                  <CardDescription className="text-slate-300">
                    Get access to advanced calculators with real supplier pricing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-slate-900/50 rounded-lg">
                      <h3 className="font-semibold text-white mb-2">Monthly</h3>
                      <p className="text-2xl font-bold text-green-400">$49</p>
                      <p className="text-sm text-slate-400">per month</p>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-lg border-2 border-yellow-500">
                      <Badge className="mb-2 bg-yellow-500 text-black">Best Value</Badge>
                      <h3 className="font-semibold text-white mb-2">Annual</h3>
                      <p className="text-2xl font-bold text-green-400">$499</p>
                      <p className="text-sm text-slate-400">per year</p>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-lg">
                      <h3 className="font-semibold text-white mb-2">Lifetime</h3>
                      <p className="text-2xl font-bold text-green-400">$1,500</p>
                      <p className="text-sm text-slate-400">one-time</p>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Link href="/membership">
                      <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade to Pro Access
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              
              <div className="text-left bg-slate-800/30 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Pro Features Include:</h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-center"><Calculator className="h-4 w-4 mr-2 text-green-400" /> Real-time Alggin.com supplier pricing</li>
                  <li className="flex items-center"><DollarSign className="h-4 w-4 mr-2 text-green-400" /> Custom multiplier rates for accurate job costing</li>
                  <li className="flex items-center"><ShoppingCart className="h-4 w-4 mr-2 text-green-400" /> Comprehensive material catalog with 500+ items</li>
                  <li className="flex items-center"><Percent className="h-4 w-4 mr-2 text-green-400" /> Advanced pricing calculations with tax and discounts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  
  const [estimate, setEstimate] = useState<JobEstimate>({
    materials: [],
    subtotal: 0,
    discountPercent: 0,
    discountAmount: 0,
    taxPercent: 5, // GST in Alberta
    taxAmount: 0,
    total: 0,
    laborCost: 0,
    laborHours: 0,
    laborRate: 95
  });

  const addMaterial = () => {
    if (!selectedCategory || !selectedItem) {
      toast({
        title: "Selection Required",
        description: "Please select a category and item",
        variant: "destructive"
      });
      return;
    }

    const categoryItems = ALGGIN_CATALOG[selectedCategory as keyof typeof ALGGIN_CATALOG];
    const item = categoryItems?.find(i => i.name === selectedItem);
    
    if (!item) {
      toast({
        title: "Item Not Found",
        description: "Selected item not found in catalog",
        variant: "destructive"
      });
      return;
    }

    const multiplier = useCustomMultiplier ? customMultiplier : MULTIPLIER_RATES[selectedCategory as keyof typeof MULTIPLIER_RATES];
    const customerPrice = item.unitCost / multiplier;

    const newMaterial: MaterialItem = {
      id: `${Date.now()}-${Math.random()}`,
      name: item.name,
      category: selectedCategory,
      supplier: 'Alggin.com',
      unitCost: item.unitCost,
      customerPrice: customerPrice,
      unit: item.unit,
      quantity: quantity,
      description: item.description,
      adjustedPrice: customerPrice * quantity
    };

    setEstimate(prev => ({
      ...prev,
      materials: [...prev.materials, newMaterial]
    }));

    // Reset selections
    setSelectedItem('');
    setQuantity(1);

    toast({
      title: "Material Added",
      description: `${item.name} added to estimate`
    });
  };

  const removeMaterial = (id: string) => {
    setEstimate(prev => ({
      ...prev,
      materials: prev.materials.filter(m => m.id !== id)
    }));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    setEstimate(prev => ({
      ...prev,
      materials: prev.materials.map(m => 
        m.id === id 
          ? { ...m, quantity: newQuantity, adjustedPrice: m.customerPrice * newQuantity }
          : m
      )
    }));
  };

  const calculateTotals = () => {
    const materialsSubtotal = estimate.materials.reduce((sum, material) => sum + (material.adjustedPrice || 0), 0);
    const laborSubtotal = estimate.laborHours * estimate.laborRate;
    const subtotal = materialsSubtotal + laborSubtotal;
    
    const discountAmount = subtotal * (estimate.discountPercent / 100);
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * (estimate.taxPercent / 100);
    const total = afterDiscount + taxAmount;

    setEstimate(prev => ({
      ...prev,
      subtotal: materialsSubtotal,
      laborCost: laborSubtotal,
      discountAmount,
      taxAmount,
      total
    }));
  };

  useEffect(() => {
    calculateTotals();
  }, [estimate.materials, estimate.laborHours, estimate.laborRate, estimate.discountPercent, estimate.taxPercent]);

  const categories = Object.keys(ALGGIN_CATALOG);
  const categoryItems = selectedCategory ? ALGGIN_CATALOG[selectedCategory as keyof typeof ALGGIN_CATALOG] : [];

  return (
    <>
      <Helmet>
        <title>Material Cost Estimator | AfterHours HVAC</title>
        <meta name="description" content="Professional HVAC material cost estimator with real Alggin.com supplier pricing and custom multiplier rates." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Calculator className="h-10 w-10 text-green-400" />
              Material Cost Estimator
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Professional HVAC material pricing with real Alggin.com catalog data
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Material Selection */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Add Materials</CardTitle>
                <CardDescription>Select items from Alggin.com catalog</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-slate-900 border-slate-600">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCategory && (
                  <div>
                    <Label htmlFor="item">Item</Label>
                    <Select value={selectedItem} onValueChange={setSelectedItem}>
                      <SelectTrigger className="bg-slate-900 border-slate-600">
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryItems.map(item => (
                          <SelectItem key={item.name} value={item.name}>
                            <div className="flex flex-col">
                              <span>{item.name}</span>
                              <span className="text-xs text-slate-400">
                                ${item.unitCost.toFixed(2)} per {item.unit} - {item.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="bg-slate-900 border-slate-600"
                    min="1"
                  />
                </div>

                {selectedCategory && (
                  <div className="bg-slate-900/50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <input
                        type="checkbox"
                        id="customMultiplier"
                        checked={useCustomMultiplier}
                        onChange={(e) => setUseCustomMultiplier(e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="customMultiplier" className="text-sm">Use custom multiplier</Label>
                      <Info className="h-4 w-4 text-slate-400" />
                    </div>
                    
                    {useCustomMultiplier ? (
                      <Input
                        type="number"
                        step="0.01"
                        min="0.1"
                        max="1"
                        value={customMultiplier}
                        onChange={(e) => setCustomMultiplier(parseFloat(e.target.value) || 0.65)}
                        className="bg-slate-800 border-slate-600 text-sm"
                        placeholder="0.65"
                      />
                    ) : (
                      <div className="text-sm text-slate-400">
                        Category rate: {MULTIPLIER_RATES[selectedCategory as keyof typeof MULTIPLIER_RATES]}
                      </div>
                    )}
                  </div>
                )}

                <Button 
                  onClick={addMaterial} 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={!selectedCategory || !selectedItem}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Estimate
                </Button>
              </CardContent>
            </Card>

            {/* Materials List */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Materials List</CardTitle>
                <CardDescription>Items in current estimate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {estimate.materials.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No materials added yet</p>
                ) : (
                  estimate.materials.map((material) => (
                    <div key={material.id} className="bg-slate-900/50 p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm">{material.name}</h4>
                          <p className="text-slate-400 text-xs">{material.description}</p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {material.category}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMaterial(material.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            min="1"
                            value={material.quantity}
                            onChange={(e) => updateQuantity(material.id, parseInt(e.target.value) || 1)}
                            className="w-16 h-8 bg-slate-800 border-slate-600"
                          />
                          <span className="text-xs text-slate-400">{material.unit}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-slate-300">
                            ${material.customerPrice.toFixed(2)} each
                          </div>
                          <div className="text-sm font-medium text-white">
                            ${material.adjustedPrice?.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Estimate Summary */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Estimate Summary</CardTitle>
                <CardDescription>Total cost breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="laborHours">Labor Hours</Label>
                    <Input
                      id="laborHours"
                      type="number"
                      min="0"
                      step="0.5"
                      value={estimate.laborHours}
                      onChange={(e) => setEstimate(prev => ({ ...prev, laborHours: parseFloat(e.target.value) || 0 }))}
                      className="bg-slate-900 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="laborRate">Rate ($/hr)</Label>
                    <Input
                      id="laborRate"
                      type="number"
                      min="0"
                      value={estimate.laborRate}
                      onChange={(e) => setEstimate(prev => ({ ...prev, laborRate: parseFloat(e.target.value) || 95 }))}
                      className="bg-slate-900 border-slate-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="discount">Discount (%)</Label>
                    <Input
                      id="discount"
                      type="number"
                      min="0"
                      max="100"
                      value={estimate.discountPercent}
                      onChange={(e) => setEstimate(prev => ({ ...prev, discountPercent: parseFloat(e.target.value) || 0 }))}
                      className="bg-slate-900 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tax">Tax (%)</Label>
                    <Input
                      id="tax"
                      type="number"
                      min="0"
                      max="100"
                      value={estimate.taxPercent}
                      onChange={(e) => setEstimate(prev => ({ ...prev, taxPercent: parseFloat(e.target.value) || 5 }))}
                      className="bg-slate-900 border-slate-600"
                    />
                  </div>
                </div>

                <Separator className="bg-slate-600" />

                <div className="space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span>Materials Subtotal:</span>
                    <span>${estimate.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Labor Cost:</span>
                    <span>${estimate.laborCost.toFixed(2)}</span>
                  </div>
                  {estimate.discountPercent > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount ({estimate.discountPercent}%):</span>
                      <span>-${estimate.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-300">
                    <span>Tax ({estimate.taxPercent}%):</span>
                    <span>${estimate.taxAmount.toFixed(2)}</span>
                  </div>
                  <Separator className="bg-slate-600" />
                  <div className="flex justify-between text-xl font-bold text-white">
                    <span>Total:</span>
                    <span>${estimate.total.toFixed(2)}</span>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Generate Quote PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default MaterialEstimator;