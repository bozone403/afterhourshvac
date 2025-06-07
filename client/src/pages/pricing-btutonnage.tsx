import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Snowflake, Wrench, Shield, Clock, Phone } from 'lucide-react';

// Alggin catalog pricing data for minimum standards (92% AFUE, 16+ SEER)
const furnaceOptions = [
  { btu: 40000, size: "40,000 BTU", efficiency: "92% AFUE", price: 2850, model: "Goodman GMH80403ANBA" },
  { btu: 60000, size: "60,000 BTU", efficiency: "92% AFUE", price: 3150, model: "Goodman GMH80603ANBA" },
  { btu: 80000, size: "80,000 BTU", efficiency: "92% AFUE", price: 3450, model: "Goodman GMH80803ANBA" },
  { btu: 100000, size: "100,000 BTU", efficiency: "92% AFUE", price: 3750, model: "Goodman GMH801003ANBA" },
  { btu: 120000, size: "120,000 BTU", efficiency: "92% AFUE", price: 4150, model: "Goodman GMH801203ANBA" },
  { btu: 40000, size: "40,000 BTU", efficiency: "96% AFUE", price: 4250, model: "Lennox EL296V-040" },
  { btu: 60000, size: "60,000 BTU", efficiency: "96% AFUE", price: 4650, model: "Lennox EL296V-060" },
  { btu: 80000, size: "80,000 BTU", efficiency: "96% AFUE", price: 5150, model: "Lennox EL296V-080" },
  { btu: 100000, size: "100,000 BTU", efficiency: "96% AFUE", price: 5750, model: "Lennox EL296V-100" },
];

const acOptions = [
  { tonnage: 1.5, size: "1.5 Ton", seer: "16 SEER", price: 2650, model: "Goodman GSX160181" },
  { tonnage: 2, size: "2 Ton", seer: "16 SEER", price: 2950, model: "Goodman GSX160241" },
  { tonnage: 2.5, size: "2.5 Ton", seer: "16 SEER", price: 3250, model: "Goodman GSX160301" },
  { tonnage: 3, size: "3 Ton", seer: "16 SEER", price: 3550, model: "Goodman GSX160361" },
  { tonnage: 3.5, size: "3.5 Ton", seer: "16 SEER", price: 3850, model: "Goodman GSX160421" },
  { tonnage: 4, size: "4 Ton", seer: "16 SEER", price: 4150, model: "Goodman GSX160481" },
  { tonnage: 5, size: "5 Ton", seer: "16 SEER", price: 4750, model: "Goodman GSX160601" },
  { tonnage: 2, size: "2 Ton", seer: "18 SEER", price: 3650, model: "Lennox XC18-024" },
  { tonnage: 2.5, size: "2.5 Ton", seer: "18 SEER", price: 4050, model: "Lennox XC18-030" },
  { tonnage: 3, size: "3 Ton", seer: "18 SEER", price: 4450, model: "Lennox XC18-036" },
  { tonnage: 3.5, size: "3.5 Ton", seer: "18 SEER", price: 4850, model: "Lennox XC18-042" },
  { tonnage: 4, size: "4 Ton", seer: "18 SEER", price: 5250, model: "Lennox XC18-048" },
];

const heatPumpOptions = [
  { tonnage: 2, size: "2 Ton", seer: "16 SEER", price: 4250, model: "Goodman GSZ160241", hspf: "9.5 HSPF" },
  { tonnage: 2.5, size: "2.5 Ton", seer: "16 SEER", price: 4650, model: "Goodman GSZ160301", hspf: "9.5 HSPF" },
  { tonnage: 3, size: "3 Ton", seer: "16 SEER", price: 5050, model: "Goodman GSZ160361", hspf: "9.5 HSPF" },
  { tonnage: 3.5, size: "3.5 Ton", seer: "16 SEER", price: 5450, model: "Goodman GSZ160421", hspf: "9.5 HSPF" },
  { tonnage: 4, size: "4 Ton", seer: "16 SEER", price: 5850, model: "Goodman GSZ160481", hspf: "9.5 HSPF" },
];

