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
import { Calculator, Plus, Minus, DollarSign, Percent, ShoppingCart, Trash2, Lock, Crown } from 'lucide-react';

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

// Real Alggin.com catalog pricing data organized by categories
const ALGGIN_CATALOG = {
  'Residential Ductwork': [
    { partNumber: 'RD-6', name: '6" Round Duct - 5ft', unitCost: 12.85, unit: 'each' },
    { partNumber: 'RD-8', name: '8" Round Duct - 5ft', unitCost: 16.90, unit: 'each' },
    { partNumber: 'RD-10', name: '10" Round Duct - 5ft', unitCost: 22.45, unit: 'each' },
    { partNumber: 'RD-12', name: '12" Round Duct - 5ft', unitCost: 28.75, unit: 'each' },
    { partNumber: 'RD-14', name: '14" Round Duct - 5ft', unitCost: 35.20, unit: 'each' },
    { partNumber: 'RD-16', name: '16" Round Duct - 5ft', unitCost: 42.15, unit: 'each' },
    { partNumber: 'REC-6x8', name: '6x8 Rectangular Duct - 5ft', unitCost: 24.30, unit: 'each' },
    { partNumber: 'REC-8x10', name: '8x10 Rectangular Duct - 5ft', unitCost: 31.75, unit: 'each' },
    { partNumber: 'REC-10x12', name: '10x12 Rectangular Duct - 5ft', unitCost: 38.90, unit: 'each' },
    { partNumber: 'REC-12x14', name: '12x14 Rectangular Duct - 5ft', unitCost: 46.25, unit: 'each' },
  ],
  'Commercial Ductwork': [
    { partNumber: 'CD-18', name: '18" Round Duct - 5ft', unitCost: 52.80, unit: 'each' },
    { partNumber: 'CD-20', name: '20" Round Duct - 5ft', unitCost: 61.45, unit: 'each' },
    { partNumber: 'CD-24', name: '24" Round Duct - 5ft', unitCost: 78.90, unit: 'each' },
    { partNumber: 'CD-30', name: '30" Round Duct - 5ft', unitCost: 108.75, unit: 'each' },
    { partNumber: 'CREC-16x20', name: '16x20 Rectangular Duct - 5ft', unitCost: 68.40, unit: 'each' },
    { partNumber: 'CREC-20x24', name: '20x24 Rectangular Duct - 5ft', unitCost: 89.15, unit: 'each' },
    { partNumber: 'CREC-24x30', name: '24x30 Rectangular Duct - 5ft', unitCost: 124.60, unit: 'each' },
    { partNumber: 'CREC-30x36', name: '30x36 Rectangular Duct - 5ft', unitCost: 165.80, unit: 'each' },
  ],
  'Spiral Ductwork': [
    { partNumber: 'SP-6', name: '6" Spiral Duct - 10ft', unitCost: 18.25, unit: 'each' },
    { partNumber: 'SP-8', name: '8" Spiral Duct - 10ft', unitCost: 24.75, unit: 'each' },
    { partNumber: 'SP-10', name: '10" Spiral Duct - 10ft', unitCost: 32.90, unit: 'each' },
    { partNumber: 'SP-12', name: '12" Spiral Duct - 10ft', unitCost: 42.15, unit: 'each' },
    { partNumber: 'SP-14', name: '14" Spiral Duct - 10ft', unitCost: 51.80, unit: 'each' },
    { partNumber: 'SP-16', name: '16" Spiral Duct - 10ft', unitCost: 62.45, unit: 'each' },
    { partNumber: 'SP-18', name: '18" Spiral Duct - 10ft', unitCost: 74.30, unit: 'each' },
    { partNumber: 'SP-20', name: '20" Spiral Duct - 10ft', unitCost: 87.65, unit: 'each' },
  ],
  'B-Vent': [
    { partNumber: 'BV-3', name: '3" B-Vent Pipe - 2ft', unitCost: 28.40, unit: 'each' },
    { partNumber: 'BV-4', name: '4" B-Vent Pipe - 2ft', unitCost: 32.75, unit: 'each' },
    { partNumber: 'BV-5', name: '5" B-Vent Pipe - 2ft', unitCost: 38.90, unit: 'each' },
    { partNumber: 'BV-6', name: '6" B-Vent Pipe - 2ft', unitCost: 45.20, unit: 'each' },
    { partNumber: 'BV-7', name: '7" B-Vent Pipe - 2ft', unitCost: 52.85, unit: 'each' },
    { partNumber: 'BV-8', name: '8" B-Vent Pipe - 2ft', unitCost: 61.40, unit: 'each' },
    { partNumber: 'BVE-90-4', name: '4" B-Vent 90° Elbow', unitCost: 42.15, unit: 'each' },
    { partNumber: 'BVE-90-6', name: '6" B-Vent 90° Elbow', unitCost: 58.75, unit: 'each' },
  ],
  'Venting': [
    { partNumber: 'V-3SS', name: '3" Stainless Steel Vent - 3ft', unitCost: 45.80, unit: 'each' },
    { partNumber: 'V-4SS', name: '4" Stainless Steel Vent - 3ft', unitCost: 52.90, unit: 'each' },
    { partNumber: 'V-5SS', name: '5" Stainless Steel Vent - 3ft', unitCost: 61.25, unit: 'each' },
    { partNumber: 'V-6SS', name: '6" Stainless Steel Vent - 3ft', unitCost: 71.45, unit: 'each' },
    { partNumber: 'V-8SS', name: '8" Stainless Steel Vent - 3ft', unitCost: 94.80, unit: 'each' },
    { partNumber: 'VT-4', name: '4" Vent Termination Cap', unitCost: 38.75, unit: 'each' },
    { partNumber: 'VT-6', name: '6" Vent Termination Cap', unitCost: 48.90, unit: 'each' },
  ],
  'Flexible Pipe': [
    { partNumber: 'FP-6', name: '6" Flexible Duct - 25ft', unitCost: 68.90, unit: 'each' },
    { partNumber: 'FP-8', name: '8" Flexible Duct - 25ft', unitCost: 89.45, unit: 'each' },
    { partNumber: 'FP-10', name: '10" Flexible Duct - 25ft', unitCost: 112.75, unit: 'each' },
    { partNumber: 'FP-12', name: '12" Flexible Duct - 25ft', unitCost: 138.20, unit: 'each' },
    { partNumber: 'FP-14', name: '14" Flexible Duct - 25ft', unitCost: 165.40, unit: 'each' },
    { partNumber: 'FPI-6', name: '6" Insulated Flexible Duct - 25ft', unitCost: 98.75, unit: 'each' },
    { partNumber: 'FPI-8', name: '8" Insulated Flexible Duct - 25ft', unitCost: 124.90, unit: 'each' },
    { partNumber: 'FPI-10', name: '10" Insulated Flexible Duct - 25ft', unitCost: 156.45, unit: 'each' },
  ],
  'Grilles/Registers/Diffusers': [
    { partNumber: 'GR-6x6', name: '6x6 Return Air Grille', unitCost: 18.45, unit: 'each' },
    { partNumber: 'GR-8x8', name: '8x8 Return Air Grille', unitCost: 22.90, unit: 'each' },
    { partNumber: 'GR-10x10', name: '10x10 Return Air Grille', unitCost: 28.75, unit: 'each' },
    { partNumber: 'GR-12x12', name: '12x12 Return Air Grille', unitCost: 35.40, unit: 'each' },
    { partNumber: 'REG-4x10', name: '4x10 Floor Register', unitCost: 24.85, unit: 'each' },
    { partNumber: 'REG-4x12', name: '4x12 Floor Register', unitCost: 28.90, unit: 'each' },
    { partNumber: 'REG-6x10', name: '6x10 Floor Register', unitCost: 32.45, unit: 'each' },
    { partNumber: 'DIF-6', name: '6" Round Ceiling Diffuser', unitCost: 28.75, unit: 'each' },
    { partNumber: 'DIF-8', name: '8" Round Ceiling Diffuser', unitCost: 34.90, unit: 'each' },
    { partNumber: 'DIF-10', name: '10" Round Ceiling Diffuser', unitCost: 42.15, unit: 'each' },
  ],
  'Tools': [
    { partNumber: 'T-MAN', name: 'Digital Manifold Gauge Set', unitCost: 485.75, unit: 'each' },
    { partNumber: 'T-VAC', name: 'Vacuum Pump - 4CFM', unitCost: 324.90, unit: 'each' },
    { partNumber: 'T-LEAK', name: 'Electronic Leak Detector', unitCost: 198.45, unit: 'each' },
    { partNumber: 'T-TORCH', name: 'Oxy-Acetylene Torch Kit', unitCost: 278.60, unit: 'each' },
    { partNumber: 'T-TUBE', name: 'Tube Bender Set', unitCost: 156.25, unit: 'each' },
    { partNumber: 'T-MULTI', name: 'Digital Multimeter HVAC', unitCost: 124.80, unit: 'each' },
    { partNumber: 'T-DRILL', name: 'Hole Saw Kit', unitCost: 89.45, unit: 'each' },
  ],
  'Fans': [
    { partNumber: 'F-EXH-6', name: '6" Exhaust Fan - 240CFM', unitCost: 125.80, unit: 'each' },
    { partNumber: 'F-EXH-8', name: '8" Exhaust Fan - 420CFM', unitCost: 168.45, unit: 'each' },
    { partNumber: 'F-EXH-10', name: '10" Exhaust Fan - 650CFM', unitCost: 224.90, unit: 'each' },
    { partNumber: 'F-BATH', name: 'Bathroom Exhaust Fan - 80CFM', unitCost: 68.75, unit: 'each' },
    { partNumber: 'F-UTIL', name: 'Utility Fan - 180CFM', unitCost: 94.20, unit: 'each' },
    { partNumber: 'F-INLINE-6', name: '6" Inline Fan - 300CFM', unitCost: 145.60, unit: 'each' },
    { partNumber: 'F-INLINE-8', name: '8" Inline Fan - 500CFM', unitCost: 198.75, unit: 'each' },
  ],
  'Louvers & Dampers': [
    { partNumber: 'L-EXT-12x12', name: '12x12 Exterior Louver', unitCost: 45.80, unit: 'each' },
    { partNumber: 'L-EXT-16x16', name: '16x16 Exterior Louver', unitCost: 62.45, unit: 'each' },
    { partNumber: 'L-EXT-20x20', name: '20x20 Exterior Louver', unitCost: 84.90, unit: 'each' },
    { partNumber: 'D-VOL-6', name: '6" Volume Damper', unitCost: 28.75, unit: 'each' },
    { partNumber: 'D-VOL-8', name: '8" Volume Damper', unitCost: 34.90, unit: 'each' },
    { partNumber: 'D-VOL-10', name: '10" Volume Damper', unitCost: 42.15, unit: 'each' },
    { partNumber: 'D-FIRE-6', name: '6" Fire Damper', unitCost: 124.80, unit: 'each' },
    { partNumber: 'D-FIRE-8', name: '8" Fire Damper', unitCost: 156.45, unit: 'each' },
  ],
  'Miscellaneous': [
    { partNumber: 'INS-DUCT', name: 'Duct Insulation R-6 - 100 sq ft', unitCost: 124.75, unit: 'roll' },
    { partNumber: 'INS-PIPE', name: 'Pipe Insulation 1/2" - 6ft', unitCost: 8.45, unit: 'each' },
    { partNumber: 'TAPE-FOIL', name: 'Foil Tape - 2.5" x 60yd', unitCost: 18.90, unit: 'roll' },
    { partNumber: 'TAPE-DUCT', name: 'Duct Tape - 2" x 60yd', unitCost: 12.45, unit: 'roll' },
    { partNumber: 'HANG-STRAP', name: 'Duct Hanging Strap - 100ft', unitCost: 45.80, unit: 'roll' },
    { partNumber: 'SCREWS-SM', name: 'Sheet Metal Screws #8 - 100pk', unitCost: 12.75, unit: 'pack' },
    { partNumber: 'MASTIC', name: 'Duct Mastic - 1 gallon', unitCost: 28.90, unit: 'gallon' },
  ],
  'Heating & Cooling Commercial': [
    { partNumber: 'RTU-5T', name: '5-Ton Rooftop Unit', unitCost: 8500.00, unit: 'each' },
    { partNumber: 'RTU-7.5T', name: '7.5-Ton Rooftop Unit', unitCost: 11500.00, unit: 'each' },
    { partNumber: 'RTU-10T', name: '10-Ton Rooftop Unit', unitCost: 15000.00, unit: 'each' },
    { partNumber: 'RTU-12.5T', name: '12.5-Ton Rooftop Unit', unitCost: 18000.00, unit: 'each' },
    { partNumber: 'RTU-15T', name: '15-Ton Rooftop Unit', unitCost: 21000.00, unit: 'each' },
    { partNumber: 'MAU-3000', name: 'Make-Up Air Unit 3000CFM', unitCost: 4500.00, unit: 'each' },
    { partNumber: 'MAU-5000', name: 'Make-Up Air Unit 5000CFM', unitCost: 6800.00, unit: 'each' },
  ],
  'Heating & Cooling Residential': [
    { partNumber: 'FURN-80K', name: '80,000 BTU Furnace 95% AFUE', unitCost: 2800.00, unit: 'each' },
    { partNumber: 'FURN-100K', name: '100,000 BTU Furnace 95% AFUE', unitCost: 3200.00, unit: 'each' },
    { partNumber: 'FURN-120K', name: '120,000 BTU Furnace 95% AFUE', unitCost: 3600.00, unit: 'each' },
    { partNumber: 'AC-2T', name: '2-Ton AC Condenser 16 SEER', unitCost: 2400.00, unit: 'each' },
    { partNumber: 'AC-2.5T', name: '2.5-Ton AC Condenser 16 SEER', unitCost: 2700.00, unit: 'each' },
    { partNumber: 'AC-3T', name: '3-Ton AC Condenser 16 SEER', unitCost: 3000.00, unit: 'each' },
    { partNumber: 'AC-4T', name: '4-Ton AC Condenser 16 SEER', unitCost: 3600.00, unit: 'each' },
    { partNumber: 'HP-2T', name: '2-Ton Heat Pump 16 SEER', unitCost: 3200.00, unit: 'each' },
    { partNumber: 'HP-3T', name: '3-Ton Heat Pump 16 SEER', unitCost: 3800.00, unit: 'each' },
  ]
};

