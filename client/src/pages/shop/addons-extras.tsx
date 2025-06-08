import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { 
  Wind, 
  Wrench, 
  Fan, 
  Thermometer, 
  Shield, 
  Zap, 
  Home, 
  Factory, 
  Phone,
  CheckCircle,
  Star,
  Clock,
  DollarSign
} from "lucide-react";

interface AddOnItem {
  id: string;
  name: string;
  description: string;
  price: string;
  laborTime: string;
  category: string;
  features: string[];
  warranty: string;
  availability: string;
  contactRequired?: boolean;
}

const addOnItems: AddOnItem[] = [
  // Air Quality & Ventilation
  {
    id: "hrv-installation",
    name: "Heat Recovery Ventilator (HRV)",
    description: "Complete HRV system installation for energy-efficient fresh air exchange while retaining indoor heat.",
    price: "$2,800 - $4,200",
    laborTime: "6-8 hours",
    category: "ventilation",
    features: [
      "Energy recovery up to 85%",
      "Balanced ventilation system",
      "Reduces humidity and pollutants",
      "Professional ductwork integration"
    ],
    warranty: "5 years parts, 2 years labor",
    availability: "2-3 weeks lead time"
  },
  {
    id: "erv-installation",
    name: "Energy Recovery Ventilator (ERV)",
    description: "Advanced ERV system for total energy recovery including both heat and moisture transfer.",
    price: "$3,200 - $4,800",
    laborTime: "6-8 hours",
    category: "ventilation",
    features: [
      "Heat and moisture recovery",
      "Ideal for humid climates",
      "Reduces HVAC load",
      "Smart controls included"
    ],
    warranty: "5 years parts, 2 years labor",
    availability: "2-3 weeks lead time"
  },
  {
    id: "bathroom-exhaust",
    name: "Bathroom Exhaust Fan Installation",
    description: "High-quality bathroom exhaust fan installation with proper venting to exterior.",
    price: "$320 - $580",
    laborTime: "2-3 hours",
    category: "ventilation",
    features: [
      "Quiet operation (<1.0 sone)",
      "Energy Star certified",
      "Humidity sensor option",
      "LED lighting available"
    ],
    warranty: "3 years parts, 1 year labor",
    availability: "Same week installation"
  },
  {
    id: "range-hood-install",
    name: "Kitchen Range Hood Installation",
    description: "Professional installation of kitchen range hood with external venting.",
    price: "$480 - $890",
    laborTime: "3-4 hours",
    category: "ventilation",
    features: [
      "Proper exterior venting",
      "Variable speed controls",
      "LED lighting",
      "Grease filter included"
    ],
    warranty: "2 years parts, 1 year labor",
    availability: "Same week installation"
  },

  // Cleaning & Maintenance Services
  {
    id: "ac-coil-cleaning",
    name: "AC Coil Deep Cleaning",
    description: "Professional evaporator and condenser coil cleaning to restore efficiency and air quality.",
    price: "$400",
    laborTime: "2-3 hours",
    category: "maintenance",
    features: [
      "Evaporator coil cleaning",
      "Condenser coil cleaning",
      "Drain line cleaning",
      "System performance test"
    ],
    warranty: "90 days service guarantee",
    availability: "Next day service"
  },
  {
    id: "duct-sanitization",
    name: "Duct Sanitization Service",
    description: "Professional duct cleaning and sanitization using hospital-grade disinfectants.",
    price: "$650 - $950",
    laborTime: "4-6 hours",
    category: "maintenance",
    features: [
      "Complete duct cleaning",
      "Antimicrobial treatment",
      "UV light sanitization",
      "Before/after photos"
    ],
    warranty: "1 year sanitization guarantee",
    availability: "1 week scheduling"
  },

  // Controls & Automation
  {
    id: "smart-thermostat",
    name: "Smart Thermostat Installation",
    description: "Professional installation of WiFi-enabled smart thermostat with mobile app control.",
    price: "$420 - $680",
    laborTime: "1-2 hours",
    category: "controls",
    features: [
      "WiFi connectivity",
      "Mobile app control",
      "Energy usage reports",
      "Geofencing capability"
    ],
    warranty: "5 years manufacturer, 1 year labor",
    availability: "Same day installation"
  },
  {
    id: "zone-control",
    name: "Zoning System Installation",
    description: "Multi-zone HVAC control system for customized comfort in different areas of your home.",
    price: "$2,400 - $4,200",
    laborTime: "8-12 hours",
    category: "controls",
    features: [
      "Individual room control",
      "Motorized dampers",
      "Multiple thermostats",
      "Energy savings up to 30%"
    ],
    warranty: "5 years parts, 2 years labor",
    availability: "2-3 weeks lead time"
  },

  // Air Quality Enhancement
  {
    id: "uv-light-system",
    name: "UV Light Air Purification",
    description: "Germicidal UV light system installation to eliminate bacteria, viruses, and mold.",
    price: "$650 - $950",
    laborTime: "2-3 hours",
    category: "air-quality",
    features: [
      "99.9% pathogen elimination",
      "Reduces odors",
      "Low maintenance",
      "1-year UV bulb included"
    ],
    warranty: "3 years parts, 1 year labor",
    availability: "Same week installation"
  },
  {
    id: "whole-home-humidifier",
    name: "Whole-Home Humidifier",
    description: "Central humidification system to maintain optimal indoor humidity levels.",
    price: "$850 - $1,350",
    laborTime: "3-4 hours",
    category: "air-quality",
    features: [
      "Automatic humidity control",
      "Reduces static electricity",
      "Protects wood furnishings",
      "Digital display panel"
    ],
    warranty: "5 years parts, 2 years labor",
    availability: "1 week installation"
  },

  // Custom & Specialty Work
  {
    id: "custom-sheet-metal",
    name: "Custom Sheet Metal Fabrication",
    description: "Bespoke sheet metal ductwork, plenums, and HVAC components fabricated to your specifications.",
    price: "Please Contact",
    laborTime: "Varies",
    category: "custom",
    features: [
      "Custom measurements",
      "Galvanized steel construction",
      "Professional installation",
      "Code compliant"
    ],
    warranty: "2 years craftsmanship",
    availability: "2-4 weeks lead time",
    contactRequired: true
  },
  {
    id: "commercial-makeup-air",
    name: "Commercial Makeup Air Units",
    description: "Industrial makeup air systems for commercial kitchens and manufacturing facilities.",
    price: "Please Contact",
    laborTime: "Varies",
    category: "commercial",
    features: [
      "Code compliant installation",
      "Heat recovery options",
      "Variable speed controls",
      "Professional design"
    ],
    warranty: "5 years parts, 2 years labor",
    availability: "3-6 weeks lead time",
    contactRequired: true
  },

  // Gas Line & Connections
  {
    id: "gas-line-installation",
    name: "Gas Line Installation & Repair",
    description: "Licensed gas fitting services for furnaces, fireplaces, and appliances.",
    price: "$450 - $1,200",
    laborTime: "2-6 hours",
    category: "gas-services",
    features: [
      "Licensed gas fitters",
      "Pressure testing",
      "Code compliant installation",
      "Safety inspection included"
    ],
    warranty: "5 years installation",
    availability: "Same week service"
  },

  // Electrical Services
  {
    id: "electrical-upgrades",
    name: "HVAC Electrical Upgrades",
    description: "Electrical panel upgrades and dedicated circuits for HVAC equipment.",
    price: "$650 - $1,850",
    laborTime: "3-6 hours",
    category: "electrical",
    features: [
      "Licensed electricians",
      "Dedicated HVAC circuits",
      "Code compliant wiring",
      "Electrical safety inspection"
    ],
    warranty: "5 years electrical work",
    availability: "1 week scheduling"
  }
];

