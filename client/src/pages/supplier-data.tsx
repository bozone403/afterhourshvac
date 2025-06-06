import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Save } from 'lucide-react';

const SupplierDataPage = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [supplierData, setSupplierData] = useState<{
    equipment: any[];
    materials: any[];
    accessories: any[];
    laborRates: any;
  }>({
    equipment: [],
    materials: [],
    accessories: [],
    laborRates: {}
  });

  // Equipment form
  const [equipmentForm, setEquipmentForm] = useState({
    name: '',
    manufacturer: '',
    model: '',
    type: 'furnace',
    btuOutput: '',
    efficiency: '',
    supplierCost: '',
    markup: '35',
    installationHours: '',
    description: ''
  });

  // Material form
  const [materialForm, setMaterialForm] = useState({
    name: '',
    category: 'ducting',
    supplier: '',
    partNumber: '',
    unit: 'each',
    unitCost: '',
    markup: '25',
    description: ''
  });

  // Labor rates form
  const [laborForm, setLaborForm] = useState({
    leadTechnicianRate: '85',
    apprenticeRate: '65',
    emergencyRate: '125',
    commercialRate: '95',
    travelRate: '75'
  });

  const addEquipment = () => {
    if (!equipmentForm.name || !equipmentForm.supplierCost) {
      toast({ title: 'Please fill in equipment name and cost', variant: 'destructive' });
      return;
    }

    const newEquipment = {
      ...equipmentForm,
      id: Date.now(),
      supplierCost: parseFloat(equipmentForm.supplierCost),
      markup: parseFloat(equipmentForm.markup),
      installationHours: parseFloat(equipmentForm.installationHours) || 0,
      customerPrice: parseFloat(equipmentForm.supplierCost) * (1 + parseFloat(equipmentForm.markup) / 100)
    };

    setSupplierData(prev => ({
      ...prev,
      equipment: [...prev.equipment, newEquipment]
    }));

    setEquipmentForm({
      name: '',
      manufacturer: '',
      model: '',
      type: 'furnace',
      btuOutput: '',
      efficiency: '',
      supplierCost: '',
      markup: '35',
      installationHours: '',
      description: ''
    });

    toast({ title: 'Equipment added successfully' });
  };

  const addMaterial = () => {
    if (!materialForm.name || !materialForm.unitCost) {
      toast({ title: 'Please fill in material name and cost', variant: 'destructive' });
      return;
    }

    const newMaterial = {
      ...materialForm,
      id: Date.now(),
      unitCost: parseFloat(materialForm.unitCost),
      markup: parseFloat(materialForm.markup),
      customerPrice: parseFloat(materialForm.unitCost) * (1 + parseFloat(materialForm.markup) / 100)
    };

    setSupplierData(prev => ({
      ...prev,
      materials: [...prev.materials, newMaterial]
    }));

    setMaterialForm({
      name: '',
      category: 'ducting',
      supplier: '',
      partNumber: '',
      unit: 'each',
      unitCost: '',
      markup: '25',
      description: ''
    });

    toast({ title: 'Material added successfully' });
  };

  const exportData = () => {
    const dataStr = JSON.stringify(supplierData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `afterhours-hvac-supplier-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({ title: 'Data exported successfully' });
  };

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
        <title>Supplier Data Input | AfterHours HVAC</title>
        <meta name="description" content="Input supplier pricing data for accurate calculator estimates" />
      </Helmet>
      
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-header text-white mb-6">
            Supplier Data <span className="text-primary">Input System</span>
          </h1>
          <p className="text-xl text-lightgray max-w-3xl mx-auto">
            Enter your actual supplier costs, labor rates, and markup percentages to power accurate calculator estimates
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-6 flex justify-end">
          <Button onClick={exportData} className="bg-secondary hover:bg-secondary/80">
            <Save className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>

        <Tabs defaultValue="equipment" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-darkgray">
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="labor">Labor Rates</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          {/* Equipment Tab */}
          <TabsContent value="equipment" className="space-y-6">
            <Card className="bg-darkgray border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Add HVAC Equipment</CardTitle>
                <CardDescription>
                  Enter actual equipment costs from your suppliers (Goodman, Carrier, Lennox, etc.)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="eq-name">Equipment Name</Label>
                    <Input
                      id="eq-name"
                      value={equipmentForm.name}
                      onChange={(e) => setEquipmentForm({...equipmentForm, name: e.target.value})}
                      placeholder="e.g., Goodman GMH95 100k BTU Furnace"
                      className="bg-dark border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="eq-manufacturer">Manufacturer</Label>
                    <Input
                      id="eq-manufacturer"
                      value={equipmentForm.manufacturer}
                      onChange={(e) => setEquipmentForm({...equipmentForm, manufacturer: e.target.value})}
                      placeholder="e.g., Goodman, Carrier, Lennox"
                      className="bg-dark border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="eq-model">Model Number</Label>
                    <Input
                      id="eq-model"
                      value={equipmentForm.model}
                      onChange={(e) => setEquipmentForm({...equipmentForm, model: e.target.value})}
                      placeholder="e.g., GMH95100"
                      className="bg-dark border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="eq-type">Equipment Type</Label>
                    <Select value={equipmentForm.type} onValueChange={(value) => setEquipmentForm({...equipmentForm, type: value})}>
                      <SelectTrigger className="bg-dark border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="furnace">Furnace</SelectItem>
                        <SelectItem value="air_conditioner">Air Conditioner</SelectItem>
                        <SelectItem value="heat_pump">Heat Pump</SelectItem>
                        <SelectItem value="boiler">Boiler</SelectItem>
                        <SelectItem value="rooftop_unit">Rooftop Unit</SelectItem>
                        <SelectItem value="water_heater">Water Heater</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="eq-btu">BTU Output</Label>
                    <Input
                      id="eq-btu"
                      value={equipmentForm.btuOutput}
                      onChange={(e) => setEquipmentForm({...equipmentForm, btuOutput: e.target.value})}
                      placeholder="e.g., 100000"
                      className="bg-dark border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="eq-efficiency">Efficiency Rating</Label>
                    <Input
                      id="eq-efficiency"
                      value={equipmentForm.efficiency}
                      onChange={(e) => setEquipmentForm({...equipmentForm, efficiency: e.target.value})}
                      placeholder="e.g., 95% AFUE, 16 SEER"
                      className="bg-dark border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="eq-cost">Supplier Cost (CAD)</Label>
                    <Input
                      id="eq-cost"
                      type="number"
                      step="0.01"
                      value={equipmentForm.supplierCost}
                      onChange={(e) => setEquipmentForm({...equipmentForm, supplierCost: e.target.value})}
                      placeholder="Your actual cost from supplier"
                      className="bg-dark border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="eq-markup">Markup (%)</Label>
                    <Input
                      id="eq-markup"
                      type="number"
                      value={equipmentForm.markup}
                      onChange={(e) => setEquipmentForm({...equipmentForm, markup: e.target.value})}
                      placeholder="35"
                      className="bg-dark border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="eq-hours">Installation Hours</Label>
                    <Input
                      id="eq-hours"
                      type="number"
                      step="0.5"
                      value={equipmentForm.installationHours}
                      onChange={(e) => setEquipmentForm({...equipmentForm, installationHours: e.target.value})}
                      placeholder="8"
                      className="bg-dark border-gray-600"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="eq-description">Description/Notes</Label>
                  <Textarea
                    id="eq-description"
                    value={equipmentForm.description}
                    onChange={(e) => setEquipmentForm({...equipmentForm, description: e.target.value})}
                    placeholder="Additional details, warranty info, special features"
                    className="bg-dark border-gray-600"
                  />
                </div>
                <Button onClick={addEquipment} className="bg-primary hover:bg-primary/80">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Equipment
                </Button>
              </CardContent>
            </Card>

            {/* Equipment List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {supplierData.equipment.map((item: any) => (
                <Card key={item.id} className="bg-dark border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">{item.name}</CardTitle>
                    <div className="flex gap-2">
                      <div className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">{item.type}</div>
                      <div className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">{item.efficiency}</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-lightgray">Supplier Cost:</span>
                        <span className="text-white">${item.supplierCost?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-lightgray">Customer Price:</span>
                        <span className="text-primary font-bold">${item.customerPrice?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-lightgray">Install Hours:</span>
                        <span className="text-white">{item.installationHours}h</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials" className="space-y-6">
            <Card className="bg-darkgray border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Add HVAC Materials</CardTitle>
                <CardDescription>
                  Enter costs for ductwork, refrigerant, fittings, and other materials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="mat-name">Material Name</Label>
                    <Input
                      id="mat-name"
                      value={materialForm.name}
                      onChange={(e) => setMaterialForm({...materialForm, name: e.target.value})}
                      placeholder="e.g., 6 inch Round Galvanized Duct"
                      className="bg-dark border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mat-category">Category</Label>
                    <Select value={materialForm.category} onValueChange={(value) => setMaterialForm({...materialForm, category: value})}>
                      <SelectTrigger className="bg-dark border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ducting">Ducting</SelectItem>
                        <SelectItem value="refrigerant">Refrigerant</SelectItem>
                        <SelectItem value="electrical">Electrical</SelectItem>
                        <SelectItem value="fittings">Fittings</SelectItem>
                        <SelectItem value="insulation">Insulation</SelectItem>
                        <SelectItem value="venting">Venting</SelectItem>
                        <SelectItem value="filters">Filters</SelectItem>
                        <SelectItem value="thermostats">Thermostats</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="mat-supplier">Supplier</Label>
                    <Input
                      id="mat-supplier"
                      value={materialForm.supplier}
                      onChange={(e) => setMaterialForm({...materialForm, supplier: e.target.value})}
                      placeholder="Supplier name"
                      className="bg-dark border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mat-part">Part Number</Label>
                    <Input
                      id="mat-part"
                      value={materialForm.partNumber}
                      onChange={(e) => setMaterialForm({...materialForm, partNumber: e.target.value})}
                      placeholder="Supplier part number"
                      className="bg-dark border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mat-unit">Unit</Label>
                    <Select value={materialForm.unit} onValueChange={(value) => setMaterialForm({...materialForm, unit: value})}>
                      <SelectTrigger className="bg-dark border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="each">Each</SelectItem>
                        <SelectItem value="linear_foot">Linear Foot</SelectItem>
                        <SelectItem value="square_foot">Square Foot</SelectItem>
                        <SelectItem value="pound">Pound</SelectItem>
                        <SelectItem value="kilogram">Kilogram</SelectItem>
                        <SelectItem value="roll">Roll</SelectItem>
                        <SelectItem value="box">Box</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="mat-cost">Unit Cost (CAD)</Label>
                    <Input
                      id="mat-cost"
                      type="number"
                      step="0.01"
                      value={materialForm.unitCost}
                      onChange={(e) => setMaterialForm({...materialForm, unitCost: e.target.value})}
                      placeholder="Cost per unit"
                      className="bg-dark border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mat-markup">Markup (%)</Label>
                    <Input
                      id="mat-markup"
                      type="number"
                      value={materialForm.markup}
                      onChange={(e) => setMaterialForm({...materialForm, markup: e.target.value})}
                      placeholder="25"
                      className="bg-dark border-gray-600"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="mat-description">Description</Label>
                  <Textarea
                    id="mat-description"
                    value={materialForm.description}
                    onChange={(e) => setMaterialForm({...materialForm, description: e.target.value})}
                    placeholder="Material specifications and details"
                    className="bg-dark border-gray-600"
                  />
                </div>
                <Button onClick={addMaterial} className="bg-primary hover:bg-primary/80">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Material
                </Button>
              </CardContent>
            </Card>

            {/* Materials List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {supplierData.materials.map((item: any) => (
                <Card key={item.id} className="bg-dark border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">{item.name}</CardTitle>
                    <div className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded w-fit">{item.category}</div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-lightgray">Unit Cost:</span>
                        <span className="text-white">${item.unitCost?.toFixed(2)} / {item.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-lightgray">Customer Price:</span>
                        <span className="text-primary font-bold">${item.customerPrice?.toFixed(2)} / {item.unit}</span>
                      </div>
                      {item.supplier && (
                        <div className="flex justify-between">
                          <span className="text-lightgray">Supplier:</span>
                          <span className="text-white text-xs">{item.supplier}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Labor Rates Tab */}
          <TabsContent value="labor" className="space-y-6">
            <Card className="bg-darkgray border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Labor Rates (CAD per hour)</CardTitle>
                <CardDescription>
                  Set your labor rates for different types of work and technician levels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="lead-rate">Lead Technician Rate</Label>
                    <Input
                      id="lead-rate"
                      type="number"
                      value={laborForm.leadTechnicianRate}
                      onChange={(e) => setLaborForm({...laborForm, leadTechnicianRate: e.target.value})}
                      className="bg-dark border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="apprentice-rate">Apprentice Rate</Label>
                    <Input
                      id="apprentice-rate"
                      type="number"
                      value={laborForm.apprenticeRate}
                      onChange={(e) => setLaborForm({...laborForm, apprenticeRate: e.target.value})}
                      className="bg-dark border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergency-rate">Emergency Rate</Label>
                    <Input
                      id="emergency-rate"
                      type="number"
                      value={laborForm.emergencyRate}
                      onChange={(e) => setLaborForm({...laborForm, emergencyRate: e.target.value})}
                      className="bg-dark border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="commercial-rate">Commercial Rate</Label>
                    <Input
                      id="commercial-rate"
                      type="number"
                      value={laborForm.commercialRate}
                      onChange={(e) => setLaborForm({...laborForm, commercialRate: e.target.value})}
                      className="bg-dark border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="travel-rate">Travel Rate</Label>
                    <Input
                      id="travel-rate"
                      type="number"
                      value={laborForm.travelRate}
                      onChange={(e) => setLaborForm({...laborForm, travelRate: e.target.value})}
                      className="bg-dark border-gray-600"
                    />
                  </div>
                </div>
                <Button 
                  onClick={() => {
                    setSupplierData(prev => ({...prev, laborRates: laborForm}));
                    toast({ title: 'Labor rates saved' });
                  }}
                  className="bg-primary hover:bg-primary/80"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Labor Rates
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-darkgray border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Equipment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{supplierData.equipment.length}</div>
                    <div className="text-lightgray">Items Added</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-darkgray border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Materials Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary mb-2">{supplierData.materials.length}</div>
                    <div className="text-lightgray">Items Added</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-darkgray border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Labor Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-lightgray">Lead Tech:</span>
                      <span className="text-white">${laborForm.leadTechnicianRate}/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-lightgray">Emergency:</span>
                      <span className="text-white">${laborForm.emergencyRate}/hr</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SupplierDataPage;