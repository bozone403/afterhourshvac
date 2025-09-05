import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Thermometer, Wind, Snowflake, Home } from "lucide-react";

export default function BTUCalculator() {
  const [formData, setFormData] = useState({
    squareFootage: "",
    roomType: "",
    ceilingHeight: "8",
    insulation: "",
    windowCount: "",
    exposures: "",
    occupancy: ""
  });

  const [results, setResults] = useState<any>(null);

  const calculateBTU = () => {
    const sqft = parseInt(formData.squareFootage) || 0;
    const height = parseFloat(formData.ceilingHeight) || 8;
    const windows = parseInt(formData.windowCount) || 0;
    const occupancy = parseInt(formData.occupancy) || 2;

    // Base BTU calculation
    let baseBtu = sqft * 20; // Base 20 BTU per sq ft

    // Room type adjustments
    const roomFactors: Record<string, number> = {
      "bedroom": 1.0,
      "living_room": 1.1,
      "kitchen": 1.3,
      "dining_room": 1.1,
      "office": 1.1,
      "basement": 0.8,
      "attic": 1.4
    };

    if (formData.roomType) {
      baseBtu *= roomFactors[formData.roomType] || 1.0;
    }

    // Ceiling height adjustment
    if (height > 8) {
      baseBtu *= (height / 8);
    }

    // Insulation adjustments
    const insulationFactors: Record<string, number> = {
      "poor": 1.3,
      "average": 1.0,
      "good": 0.85,
      "excellent": 0.7
    };

    if (formData.insulation) {
      baseBtu *= insulationFactors[formData.insulation] || 1.0;
    }

    // Window load (600 BTU per window average)
    baseBtu += windows * 600;

    // Sun exposure
    const exposureFactors: Record<string, number> = {
      "north": 1.0,
      "east": 1.1,
      "south": 1.15,
      "west": 1.2
    };

    if (formData.exposures) {
      baseBtu *= exposureFactors[formData.exposures] || 1.0;
    }

    // Occupancy (400 BTU per person after first 2)
    if (occupancy > 2) {
      baseBtu += (occupancy - 2) * 400;
    }

    // Equipment recommendations for different brands
    const coolingTonnage = Math.ceil(baseBtu / 12000 * 10) / 10;
    const heatingBtu = Math.round(baseBtu * 1.1);

    // Ducane recommendations
    const ducaneModels = getDucaneModels(coolingTonnage, heatingBtu);
    
    // Daikin recommendations
    const daikinModels = getDaikinModels(coolingTonnage, heatingBtu);
    
    // Lennox recommendations
    const lennoxModels = getLennoxModels(coolingTonnage, heatingBtu);

    setResults({
      totalBtu: Math.round(baseBtu),
      coolingTonnage,
      heatingBtu,
      ducaneModels,
      daikinModels,
      lennoxModels
    });
  };

  const getDucaneModels = (tonnage: number, heatingBtu: number) => {
    const coolingModels: Record<number, string> = {
      1.5: "2R13L18P - 1.5 Ton, 13 SEER",
      2: "2R13L24P - 2 Ton, 13 SEER",
      2.5: "2R13L30P - 2.5 Ton, 13 SEER", 
      3: "2R13L36P - 3 Ton, 13 SEER",
      3.5: "2R13L42P - 3.5 Ton, 13 SEER",
      4: "2R13L48P - 4 Ton, 13 SEER",
      5: "2R13L60P - 5 Ton, 13 SEER"
    };

    const heatingModels: Record<number, string> = {
      40000: "R801T040 - 40k BTU, 80% AFUE",
      60000: "R801T060 - 60k BTU, 80% AFUE", 
      80000: "R801T080 - 80k BTU, 80% AFUE",
      100000: "R96V1003 - 100k BTU, 96% AFUE",
      120000: "R96V1203 - 120k BTU, 96% AFUE"
    };

    const coolingModel = coolingModels[tonnage] || `${tonnage} Ton Unit`;
    
    const heatingSizes = [40000, 60000, 80000, 100000, 120000];
    const closestHeatingSize = heatingSizes.find(size => size >= heatingBtu) || heatingSizes[heatingSizes.length - 1];
    const heatingModel = heatingModels[closestHeatingSize];

    return { cooling: coolingModel, heating: heatingModel };
  };

  const getDaikinModels = (tonnage: number, heatingBtu: number) => {
    const coolingModels: Record<number, string> = {
      1.5: "DX13SA0181 - 1.5 Ton, 13 SEER",
      2: "DX13SA0241 - 2 Ton, 13 SEER",
      2.5: "DX13SA0301 - 2.5 Ton, 13 SEER",
      3: "DX13SA0361 - 3 Ton, 13 SEER", 
      3.5: "DX13SA0421 - 3.5 Ton, 13 SEER",
      4: "DX13SA0481 - 4 Ton, 13 SEER",
      5: "DX13SA0601 - 5 Ton, 13 SEER"
    };

    const heatingModels: Record<number, string> = {
      40000: "DM80SS0403B - 40k BTU, 80% AFUE",
      60000: "DM80SS0603B - 60k BTU, 80% AFUE",
      80000: "DM80SS0803B - 80k BTU, 80% AFUE", 
      100000: "DM96SS1003B - 100k BTU, 96% AFUE",
      120000: "DM96SS1203B - 120k BTU, 96% AFUE"
    };

    const coolingModel = coolingModels[tonnage] || `${tonnage} Ton Unit`;
    
    const heatingSizes = [40000, 60000, 80000, 100000, 120000];
    const closestHeatingSize = heatingSizes.find(size => size >= heatingBtu) || heatingSizes[heatingSizes.length - 1];
    const heatingModel = heatingModels[closestHeatingSize];

    return { cooling: coolingModel, heating: heatingModel };
  };

  const getLennoxModels = (tonnage: number, heatingBtu: number) => {
    const coolingModels: Record<number, string> = {
      1.5: "13ACX-018 - 1.5 Ton, 13 SEER",
      2: "13ACX-024 - 2 Ton, 13 SEER", 
      2.5: "13ACX-030 - 2.5 Ton, 13 SEER",
      3: "13ACX-036 - 3 Ton, 13 SEER",
      3.5: "13ACX-042 - 3.5 Ton, 13 SEER",
      4: "13ACX-048 - 4 Ton, 13 SEER",
      5: "13ACX-060 - 5 Ton, 13 SEER"
    };

    const heatingModels: Record<number, string> = {
      40000: "ML180UH045P36A - 40k BTU, 80% AFUE",
      60000: "ML180UH070P36A - 60k BTU, 80% AFUE",
      80000: "ML180UH090P36A - 80k BTU, 80% AFUE",
      100000: "SL280V100 - 100k BTU, 96% AFUE", 
      120000: "SL280V120 - 120k BTU, 96% AFUE"
    };

    const coolingModel = coolingModels[tonnage] || `${tonnage} Ton Unit`;
    
    const heatingSizes = [40000, 60000, 80000, 100000, 120000];
    const closestHeatingSize = heatingSizes.find(size => size >= heatingBtu) || heatingSizes[heatingSizes.length - 1];
    const heatingModel = heatingModels[closestHeatingSize];

    return { cooling: coolingModel, heating: heatingModel };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="h-8 w-8 text-blue-600" />
            <Thermometer className="h-8 w-8 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">BTU Calculator</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calculate the right heating and cooling capacity for any room or space
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-blue-600" />
                Room Information
              </CardTitle>
              <CardDescription>
                Enter room details for accurate BTU calculation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="squareFootage">Square Footage</Label>
                  <Input
                    id="squareFootage"
                    type="number"
                    placeholder="e.g., 300"
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

              <div className="space-y-2">
                <Label htmlFor="roomType">Room Type</Label>
                <Select value={formData.roomType} onValueChange={(value) => setFormData(prev => ({ ...prev, roomType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bedroom">Bedroom</SelectItem>
                    <SelectItem value="living_room">Living Room</SelectItem>
                    <SelectItem value="kitchen">Kitchen</SelectItem>
                    <SelectItem value="dining_room">Dining Room</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="basement">Basement</SelectItem>
                    <SelectItem value="attic">Attic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="windowCount">Number of Windows</Label>
                  <Input
                    id="windowCount"
                    type="number"
                    placeholder="e.g., 2"
                    value={formData.windowCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, windowCount: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupancy">Average Occupancy</Label>
                  <Input
                    id="occupancy"
                    type="number"
                    placeholder="e.g., 2"
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
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="average">Average</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="exposures">Sun Exposure</Label>
                <Select value={formData.exposures} onValueChange={(value) => setFormData(prev => ({ ...prev, exposures: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Primary sun exposure" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="north">North (Minimal sun)</SelectItem>
                    <SelectItem value="east">East (Morning sun)</SelectItem>
                    <SelectItem value="south">South (Moderate sun)</SelectItem>
                    <SelectItem value="west">West (Afternoon sun)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={calculateBTU} className="w-full" size="lg">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate BTU Requirements
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
                    BTU Requirements
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
                <h3 className="text-lg font-semibold text-gray-900">Recommended Equipment</h3>
                
                {/* Ducane */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-blue-600">Ducane Equipment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-sm text-blue-900 mb-1">Air Conditioner</div>
                      <div className="text-sm text-gray-700">{results.ducaneModels.cooling}</div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="font-medium text-sm text-orange-900 mb-1">Furnace</div>
                      <div className="text-sm text-gray-700">{results.ducaneModels.heating}</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Daikin */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-blue-600">Daikin Equipment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-sm text-blue-900 mb-1">Air Conditioner</div>
                      <div className="text-sm text-gray-700">{results.daikinModels.cooling}</div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="font-medium text-sm text-orange-900 mb-1">Furnace</div>
                      <div className="text-sm text-gray-700">{results.daikinModels.heating}</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lennox */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-blue-600">Lennox Equipment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-sm text-blue-900 mb-1">Air Conditioner</div>
                      <div className="text-sm text-gray-700">{results.lennoxModels.cooling}</div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="font-medium text-sm text-orange-900 mb-1">Furnace</div>
                      <div className="text-sm text-gray-700">{results.lennoxModels.heating}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-to-r from-orange-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Calculator className="h-8 w-8 mx-auto mb-3" />
                    <h3 className="text-lg font-bold mb-2">Ready for Installation?</h3>
                    <p className="mb-4 opacity-90">Get professional installation from AfterHours HVAC</p>
                    <Button variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100">
                      Get Free Quote
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