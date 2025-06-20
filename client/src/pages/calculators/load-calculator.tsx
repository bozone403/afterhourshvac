import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Calculator, Thermometer, Home, Wind, Snowflake } from "lucide-react";

export default function LoadCalculator() {
  const [formData, setFormData] = useState({
    squareFootage: "",
    ceilingHeight: "8",
    insulation: "",
    windowType: "",
    windowArea: "",
    occupancy: "",
    climate: "",
    exposures: {
      north: false,
      south: false,
      east: false,
      west: false
    }
  });

  const [results, setResults] = useState<any>(null);

  const calculateLoad = () => {
    const sqft = parseInt(formData.squareFootage) || 0;
    const height = parseFloat(formData.ceilingHeight) || 8;
    const windowArea = parseInt(formData.windowArea) || 0;
    const occupancy = parseInt(formData.occupancy) || 2;

    // Base load calculations (simplified Manual J)
    let baseBtu = sqft * 25; // Base 25 BTU per sq ft

    // Ceiling height adjustment
    if (height > 8) {
      baseBtu *= (height / 8);
    }

    // Insulation factors
    const insulationFactors: Record<string, number> = {
      "poor": 1.3,
      "average": 1.0,
      "good": 0.8,
      "excellent": 0.6
    };

    if (formData.insulation) {
      baseBtu *= insulationFactors[formData.insulation] || 1.0;
    }

    // Window factors
    const windowFactors: Record<string, number> = {
      "single": 1.2,
      "double": 1.0,
      "triple": 0.8,
      "low_e": 0.7
    };

    if (formData.windowType) {
      const windowBtu = windowArea * 200 * (windowFactors[formData.windowType] || 1.0);
      baseBtu += windowBtu;
    }

    // Climate adjustment
    const climateFactors: Record<string, number> = {
      "mild": 0.8,
      "moderate": 1.0,
      "harsh": 1.2,
      "extreme": 1.4
    };

    if (formData.climate) {
      baseBtu *= climateFactors[formData.climate] || 1.0;
    }

    // Occupancy load (300 BTU per person)
    baseBtu += occupancy * 300;

    // Exposure adjustments
    let exposureAdjustment = 1.0;
    if (formData.exposures.south || formData.exposures.west) {
      exposureAdjustment += 0.1; // More heat gain
    }
    if (formData.exposures.north) {
      exposureAdjustment += 0.05; // Some heat loss
    }

    baseBtu *= exposureAdjustment;

    // Equipment recommendations
    const coolingTonnage = Math.ceil(baseBtu / 12000 * 10) / 10; // Round to nearest 0.1 ton
    const heatingBtu = Math.round(baseBtu * 1.1); // 10% heating factor

    // Equipment suggestions by brand
    const equipmentOptions = {
      daikin: {
        cooling: getCoolingUnit("Daikin", coolingTonnage),
        heating: getHeatingUnit("Daikin", heatingBtu)
      },
      ducane: {
        cooling: getCoolingUnit("Ducane", coolingTonnage),
        heating: getHeatingUnit("Ducane", heatingBtu)
      },
      lennox: {
        cooling: getCoolingUnit("Lennox", coolingTonnage),
        heating: getHeatingUnit("Lennox", heatingBtu)
      }
    };

    setResults({
      totalBtu: Math.round(baseBtu),
      coolingTonnage,
      heatingBtu,
      equipmentOptions
    });
  };

  const getCoolingUnit = (brand: string, tonnage: number) => {
    const models: Record<string, Record<string, string>> = {
      "Daikin": {
        "1.5": "DX13SA0181 (1.5 Ton, 13 SEER)",
        "2.0": "DX13SA0241 (2 Ton, 13 SEER)",
        "2.5": "DX13SA0301 (2.5 Ton, 13 SEER)",
        "3.0": "DX13SA0361 (3 Ton, 13 SEER)",
        "3.5": "DX13SA0421 (3.5 Ton, 13 SEER)",
        "4.0": "DX13SA0481 (4 Ton, 13 SEER)",
        "5.0": "DX13SA0601 (5 Ton, 13 SEER)"
      },
      "Ducane": {
        "1.5": "2R13L18P (1.5 Ton, 13 SEER)",
        "2.0": "2R13L24P (2 Ton, 13 SEER)",
        "2.5": "2R13L30P (2.5 Ton, 13 SEER)",
        "3.0": "2R13L36P (3 Ton, 13 SEER)",
        "3.5": "2R13L42P (3.5 Ton, 13 SEER)",
        "4.0": "2R13L48P (4 Ton, 13 SEER)",
        "5.0": "2R13L60P (5 Ton, 13 SEER)"
      },
      "Lennox": {
        "1.5": "13ACX-018 (1.5 Ton, 13 SEER)",
        "2.0": "13ACX-024 (2 Ton, 13 SEER)",
        "2.5": "13ACX-030 (2.5 Ton, 13 SEER)",
        "3.0": "13ACX-036 (3 Ton, 13 SEER)",
        "3.5": "13ACX-042 (3.5 Ton, 13 SEER)",
        "4.0": "13ACX-048 (4 Ton, 13 SEER)",
        "5.0": "13ACX-060 (5 Ton, 13 SEER)"
      }
    };

    const tonnageKey = tonnage.toString();
    return models[brand]?.[tonnageKey] || `${tonnage} Ton Unit`;
  };

  const getHeatingUnit = (brand: string, btu: number) => {
    const models: Record<string, Record<string, string>> = {
      "Daikin": {
        "40000": "DM80SS0403B (40k BTU, 80% AFUE)",
        "60000": "DM80SS0603B (60k BTU, 80% AFUE)",
        "80000": "DM80SS0803B (80k BTU, 80% AFUE)",
        "100000": "DM96SS1003B (100k BTU, 96% AFUE)",
        "120000": "DM96SS1203B (120k BTU, 96% AFUE)"
      },
      "Ducane": {
        "40000": "R801T040 (40k BTU, 80% AFUE)",
        "60000": "R801T060 (60k BTU, 80% AFUE)",
        "80000": "R801T080 (80k BTU, 80% AFUE)",
        "100000": "R96V1003 (100k BTU, 96% AFUE)",
        "120000": "R96V1203 (120k BTU, 96% AFUE)"
      },
      "Lennox": {
        "40000": "ML180UH045P36A (40k BTU, 80% AFUE)",
        "60000": "ML180UH070P36A (60k BTU, 80% AFUE)",
        "80000": "ML180UH090P36A (80k BTU, 80% AFUE)",
        "100000": "SL280V100 (100k BTU, 96% AFUE)",
        "120000": "SL280V120 (120k BTU, 96% AFUE)"
      }
    };

    // Find closest BTU size
    const sizes = [40000, 60000, 80000, 100000, 120000];
    const closestSize = sizes.find(size => size >= btu) || sizes[sizes.length - 1];
    
    return models[brand]?.[closestSize.toString()] || `${Math.round(btu/1000)}k BTU Furnace`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Thermometer className="h-8 w-8 text-blue-600" />
            <Calculator className="h-8 w-8 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">HVAC Load Calculator</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calculate proper equipment sizing for your home with Manual J principles
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-blue-600" />
                Property Details
              </CardTitle>
              <CardDescription>
                Enter your home's specifications for accurate load calculation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="squareFootage">Square Footage</Label>
                  <Input
                    id="squareFootage"
                    type="number"
                    placeholder="e.g., 1500"
                    value={formData.squareFootage}
                    onChange={(e) => setFormData(prev => ({ ...prev, squareFootage: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ceilingHeight">Ceiling Height (ft)</Label>
                  <Select value={formData.ceilingHeight} onValueChange={(value) => setFormData(prev => ({ ...prev, ceilingHeight: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8">8 feet</SelectItem>
                      <SelectItem value="9">9 feet</SelectItem>
                      <SelectItem value="10">10 feet</SelectItem>
                      <SelectItem value="12">12 feet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="windowArea">Window Area (sq ft)</Label>
                  <Input
                    id="windowArea"
                    type="number"
                    placeholder="e.g., 200"
                    value={formData.windowArea}
                    onChange={(e) => setFormData(prev => ({ ...prev, windowArea: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupancy">Number of Occupants</Label>
                  <Input
                    id="occupancy"
                    type="number"
                    placeholder="e.g., 4"
                    value={formData.occupancy}
                    onChange={(e) => setFormData(prev => ({ ...prev, occupancy: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="insulation">Insulation Quality</Label>
                <Select value={formData.insulation} onValueChange={(value) => setFormData(prev => ({ ...prev, insulation: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select insulation level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="poor">Poor (Minimal/Old)</SelectItem>
                    <SelectItem value="average">Average (Standard)</SelectItem>
                    <SelectItem value="good">Good (Above Code)</SelectItem>
                    <SelectItem value="excellent">Excellent (High Performance)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="windowType">Window Type</Label>
                <Select value={formData.windowType} onValueChange={(value) => setFormData(prev => ({ ...prev, windowType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select window type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single Pane</SelectItem>
                    <SelectItem value="double">Double Pane</SelectItem>
                    <SelectItem value="triple">Triple Pane</SelectItem>
                    <SelectItem value="low_e">Low-E Coated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="climate">Climate Zone</Label>
                <Select value={formData.climate} onValueChange={(value) => setFormData(prev => ({ ...prev, climate: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select climate zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild (Minimal extremes)</SelectItem>
                    <SelectItem value="moderate">Moderate (Calgary area)</SelectItem>
                    <SelectItem value="harsh">Harsh (Northern Alberta)</SelectItem>
                    <SelectItem value="extreme">Extreme (Far North)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={calculateLoad} className="w-full" size="lg">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Load
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-blue-600" />
                    Load Calculations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Snowflake className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{results.coolingTonnage} Tons</div>
                      <div className="text-sm text-gray-600">Cooling Capacity</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Wind className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="text-2xl font-bold text-orange-600">{results.heatingBtu.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Heating BTU/hr</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Equipment Recommendations */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Equipment Recommendations</h3>
                
                {/* Daikin */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Daikin Equipment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                      <span className="font-medium">Cooling Unit:</span>
                      <span className="text-sm">{results.equipmentOptions.daikin.cooling}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded">
                      <span className="font-medium">Heating Unit:</span>
                      <span className="text-sm">{results.equipmentOptions.daikin.heating}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Ducane */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Ducane Equipment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                      <span className="font-medium">Cooling Unit:</span>
                      <span className="text-sm">{results.equipmentOptions.ducane.cooling}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded">
                      <span className="font-medium">Heating Unit:</span>
                      <span className="text-sm">{results.equipmentOptions.ducane.heating}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Lennox */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Lennox Equipment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                      <span className="font-medium">Cooling Unit:</span>
                      <span className="text-sm">{results.equipmentOptions.lennox.cooling}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded">
                      <span className="font-medium">Heating Unit:</span>
                      <span className="text-sm">{results.equipmentOptions.lennox.heating}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-to-r from-orange-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Calculator className="h-8 w-8 mx-auto mb-3" />
                    <h3 className="text-lg font-bold mb-2">Need Professional Sizing?</h3>
                    <p className="mb-4 opacity-90">Get a detailed Manual J calculation from our experts</p>
                    <Button variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100">
                      Request Professional Quote
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}