const maintenancePlans = [
  {
    name: "Basic Maintenance",
    price: 199,
    features: ["Annual furnace inspection", "Filter replacement", "Basic cleaning", "Safety check"],
    popular: false
  },
  {
    name: "Premium Maintenance", 
    price: 349,
    features: ["Bi-annual tune-ups", "Priority service", "15% discount on repairs", "Extended warranty", "Emergency service"],
    popular: true
  },
  {
    name: "Commercial Maintenance",
    price: 599,
    features: ["Quarterly inspections", "24/7 emergency service", "20% discount on parts", "Preventive maintenance", "System monitoring"],
    popular: false
  }
];

const emergencyServices = [
  {
    name: "Evening Service",
    time: "5pm - 12am",
    price: 150,
    description: "After-hours service for urgent HVAC issues"
  },
  {
    name: "Overnight Service", 
    time: "12am - 8am",
    price: 200,
    description: "Emergency overnight service for critical repairs"
  }
];

export default function PricingBTUTonnage() {
  const [, setLocation] = useLocation();
  const [selectedFurnace, setSelectedFurnace] = useState<string>('');
  const [selectedAC, setSelectedAC] = useState<string>('');
  const [selectedHeatPump, setSelectedHeatPump] = useState<string>('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount);
  };

  const handlePurchase = (service: string, amount: number, description: string, plan?: string, time?: string) => {
    const queryParams = new URLSearchParams({
      service,
      amount: amount.toString(),
      description,
      ...(plan && { plan }),
      ...(time && { time })
    });
    setLocation(`/checkout?${queryParams.toString()}`);
  };

  const getInstallationCost = (equipmentPrice: number) => {
    return Math.round(equipmentPrice * 0.4); // 40% of equipment cost for installation
  };

  const getTotalCost = (equipmentPrice: number) => {
    return equipmentPrice + getInstallationCost(equipmentPrice);
  };

  return (
    <>
      <Helmet>
        <title>HVAC Equipment Pricing - BTU & Tonnage Based | AfterHours HVAC</title>
        <meta name="description" content="Professional HVAC equipment pricing based on BTU and tonnage. Minimum 92% AFUE furnaces and 16 SEER AC units. Get accurate quotes from Alggin catalog pricing." />
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-dark via-black to-dark">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-header mb-6">
              Professional HVAC Equipment
            </h1>
            <p className="text-xl text-lightgray mb-8 max-w-3xl mx-auto">
              Quality equipment sized by BTU and tonnage. Minimum 92% AFUE furnaces and 16 SEER AC units.
              All pricing based on current Alggin catalog rates.
            </p>
            <Badge className="bg-primary text-black font-semibold px-4 py-2 text-lg">
              Professional Installation Included
            </Badge>
          </div>
        </section>

        {/* Furnace Section */}
        <section className="py-16 bg-dark">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Thermometer className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold font-header mb-4">Gas Furnaces</h2>
              <p className="text-lightgray max-w-2xl mx-auto">
                High-efficiency furnaces starting at 92% AFUE. Sized by BTU output for precise heating capacity.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Select Furnace Size & Efficiency:</label>
              <Select value={selectedFurnace} onValueChange={setSelectedFurnace}>
                <SelectTrigger className="w-full bg-black border-gray-600">
                  <SelectValue placeholder="Choose furnace BTU and efficiency rating" />
                </SelectTrigger>
                <SelectContent>
                  {furnaceOptions.map((furnace, index) => (
                    <SelectItem key={index} value={`${furnace.btu}-${furnace.efficiency}`}>
                      {furnace.size} - {furnace.efficiency} - {furnace.model} - {formatCurrency(furnace.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedFurnace && (
              <Card className="bg-black border-gray-700 mb-6">
                <CardHeader>
                  <CardTitle className="text-primary">Selected Furnace Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const [btu, efficiency] = selectedFurnace.split('-');
                    const furnace = furnaceOptions.find(f => f.btu.toString() === btu && f.efficiency === efficiency);
                    if (!furnace) return null;
                    
                    return (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-lightgray">Model:</p>
                            <p className="font-semibold">{furnace.model}</p>
                          </div>
                          <div>
                            <p className="text-lightgray">Size:</p>
                            <p className="font-semibold">{furnace.size}</p>
                          </div>
                          <div>
                            <p className="text-lightgray">Efficiency:</p>
                            <p className="font-semibold">{furnace.efficiency}</p>
                          </div>
                          <div>
                            <p className="text-lightgray">Equipment Cost:</p>
                            <p className="font-semibold">{formatCurrency(furnace.price)}</p>
                          </div>
                        </div>
                        <div className="border-t border-gray-700 pt-4">
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Total with Installation:</span>
                            <span className="text-primary">{formatCurrency(getTotalCost(furnace.price))}</span>
                          </div>
                          <p className="text-sm text-lightgray mt-1">
                            Installation: {formatCurrency(getInstallationCost(furnace.price))}
                          </p>
                        </div>
                        <Button 
                          onClick={() => handlePurchase(
                            'furnace-install',
                            getTotalCost(furnace.price),
                            `${furnace.size} ${furnace.efficiency} Furnace Installation - ${furnace.model}`
                          )}
                          className="w-full bg-primary hover:bg-primary/90 text-black font-semibold"
                        >
                          Purchase Furnace Installation - {formatCurrency(getTotalCost(furnace.price))}
                        </Button>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Air Conditioning Section */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Snowflake className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold font-header mb-4">Air Conditioning Units</h2>
              <p className="text-lightgray max-w-2xl mx-auto">
                High-efficiency central air conditioning starting at 16 SEER. Sized by tonnage for optimal cooling.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Select AC Unit Size & Efficiency:</label>
              <Select value={selectedAC} onValueChange={setSelectedAC}>
                <SelectTrigger className="w-full bg-dark border-gray-600">
                  <SelectValue placeholder="Choose AC tonnage and SEER rating" />
                </SelectTrigger>
                <SelectContent>
                  {acOptions.map((ac, index) => (
                    <SelectItem key={index} value={`${ac.tonnage}-${ac.seer}`}>
                      {ac.size} - {ac.seer} - {ac.model} - {formatCurrency(ac.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedAC && (
              <Card className="bg-dark border-gray-700 mb-6">
                <CardHeader>
                  <CardTitle className="text-primary">Selected AC Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const [tonnage, seer] = selectedAC.split('-');
                    const ac = acOptions.find(a => a.tonnage.toString() === tonnage && a.seer === seer);
                    if (!ac) return null;
                    
                    return (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-lightgray">Model:</p>
                            <p className="font-semibold">{ac.model}</p>
                          </div>
                          <div>
                            <p className="text-lightgray">Size:</p>
                            <p className="font-semibold">{ac.size}</p>
                          </div>
                          <div>
                            <p className="text-lightgray">Efficiency:</p>
                            <p className="font-semibold">{ac.seer}</p>
                          </div>
                          <div>
                            <p className="text-lightgray">Equipment Cost:</p>
                            <p className="font-semibold">{formatCurrency(ac.price)}</p>
                          </div>
                        </div>
                        <div className="border-t border-gray-700 pt-4">
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Total with Installation:</span>
                            <span className="text-primary">{formatCurrency(getTotalCost(ac.price))}</span>
                          </div>
                          <p className="text-sm text-lightgray mt-1">
                            Installation: {formatCurrency(getInstallationCost(ac.price))}
                          </p>
                        </div>
                        <Button 
                          onClick={() => handlePurchase(
                            'ac-install',
                            getTotalCost(ac.price),
                            `${ac.size} ${ac.seer} AC Installation - ${ac.model}`
                          )}
                          className="w-full bg-primary hover:bg-primary/90 text-black font-semibold"
                        >
                          Purchase AC Installation - {formatCurrency(getTotalCost(ac.price))}
                        </Button>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Heat Pump Section */}
        <section className="py-16 bg-dark">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold font-header mb-4">Heat Pump Systems</h2>
              <p className="text-lightgray max-w-2xl mx-auto">
                Year-round comfort with efficient heat pump technology. Heating and cooling in one system.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Select Heat Pump Size:</label>
              <Select value={selectedHeatPump} onValueChange={setSelectedHeatPump}>
                <SelectTrigger className="w-full bg-black border-gray-600">
                  <SelectValue placeholder="Choose heat pump tonnage and efficiency" />
                </SelectTrigger>
                <SelectContent>
                  {heatPumpOptions.map((hp, index) => (
                    <SelectItem key={index} value={`${hp.tonnage}-${hp.seer}`}>
                      {hp.size} - {hp.seer} / {hp.hspf} - {hp.model} - {formatCurrency(hp.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedHeatPump && (
              <Card className="bg-black border-gray-700 mb-6">
                <CardHeader>
                  <CardTitle className="text-primary">Selected Heat Pump Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const [tonnage, seer] = selectedHeatPump.split('-');
                    const hp = heatPumpOptions.find(h => h.tonnage.toString() === tonnage && h.seer === seer);
                    if (!hp) return null;
                    
                    return (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-lightgray">Model:</p>
                            <p className="font-semibold">{hp.model}</p>
                          </div>
                          <div>
                            <p className="text-lightgray">Size:</p>
                            <p className="font-semibold">{hp.size}</p>
                          </div>
                          <div>
                            <p className="text-lightgray">Cooling Efficiency:</p>
                            <p className="font-semibold">{hp.seer}</p>
                          </div>
                          <div>
                            <p className="text-lightgray">Heating Efficiency:</p>
                            <p className="font-semibold">{hp.hspf}</p>
                          </div>
                        </div>
                        <div className="border-t border-gray-700 pt-4">
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Total with Installation:</span>
                            <span className="text-primary">{formatCurrency(getTotalCost(hp.price))}</span>
                          </div>
                          <p className="text-sm text-lightgray mt-1">
                            Installation: {formatCurrency(getInstallationCost(hp.price))}
                          </p>
                        </div>
                        <Button 
                          onClick={() => handlePurchase(
                            'heatpump-install',
                            getTotalCost(hp.price),
                            `${hp.size} Heat Pump Installation - ${hp.model}`
                          )}
                          className="w-full bg-primary hover:bg-primary/90 text-black font-semibold"
                        >
                          Purchase Heat Pump Installation - {formatCurrency(getTotalCost(hp.price))}
                        </Button>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Maintenance Plans */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Wrench className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold font-header mb-4">Maintenance Plans</h2>
              <p className="text-lightgray max-w-2xl mx-auto">
                Keep your HVAC system running efficiently with our professional maintenance plans
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {maintenancePlans.map((plan, index) => (
                <Card key={index} className={`bg-dark border-gray-700 relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-black font-semibold px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <CardDescription>
                      <span className="text-3xl font-bold text-primary">{formatCurrency(plan.price)}</span>
                      <span className="text-lightgray">/year</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <svg className="w-5 h-5 text-primary mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      onClick={() => handlePurchase(
                        'maintenance-plan',
                        plan.price,
                        `${plan.name} - Annual Plan`,
                        plan.name.toLowerCase().replace(' ', '-')
                      )}
                      className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90 text-black' : 'bg-gray-700 hover:bg-gray-600 text-white'} font-semibold`}
                    >
                      Choose {plan.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Emergency Services */}
        <section className="py-16 bg-dark">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Clock className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold font-header mb-4">Emergency Services</h2>
              <p className="text-lightgray max-w-2xl mx-auto">
                24/7 emergency HVAC repair services when you need them most
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {emergencyServices.map((service, index) => (
                <Card key={index} className="bg-black border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-primary">{service.name}</CardTitle>
                    <CardDescription className="text-lg">{service.time}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lightgray mb-4">{service.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-primary">{formatCurrency(service.price)}</span>
                      <span className="text-lightgray">Service call fee</span>
                    </div>
                    <Button 
                      onClick={() => handlePurchase(
                        'emergency-service',
                        service.price,
                        `${service.name} - ${service.time}`,
                        undefined,
                        service.time.includes('Evening') ? 'evening' : 'overnight'
                      )}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
                    >
                      Book Emergency Service
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-lightgray mb-4">Need immediate assistance?</p>
              <a href="tel:4036136014" className="inline-flex items-center bg-primary hover:bg-primary/90 text-black px-6 py-3 rounded-md font-semibold transition-all">
                <Phone className="w-5 h-5 mr-2" />
                Call (403) 613-6014
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}