const categories = [
  { id: "all", name: "All Add-Ons", icon: <Star className="h-4 w-4" /> },
  { id: "ventilation", name: "Ventilation", icon: <Wind className="h-4 w-4" /> },
  { id: "maintenance", name: "Cleaning & Maintenance", icon: <Wrench className="h-4 w-4" /> },
  { id: "controls", name: "Controls & Automation", icon: <Thermometer className="h-4 w-4" /> },
  { id: "air-quality", name: "Air Quality", icon: <Shield className="h-4 w-4" /> },
  { id: "custom", name: "Custom Work", icon: <Factory className="h-4 w-4" /> },
  { id: "commercial", name: "Commercial", icon: <Factory className="h-4 w-4" /> },
  { id: "gas-services", name: "Gas Services", icon: <Zap className="h-4 w-4" /> },
  { id: "electrical", name: "Electrical", icon: <Zap className="h-4 w-4" /> }
];

const AddOnsExtrasPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredItems = selectedCategory === "all" 
    ? addOnItems 
    : addOnItems.filter(item => item.category === selectedCategory);

  const getCategoryBadgeColor = (category: string) => {
    const colors: { [key: string]: string } = {
      ventilation: "bg-blue-100 text-blue-800",
      maintenance: "bg-green-100 text-green-800",
      controls: "bg-purple-100 text-purple-800",
      "air-quality": "bg-teal-100 text-teal-800",
      custom: "bg-orange-100 text-orange-800",
      commercial: "bg-gray-100 text-gray-800",
      "gas-services": "bg-red-100 text-red-800",
      electrical: "bg-yellow-100 text-yellow-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-red-100 border border-red-200 rounded-full px-6 py-3 mb-6">
            <Wrench className="h-5 w-5 text-red-700 mr-3" />
            <span className="text-red-800 text-lg font-bold">HVAC Add-Ons & Extras</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Professional HVAC Enhancements
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Upgrade your HVAC system with our professional add-on services. From air quality improvements 
            to smart controls, we offer everything you need for optimal comfort and efficiency.
          </p>
          
          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow-sm border p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-red-600" />
                <span className="font-semibold">(403) 613-6014</span>
              </div>
              <div className="text-gray-500">|</div>
              <Link href="/contact">
                <Button variant="outline" size="sm">
                  Get Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                {category.icon}
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Add-Ons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredItems.map((item) => (
            <Card key={item.id} className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <Badge className={getCategoryBadgeColor(item.category)}>
                    {categories.find(c => c.id === item.category)?.name}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Pricing */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-700">{item.price}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    {item.laborTime}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {item.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                    {item.features.length > 3 && (
                      <li className="text-sm text-gray-500">
                        +{item.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                </div>

                {/* Warranty & Availability */}
                <div className="text-xs text-gray-500 space-y-1">
                  <div><strong>Warranty:</strong> {item.warranty}</div>
                  <div><strong>Availability:</strong> {item.availability}</div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  {item.contactRequired ? (
                    <Link href="/contact">
                      <Button className="w-full">
                        <Phone className="h-4 w-4 mr-2" />
                        Contact for Quote
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/contact">
                      <Button variant="outline" className="w-full">
                        Get Quote
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Professional Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Professional Installation & Licensing
          </h3>
          <p className="text-blue-800">
            All HVAC add-on services are performed by licensed technicians in accordance with 
            Alberta Building Code and local regulations. We carry full liability insurance and 
            all work comes with comprehensive warranties. Gas fitting performed by licensed 
            gas fitters only.
          </p>
        </div>

        {/* Why Choose AfterHours */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <h3 className="text-2xl font-bold text-center mb-6">Why Choose AfterHours HVAC?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Licensed & Insured</h4>
              <p className="text-sm text-gray-600">
                Fully licensed technicians with comprehensive liability coverage
              </p>
            </div>
            <div className="text-center">
              <Star className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Quality Guaranteed</h4>
              <p className="text-sm text-gray-600">
                Premium components with extended warranties on all installations
              </p>
            </div>
            <div className="text-center">
              <Clock className="h-12 w-12 text-blue-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Flexible Scheduling</h4>
              <p className="text-sm text-gray-600">
                Same-day service available for most add-on installations
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-red-600 text-white rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Upgrade Your HVAC System?</h3>
            <p className="text-lg mb-6 opacity-90">
              Contact us today for a free consultation and quote on any add-on service.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Phone className="h-5 w-5" />
                (403) 613-6014
              </div>
              <Link href="/contact">
                <Button size="lg" variant="secondary">
                  Schedule Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOnsExtrasPage;