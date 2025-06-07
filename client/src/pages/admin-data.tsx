import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/hooks/use-auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Edit2, Save, X } from 'lucide-react';

interface HvacEquipment {
  id?: number;
  categoryId: number;
  name: string;
  description: string;
  manufacturer: string;
  model: string;
  efficiency: string;
  basePrice: number;
  installationCost: number;
  annualOperatingCost: number;
  lifespan: number;
  type: string;
  btuOutput?: number;
  seerRating?: number;
  afueRating?: number;
}

interface HvacMaterial {
  id?: number;
  name: string;
  description: string;
  unit: string;
  unitPrice: number;
  category: string;
  supplier: string;
  partNumber?: string;
}

interface HvacAccessory {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: string;
  compatibleSystems: string[];
}

const AdminDataPage = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingEquipment, setEditingEquipment] = useState<HvacEquipment | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<HvacMaterial | null>(null);
  const [editingAccessory, setEditingAccessory] = useState<HvacAccessory | null>(null);

  // Equipment form state
  const [equipmentForm, setEquipmentForm] = useState<HvacEquipment>({
    categoryId: 1,
    name: '',
    description: '',
    manufacturer: '',
    model: '',
    efficiency: '',
    basePrice: 0,
    installationCost: 0,
    annualOperatingCost: 0,
    lifespan: 15,
    type: 'furnace',
    btuOutput: 0,
    seerRating: 0,
    afueRating: 0,
  });

  // Material form state
  const [materialForm, setMaterialForm] = useState<HvacMaterial>({
    name: '',
    description: '',
    unit: 'each',
    unitPrice: 0,
    category: 'ducting',
    supplier: '',
    partNumber: '',
  });

  // Accessory form state
  const [accessoryForm, setAccessoryForm] = useState<HvacAccessory>({
    name: '',
    description: '',
    price: 0,
    category: 'controls',
    compatibleSystems: [],
  });

  // Fetch data
  const { data: equipment = [] } = useQuery({
    queryKey: ['/api/admin/hvac-equipment'],
  });

  const { data: materials = [] } = useQuery({
    queryKey: ['/api/admin/hvac-materials'],
  });

  const { data: accessories = [] } = useQuery({
    queryKey: ['/api/admin/hvac-accessories'],
  });

  // Equipment mutations
  const createEquipmentMutation = useMutation({
    mutationFn: (data: HvacEquipment) => apiRequest('POST', '/api/admin/hvac-equipment', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/hvac-equipment'] });
      setEquipmentForm({
        categoryId: 1,
        name: '',
        description: '',
        manufacturer: '',
        model: '',
        efficiency: '',
        basePrice: 0,
        installationCost: 0,
        annualOperatingCost: 0,
        lifespan: 15,
        type: 'furnace',
        btuOutput: 0,
        seerRating: 0,
        afueRating: 0,
      });
      toast({ title: 'Equipment added successfully' });
    },
  });

  const updateEquipmentMutation = useMutation({
    mutationFn: ({ id, ...data }: HvacEquipment) => 
      apiRequest('PUT', `/api/admin/hvac-equipment/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/hvac-equipment'] });
      setEditingEquipment(null);
      toast({ title: 'Equipment updated successfully' });
    },
  });

  // Material mutations
  const createMaterialMutation = useMutation({
    mutationFn: (data: HvacMaterial) => apiRequest('POST', '/api/admin/hvac-materials', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/hvac-materials'] });
      setMaterialForm({
        name: '',
        description: '',
        unit: 'each',
        unitPrice: 0,
        category: 'ducting',
        supplier: '',
        partNumber: '',
      });
      toast({ title: 'Material added successfully' });
    },
  });

  const updateMaterialMutation = useMutation({
    mutationFn: ({ id, ...data }: HvacMaterial) => 
      apiRequest('PUT', `/api/admin/hvac-materials/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/hvac-materials'] });
      setEditingMaterial(null);
      toast({ title: 'Material updated successfully' });
    },
  });

  // Accessory mutations
  const createAccessoryMutation = useMutation({
    mutationFn: (data: HvacAccessory) => apiRequest('POST', '/api/admin/hvac-accessories', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/hvac-accessories'] });
      setAccessoryForm({
        name: '',
        description: '',
        price: 0,
        category: 'controls',
        compatibleSystems: [],
      });
      toast({ title: 'Accessory added successfully' });
    },
  });

  const updateAccessoryMutation = useMutation({
    mutationFn: ({ id, ...data }: HvacAccessory) => 
      apiRequest('PUT', `/api/admin/hvac-accessories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/hvac-accessories'] });
      setEditingAccessory(null);
      toast({ title: 'Accessory updated successfully' });
    },
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
        <title>Admin Data Management | AfterHours HVAC</title>
        <meta name="description" content="Manage HVAC equipment, materials, and pricing data" />
      </Helmet>
      
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-header text-white mb-6">
            Supplier Data <span className="text-primary">Management</span>
          </h1>
          <p className="text-xl text-lightgray max-w-3xl mx-auto">
            Input your supplier pricing and equipment data to power accurate calculator estimates
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="equipment" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-darkgray">
            <TabsTrigger value="equipment">HVAC Equipment</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="accessories">Accessories</TabsTrigger>
          </TabsList>

          {/* Equipment Tab */}
          <TabsContent value="equipment" className="space-y-6">
            <Card className="bg-darkgray border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Add HVAC Equipment</CardTitle>
                <CardDescription>
                  Input furnaces, air conditioners, heat pumps, and other major equipment with supplier pricing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="eq-name">Equipment Name</Label>
                    <Input
                      id="eq-name"
                      value={equipmentForm.name}
                      onChange={(e) => setEquipmentForm({...equipmentForm, name: e.target.value})}
                      placeholder="e.g., Goodman GMH95 Furnace"
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
                    <Label htmlFor="eq-type">Type</Label>
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
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="eq-base-price">Base Price (CAD)</Label>
                    <Input
                      id="eq-base-price"
                      type="number"
                      value={equipmentForm.basePrice}
                      onChange={(e) => setEquipmentForm({...equipmentForm, basePrice: parseFloat(e.target.value) || 0})}
                      placeholder="Equipment cost from supplier"
                      className="bg-dark border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="eq-install-cost">Installation Cost (CAD)</Label>
                    <Input
                      id="eq-install-cost"
                      type="number"
                      value={equipmentForm.installationCost}
                      onChange={(e) => setEquipmentForm({...equipmentForm, installationCost: parseFloat(e.target.value) || 0})}
                      placeholder="Labor and installation materials"
                      className="bg-dark border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="eq-btu">BTU Output</Label>
                    <Input
                      id="eq-btu"
                      type="number"
                      value={equipmentForm.btuOutput}
                      onChange={(e) => setEquipmentForm({...equipmentForm, btuOutput: parseInt(e.target.value) || 0})}
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
                </div>
                <div>
                  <Label htmlFor="eq-description">Description/Notes</Label>
                  <Textarea
                    id="eq-description"
                    value={equipmentForm.description}
                    onChange={(e) => setEquipmentForm({...equipmentForm, description: e.target.value})}
                    placeholder="Additional details, features, or notes"
                    className="bg-dark border-gray-600"
                  />
                </div>
                <Button 
                  onClick={() => createEquipmentMutation.mutate(equipmentForm)}
                  disabled={createEquipmentMutation.isPending}
                  className="bg-primary hover:bg-primary/80"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Equipment
                </Button>
              </CardContent>
            </Card>

            {/* Equipment List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {equipment.map((item: any) => (
                <Card key={item.id} className="bg-dark border-gray-700">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-sm">{item.name}</CardTitle>
                        <Badge variant="outline">{item.type}</Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingEquipment(item)}
                        className="border-gray-600"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-lightgray">Manufacturer:</span>
                        <span className="text-white">{item.manufacturer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-lightgray">Model:</span>
                        <span className="text-white">{item.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-lightgray">Base Price:</span>
                        <span className="text-primary font-bold">${item.basePrice?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-lightgray">Install Cost:</span>
                        <span className="text-secondary">${item.installationCost?.toLocaleString()}</span>
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
                  Input ductwork, refrigerant, fittings, and other materials with supplier pricing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mat-name">Material Name</Label>
                    <Input
                      id="mat-name"
                      value={materialForm.name}
                      onChange={(e) => setMaterialForm({...materialForm, name: e.target.value})}
                      placeholder="e.g., 6 inch Round Duct"
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
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="mat-price">Unit Price (CAD)</Label>
                    <Input
                      id="mat-price"
                      type="number"
                      step="0.01"
                      value={materialForm.unitPrice}
                      onChange={(e) => setMaterialForm({...materialForm, unitPrice: parseFloat(e.target.value) || 0})}
                      placeholder="Price per unit"
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
                <Button 
                  onClick={() => createMaterialMutation.mutate(materialForm)}
                  disabled={createMaterialMutation.isPending}
                  className="bg-primary hover:bg-primary/80"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Material
                </Button>
              </CardContent>
            </Card>

            {/* Materials List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {materials.map((item: any) => (
                <Card key={item.id} className="bg-dark border-gray-700">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-sm">{item.name}</CardTitle>
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingMaterial(item)}
                        className="border-gray-600"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-lightgray">Supplier:</span>
                        <span className="text-white">{item.supplier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-lightgray">Unit Price:</span>
                        <span className="text-primary font-bold">${item.unitPrice?.toFixed(2)} / {item.unit}</span>
                      </div>
                      {item.partNumber && (
                        <div className="flex justify-between">
                          <span className="text-lightgray">Part #:</span>
                          <span className="text-white">{item.partNumber}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Accessories Tab */}
          <TabsContent value="accessories" className="space-y-6">
            <Card className="bg-darkgray border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Add HVAC Accessories</CardTitle>
                <CardDescription>
                  Input thermostats, filters, dampers, and other accessories with pricing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="acc-name">Accessory Name</Label>
                    <Input
                      id="acc-name"
                      value={accessoryForm.name}
                      onChange={(e) => setAccessoryForm({...accessoryForm, name: e.target.value})}
                      placeholder="e.g., Ecobee Smart Thermostat"
                      className="bg-dark border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="acc-category">Category</Label>
                    <Select value={accessoryForm.category} onValueChange={(value) => setAccessoryForm({...accessoryForm, category: value})}>
                      <SelectTrigger className="bg-dark border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="controls">Controls/Thermostats</SelectItem>
                        <SelectItem value="filters">Filters</SelectItem>
                        <SelectItem value="dampers">Dampers</SelectItem>
                        <SelectItem value="humidifiers">Humidifiers</SelectItem>
                        <SelectItem value="air_quality">Air Quality</SelectItem>
                        <SelectItem value="registers">Registers/Grilles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="acc-price">Price (CAD)</Label>
                    <Input
                      id="acc-price"
                      type="number"
                      step="0.01"
                      value={accessoryForm.price}
                      onChange={(e) => setAccessoryForm({...accessoryForm, price: parseFloat(e.target.value) || 0})}
                      placeholder="Accessory price"
                      className="bg-dark border-gray-600"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="acc-description">Description</Label>
                  <Textarea
                    id="acc-description"
                    value={accessoryForm.description}
                    onChange={(e) => setAccessoryForm({...accessoryForm, description: e.target.value})}
                    placeholder="Accessory features and specifications"
                    className="bg-dark border-gray-600"
                  />
                </div>
                <Button 
                  onClick={() => createAccessoryMutation.mutate(accessoryForm)}
                  disabled={createAccessoryMutation.isPending}
                  className="bg-primary hover:bg-primary/80"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Accessory
                </Button>
              </CardContent>
            </Card>

            {/* Accessories List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accessories.map((item: any) => (
                <Card key={item.id} className="bg-dark border-gray-700">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-sm">{item.name}</CardTitle>
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingAccessory(item)}
                        className="border-gray-600"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-lightgray">Price:</span>
                        <span className="text-primary font-bold">${item.price?.toFixed(2)}</span>
                      </div>
                      <p className="text-lightgray text-xs">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDataPage;