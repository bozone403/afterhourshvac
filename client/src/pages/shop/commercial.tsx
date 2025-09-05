import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  Building2, 
  Wrench, 
  Clock, 
  Shield, 
  FileText, 
  Calendar,
  Phone,
  Mail,
  ChefHat,
  Briefcase,
  Home,
  Warehouse,
  TrendingDown,
  DollarSign,
  Settings,
  Wind,
  Thermometer,
  Star
} from "lucide-react";
import { Link } from "wouter";

const CommercialServices = () => {
  const [activeTab, setActiveTab] = useState("restaurants");

  const valueProps = [
    {
      icon: Shield,
      title: "Protecting Their Asset",
      description: "We're not just fixing a heater; we're maintaining a critical piece of your business infrastructure. Our service protects your asset, keeps tenants happy, and ensures business continuity."
    },
    {
      icon: DollarSign,
      title: "Total Cost of Ownership (TCO)", 
      description: "Commercial clients think long-term. Our solutions focus on lower energy bills, fewer breakdowns, and longer equipment lifespan, saving you money over the long run."
    },
    {
      icon: Calendar,
      title: "Preventive Maintenance is King",
      description: "A signed Preventive Maintenance contract is predictable, recurring revenue for us and peace of mind for you. We're not just a repairman; we're your dedicated HVAC service provider."
    }
  ];

  const maintenanceBenefits = [
    "Reduce the risk of costly, unexpected breakdowns",
    "Lower energy consumption through peak efficiency tuning", 
    "Extend the operational lifespan of your equipment",
    "Ensure tenant and employee comfort and safety",
    "Provide detailed service reports for your records",
    "Preferred pricing on all repairs and future installations"
  ];

  const niches = {
    restaurants: {
      icon: ChefHat,
      title: "Restaurants & Food Service",
      description: "Specializing in commercial kitchen ventilation, exhaust fans, and make-up air (MUA) units to keep your kitchen compliant and your staff and customers comfortable.",
      services: [
        "Commercial Kitchen Ventilation Systems",
        "Exhaust Fan Installation & Maintenance",
        "Make-Up Air (MUA) Units",
        "Commercial Refrigeration Support",
        "Health Code Compliance Solutions",
        "Emergency Kitchen HVAC Repair"
      ]
    },
    office: {
      icon: Briefcase,
      title: "Office & Retail",
      description: "Tenant comfort is key. We offer zoned systems, rooftop unit (RTU) maintenance, and indoor air quality solutions to create a productive and welcoming environment.",
      services: [
        "Rooftop Unit (RTU) Installation & Service",
        "Multi-Zone Climate Control Systems",
        "Indoor Air Quality Solutions",
        "Energy-Efficient HVAC Retrofits",
        "Tenant Space Buildouts",
        "Smart Building Integration"
      ]
    },
    multifamily: {
      icon: Home,
      title: "Multi-Family & Apartments",
      description: "Keep your tenants happy with reliable heating and cooling. We offer bulk maintenance contracts and timely service for apartment buildings, condos, and townhome complexes.",
      services: [
        "Bulk Maintenance Contracts",
        "Central Boiler & Chiller Systems",
        "Individual Suite HVAC Units",
        "Common Area Climate Control",
        "Emergency Tenant Service",
        "Energy Management Systems"
      ]
    },
    warehouse: {
      icon: Warehouse,
      title: "Warehouses & Light Industrial",
      description: "Efficiently heat and ventilate large spaces with our expertise in unit heaters, infrared heaters, and large-scale ventilation systems.",
      services: [
        "Unit Heater Installation & Service",
        "Infrared Heating Systems",
        "Large-Scale Ventilation Systems",
        "Warehouse Climate Control",
        "Industrial Air Quality Solutions",
        "Energy-Efficient Heating Solutions"
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-r from-blue-800 via-indigo-800 to-purple-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Building2 className="h-12 w-12 text-white mr-4" />
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Commercial & Multi-Family HVAC Solutions
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
            Reliable HVAC Solutions That Protect Your Business and Bottom Line
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto">
            <p className="text-lg text-white leading-relaxed">
              For businesses and property managers in Calgary, HVAC system failure means lost revenue and unhappy tenants. AfterHours HVAC provides reliable commercial service, planned retrofits, and comprehensive maintenance contracts designed to maximize uptime and protect your investment.
            </p>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Why Commercial Clients Choose AfterHours HVAC
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {valueProps.map((prop, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-600">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <prop.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{prop.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{prop.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Niches */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Specialized Solutions for Every Industry
          </h2>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              {Object.entries(niches).map(([key, niche]) => (
                <TabsTrigger key={key} value={key} className="flex items-center space-x-2">
                  <niche.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{niche.title.split(' ')[0]}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(niches).map(([key, niche]) => (
              <TabsContent key={key} value={key}>
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
                  <CardHeader>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-4 bg-blue-600 rounded-lg">
                        <niche.icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-gray-900">{niche.title}</CardTitle>
                        <CardDescription className="text-lg text-gray-600 mt-2">
                          {niche.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {niche.services.map((service, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">{service}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Maintenance Program */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              The Commercial Advantage Maintenance Program
            </h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Predictable, proactive maintenance that protects your investment and ensures business continuity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center">
                    <Star className="h-6 w-6 mr-3 text-yellow-300" />
                    Program Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {maintenanceBenefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0 mt-0.5" />
                        <span className="text-white">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <TrendingDown className="h-12 w-12 text-green-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Reduce Operating Costs</h3>
                  <p className="text-green-100">Preventive maintenance can reduce energy costs by up to 15% and prevent costly emergency repairs.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 text-blue-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Maximize Uptime</h3>
                  <p className="text-blue-100">Regular maintenance prevents 85% of equipment failures, keeping your business running smoothly.</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <Shield className="h-12 w-12 text-purple-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Peace of Mind</h3>
                  <p className="text-purple-100">Priority service, detailed reporting, and preferred pricing on all additional work.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Protect Your Investment
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Schedule a free site assessment to receive a customized maintenance proposal for your property.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-blue-50 border-2 border-blue-200">
              <CardContent className="p-6 text-center">
                <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergency Service</h3>
                <p className="text-gray-600 mb-4">24/7 emergency response</p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <a href="tel:4036136014">(403) 613-6014</a>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-2 border-green-200">
              <CardContent className="p-6 text-center">
                <Calendar className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedule Assessment</h3>
                <p className="text-gray-600 mb-4">Free on-site evaluation</p>
                <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                  <Link href="/calendar-booking">Book Assessment</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-2 border-purple-200">
              <CardContent className="p-6 text-center">
                <Mail className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Quote</h3>
                <p className="text-gray-600 mb-4">Custom maintenance proposal</p>
                <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
                  <a href="mailto:Jordan@Afterhourshvac.ca">Email Jordan</a>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Protect Your Business?</h3>
            <p className="text-gray-600 mb-6">
              Join hundreds of Calgary businesses who trust AfterHours HVAC for reliable commercial service and maintenance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                <Link href="/contact">Request Site Assessment</Link>
              </Button>
              <Button asChild variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3">
                <Link href="/shop/maintenance-plans">View Maintenance Plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CommercialServices;