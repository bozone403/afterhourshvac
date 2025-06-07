import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ProAccessGuard } from '@/components/pro-access-guard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Calculator, Home, Wrench, DollarSign, FileText } from 'lucide-react';

const ProCalculator = () => {
  const [squareFootage, setSquareFootage] = useState('');
  const [homeType, setHomeType] = useState('');
  const [currentSystem, setCurrentSystem] = useState('');
  const [systemAge, setSystemAge] = useState('');
  const [efficiency, setEfficiency] = useState('');
  const [brand, setBrand] = useState('');
  const [additionalWork, setAdditionalWork] = useState<string[]>([]);
  const [estimate, setEstimate] = useState<{
    low: number;
    high: number;
    base: number;
    breakdown: {
      equipment: number;
      installation: number;
      permits: number;
      additional: number;
      warranty: number;
    };
  } | null>(null);

  const homeTypes = {
    'single-story': 'Single Story',
    'two-story': 'Two Story',
    'split-level': 'Split Level',
    'bi-level': 'Bi-Level',
    'manufactured': 'Manufactured Home'
  };

  const systemTypes = {
    'forced-air-gas': 'Forced Air Gas',
    'forced-air-electric': 'Forced Air Electric',
    'boiler': 'Boiler',
    'heat-pump': 'Heat Pump',
    'baseboard': 'Baseboard Electric',
    'none': 'No Current System'
  };

  const efficiencyRatings = {
    'standard': '80% AFUE (Standard)',
    'mid-efficiency': '90-92% AFUE (Mid-Efficiency)',
    'high-efficiency': '95%+ AFUE (High-Efficiency)',
    'heat-pump-standard': '8.5 HSPF (Standard Heat Pump)',
    'heat-pump-high': '10+ HSPF (High-Efficiency Heat Pump)'
  };

  const brands = {
    'ducane': 'Ducane',
    'daikin': 'Daikin',
    'lennox': 'Lennox',
    'carrier': 'Carrier',
    'trane': 'Trane',
    'goodman': 'Goodman'
  };

  const additionalServices = {
    'ductwork-repair': 'Ductwork Repair/Replacement',
    'insulation': 'Attic Insulation Upgrade',
    'thermostat': 'Smart Thermostat Installation',
    'air-quality': 'Air Quality System',
    'humidifier': 'Whole-Home Humidifier',
    'electrical': 'Electrical Upgrade Required',
    'gas-line': 'Gas Line Installation/Upgrade',
    'chimney': 'Chimney/Venting Work'
  };

  const calculateEstimate = () => {
    if (!squareFootage || !homeType || !efficiency || !brand) {
      return;
    }

    const sqft = parseInt(squareFootage);
    let basePrice = 0;
    let installationMultiplier = 1;
    let efficiencyMultiplier = 1;
    let brandMultiplier = 1;

    // Base pricing based on square footage (Calgary market rates)
    if (sqft <= 1200) {
      basePrice = 6999;
    } else if (sqft <= 1800) {
      basePrice = 8499;
    } else if (sqft <= 2500) {
      basePrice = 9999;
    } else {
      basePrice = 11999;
    }

    // Home type complexity multiplier
    switch (homeType) {
      case 'single-story':
        installationMultiplier = 1.0;
        break;
      case 'two-story':
        installationMultiplier = 1.15;
        break;
      case 'split-level':
        installationMultiplier = 1.25;
        break;
      case 'bi-level':
        installationMultiplier = 1.20;
        break;
      case 'manufactured':
        installationMultiplier = 1.10;
        break;
    }

    // Efficiency multiplier
    switch (efficiency) {
      case 'standard':
        efficiencyMultiplier = 1.0;
        break;
      case 'mid-efficiency':
        efficiencyMultiplier = 1.20;
        break;
      case 'high-efficiency':
        efficiencyMultiplier = 1.45;
        break;
      case 'heat-pump-standard':
        efficiencyMultiplier = 1.30;
        break;
      case 'heat-pump-high':
        efficiencyMultiplier = 1.60;
        break;
    }

    // Brand multiplier
    switch (brand) {
      case 'ducane':
        brandMultiplier = 1.0;
        break;
      case 'daikin':
        brandMultiplier = 1.25;
        break;
      case 'lennox':
        brandMultiplier = 1.30;
        break;
      case 'carrier':
        brandMultiplier = 1.25;
        break;
      case 'trane':
        brandMultiplier = 1.25;
        break;
      case 'goodman':
        brandMultiplier = 0.90;
        break;
    }

    let totalPrice = basePrice * installationMultiplier * efficiencyMultiplier * brandMultiplier;

    // Additional services
    const additionalCosts = {
      'ductwork-repair': 3500,
      'insulation': 2000,
      'thermostat': 450,
      'air-quality': 1800,
      'humidifier': 1200,
      'electrical': 1500,
      'gas-line': 2200,
      'chimney': 2800
    };

    let additionalTotal = 0;
    additionalWork.forEach(service => {
      additionalTotal += additionalCosts[service as keyof typeof additionalCosts] || 0;
    });

    totalPrice += additionalTotal;

    // Calculate ranges (±15% for competitive pricing)
    const lowEstimate = Math.round(totalPrice * 0.85);
    const highEstimate = Math.round(totalPrice * 1.15);

    setEstimate({
      low: lowEstimate,
      high: highEstimate,
      base: Math.round(totalPrice),
      breakdown: {
        equipment: Math.round(totalPrice * 0.60),
        installation: Math.round(totalPrice * 0.25),
        permits: Math.round(totalPrice * 0.05),
        additional: additionalTotal,
        warranty: Math.round(totalPrice * 0.10)
      }
    });
  };

  const toggleAdditionalService = (service: string) => {
    setAdditionalWork(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  return (
    <ProAccessGuard feature="Professional HVAC Calculator">
      <Helmet>
        <title>Pro HVAC Calculator - AfterHours HVAC Professional Tools</title>
        <meta name="description" content="Professional HVAC system estimation calculator with Calgary market pricing for accurate project quotes." />
      </Helmet>
      
      <div className="min-h-screen bg-dark py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                <Calculator className="text-primary" />
                Professional HVAC Calculator
              </h1>
              <p className="text-xl text-gray-300">
                Generate accurate Calgary market estimates for complete HVAC installations
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Input Section */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Home className="text-primary" />
                    Project Details
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Enter your project specifications for accurate pricing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="squareFootage" className="text-white">Square Footage</Label>
                    <Input
                      id="squareFootage"
                      type="number"
                      placeholder="e.g., 1800"
                      value={squareFootage}
                      onChange={(e) => setSquareFootage(e.target.value)}
                      className="mt-1 bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="homeType" className="text-white">Home Type</Label>
                    <Select value={homeType} onValueChange={setHomeType}>
                      <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select home type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(homeTypes).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="currentSystem" className="text-white">Current System</Label>
                    <Select value={currentSystem} onValueChange={setCurrentSystem}>
                      <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select current system" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(systemTypes).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="systemAge" className="text-white">System Age (if applicable)</Label>
                    <Input
                      id="systemAge"
                      type="number"
                      placeholder="e.g., 15"
                      value={systemAge}
                      onChange={(e) => setSystemAge(e.target.value)}
                      className="mt-1 bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="efficiency" className="text-white">Desired Efficiency</Label>
                    <Select value={efficiency} onValueChange={setEfficiency}>
                      <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select efficiency rating" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(efficiencyRatings).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="brand" className="text-white">Preferred Brand</Label>
                    <Select value={brand} onValueChange={setBrand}>
                      <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(brands).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white mb-3 block">Additional Services Needed</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {Object.entries(additionalServices).map(([key, label]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={key}
                            checked={additionalWork.includes(key)}
                            onChange={() => toggleAdditionalService(key)}
                            className="rounded border-gray-600 bg-gray-700"
                          />
                          <Label htmlFor={key} className="text-gray-300 text-sm">{label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={calculateEstimate}
                    className="w-full bg-primary hover:bg-primary/80 text-white"
                    disabled={!squareFootage || !homeType || !efficiency || !brand}
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate Estimate
                  </Button>
                </CardContent>
              </Card>

              {/* Results Section */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="text-secondary" />
                    Project Estimate
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Calgary market pricing - includes equipment, installation & warranty
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {estimate ? (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-2">
                          ${estimate.low.toLocaleString()} - ${estimate.high.toLocaleString()} CAD
                        </div>
                        <div className="text-lg text-gray-300">
                          Target: ${estimate.base.toLocaleString()} CAD
                        </div>
                      </div>

                      <Separator className="bg-gray-600" />

                      <div className="space-y-3">
                        <h4 className="text-white font-semibold flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          Cost Breakdown
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-gray-300">
                            <span>Equipment & Materials:</span>
                            <span>${estimate.breakdown.equipment.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-gray-300">
                            <span>Installation Labor:</span>
                            <span>${estimate.breakdown.installation.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-gray-300">
                            <span>Permits & Inspections:</span>
                            <span>${estimate.breakdown.permits.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-gray-300">
                            <span>Warranty & Service:</span>
                            <span>${estimate.breakdown.warranty.toLocaleString()}</span>
                          </div>
                          {estimate.breakdown.additional > 0 && (
                            <div className="flex justify-between text-gray-300">
                              <span>Additional Services:</span>
                              <span>${estimate.breakdown.additional.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-700 p-4 rounded-lg">
                        <h4 className="text-white font-semibold mb-2">What's Included:</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          <li>• Complete system removal & installation</li>
                          <li>• All necessary permits & inspections</li>
                          <li>• 10-year manufacturer warranty</li>
                          <li>• 2-year installation warranty</li>
                          <li>• Professional system commissioning</li>
                          <li>• Customer training & documentation</li>
                        </ul>
                      </div>

                      <div className="text-center">
                        <Button className="bg-secondary hover:bg-secondary/80 text-white">
                          <Wrench className="w-4 h-4 mr-2" />
                          Request Detailed Quote
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calculator className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">
                        Fill out the project details to generate your estimate
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                * Estimates are based on Calgary market rates and may vary based on specific site conditions, 
                accessibility, and current material costs. Final pricing subject to on-site assessment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProAccessGuard>
  );
};

export default ProCalculator;