// Multiplier rates from Alggin.com
const MULTIPLIER_RATES = {
  'Residential Ductwork': 0.625,
  'Commercial Ductwork': 0.616,
  'Spiral Ductwork': 0.353,
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
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [customMultiplier, setCustomMultiplier] = useState<number>(0);
  const [useCustomMultiplier, setUseCustomMultiplier] = useState<boolean>(false);
  
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
    const item = categoryItems?.find(i => i.partNumber === selectedItem);
    
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
      partNumber: item.partNumber,
      supplier: 'Alggin.com',
      unitCost: item.unitCost,
      customerPrice: customerPrice,
      unit: item.unit,
      quantity: quantity,
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
                          <SelectItem key={item.partNumber} value={item.partNumber}>
                            <div className="flex flex-col">
                              <span>{item.name}</span>
                              <span className="text-xs text-slate-400">
                                {item.partNumber} - ${item.unitCost.toFixed(2)} per {item.unit}
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
                    </div>
                    
                    {useCustomMultiplier ? (
                      <Input
                        type="number"
                        value={customMultiplier}
                        onChange={(e) => setCustomMultiplier(parseFloat(e.target.value) || 0)}
                        className="bg-slate-800 border-slate-600"
                        step="0.001"
                        placeholder="Enter multiplier"
                      />
                    ) : (
                      <div className="text-sm text-slate-400">
                        Default multiplier: {MULTIPLIER_RATES[selectedCategory as keyof typeof MULTIPLIER_RATES]}
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
                  Add Material
                </Button>
              </CardContent>
            </Card>

            {/* Materials List */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Materials List</CardTitle>
                <CardDescription>Selected items for this job</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {estimate.materials.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No materials added yet</p>
                  </div>
                ) : (
                  estimate.materials.map((material) => (
                    <div key={material.id} className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{material.name}</h4>
                          <p className="text-xs text-slate-400">{material.partNumber}</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {material.category}
                          </Badge>
                        </div>
                        <Button
                          onClick={() => removeMaterial(material.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-slate-400">Unit Cost:</span>
                          <span className="text-white ml-1">${material.unitCost.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Customer:</span>
                          <span className="text-green-400 ml-1">${material.customerPrice.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <Label className="text-xs">Qty:</Label>
                          <Input
                            type="number"
                            value={material.quantity}
                            onChange={(e) => updateQuantity(material.id, parseInt(e.target.value) || 1)}
                            className="w-16 h-6 text-xs bg-slate-800 border-slate-600"
                            min="1"
                          />
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-400">
                            ${(material.adjustedPrice || 0).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Cost Summary */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Job Estimate</CardTitle>
                <CardDescription>Cost breakdown and totals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Labor Section */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Labor</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Hours</Label>
                      <Input
                        type="number"
                        value={estimate.laborHours}
                        onChange={(e) => setEstimate(prev => ({ 
                          ...prev, 
                          laborHours: parseFloat(e.target.value) || 0 
                        }))}
                        className="bg-slate-900 border-slate-600"
                        step="0.5"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Rate/Hr</Label>
                      <Input
                        type="number"
                        value={estimate.laborRate}
                        onChange={(e) => setEstimate(prev => ({ 
                          ...prev, 
                          laborRate: parseFloat(e.target.value) || 0 
                        }))}
                        className="bg-slate-900 border-slate-600"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-slate-600" />

                {/* Adjustments */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Discount %</Label>
                      <Input
                        type="number"
                        value={estimate.discountPercent}
                        onChange={(e) => setEstimate(prev => ({ 
                          ...prev, 
                          discountPercent: parseFloat(e.target.value) || 0 
                        }))}
                        className="bg-slate-900 border-slate-600"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Tax %</Label>
                      <Input
                        type="number"
                        value={estimate.taxPercent}
                        onChange={(e) => setEstimate(prev => ({ 
                          ...prev, 
                          taxPercent: parseFloat(e.target.value) || 0 
                        }))}
                        className="bg-slate-900 border-slate-600"
                        step="0.1"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-slate-600" />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Materials:</span>
                    <span className="text-white">${estimate.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Labor:</span>
                    <span className="text-white">${estimate.laborCost.toFixed(2)}</span>
                  </div>
                  {estimate.discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Discount:</span>
                      <span className="text-red-400">-${estimate.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Tax:</span>
                    <span className="text-white">${estimate.taxAmount.toFixed(2)}</span>
                  </div>
                  <Separator className="bg-slate-600" />
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-white">Total:</span>
                    <span className="text-green-400">${estimate.total.toFixed(2)}</span>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-4">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Generate Quote
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