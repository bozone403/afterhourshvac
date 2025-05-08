import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { calculateEnergySavings, formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface CalculatorFormState {
  propertyType: string;
  squareFootage: string;
  currentSystemAge: string;
  furnaceType: string;
  acType: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  additionalNotes: string;
  // Added advanced fields
  numberOfFloors: string;
  insulation: string;
  windows: string;
  foundationType: string;
  existingDuctwork: string;
  homeOrientation: string;
  ceilingHeight: string;
  homeBuildYear: string;
}

interface CalculatorResults {
  currentCost: number;
  newCost: number;
  savings: number;
  roi: number;
  systemRecommendation: string;
  costRange: {
    low: number;
    high: number;
  };
  installationTime: string;
  carbonReduction: number;
  equipmentDetails: {
    furnace: {
      model: string;
      manufacturer: string;
      btuOutput: number;
      afueRating: number;
      price: number;
      installationCost: number;
      annualOperatingCost: number;
      lifespan: number;
    };
    ac?: {
      model: string;
      manufacturer: string;
      btuOutput: number;
      seerRating: number;
      price: number;
      installationCost: number;
      annualOperatingCost: number;
      lifespan: number;
    };
    heatPump?: {
      model: string;
      manufacturer: string;
      btuOutput: number;
      seerRating: number;
      hspfRating: number;
      price: number;
      installationCost: number;
      annualOperatingCost: number;
      lifespan: number;
    };
    thermostat: {
      model: string;
      manufacturer: string;
      features: string[];
      price: number;
      installationCost: number;
      lifespan: number;
    };
    accessories: Array<{
      name: string;
      description: string;
      price: number;
      installationCost: number;
      lifespan: number;
    }>;
  };
  materialsDetails: {
    ductwork: Array<{
      type: string;
      length: number;
      diameter: number;
      materialCost: number;
      installationCost: number;
    }>;
    insulation: Array<{
      type: string;
      rValue: number;
      area: number;
      materialCost: number;
      installationCost: number;
    }>;
    refrigerant: {
      type: string;
      amount: number;
      costPerUnit: number;
    };
    electrical: Array<{
      description: string;
      quantity: number;
      costPerUnit: number;
      installationCost: number;
    }>;
    mounts: Array<{
      type: string;
      quantity: number;
      costPerUnit: number;
      installationCost: number;
    }>;
    venting: Array<{
      type: string;
      length: number;
      diameter: number;
      materialCost: number;
      installationCost: number;
    }>;
    additionalMaterials: Array<{
      description: string;
      quantity: number;
      costPerUnit: number;
    }>;
  };
  laborDetails: {
    technicians: Array<{
      role: string;
      hours: number;
      hourlyRate: number;
    }>;
    permitFees: number;
    inspectionFees: number;
    travelCosts: number;
  };
  isEditable: boolean;
}

const ProCalculator = () => {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showLightCalculator, setShowLightCalculator] = useState(false);
  const [formData, setFormData] = useState<CalculatorFormState>({
    propertyType: 'residential',
    squareFootage: '',
    currentSystemAge: '',
    furnaceType: 'standard',
    acType: 'standard',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    additionalNotes: '',
    numberOfFloors: '1',
    insulation: 'average',
    windows: 'standard',
    foundationType: 'basement',
    existingDuctwork: 'yes',
    homeOrientation: 'north',
    ceilingHeight: '8',
    homeBuildYear: '',
  });
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<CalculatorResults | null>(null);
  const [editableResults, setEditableResults] = useState<CalculatorResults | null>(null);
  const [formStep, setFormStep] = useState(1);
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false);
  
  // States for Pro Calculator editing
  const [isEquipmentEditMode, setIsEquipmentEditMode] = useState(false);
  const [isAccessoriesEditMode, setIsAccessoriesEditMode] = useState(false);
  const [isMaterialsEditMode, setIsMaterialsEditMode] = useState(false);
  const [isLaborEditMode, setIsLaborEditMode] = useState(false);
  
  // When results come in, set up the editable copy
  useEffect(() => {
    if (results) {
      setEditableResults(JSON.parse(JSON.stringify(results)));
    }
  }, [results]);
  
  // Handler for equipment changes
  const handleEquipmentChange = (
    equipmentType: 'furnace' | 'ac' | 'heatPump' | 'thermostat', 
    field: string, 
    value: string | number | string[] | boolean
  ) => {
    if (!editableResults) return;
    
    setEditableResults(prev => {
      if (!prev) return prev;
      const newResults = { ...prev };
      
      if (equipmentType === 'furnace') {
        newResults.equipmentDetails.furnace = {
          ...newResults.equipmentDetails.furnace,
          [field]: value
        };
      } else if (equipmentType === 'ac' && newResults.equipmentDetails.ac) {
        newResults.equipmentDetails.ac = {
          ...newResults.equipmentDetails.ac,
          [field]: value
        };
      } else if (equipmentType === 'heatPump' && newResults.equipmentDetails.heatPump) {
        newResults.equipmentDetails.heatPump = {
          ...newResults.equipmentDetails.heatPump,
          [field]: value
        };
      } else if (equipmentType === 'thermostat') {
        newResults.equipmentDetails.thermostat = {
          ...newResults.equipmentDetails.thermostat,
          [field]: value
        };
      }
      
      return newResults;
    });
  };
  
  // Handler for accessory changes
  const handleAccessoryChange = (
    index: number,
    field: 'name' | 'description' | 'price' | 'installationCost' | 'lifespan',
    value: string | number
  ) => {
    if (!editableResults) return;
    
    setEditableResults(prev => {
      if (!prev) return prev;
      const newResults = { ...prev };
      const newAccessories = [...newResults.equipmentDetails.accessories];
      
      newAccessories[index] = {
        ...newAccessories[index],
        [field]: value
      };
      
      newResults.equipmentDetails.accessories = newAccessories;
      return newResults;
    });
  };
  
  // Add a new accessory
  const handleAddAccessory = () => {
    if (!editableResults) return;
    
    setEditableResults(prev => {
      if (!prev) return prev;
      const newResults = { ...prev };
      const newAccessories = [...newResults.equipmentDetails.accessories];
      
      newAccessories.push({
        name: 'New Accessory',
        description: 'Description',
        price: 0,
        installationCost: 0,
        lifespan: 1
      });
      
      newResults.equipmentDetails.accessories = newAccessories;
      return newResults;
    });
  };
  
  // Remove an accessory
  const handleRemoveAccessory = (index: number) => {
    if (!editableResults) return;
    
    setEditableResults(prev => {
      if (!prev) return prev;
      const newResults = { ...prev };
      const newAccessories = [...newResults.equipmentDetails.accessories];
      
      newAccessories.splice(index, 1);
      
      newResults.equipmentDetails.accessories = newAccessories;
      return newResults;
    });
  };
  
  // Handle material changes (ductwork, etc)
  const handleMaterialChange = (
    materialType: 'ductwork' | 'insulation' | 'electrical' | 'mounts' | 'venting' | 'additionalMaterials',
    index: number,
    field: string,
    value: string | number
  ) => {
    if (!editableResults) return;
    
    setEditableResults(prev => {
      if (!prev) return prev;
      const newResults = { ...prev };
      
      if (materialType === 'ductwork') {
        const newDuctwork = [...newResults.materialsDetails.ductwork];
        newDuctwork[index] = {
          ...newDuctwork[index],
          [field]: value
        };
        newResults.materialsDetails.ductwork = newDuctwork;
      } else if (materialType === 'insulation') {
        const newInsulation = [...newResults.materialsDetails.insulation];
        newInsulation[index] = {
          ...newInsulation[index],
          [field]: value
        };
        newResults.materialsDetails.insulation = newInsulation;
      } else if (materialType === 'electrical') {
        const newElectrical = [...newResults.materialsDetails.electrical];
        newElectrical[index] = {
          ...newElectrical[index],
          [field]: value
        };
        newResults.materialsDetails.electrical = newElectrical;
      } else if (materialType === 'mounts') {
        const newMounts = [...newResults.materialsDetails.mounts];
        newMounts[index] = {
          ...newMounts[index],
          [field]: value
        };
        newResults.materialsDetails.mounts = newMounts;
      } else if (materialType === 'venting') {
        const newVenting = [...newResults.materialsDetails.venting];
        newVenting[index] = {
          ...newVenting[index],
          [field]: value
        };
        newResults.materialsDetails.venting = newVenting;
      } else if (materialType === 'additionalMaterials') {
        const newAdditionalMaterials = [...newResults.materialsDetails.additionalMaterials];
        newAdditionalMaterials[index] = {
          ...newAdditionalMaterials[index],
          [field]: value
        };
        newResults.materialsDetails.additionalMaterials = newAdditionalMaterials;
      }
      
      return newResults;
    });
  };
  
  // Handle refrigerant changes
  const handleRefrigerantChange = (field: 'type' | 'amount' | 'costPerUnit', value: string | number) => {
    if (!editableResults) return;
    
    setEditableResults(prev => {
      if (!prev) return prev;
      const newResults = { ...prev };
      
      newResults.materialsDetails.refrigerant = {
        ...newResults.materialsDetails.refrigerant,
        [field]: value
      };
      
      return newResults;
    });
  };
  
  // Handle labor changes
  const handleLaborChange = (
    index: number,
    field: 'role' | 'hours' | 'hourlyRate',
    value: string | number
  ) => {
    if (!editableResults) return;
    
    setEditableResults(prev => {
      if (!prev) return prev;
      const newResults = { ...prev };
      const newTechnicians = [...newResults.laborDetails.technicians];
      
      newTechnicians[index] = {
        ...newTechnicians[index],
        [field]: value
      };
      
      newResults.laborDetails.technicians = newTechnicians;
      return newResults;
    });
  };
  
  // Handle additional labor costs
  const handleAdditionalLaborCostChange = (
    field: 'permitFees' | 'inspectionFees' | 'travelCosts',
    value: number
  ) => {
    if (!editableResults) return;
    
    setEditableResults(prev => {
      if (!prev) return prev;
      const newResults = { ...prev };
      
      newResults.laborDetails = {
        ...newResults.laborDetails,
        [field]: value
      };
      
      return newResults;
    });
  };
  
  // Save all edits
  const saveAllEdits = () => {
    if (!editableResults) return;
    
    // Apply all changes to the main results
    setResults(editableResults);
    
    // Turn off edit modes
    setIsEquipmentEditMode(false);
    setIsAccessoriesEditMode(false);
    setIsMaterialsEditMode(false);
    setIsLaborEditMode(false);
    
    toast({
      title: "Changes Saved",
      description: "Your customized HVAC configuration has been updated.",
    });
  };

  // For demo purposes, we'll use a mock user ID
  // In a real app, this would come from authentication
  const mockUserId = 1;
  
  // Check if user has access to Pro Calculator
  const { data: accessData, isLoading: checkingAccess } = useQuery<{ hasAccess: boolean }>({
    queryKey: ['/api/check-pro-access', mockUserId],
    queryFn: async () => {
      const response = await apiRequest(
        'GET', 
        `/api/check-pro-access?userId=${mockUserId}`
      );
      return response.json();
    },
    retry: false,
    staleTime: 60000, // 1 minute
  });

  useEffect(() => {
    if (accessData) {
      setHasAccess(accessData.hasAccess || false);
      
      if (!accessData.hasAccess) {
        // If they don't have access, show the light calculator option first
        setShowLightCalculator(true);
      }
    }
  }, [accessData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset results when inputs change
    if (showResults) {
      setShowResults(false);
    }
  };

  const handlePropertyTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      propertyType: type
    }));
    
    // Reset results when inputs change
    if (showResults) {
      setShowResults(false);
    }
  };

  const handleLightCalculatorClick = () => {
    setShowLightCalculator(true);
    setShowPaywall(false);
  };

  const handleProCalculatorClick = () => {
    if (hasAccess) {
      setShowLightCalculator(false);
    } else {
      setShowPaywall(true);
      setShowLightCalculator(false);
    }
  };

  const handlePayForAccess = () => {
    setLocation('/checkout?service=pro&amount=500');
  };

  const validateForm = (step: number): boolean => {
    // Validate based on current step
    if (step === 1) {
      if (!formData.squareFootage || !formData.currentSystemAge) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields in this section.",
          variant: "destructive",
        });
        return false;
      }
      return true;
    } else if (step === 2) {
      // For step 2, all fields are optional advanced parameters
      return true;
    } else if (step === 3) {
      if (!formData.clientName || !formData.clientEmail || !formData.clientPhone) {
        toast({
          title: "Missing Information",
          description: "Please provide client contact information to generate a detailed quote.",
          variant: "destructive",
        });
        return false;
      }
      return true;
    }
    return false;
  };

  const handleNextStep = () => {
    if (validateForm(formStep)) {
      setFormStep(prev => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    setFormStep(prev => prev - 1);
  };

  const generateProQuote = async () => {
    if (!validateForm(formStep)) {
      return;
    }
    
    setIsGeneratingQuote(true);
    
    // Calculate base values first
    const squareFootage = parseInt(formData.squareFootage) || 0;
    const efficiency = formData.furnaceType === 'premium' ? 0.96 : 0.92;
    const baseCalculation = calculateEnergySavings(squareFootage, formData.currentSystemAge, efficiency);
    
    // For Pro Calculator, we enhance the calculation with additional factors
    try {
      // In a real app, this would be a server call that does advanced calculations
      // For this demo, we'll simulate more advanced calculations locally
      
      const houseAgeImpact = formData.homeBuildYear ? 
        (2023 - parseInt(formData.homeBuildYear)) / 100 : 0.2;
        
      const insulationFactor = 
        formData.insulation === 'poor' ? 0.8 :
        formData.insulation === 'average' ? 1.0 :
        formData.insulation === 'good' ? 1.2 : 1.0;
        
      const windowsFactor = 
        formData.windows === 'single' ? 0.85 :
        formData.windows === 'standard' ? 1.0 :
        formData.windows === 'higheff' ? 1.2 : 1.0;
        
      const floorsFactor = 
        formData.numberOfFloors === '1' ? 1.0 :
        formData.numberOfFloors === '2' ? 1.15 :
        formData.numberOfFloors === '3' ? 1.25 : 1.0;
        
      const ductworkFactor = formData.existingDuctwork === 'yes' ? 1.0 : 1.3;
      
      // Enhanced calculation
      const enhancedCurrentCost = Math.round(baseCalculation.currentCost * 
        (1 + houseAgeImpact) * (2 - insulationFactor) * (2 - windowsFactor) * floorsFactor);
        
      const enhancedNewCost = Math.round(baseCalculation.newCost * 
        ductworkFactor * (1.1 - (windowsFactor - 0.9)) * (1.1 - (insulationFactor - 0.9)));
        
      const enhancedSavings = enhancedCurrentCost - enhancedNewCost;
      
      // Commercial properties have different cost factors
      const isCommercial = formData.propertyType === 'commercial';
      const baseCostMultiplier = isCommercial ? 1.6 : 1.0;
      
      // Calculate cost range based on all factors
      let lowCost = Math.round(squareFootage * 5.5 * baseCostMultiplier * 
        ductworkFactor * (formData.acType === 'premium' ? 1.2 : 1.0));
        
      let highCost = Math.round(squareFootage * 9 * baseCostMultiplier * 
        ductworkFactor * (formData.acType === 'premium' ? 1.3 : 1.0) * 
        (formData.furnaceType === 'premium' ? 1.2 : 1.0));
      
      // Add at least $1500 difference between low and high if they're too close
      if (highCost - lowCost < 1500) {
        highCost = lowCost + 1500;
      }
      
      // Estimate carbon reduction (simple calculation for demo)
      const carbonReduction = Math.round((enhancedSavings / enhancedCurrentCost) * 2.5 * squareFootage);
      
      // Generate equipment recommendations
      const furnaceModel = formData.furnaceType === 'premium' ? 
        'Carrier Infinity 98 96.5% AFUE' : 'Carrier Performance 96 96.0% AFUE';
        
      const acModel = formData.acType === 'premium' ? 
        'Carrier Infinity 20 SEER2' : 'Carrier Performance 16 SEER2';
        
      const thermostat = formData.furnaceType === 'premium' || formData.acType === 'premium' ? 
        'Carrier Infinity Touch Control' : 'Carrier Côr 7-Day Programmable';
        
      const accessories = [
        'Media Air Cleaner',
        'Humidifier',
        formData.propertyType === 'commercial' ? 'Commercial Zoning System' : 'Residential Zoning System',
        formData.insulation === 'poor' ? 'Duct Insulation Wrap' : '',
        'UV Air Purifier'
      ].filter(item => item !== '');
      
      // Enhanced results with exhaustive details for pro calculator
      const enhancedResults: CalculatorResults = {
        currentCost: enhancedCurrentCost,
        newCost: enhancedNewCost,
        savings: enhancedSavings,
        roi: Math.round((lowCost / enhancedSavings) * 10) / 10, // ROI in years, rounded to 1 decimal
        systemRecommendation: formData.propertyType === 'commercial' ? 
          'Commercial Rooftop Package System' : 'High-Efficiency Split System',
        costRange: {
          low: lowCost,
          high: highCost
        },
        installationTime: formData.propertyType === 'commercial' ? '3-5 days' : '1-2 days',
        carbonReduction: carbonReduction,
        equipmentDetails: {
          furnace: {
            model: formData.furnaceType === 'premium' ? 'Infinity 98' : 'Performance 96',
            manufacturer: 'Carrier',
            btuOutput: formData.propertyType === 'commercial' ? 120000 : Math.round((parseInt(formData.squareFootage) || 2000) * 25),
            afueRating: formData.furnaceType === 'premium' ? 97.5 : 96.0,
            price: Math.round((formData.propertyType === 'commercial' ? 8500 : 4500) * (formData.furnaceType === 'premium' ? 1.4 : 1)),
            installationCost: formData.propertyType === 'commercial' ? 2200 : 1800,
            annualOperatingCost: Math.round(enhancedNewCost * 0.6),
            lifespan: 15
          },
          ac: formData.acType !== 'none' ? {
            model: formData.acType === 'premium' ? 'Infinity 20' : 'Performance 16',
            manufacturer: 'Carrier',
            btuOutput: formData.propertyType === 'commercial' ? 80000 : Math.round((parseInt(formData.squareFootage) || 2000) * 20),
            seerRating: formData.acType === 'premium' ? 20 : 16,
            price: Math.round((formData.propertyType === 'commercial' ? 9000 : 5000) * (formData.acType === 'premium' ? 1.5 : 1)),
            installationCost: formData.propertyType === 'commercial' ? 2000 : 1500,
            annualOperatingCost: Math.round(enhancedNewCost * 0.4),
            lifespan: 12
          } : undefined,
          heatPump: formData.acType === 'premium' ? {
            model: 'Infinity 24 Heat Pump',
            manufacturer: 'Carrier',
            btuOutput: formData.propertyType === 'commercial' ? 60000 : Math.round((parseInt(formData.squareFootage) || 2000) * 15),
            seerRating: 24,
            hspfRating: 13,
            price: Math.round(formData.propertyType === 'commercial' ? 12000 : 8000),
            installationCost: formData.propertyType === 'commercial' ? 2500 : 2000,
            annualOperatingCost: Math.round(enhancedNewCost * 0.5),
            lifespan: 15
          } : undefined,
          thermostat: {
            model: formData.furnaceType === 'premium' || formData.acType === 'premium' ? 'Infinity Touch Control' : 'Côr 7-Day Programmable',
            manufacturer: 'Carrier',
            features: formData.furnaceType === 'premium' || formData.acType === 'premium' ? 
              ['Wi-Fi', 'Touchscreen', 'Smart Home Integration', 'Zoning Control'] : 
              ['7-Day Programming', 'Wi-Fi', 'Smart Home Integration'],
            price: formData.furnaceType === 'premium' || formData.acType === 'premium' ? 450 : 250,
            installationCost: 150,
            lifespan: 10
          },
          accessories: [
            {
              name: 'Media Air Cleaner',
              description: 'High-efficiency air purification system',
              price: 450,
              installationCost: 150,
              lifespan: 5
            },
            {
              name: 'Humidifier',
              description: 'Whole-home humidity control system',
              price: 550,
              installationCost: 200,
              lifespan: 8
            },
            {
              name: formData.propertyType === 'commercial' ? 'Commercial Zoning System' : 'Residential Zoning System',
              description: 'Multi-zone temperature control system',
              price: formData.propertyType === 'commercial' ? 2500 : 1200,
              installationCost: formData.propertyType === 'commercial' ? 800 : 600,
              lifespan: 15
            },
            {
              name: 'UV Air Purifier',
              description: 'UV-C light air treatment system',
              price: 600,
              installationCost: 200,
              lifespan: 3
            },
            {
              name: 'Smart Vents',
              description: 'Automated vent control system for room-by-room temperature management',
              price: 800,
              installationCost: 400,
              lifespan: 10
            },
            {
              name: 'Carbon Monoxide Detector',
              description: 'Safety device integrated with HVAC system',
              price: 120,
              installationCost: 80,
              lifespan: 7
            }
          ]
        },
        materialsDetails: {
          ductwork: [
            {
              type: 'Flexible Insulated Duct',
              length: formData.existingDuctwork === 'yes' ? 20 : 120,
              diameter: 8,
              materialCost: formData.existingDuctwork === 'yes' ? 200 : 1200,
              installationCost: formData.existingDuctwork === 'yes' ? 250 : 1500
            },
            {
              type: 'Rigid Metal Duct',
              length: formData.existingDuctwork === 'yes' ? 10 : 60,
              diameter: 12,
              materialCost: formData.existingDuctwork === 'yes' ? 300 : 1800,
              installationCost: formData.existingDuctwork === 'yes' ? 400 : 2400
            }
          ],
          insulation: [
            {
              type: 'Fiberglass Duct Insulation',
              rValue: 8,
              area: 200,
              materialCost: 400,
              installationCost: 600
            }
          ],
          refrigerant: {
            type: 'R-410A',
            amount: 6,
            costPerUnit: 40
          },
          electrical: [
            {
              description: 'Circuit Breaker & Wiring',
              quantity: 1,
              costPerUnit: 300,
              installationCost: 450
            },
            {
              description: 'Disconnect Switch',
              quantity: 2,
              costPerUnit: 85,
              installationCost: 120
            }
          ],
          mounts: [
            {
              type: 'Concrete Pad',
              quantity: 1,
              costPerUnit: 120,
              installationCost: 250
            },
            {
              type: 'Roof Mounting Bracket',
              quantity: formData.propertyType === 'commercial' ? 4 : 0,
              costPerUnit: 85,
              installationCost: 150
            }
          ],
          venting: [
            {
              type: 'PVC Exhaust Vent',
              length: 15,
              diameter: 3,
              materialCost: 180,
              installationCost: 350
            }
          ],
          additionalMaterials: [
            {
              description: 'Condensate Drain Kit',
              quantity: 1,
              costPerUnit: 45
            },
            {
              description: 'Vibration Dampeners',
              quantity: 4,
              costPerUnit: 15
            },
            {
              description: 'Refrigerant Line Set',
              quantity: 1,
              costPerUnit: 150
            },
            {
              description: 'Air Registers and Grilles',
              quantity: parseInt(formData.numberOfFloors) * 6 || 6,
              costPerUnit: 35
            }
          ]
        },
        laborDetails: {
          technicians: [
            {
              role: 'Lead HVAC Technician',
              hours: formData.propertyType === 'commercial' ? 16 : 10,
              hourlyRate: 85
            },
            {
              role: 'HVAC Assistant',
              hours: formData.propertyType === 'commercial' ? 16 : 10,
              hourlyRate: 55
            },
            {
              role: 'Electrical Specialist',
              hours: 4,
              hourlyRate: 90
            }
          ],
          permitFees: formData.propertyType === 'commercial' ? 750 : 350,
          inspectionFees: formData.propertyType === 'commercial' ? 500 : 250,
          travelCosts: 180
        },
        isEditable: true
      };
      
      setResults(enhancedResults);
      setShowResults(true);
      
      // In a real application, we would save this quote to the database
      // and offer options to email it, download as PDF, etc.
      
    } catch (error) {
      console.error('Error generating pro quote:', error);
      toast({
        title: "Calculation Error",
        description: "There was an error generating your detailed quote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingQuote(false);
    }
  };

  const handleCalculate = () => {
    if (hasAccess) {
      generateProQuote();
    } else {
      // For non-pro users, do basic calculation
      if (!formData.squareFootage || !formData.currentSystemAge) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      const squareFootage = parseInt(formData.squareFootage);
      let newEfficiency = 0.92; // Default high-efficiency

      if (formData.furnaceType === 'premium') {
        newEfficiency = 0.96;
      }

      // Calculate results
      const calculationResults = calculateEnergySavings(
        squareFootage,
        formData.currentSystemAge,
        newEfficiency
      );

      // Create simplified results for basic calculator
      const lowCost = Math.round(squareFootage * (formData.propertyType === 'residential' ? 5.5 : 7));
      const highCost = Math.round(squareFootage * (formData.propertyType === 'residential' ? 9 : 11.5));
      
      const basicResults: CalculatorResults = {
        currentCost: calculationResults.currentCost,
        newCost: calculationResults.newCost,
        savings: calculationResults.savings,
        roi: Math.round((lowCost / calculationResults.savings) * 10) / 10,
        systemRecommendation: formData.propertyType === 'residential' ? 'High-Efficiency Residential System' : 'Commercial Rooftop System',
        costRange: {
          low: lowCost,
          high: highCost
        },
        installationTime: formData.propertyType === 'residential' ? '1-2 days' : '2-4 days',
        carbonReduction: Math.round(calculationResults.savings * 0.5), // Simplified carbon calculation
        equipmentDetails: {
          furnace: {
            model: formData.furnaceType === 'premium' ? 'High-Efficiency Premium Furnace' : 'Standard High-Efficiency Furnace',
            manufacturer: 'Various',
            btuOutput: formData.propertyType === 'commercial' ? 100000 : Math.round((parseInt(formData.squareFootage) || 2000) * 20),
            afueRating: formData.furnaceType === 'premium' ? 96.0 : 92.0,
            price: Math.round(lowCost * 0.4),
            installationCost: Math.round(lowCost * 0.2),
            annualOperatingCost: Math.round(calculationResults.newCost * 0.6),
            lifespan: 15
          },
          ac: formData.acType !== 'none' ? {
            model: formData.acType === 'premium' ? 'Premium AC Unit' : 'Standard AC Unit',
            manufacturer: 'Various',
            btuOutput: formData.propertyType === 'commercial' ? 60000 : Math.round((parseInt(formData.squareFootage) || 2000) * 15),
            seerRating: formData.acType === 'premium' ? 18 : 14,
            price: Math.round(lowCost * 0.3),
            installationCost: Math.round(lowCost * 0.1),
            annualOperatingCost: Math.round(calculationResults.newCost * 0.4),
            lifespan: 10
          } : undefined,
          thermostat: {
            model: 'Programmable Thermostat',
            manufacturer: 'Various',
            features: ['Programmable', 'Digital Display'],
            price: 200,
            installationCost: 100,
            lifespan: 8
          },
          accessories: [
            {
              name: 'Air Filter',
              description: 'Standard air filtration system',
              price: 150,
              installationCost: 50,
              lifespan: 1
            },
            {
              name: 'Humidifier',
              description: 'Basic whole-home humidifier',
              price: 300,
              installationCost: 150,
              lifespan: 5
            }
          ]
        },
        materialsDetails: {
          ductwork: [
            {
              type: 'Standard Ductwork',
              length: 30,
              diameter: 8,
              materialCost: Math.round(lowCost * 0.1),
              installationCost: Math.round(lowCost * 0.15)
            }
          ],
          insulation: [
            {
              type: 'Standard Insulation',
              rValue: 6,
              area: 100,
              materialCost: 250,
              installationCost: 350
            }
          ],
          refrigerant: {
            type: 'Standard Refrigerant',
            amount: 4,
            costPerUnit: 30
          },
          electrical: [
            {
              description: 'Basic Electrical Work',
              quantity: 1,
              costPerUnit: 200,
              installationCost: 300
            }
          ],
          mounts: [
            {
              type: 'Standard Mount',
              quantity: 1,
              costPerUnit: 100,
              installationCost: 150
            }
          ],
          venting: [
            {
              type: 'Standard Venting',
              length: 10,
              diameter: 3,
              materialCost: 120,
              installationCost: 180
            }
          ],
          additionalMaterials: [
            {
              description: 'Miscellaneous Materials',
              quantity: 1,
              costPerUnit: 200
            }
          ]
        },
        laborDetails: {
          technicians: [
            {
              role: 'HVAC Technician',
              hours: formData.propertyType === 'commercial' ? 12 : 8,
              hourlyRate: 75
            },
            {
              role: 'Helper',
              hours: formData.propertyType === 'commercial' ? 12 : 8,
              hourlyRate: 45
            }
          ],
          permitFees: formData.propertyType === 'commercial' ? 500 : 250,
          inspectionFees: formData.propertyType === 'commercial' ? 400 : 200,
          travelCosts: 150
        },
        isEditable: false
      };

      setResults(basicResults);
      setShowResults(true);
    }
  };

  // Functions to handle quote download and sharing would go here
  const handleDownloadQuote = () => {
    toast({
      title: "Download Started",
      description: "Your quote is being prepared as a PDF. It will download automatically when ready.",
    });
    // In a real app, this would trigger a download of a generated PDF
  };

  const handleEmailQuote = () => {
    toast({
      title: "Quote Sent",
      description: `The detailed quote has been emailed to ${formData.clientEmail}.`,
    });
    // In a real app, this would send an email with the quote attached
  };

  if (checkingAccess) {
    return (
      <div className="min-h-screen bg-dark pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Pro HVAC Calculator - AfterHours HVAC</title>
        <meta name="description" content="Advanced HVAC calculator for professionals. Get detailed equipment specifications, pricing, and energy savings calculations for residential and commercial HVAC projects." />
      </Helmet>
      
      {/* Page Header */}
      <div className="relative pt-24 pb-10 bg-dark">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold font-header mb-4">HVAC <span className="text-primary">Pro Calculator</span></h1>
            <p className="text-lightgray max-w-3xl mx-auto">
              {hasAccess 
                ? "Advanced HVAC calculator with Alberta-specific pricing, load calculations, and detailed quotes." 
                : "Choose between our free basic calculator or upgrade to the Pro version for detailed quotes and advanced features."}
            </p>
          </div>
        </div>
      </div>
      
      {/* Calculator Selection (only shown if user doesn't have Pro access) */}
      {!hasAccess && !showLightCalculator && !showPaywall && (
        <section className="bg-dark py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div 
                  className="bg-darkgray rounded-lg p-8 border border-gray-700 hover:border-secondary transition-all cursor-pointer"
                  onClick={handleLightCalculatorClick}
                >
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold font-header">Basic Calculator</h3>
                    <span className="px-3 py-1 bg-secondary text-white text-sm rounded-full">FREE</span>
                  </div>
                  <p className="text-lightgray mb-6">Simple HVAC calculator with basic estimation features for homeowners and small businesses.</p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-400 mr-3"></i>
                      <span>Energy savings calculation</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-400 mr-3"></i>
                      <span>Equipment sizing estimates</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-400 mr-3"></i>
                      <span>Basic price ranges</span>
                    </li>
                    <li className="flex items-center opacity-50">
                      <i className="fas fa-times text-red-400 mr-3"></i>
                      <span>Detailed equipment specifications</span>
                    </li>
                    <li className="flex items-center opacity-50">
                      <i className="fas fa-times text-red-400 mr-3"></i>
                      <span>PDF quote export</span>
                    </li>
                    <li className="flex items-center opacity-50">
                      <i className="fas fa-times text-red-400 mr-3"></i>
                      <span>Alberta-specific pricing data</span>
                    </li>
                  </ul>
                  <button 
                    className="w-full bg-secondary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold"
                    onClick={handleLightCalculatorClick}
                  >
                    Use Free Calculator
                  </button>
                </div>
                
                <div 
                  className="bg-darkgray rounded-lg p-8 border border-primary hover:border-opacity-100 transform scale-105 shadow-xl transition-all cursor-pointer"
                  onClick={handleProCalculatorClick}
                >
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold font-header">Pro Calculator</h3>
                    <span className="px-3 py-1 bg-primary text-white text-sm rounded-full">$500 LIFETIME</span>
                  </div>
                  <p className="text-lightgray mb-6">Advanced HVAC calculator for professionals with comprehensive features and Alberta-specific data.</p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-400 mr-3"></i>
                      <span>All free calculator features</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-400 mr-3"></i>
                      <span>Alberta-specific pricing defaults</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-400 mr-3"></i>
                      <span>Detailed equipment specifications</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-400 mr-3"></i>
                      <span>Professional PDF quote export</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-400 mr-3"></i>
                      <span>Advanced load calculations</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-400 mr-3"></i>
                      <span>Client management and quote history</span>
                    </li>
                  </ul>
                  <button 
                    className="w-full bg-primary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold"
                    onClick={handleProCalculatorClick}
                  >
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Pro Calculator Paywall */}
      {showPaywall && (
        <section className="bg-dark py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-darkgray rounded-lg overflow-hidden border border-primary">
              <div className="bg-primary p-6">
                <h3 className="text-2xl font-bold font-header text-white text-center">Pro Calculator - One-Time Purchase</h3>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold font-header mb-4">Pro Features Include:</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <i className="fas fa-check-circle text-primary mt-1 mr-3"></i>
                        <span>Alberta-specific pricing defaults for all equipment</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-check-circle text-primary mt-1 mr-3"></i>
                        <span>Editable per-region material/labor pricing</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-check-circle text-primary mt-1 mr-3"></i>
                        <span>Save multiple pricing profiles for different scenarios</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-check-circle text-primary mt-1 mr-3"></i>
                        <span>Load calculation override inputs for custom projects</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-check-circle text-primary mt-1 mr-3"></i>
                        <span>Professional PDF quote export with your branding</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-check-circle text-primary mt-1 mr-3"></i>
                        <span>Side-by-side quote comparison for customer options</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-check-circle text-primary mt-1 mr-3"></i>
                        <span>Markup + Margin calculation with profit analytics</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-dark p-6 rounded-lg border border-gray-700">
                    <h4 className="text-xl font-semibold font-header mb-4">One-Time Purchase</h4>
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-white">$500</div>
                      <p className="text-lightgray mt-2">Lifetime access - no subscription fees</p>
                    </div>
                    
                    <p className="text-lightgray mb-6">Perfect for HVAC contractors, property managers, and home builders who need accurate estimates and professional quotes.</p>
                    
                    <div className="pt-3">
                      <button 
                        onClick={handlePayForAccess}
                        className="block w-full bg-primary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold text-center"
                      >
                        <i className="fas fa-lock-open mr-2"></i> Purchase Pro Access
                      </button>
                      <div className="flex justify-center mt-4">
                        <button 
                          onClick={() => {
                            setShowPaywall(false);
                            setShowLightCalculator(true);
                          }}
                          className="text-lightgray hover:text-white transition-colors"
                        >
                          Continue with free calculator
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Calculator Form - Either Pro or Basic depending on user access */}
      {(showLightCalculator || hasAccess) && (
        <section className="bg-dark py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {hasAccess && (
                <div className="bg-primary bg-opacity-20 mb-8 p-4 rounded-lg border border-primary">
                  <div className="flex items-center">
                    <i className="fas fa-crown text-primary text-xl mr-3"></i>
                    <p className="font-semibold">Pro Calculator Access Enabled - Full features unlocked</p>
                  </div>
                </div>
              )}
              
              <div className="bg-darkgray rounded-lg shadow-xl overflow-hidden border border-gray-700">
                <div className="bg-dark px-6 py-4 border-b border-gray-700">
                  <h3 className="text-xl font-bold font-header text-white">
                    {hasAccess ? "Professional HVAC Quote Calculator" : "Basic HVAC Calculator"}
                  </h3>
                </div>
                
                <div className="p-6">
                  {/* Multi-step form for Pro or single step for Basic */}
                  {hasAccess ? (
                    <div>
                      {/* Step Indicator for Pro Calculator */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between">
                          <div className={`flex flex-col items-center ${formStep >= 1 ? 'text-primary' : 'text-gray-500'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${formStep >= 1 ? 'border-primary bg-primary bg-opacity-10' : 'border-gray-500'} mb-2`}>
                              1
                            </div>
                            <span className="text-sm">Basic Info</span>
                          </div>
                          <div className="flex-1 h-0.5 mx-2 bg-gray-700">
                            <div className={`h-full ${formStep >= 2 ? 'bg-primary' : 'bg-gray-700'}`} style={{width: formStep > 1 ? '100%' : '0%', transition: 'width 0.3s'}}></div>
                          </div>
                          <div className={`flex flex-col items-center ${formStep >= 2 ? 'text-primary' : 'text-gray-500'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${formStep >= 2 ? 'border-primary bg-primary bg-opacity-10' : 'border-gray-500'} mb-2`}>
                              2
                            </div>
                            <span className="text-sm">Parameters</span>
                          </div>
                          <div className="flex-1 h-0.5 mx-2 bg-gray-700">
                            <div className={`h-full ${formStep >= 3 ? 'bg-primary' : 'bg-gray-700'}`} style={{width: formStep > 2 ? '100%' : '0%', transition: 'width 0.3s'}}></div>
                          </div>
                          <div className={`flex flex-col items-center ${formStep >= 3 ? 'text-primary' : 'text-gray-500'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${formStep >= 3 ? 'border-primary bg-primary bg-opacity-10' : 'border-gray-500'} mb-2`}>
                              3
                            </div>
                            <span className="text-sm">Client Info</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Step 1: Basic Information */}
                      {formStep === 1 && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-lightgray mb-1">Property Type</label>
                            <div className="grid grid-cols-2 gap-4">
                              <div 
                                className={`bg-dark rounded-md p-4 border ${formData.propertyType === 'residential' ? 'border-primary' : 'border-gray-700'} cursor-pointer hover:border-primary transition-colors`}
                                onClick={() => handlePropertyTypeChange('residential')}
                              >
                                <div className="flex items-center">
                                  <input 
                                    type="radio" 
                                    name="propertyType" 
                                    className="mr-3" 
                                    checked={formData.propertyType === 'residential'}
                                    onChange={() => handlePropertyTypeChange('residential')}
                                  />
                                  <label className="cursor-pointer">
                                    <div className="font-medium">Residential</div>
                                    <div className="text-xs text-lightgray">Homes & Condos</div>
                                  </label>
                                </div>
                              </div>
                              
                              <div 
                                className={`bg-dark rounded-md p-4 border ${formData.propertyType === 'commercial' ? 'border-primary' : 'border-gray-700'} cursor-pointer hover:border-primary transition-colors`}
                                onClick={() => handlePropertyTypeChange('commercial')}
                              >
                                <div className="flex items-center">
                                  <input 
                                    type="radio" 
                                    name="propertyType" 
                                    className="mr-3"
                                    checked={formData.propertyType === 'commercial'}
                                    onChange={() => handlePropertyTypeChange('commercial')}
                                  />
                                  <label className="cursor-pointer">
                                    <div className="font-medium">Commercial</div>
                                    <div className="text-xs text-lightgray">Offices & Retail</div>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="squareFootage" className="block text-sm font-medium text-lightgray mb-1">Square Footage <span className="text-red-500">*</span></label>
                            <input 
                              type="number" 
                              id="squareFootage" 
                              name="squareFootage"
                              placeholder="Enter square feet" 
                              className="w-full bg-dark border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                              value={formData.squareFootage}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="currentSystemAge" className="block text-sm font-medium text-lightgray mb-1">Current System Age <span className="text-red-500">*</span></label>
                            <select 
                              id="currentSystemAge" 
                              name="currentSystemAge"
                              className="w-full bg-dark border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                              value={formData.currentSystemAge}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">Select age range</option>
                              <option value="0-5">0-5 years</option>
                              <option value="6-10">6-10 years</option>
                              <option value="11-15">11-15 years</option>
                              <option value="16+">16+ years</option>
                            </select>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="furnaceType" className="block text-sm font-medium text-lightgray mb-1">Furnace Type</label>
                              <select 
                                id="furnaceType" 
                                name="furnaceType"
                                className="w-full bg-dark border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                value={formData.furnaceType}
                                onChange={handleInputChange}
                              >
                                <option value="standard">Standard High-Efficiency (92%)</option>
                                <option value="premium">Premium High-Efficiency (96%+)</option>
                              </select>
                            </div>
                            
                            <div>
                              <label htmlFor="acType" className="block text-sm font-medium text-lightgray mb-1">AC Type</label>
                              <select 
                                id="acType" 
                                name="acType"
                                className="w-full bg-dark border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                value={formData.acType}
                                onChange={handleInputChange}
                              >
                                <option value="none">No AC Required</option>
                                <option value="standard">Standard Efficiency</option>
                                <option value="premium">Premium High-Efficiency</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="pt-6 flex justify-end">
                            <button 
                              type="button" 
                              className="bg-primary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold"
                              onClick={handleNextStep}
                            >
                              Next: Advanced Parameters <i className="fas fa-arrow-right ml-2"></i>
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Step 2: Advanced Parameters */}
                      {formStep === 2 && (
                        <div className="space-y-4">
                          <h4 className="font-bold text-xl mb-3">Advanced Parameters</h4>
                          <p className="text-lightgray mb-4">These additional parameters help generate a more accurate quote. All fields are optional.</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="homeBuildYear" className="block text-sm font-medium text-lightgray mb-1">Home Build Year</label>
                              <input 
                                type="number" 
                                id="homeBuildYear" 
                                name="homeBuildYear"
                                placeholder="e.g. 1985" 
                                className="w-full bg-dark border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                value={formData.homeBuildYear}
                                onChange={handleInputChange}
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="numberOfFloors" className="block text-sm font-medium text-lightgray mb-1">Number of Floors</label>
                              <select 
                                id="numberOfFloors" 
                                name="numberOfFloors"
                                className="w-full bg-dark border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                value={formData.numberOfFloors}
                                onChange={handleInputChange}
                              >
                                <option value="1">1 Floor</option>
                                <option value="2">2 Floors</option>
                                <option value="3">3+ Floors</option>
                              </select>
                            </div>
                            
                            <div>
                              <label htmlFor="insulation" className="block text-sm font-medium text-lightgray mb-1">Insulation Quality</label>
                              <select 
                                id="insulation" 
                                name="insulation"
                                className="w-full bg-dark border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                value={formData.insulation}
                                onChange={handleInputChange}
                              >
                                <option value="poor">Poor</option>
                                <option value="average">Average</option>
                                <option value="good">Good</option>
                              </select>
                            </div>
                            
                            <div>
                              <label htmlFor="windows" className="block text-sm font-medium text-lightgray mb-1">Window Type</label>
                              <select 
                                id="windows" 
                                name="windows"
                                className="w-full bg-dark border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                value={formData.windows}
                                onChange={handleInputChange}
                              >
                                <option value="single">Single Pane</option>
                                <option value="standard">Double Pane</option>
                                <option value="higheff">High-Efficiency</option>
                              </select>
                            </div>
                            
                            <div>
                              <label htmlFor="foundationType" className="block text-sm font-medium text-lightgray mb-1">Foundation Type</label>
                              <select 
                                id="foundationType" 
                                name="foundationType"
                                className="w-full bg-dark border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                value={formData.foundationType}
                                onChange={handleInputChange}
                              >
                                <option value="basement">Full Basement</option>
                                <option value="crawlspace">Crawlspace</option>
                                <option value="slab">Slab on Grade</option>
                              </select>
                            </div>
                            
                            <div>
                              <label htmlFor="existingDuctwork" className="block text-sm font-medium text-lightgray mb-1">Existing Ductwork</label>
                              <select 
                                id="existingDuctwork" 
                                name="existingDuctwork"
                                className="w-full bg-dark border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                value={formData.existingDuctwork}
                                onChange={handleInputChange}
                              >
                                <option value="yes">Yes, in good condition</option>
                                <option value="no">No or needs replacement</option>
                              </select>
                            </div>
                            
                            <div>
                              <label htmlFor="homeOrientation" className="block text-sm font-medium text-lightgray mb-1">Home Orientation</label>
                              <select 
                                id="homeOrientation" 
                                name="homeOrientation"
                                className="w-full bg-dark border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                value={formData.homeOrientation}
                                onChange={handleInputChange}
                              >
                                <option value="north">North</option>
                                <option value="south">South</option>
                                <option value="east">East</option>
                                <option value="west">West</option>
                              </select>
                            </div>
                            
                            <div>
                              <label htmlFor="ceilingHeight" className="block text-sm font-medium text-lightgray mb-1">Ceiling Height (ft)</label>
                              <input 
                                type="number" 
                                id="ceilingHeight" 
                                name="ceilingHeight"
                                placeholder="e.g. 8" 
                                className="w-full bg-dark border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                value={formData.ceilingHeight}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          
                          <div className="pt-6 flex justify-between">
                            <button 
                              type="button" 
                              className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-md transition-all font-medium"
                              onClick={handlePreviousStep}
                            >
                              <i className="fas fa-arrow-left mr-2"></i> Previous
                            </button>
                            <button 
                              type="button" 
                              className="bg-primary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold"
                              onClick={handleNextStep}
                            >
                              Next: Client Information <i className="fas fa-arrow-right ml-2"></i>
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Step 3: Client Information */}
                      {formStep === 3 && (
                        <div className="space-y-4">
                          <h4 className="font-bold text-xl mb-3">Client Information</h4>
                          <p className="text-lightgray mb-4">Add client details to generate a personalized quote.</p>
                          
                          <div>
                            <label htmlFor="clientName" className="block text-sm font-medium text-lightgray mb-1">Client Name <span className="text-red-500">*</span></label>
                            <input 
                              type="text" 
                              id="clientName" 
                              name="clientName"
                              placeholder="Enter client name" 
                              className="w-full bg-dark border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                              value={formData.clientName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="clientEmail" className="block text-sm font-medium text-lightgray mb-1">Email <span className="text-red-500">*</span></label>
                              <input 
                                type="email" 
                                id="clientEmail" 
                                name="clientEmail"
                                placeholder="Enter email address" 
                                className="w-full bg-dark border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                value={formData.clientEmail}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="clientPhone" className="block text-sm font-medium text-lightgray mb-1">Phone <span className="text-red-500">*</span></label>
                              <input 
                                type="tel" 
                                id="clientPhone" 
                                name="clientPhone"
                                placeholder="Enter phone number" 
                                className="w-full bg-dark border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                value={formData.clientPhone}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="additionalNotes" className="block text-sm font-medium text-lightgray mb-1">Additional Notes</label>
                            <textarea 
                              id="additionalNotes" 
                              name="additionalNotes"
                              rows={4} 
                              placeholder="Enter any additional notes or special requirements" 
                              className="w-full bg-dark border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                              value={formData.additionalNotes}
                              onChange={handleInputChange}
                            ></textarea>
                          </div>
                          
                          <div className="pt-6 flex justify-between">
                            <button 
                              type="button" 
                              className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-md transition-all font-medium"
                              onClick={handlePreviousStep}
                            >
                              <i className="fas fa-arrow-left mr-2"></i> Previous
                            </button>
                            <button 
                              type="button" 
                              className="bg-primary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold disabled:opacity-50"
                              onClick={generateProQuote}
                              disabled={isGeneratingQuote}
                            >
                              {isGeneratingQuote ? (
                                <span className="flex items-center">
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Generating Quote...
                                </span>
                              ) : "Generate Detailed Quote"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Basic Calculator Form
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-lightgray mb-1">Property Type</label>
                        <div className="grid grid-cols-2 gap-4">
                          <div 
                            className={`bg-dark rounded-md p-4 border ${formData.propertyType === 'residential' ? 'border-primary' : 'border-gray-700'} cursor-pointer hover:border-primary transition-colors`}
                            onClick={() => handlePropertyTypeChange('residential')}
                          >
                            <div className="flex items-center">
                              <input 
                                type="radio" 
                                name="propertyType" 
                                className="mr-3" 
                                checked={formData.propertyType === 'residential'}
                                onChange={() => handlePropertyTypeChange('residential')}
                              />
                              <label className="cursor-pointer">
                                <div className="font-medium">Residential</div>
                                <div className="text-xs text-lightgray">Homes & Condos</div>
                              </label>
                            </div>
                          </div>
                          
                          <div 
                            className={`bg-dark rounded-md p-4 border ${formData.propertyType === 'commercial' ? 'border-primary' : 'border-gray-700'} cursor-pointer hover:border-primary transition-colors`}
                            onClick={() => handlePropertyTypeChange('commercial')}
                          >
                            <div className="flex items-center">
                              <input 
                                type="radio" 
                                name="propertyType" 
                                className="mr-3"
                                checked={formData.propertyType === 'commercial'}
                                onChange={() => handlePropertyTypeChange('commercial')}
                              />
                              <label className="cursor-pointer">
                                <div className="font-medium">Commercial</div>
                                <div className="text-xs text-lightgray">Offices & Retail</div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="squareFootage" className="block text-sm font-medium text-lightgray mb-1">Square Footage <span className="text-red-500">*</span></label>
                        <input 
                          type="number" 
                          id="squareFootage" 
                          name="squareFootage"
                          placeholder="Enter square feet" 
                          className="w-full bg-dark border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                          value={formData.squareFootage}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="currentSystemAge" className="block text-sm font-medium text-lightgray mb-1">Current System Age <span className="text-red-500">*</span></label>
                        <select 
                          id="currentSystemAge" 
                          name="currentSystemAge"
                          className="w-full bg-dark border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                          value={formData.currentSystemAge}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select age range</option>
                          <option value="0-5">0-5 years</option>
                          <option value="6-10">6-10 years</option>
                          <option value="11-15">11-15 years</option>
                          <option value="16+">16+ years</option>
                        </select>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="furnaceType" className="block text-sm font-medium text-lightgray mb-1">Furnace Type</label>
                          <select 
                            id="furnaceType" 
                            name="furnaceType"
                            className="w-full bg-dark border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            value={formData.furnaceType}
                            onChange={handleInputChange}
                          >
                            <option value="standard">Standard High-Efficiency (92%)</option>
                            <option value="premium">Premium High-Efficiency (96%+)</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="acType" className="block text-sm font-medium text-lightgray mb-1">AC Type</label>
                          <select 
                            id="acType" 
                            name="acType"
                            className="w-full bg-dark border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            value={formData.acType}
                            onChange={handleInputChange}
                          >
                            <option value="none">No AC Required</option>
                            <option value="standard">Standard Efficiency</option>
                            <option value="premium">Premium High-Efficiency</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex justify-between pt-4">
                        <button 
                          type="button" 
                          className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-md transition-all font-medium"
                          onClick={() => {
                            setFormData({
                              propertyType: 'residential',
                              squareFootage: '',
                              currentSystemAge: '',
                              furnaceType: 'standard',
                              acType: 'standard',
                              clientName: '',
                              clientEmail: '',
                              clientPhone: '',
                              additionalNotes: '',
                              numberOfFloors: '1',
                              insulation: 'average',
                              windows: 'standard',
                              foundationType: 'basement',
                              existingDuctwork: 'yes',
                              homeOrientation: 'north',
                              ceilingHeight: '8',
                              homeBuildYear: '',
                            });
                            setShowResults(false);
                          }}
                        >
                          Reset
                        </button>
                        <div className="flex space-x-3">
                          <button 
                            type="button" 
                            className="bg-secondary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-medium"
                            onClick={handleProCalculatorClick}
                          >
                            Upgrade to Pro
                          </button>
                          <button 
                            type="button" 
                            className="bg-primary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-medium"
                            onClick={handleCalculate}
                          >
                            Calculate
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Results Display - Same for both Pro and Basic but with more details for Pro */}
                  {showResults && results && (
                    <div className="mt-8 p-6 bg-dark border border-gray-700 rounded-lg">
                      <h4 className="text-2xl font-bold mb-6 font-header text-center">
                        {hasAccess ? "Detailed HVAC System Quote" : "HVAC System Estimate"}
                      </h4>
                      
                      {hasAccess && (
                        <div className="bg-darkgray p-4 rounded-lg border border-gray-700 mb-6">
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-semibold">Quote for: {formData.clientName}</h5>
                            <span className="text-sm text-lightgray">Generated: {new Date().toLocaleDateString()}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-lightgray">Email: </span>
                              <span>{formData.clientEmail}</span>
                            </div>
                            <div>
                              <span className="text-lightgray">Phone: </span>
                              <span>{formData.clientPhone}</span>
                            </div>
                            <div>
                              <span className="text-lightgray">Property: </span>
                              <span>{formData.propertyType}, {formData.squareFootage} sq ft</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h5 className="font-semibold text-lg mb-4 flex items-center">
                            <i className="fas fa-tags text-primary mr-2"></i> System Recommendation
                          </h5>
                          <div className="bg-darkgray p-4 rounded-lg border border-gray-700 h-full">
                            <div className="mb-4">
                              <div className="text-xl font-bold text-primary mb-2">{results.systemRecommendation}</div>
                              <p className="text-lightgray">Recommended for your {formData.squareFootage} sq ft {formData.propertyType} property</p>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                                <span className="text-lightgray">Estimated Price Range:</span>
                                <span className="font-semibold">{formatCurrency(results.costRange.low)} - {formatCurrency(results.costRange.high)}</span>
                              </div>
                              <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                                <span className="text-lightgray">Estimated Installation Time:</span>
                                <span>{results.installationTime}</span>
                              </div>
                            </div>
                            
                            {/* Pro Calculator Equipment Details with Editable Capability */}
                            {hasAccess && results.isEditable && (
                              <div className="mt-4 pt-4 border-t border-gray-700">
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="font-semibold text-lg">Equipment Details</h4>
                                  <button
                                    className="text-xs bg-secondary py-1 px-2 rounded text-white"
                                    onClick={() => {
                                      if (isEquipmentEditMode) {
                                        saveAllEdits();
                                      } else {
                                        setIsEquipmentEditMode(true);
                                      }
                                    }}
                                  >
                                    {isEquipmentEditMode ? 'Save Changes' : 'Edit Equipment'}
                                  </button>
                                </div>
                                
                                {/* Furnace Details */}
                                <div className="bg-darkgray p-3 rounded-lg mb-3">
                                  <div className="font-semibold mb-2 border-b border-gray-700 pb-1">Furnace</div>
                                  {isEquipmentEditMode ? (
                                    <div className="space-y-2">
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="text-xs text-lightgray">Model</label>
                                          <input 
                                            type="text" 
                                            className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                            value={editableResults.equipmentDetails.furnace.model}
                                            onChange={(e) => handleEquipmentChange('furnace', 'model', e.target.value)}
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-lightgray">Manufacturer</label>
                                          <input 
                                            type="text" 
                                            className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                            value={editableResults.equipmentDetails.furnace.manufacturer}
                                            onChange={(e) => handleEquipmentChange('furnace', 'manufacturer', e.target.value)}
                                          />
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="text-xs text-lightgray">BTU Output</label>
                                          <input 
                                            type="number" 
                                            className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                            value={editableResults.equipmentDetails.furnace.btuOutput}
                                            onChange={(e) => handleEquipmentChange('furnace', 'btuOutput', parseInt(e.target.value))}
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-lightgray">AFUE Rating</label>
                                          <input 
                                            type="number" 
                                            step="0.1"
                                            className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                            value={editableResults.equipmentDetails.furnace.afueRating}
                                            onChange={(e) => handleEquipmentChange('furnace', 'afueRating', parseFloat(e.target.value))}
                                          />
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="text-xs text-lightgray">Equipment Price</label>
                                          <input 
                                            type="number" 
                                            className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                            value={editableResults.equipmentDetails.furnace.price}
                                            onChange={(e) => handleEquipmentChange('furnace', 'price', parseInt(e.target.value))}
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-lightgray">Installation Cost</label>
                                          <input 
                                            type="number" 
                                            className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                            value={editableResults.equipmentDetails.furnace.installationCost}
                                            onChange={(e) => handleEquipmentChange('furnace', 'installationCost', parseInt(e.target.value))}
                                          />
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="text-xs text-lightgray">Annual Operating Cost</label>
                                          <input 
                                            type="number" 
                                            className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                            value={editableResults.equipmentDetails.furnace.annualOperatingCost}
                                            onChange={(e) => handleEquipmentChange('furnace', 'annualOperatingCost', parseInt(e.target.value))}
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-lightgray">Expected Lifespan (years)</label>
                                          <input 
                                            type="number" 
                                            className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                            value={editableResults.equipmentDetails.furnace.lifespan}
                                            onChange={(e) => handleEquipmentChange('furnace', 'lifespan', parseInt(e.target.value))}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="space-y-1 text-sm">
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <span className="text-xs text-lightgray">Model:</span>
                                          <div>{results.equipmentDetails.furnace.model}</div>
                                        </div>
                                        <div>
                                          <span className="text-xs text-lightgray">Manufacturer:</span>
                                          <div>{results.equipmentDetails.furnace.manufacturer}</div>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <span className="text-xs text-lightgray">BTU Output:</span>
                                          <div>{results.equipmentDetails.furnace.btuOutput.toLocaleString()} BTU</div>
                                        </div>
                                        <div>
                                          <span className="text-xs text-lightgray">AFUE Rating:</span>
                                          <div>{results.equipmentDetails.furnace.afueRating}%</div>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <span className="text-xs text-lightgray">Price:</span>
                                          <div>{formatCurrency(results.equipmentDetails.furnace.price)}</div>
                                        </div>
                                        <div>
                                          <span className="text-xs text-lightgray">Installation:</span>
                                          <div>{formatCurrency(results.equipmentDetails.furnace.installationCost)}</div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Air Conditioner Details */}
                                {results.equipmentDetails.ac && (
                                  <div className="bg-darkgray p-3 rounded-lg mb-3">
                                    <div className="font-semibold mb-2 border-b border-gray-700 pb-1">Air Conditioner</div>
                                    {isEquipmentEditMode ? (
                                      <div className="space-y-2">
                                        <div className="grid grid-cols-2 gap-2">
                                          <div>
                                            <label className="text-xs text-lightgray">Model</label>
                                            <input 
                                              type="text" 
                                              className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                              value={editableResults.equipmentDetails.ac?.model || ''}
                                              onChange={(e) => handleEquipmentChange('ac', 'model', e.target.value)}
                                            />
                                          </div>
                                          <div>
                                            <label className="text-xs text-lightgray">Manufacturer</label>
                                            <input 
                                              type="text" 
                                              className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                              value={editableResults.equipmentDetails.ac?.manufacturer || ''}
                                              onChange={(e) => handleEquipmentChange('ac', 'manufacturer', e.target.value)}
                                            />
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                          <div>
                                            <label className="text-xs text-lightgray">BTU Output</label>
                                            <input 
                                              type="number" 
                                              className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                              value={editableResults.equipmentDetails.ac?.btuOutput || 0}
                                              onChange={(e) => handleEquipmentChange('ac', 'btuOutput', parseInt(e.target.value))}
                                            />
                                          </div>
                                          <div>
                                            <label className="text-xs text-lightgray">SEER Rating</label>
                                            <input 
                                              type="number" 
                                              step="0.1"
                                              className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                              value={editableResults.equipmentDetails.ac?.seerRating || 0}
                                              onChange={(e) => handleEquipmentChange('ac', 'seerRating', parseFloat(e.target.value))}
                                            />
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                          <div>
                                            <label className="text-xs text-lightgray">Equipment Price</label>
                                            <input 
                                              type="number" 
                                              className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                              value={editableResults.equipmentDetails.ac?.price || 0}
                                              onChange={(e) => handleEquipmentChange('ac', 'price', parseInt(e.target.value))}
                                            />
                                          </div>
                                          <div>
                                            <label className="text-xs text-lightgray">Installation Cost</label>
                                            <input 
                                              type="number" 
                                              className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                              value={editableResults.equipmentDetails.ac?.installationCost || 0}
                                              onChange={(e) => handleEquipmentChange('ac', 'installationCost', parseInt(e.target.value))}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="space-y-1 text-sm">
                                        <div className="grid grid-cols-2 gap-2">
                                          <div>
                                            <span className="text-xs text-lightgray">Model:</span>
                                            <div>{results.equipmentDetails.ac.model}</div>
                                          </div>
                                          <div>
                                            <span className="text-xs text-lightgray">Manufacturer:</span>
                                            <div>{results.equipmentDetails.ac.manufacturer}</div>
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                          <div>
                                            <span className="text-xs text-lightgray">BTU Output:</span>
                                            <div>{results.equipmentDetails.ac.btuOutput.toLocaleString()} BTU</div>
                                          </div>
                                          <div>
                                            <span className="text-xs text-lightgray">SEER Rating:</span>
                                            <div>{results.equipmentDetails.ac.seerRating}</div>
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                          <div>
                                            <span className="text-xs text-lightgray">Price:</span>
                                            <div>{formatCurrency(results.equipmentDetails.ac.price)}</div>
                                          </div>
                                          <div>
                                            <span className="text-xs text-lightgray">Installation:</span>
                                            <div>{formatCurrency(results.equipmentDetails.ac.installationCost)}</div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {/* Thermostat Details */}
                                <div className="bg-darkgray p-3 rounded-lg mb-3">
                                  <div className="font-semibold mb-2 border-b border-gray-700 pb-1">Thermostat</div>
                                  {isEquipmentEditMode ? (
                                    <div className="space-y-2">
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="text-xs text-lightgray">Model</label>
                                          <input 
                                            type="text" 
                                            className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                            value={editableResults.equipmentDetails.thermostat.model}
                                            onChange={(e) => handleEquipmentChange('thermostat', 'model', e.target.value)}
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-lightgray">Manufacturer</label>
                                          <input 
                                            type="text" 
                                            className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                            value={editableResults.equipmentDetails.thermostat.manufacturer}
                                            onChange={(e) => handleEquipmentChange('thermostat', 'manufacturer', e.target.value)}
                                          />
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="text-xs text-lightgray">Price</label>
                                          <input 
                                            type="number" 
                                            className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                            value={editableResults.equipmentDetails.thermostat.price}
                                            onChange={(e) => handleEquipmentChange('thermostat', 'price', parseInt(e.target.value))}
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-lightgray">Installation Cost</label>
                                          <input 
                                            type="number" 
                                            className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                            value={editableResults.equipmentDetails.thermostat.installationCost}
                                            onChange={(e) => handleEquipmentChange('thermostat', 'installationCost', parseInt(e.target.value))}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="space-y-1 text-sm">
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <span className="text-xs text-lightgray">Model:</span>
                                          <div>{results.equipmentDetails.thermostat.model}</div>
                                        </div>
                                        <div>
                                          <span className="text-xs text-lightgray">Features:</span>
                                          <div>{results.equipmentDetails.thermostat.features.join(', ')}</div>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <span className="text-xs text-lightgray">Price:</span>
                                          <div>{formatCurrency(results.equipmentDetails.thermostat.price)}</div>
                                        </div>
                                        <div>
                                          <span className="text-xs text-lightgray">Installation:</span>
                                          <div>{formatCurrency(results.equipmentDetails.thermostat.installationCost)}</div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {/* Accessories Section - Simpler for basic version, detailed for Pro */}
                            {hasAccess ? (
                              <div className="mt-4 pt-4 border-t border-gray-700">
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="font-semibold">Recommended Accessories</h4>
                                  {results.isEditable && (
                                    <button
                                      className="text-xs bg-secondary py-1 px-2 rounded text-white"
                                      onClick={() => {
                                        if (isAccessoriesEditMode) {
                                          saveAllEdits();
                                        } else {
                                          setIsAccessoriesEditMode(true);
                                        }
                                      }}
                                    >
                                      {isAccessoriesEditMode ? 'Save Changes' : 'Edit Accessories'}
                                    </button>
                                  )}
                                </div>
                                
                                {isAccessoriesEditMode && results.isEditable ? (
                                  <div className="space-y-3">
                                    {editableResults.equipmentDetails.accessories.map((accessory, index) => (
                                      <div key={index} className="bg-darkgray p-2 rounded border border-gray-700">
                                        <div className="grid grid-cols-2 gap-2 mb-2">
                                          <div>
                                            <label className="text-xs text-lightgray">Name</label>
                                            <input 
                                              type="text" 
                                              className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                              value={accessory.name}
                                              onChange={(e) => handleAccessoryChange(index, 'name', e.target.value)}
                                            />
                                          </div>
                                          <div>
                                            <label className="text-xs text-lightgray">Description</label>
                                            <input 
                                              type="text" 
                                              className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                              value={accessory.description}
                                              onChange={(e) => handleAccessoryChange(index, 'description', e.target.value)}
                                            />
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div>
                                            <label className="text-xs text-lightgray">Price</label>
                                            <input 
                                              type="number" 
                                              className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                              value={accessory.price}
                                              onChange={(e) => handleAccessoryChange(index, 'price', parseInt(e.target.value))}
                                            />
                                          </div>
                                          <div>
                                            <label className="text-xs text-lightgray">Installation</label>
                                            <input 
                                              type="number" 
                                              className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                              value={accessory.installationCost}
                                              onChange={(e) => handleAccessoryChange(index, 'installationCost', parseInt(e.target.value))}
                                            />
                                          </div>
                                          <div>
                                            <label className="text-xs text-lightgray">Lifespan (years)</label>
                                            <input 
                                              type="number" 
                                              className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                              value={accessory.lifespan}
                                              onChange={(e) => handleAccessoryChange(index, 'lifespan', parseInt(e.target.value))}
                                            />
                                          </div>
                                        </div>
                                        <div className="mt-2 text-right">
                                          <button
                                            className="text-xs bg-red-900 hover:bg-red-800 py-1 px-2 rounded text-white"
                                            onClick={() => handleRemoveAccessory(index)}
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                    <button
                                      className="w-full text-sm bg-dark hover:bg-opacity-80 border border-dashed border-gray-600 py-2 rounded text-lightgray"
                                      onClick={handleAddAccessory}
                                    >
                                      + Add Accessory
                                    </button>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {results.equipmentDetails.accessories.map((accessory, index) => (
                                      <div key={index} className="bg-darkgray p-2 rounded flex items-start">
                                        <i className="fas fa-plus-circle text-green-500 mr-2 mt-1"></i>
                                        <div>
                                          <div className="font-medium">{accessory.name}</div>
                                          {hasAccess && (
                                            <>
                                              <div className="text-sm text-lightgray">{accessory.description}</div>
                                              <div className="text-sm mt-1">
                                                <span className="text-secondary font-semibold">{formatCurrency(accessory.price)}</span>
                                                <span className="text-xs text-lightgray ml-2">
                                                  (Install: {formatCurrency(accessory.installationCost)})
                                                </span>
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="mt-4 pt-4 border-t border-gray-700">
                                <div className="font-semibold mb-2">Recommended Accessories:</div>
                                <ul className="space-y-1">
                                  {results.equipmentDetails.accessories.map((accessory, index) => (
                                    <li key={index} className="flex items-center">
                                      <i className="fas fa-check text-green-500 mr-2"></i>
                                      {accessory.name}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-semibold text-lg mb-4 flex items-center">
                            <i className="fas fa-chart-line text-primary mr-2"></i> Energy & Cost Analysis
                          </h5>
                          <div className="bg-darkgray p-4 rounded-lg border border-gray-700">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div>
                                <p className="text-sm text-lightgray">Current Annual Cost</p>
                                <p className="text-xl font-semibold text-white">{formatCurrency(results.currentCost)}</p>
                              </div>
                              <div>
                                <p className="text-sm text-lightgray">New System Annual Cost</p>
                                <p className="text-xl font-semibold text-secondary">{formatCurrency(results.newCost)}</p>
                              </div>
                            </div>
                            
                            <div className="mb-6">
                              <div className="relative pt-1">
                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    <span className="text-xs text-lightgray">Annual Energy Savings</span>
                                  </div>
                                  <div>
                                    <span className="text-xs font-semibold text-secondary">{Math.round((results.savings / results.currentCost) * 100)}%</span>
                                  </div>
                                </div>
                                <div className="overflow-hidden h-2 text-xs flex rounded bg-dark">
                                  <div style={{ width: `${Math.round((results.savings / results.currentCost) * 100)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-secondary"></div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                              <div>
                                <p className="text-sm text-lightgray">Annual Savings</p>
                                <p className="text-2xl font-bold text-primary">{formatCurrency(results.savings)}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-lightgray">ROI Timeline</p>
                                <p className="text-lg font-semibold text-white">{results.roi} years</p>
                              </div>
                            </div>
                            
                            {hasAccess && (
                              <div className="pt-4">
                                <div className="flex justify-between items-center">
                                  <span className="text-lightgray">CO2 Reduction:</span>
                                  <span className="font-semibold">{results.carbonReduction} kg/year</span>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Materials and Labor Details for Pro Users */}
                          {hasAccess && results && results.isEditable && (
                            <>
                              <div className="mt-6 pt-4 border-t border-gray-700">
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="font-semibold text-lg">Materials Breakdown</h4>
                                  <button
                                    className="text-xs bg-secondary py-1 px-2 rounded text-white"
                                    onClick={() => {
                                      if (isMaterialsEditMode) {
                                        saveAllEdits();
                                      } else {
                                        setIsMaterialsEditMode(true);
                                      }
                                    }}
                                  >
                                    {isMaterialsEditMode ? 'Save Changes' : 'Edit Materials'}
                                  </button>
                                </div>
                                
                                {isMaterialsEditMode ? (
                                  <div className="space-y-3 mb-4">
                                    <div className="bg-darkgray p-3 rounded-lg">
                                      <h6 className="font-semibold text-sm mb-2">Ductwork</h6>
                                      {editableResults?.materialsDetails.ductwork.map((item, index) => (
                                        <div key={`duct-${index}`} className="bg-dark p-2 rounded mb-2 border border-gray-700">
                                          <div className="grid grid-cols-4 gap-2">
                                            <div>
                                              <label className="text-xs text-lightgray">Type</label>
                                              <input
                                                type="text"
                                                className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                                value={item.type}
                                                onChange={(e) => handleMaterialChange('ductwork', index, 'type', e.target.value)}
                                              />
                                            </div>
                                            <div>
                                              <label className="text-xs text-lightgray">Length (ft)</label>
                                              <input
                                                type="number"
                                                className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                                value={item.length}
                                                onChange={(e) => handleMaterialChange('ductwork', index, 'length', parseInt(e.target.value))}
                                              />
                                            </div>
                                            <div>
                                              <label className="text-xs text-lightgray">Cost</label>
                                              <input
                                                type="number"
                                                className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                                value={item.materialCost}
                                                onChange={(e) => handleMaterialChange('ductwork', index, 'materialCost', parseInt(e.target.value))}
                                              />
                                            </div>
                                            <div>
                                              <label className="text-xs text-lightgray">Install</label>
                                              <input
                                                type="number"
                                                className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                                value={item.installationCost}
                                                onChange={(e) => handleMaterialChange('ductwork', index, 'installationCost', parseInt(e.target.value))}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    
                                    <div className="bg-darkgray p-3 rounded-lg">
                                      <h6 className="font-semibold text-sm mb-2">Refrigerant</h6>
                                      <div className="grid grid-cols-3 gap-2">
                                        <div>
                                          <label className="text-xs text-lightgray">Type</label>
                                          <input
                                            type="text"
                                            className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                            value={editableResults?.materialsDetails.refrigerant.type}
                                            onChange={(e) => handleRefrigerantChange('type', e.target.value)}
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-lightgray">Amount (lbs)</label>
                                          <input
                                            type="number"
                                            className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                            value={editableResults?.materialsDetails.refrigerant.amount}
                                            onChange={(e) => handleRefrigerantChange('amount', parseInt(e.target.value))}
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-lightgray">Cost per Unit</label>
                                          <input
                                            type="number"
                                            className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                            value={editableResults?.materialsDetails.refrigerant.costPerUnit}
                                            onChange={(e) => handleRefrigerantChange('costPerUnit', parseInt(e.target.value))}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="mb-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div className="bg-darkgray p-3 rounded-lg">
                                        <h6 className="font-semibold text-sm mb-2">Ductwork</h6>
                                        <table className="w-full text-sm">
                                          <thead className="text-xs text-lightgray">
                                            <tr>
                                              <th className="text-left pb-1">Type</th>
                                              <th className="text-right pb-1">Length</th>
                                              <th className="text-right pb-1">Cost</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {results.materialsDetails.ductwork.map((item, index) => (
                                              <tr key={index} className="border-t border-gray-700">
                                                <td className="py-1">{item.type}</td>
                                                <td className="text-right py-1">{item.length} ft</td>
                                                <td className="text-right py-1">{formatCurrency(item.materialCost)}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                      
                                      <div className="bg-darkgray p-3 rounded-lg">
                                        <h6 className="font-semibold text-sm mb-2">Other Materials</h6>
                                        <div className="space-y-2">
                                          <div className="flex justify-between text-sm">
                                            <span>Refrigerant ({results.materialsDetails.refrigerant.type})</span>
                                            <span>{results.materialsDetails.refrigerant.amount} lbs @ {formatCurrency(results.materialsDetails.refrigerant.costPerUnit)}/lb</span>
                                          </div>
                                          <div className="flex justify-between text-sm">
                                            <span>Installation Materials</span>
                                            <span>{formatCurrency(results.materialsDetails.additionalMaterials.reduce((sum, item) => sum + (item.quantity * item.costPerUnit), 0))}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                <div className="flex justify-between items-center mb-3 pt-2">
                                  <h4 className="font-semibold text-lg">Labor Details</h4>
                                  <button
                                    className="text-xs bg-secondary py-1 px-2 rounded text-white"
                                    onClick={() => {
                                      if (isLaborEditMode) {
                                        saveAllEdits();
                                      } else {
                                        setIsLaborEditMode(true);
                                      }
                                    }}
                                  >
                                    {isLaborEditMode ? 'Save Changes' : 'Edit Labor'}
                                  </button>
                                </div>
                                
                                {isLaborEditMode ? (
                                  <div className="space-y-3 mb-4">
                                    {editableResults?.laborDetails.technicians.map((tech, index) => (
                                      <div key={`tech-${index}`} className="bg-darkgray p-2 rounded border border-gray-700">
                                        <div className="grid grid-cols-3 gap-2">
                                          <div>
                                            <label className="text-xs text-lightgray">Role</label>
                                            <input
                                              type="text"
                                              className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                              value={tech.role}
                                              onChange={(e) => handleLaborChange(index, 'role', e.target.value)}
                                            />
                                          </div>
                                          <div>
                                            <label className="text-xs text-lightgray">Hours</label>
                                            <input
                                              type="number"
                                              className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                              value={tech.hours}
                                              onChange={(e) => handleLaborChange(index, 'hours', parseInt(e.target.value))}
                                            />
                                          </div>
                                          <div>
                                            <label className="text-xs text-lightgray">Hourly Rate</label>
                                            <input
                                              type="number"
                                              className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                              value={tech.hourlyRate}
                                              onChange={(e) => handleLaborChange(index, 'hourlyRate', parseInt(e.target.value))}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    
                                    <div className="bg-darkgray p-3 rounded-lg">
                                      <h6 className="font-semibold text-sm mb-2">Additional Costs</h6>
                                      <div className="grid grid-cols-3 gap-2">
                                        <div>
                                          <label className="text-xs text-lightgray">Permit Fees</label>
                                          <input
                                            type="number"
                                            className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                            value={editableResults?.laborDetails.permitFees}
                                            onChange={(e) => handleAdditionalLaborCostChange('permitFees', parseInt(e.target.value))}
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-lightgray">Inspection Fees</label>
                                          <input
                                            type="number"
                                            className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                            value={editableResults?.laborDetails.inspectionFees}
                                            onChange={(e) => handleAdditionalLaborCostChange('inspectionFees', parseInt(e.target.value))}
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-lightgray">Travel Costs</label>
                                          <input
                                            type="number"
                                            className="w-full bg-dark border border-gray-700 rounded px-2 py-1 text-sm"
                                            value={editableResults?.laborDetails.travelCosts}
                                            onChange={(e) => handleAdditionalLaborCostChange('travelCosts', parseInt(e.target.value))}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="mb-4">
                                    <div className="bg-darkgray p-3 rounded-lg">
                                      <table className="w-full text-sm">
                                        <thead className="text-xs text-lightgray">
                                          <tr>
                                            <th className="text-left pb-1">Labor</th>
                                            <th className="text-right pb-1">Hours</th>
                                            <th className="text-right pb-1">Rate</th>
                                            <th className="text-right pb-1">Total</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {results.laborDetails.technicians.map((tech, index) => (
                                            <tr key={index} className="border-t border-gray-700">
                                              <td className="py-1">{tech.role}</td>
                                              <td className="text-right py-1">{tech.hours}</td>
                                              <td className="text-right py-1">{formatCurrency(tech.hourlyRate)}/hr</td>
                                              <td className="text-right py-1">{formatCurrency(tech.hours * tech.hourlyRate)}</td>
                                            </tr>
                                          ))}
                                          <tr className="border-t border-gray-700">
                                            <td className="py-1">Permits & Fees</td>
                                            <td className="text-right py-1">-</td>
                                            <td className="text-right py-1">-</td>
                                            <td className="text-right py-1">{formatCurrency(results.laborDetails.permitFees + results.laborDetails.inspectionFees)}</td>
                                          </tr>
                                          <tr className="border-t border-gray-700">
                                            <td className="py-1">Travel</td>
                                            <td className="text-right py-1">-</td>
                                            <td className="text-right py-1">-</td>
                                            <td className="text-right py-1">{formatCurrency(results.laborDetails.travelCosts)}</td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                          
                          {hasAccess && (
                            <div className="mt-4 flex space-x-3">
                              <button 
                                onClick={handleDownloadQuote} 
                                className="flex-1 bg-secondary hover:bg-opacity-80 text-white py-2 px-3 rounded-md transition-all font-medium text-sm flex items-center justify-center"
                              >
                                <i className="fas fa-file-pdf mr-2"></i> Download Quote
                              </button>
                              <button 
                                onClick={handleEmailQuote}
                                className="flex-1 bg-primary hover:bg-opacity-80 text-white py-2 px-3 rounded-md transition-all font-medium text-sm flex items-center justify-center"
                              >
                                <i className="fas fa-envelope mr-2"></i> Email Quote
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 justify-center pt-4 border-t border-gray-700">
                        <a 
                          href="https://calendar.app.google/NXZB4v1PP57HhARL7" 
                          target="_blank"
                          rel="noopener noreferrer" 
                          className="bg-primary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold"
                        >
                          <i className="fas fa-calendar-alt mr-2"></i> Schedule Consultation
                        </a>
                        <Link href="/contact">
                          <a className="bg-secondary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold">
                            <i className="fas fa-comment mr-2"></i> Contact Us
                          </a>
                        </Link>
                      </div>
                      
                      {!hasAccess && (
                        <div className="mt-8 bg-dark p-4 rounded-lg border border-primary">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <i className="fas fa-crown text-primary text-xl mr-3"></i>
                              <div>
                                <h5 className="font-semibold">Want more detailed analysis?</h5>
                                <p className="text-sm text-lightgray">Upgrade to Pro for comprehensive quote generation</p>
                              </div>
                            </div>
                            <button 
                              onClick={handleProCalculatorClick}
                              className="bg-primary hover:bg-opacity-80 text-white py-2 px-4 rounded-md transition-all font-medium text-sm"
                            >
                              Upgrade to Pro
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {!hasAccess && !showPaywall && (
                <div className="mt-8 bg-darkgray rounded-lg p-6 border border-gray-700">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-xl font-bold font-header flex items-center">
                        <i className="fas fa-crown text-primary mr-2"></i> Pro Calculator
                      </h3>
                      <p className="text-lightgray mt-1">Unlock advanced features with our professional HVAC calculator.</p>
                    </div>
                    <button 
                      onClick={handleProCalculatorClick}
                      className="bg-primary hover:bg-opacity-80 text-white py-2 px-6 rounded-md transition-all font-semibold"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
      
      {/* Pro Features Showcase (only shows if user doesn't have Pro) */}
      {!hasAccess && !showPaywall && showLightCalculator && (
        <section className="bg-darkgray py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold font-header mb-4">Pro Calculator <span className="text-primary">Features</span></h2>
                <p className="text-lightgray max-w-3xl mx-auto">See what you're missing with our professional HVAC calculator suite.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-dark p-6 rounded-lg border border-gray-700">
                  <div className="text-primary text-3xl mb-4">
                    <i className="fas fa-calculator"></i>
                  </div>
                  <h3 className="text-xl font-bold font-header mb-2">Advanced Load Calculations</h3>
                  <p className="text-lightgray">Precise equipment sizing with detailed heat load calculations for Alberta homes and buildings.</p>
                </div>
                
                <div className="bg-dark p-6 rounded-lg border border-gray-700">
                  <div className="text-primary text-3xl mb-4">
                    <i className="fas fa-file-invoice-dollar"></i>
                  </div>
                  <h3 className="text-xl font-bold font-header mb-2">Professional Quotes</h3>
                  <p className="text-lightgray">Generate detailed PDF quotes with equipment specifications, pricing, and company branding.</p>
                </div>
                
                <div className="bg-dark p-6 rounded-lg border border-gray-700">
                  <div className="text-primary text-3xl mb-4">
                    <i className="fas fa-database"></i>
                  </div>
                  <h3 className="text-xl font-bold font-header mb-2">Alberta Pricing Database</h3>
                  <p className="text-lightgray">Region-specific material and labor pricing data updated regularly for accurate estimates.</p>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <button 
                  onClick={handleProCalculatorClick}
                  className="bg-primary hover:bg-opacity-80 text-white py-3 px-8 rounded-md transition-all font-semibold"
                >
                  <i className="fas fa-arrow-up mr-2"></i> Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ProCalculator;
