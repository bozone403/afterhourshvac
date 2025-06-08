import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Mail, 
  CheckCircle, 
  Star,
  Clock,
  Shield,
  Wrench,
  ThermometerSun,
  Snowflake,
  Zap
} from "lucide-react";
import { Link } from "wouter";

export default function FurnaceInstallation() {
  const furnaceTypes = [
    {
      name: "1-Stage Gas Furnaces",
      efficiency: "92% AFUE",
      features: ["Single-stage heating", "Stainless steel heat exchanger", "10-year parts warranty", "Reliable operation"],
      startingPrice: "$6,999"
    },
    {
      name: "2-Stage Gas Furnaces",
      efficiency: "96% AFUE",
      features: ["Two-stage heating", "Variable speed blower", "Enhanced comfort control", "15-year parts warranty"],
      startingPrice: "$8,499"
    },
    {
      name: "Variable/Modulating Furnaces",
      efficiency: "98% AFUE",
      features: ["Variable-speed blower", "Modulating gas valve", "Precise Comfort technology", "20-year heat exchanger warranty"],
      startingPrice: "$11,999"
    }
  ];

  const installationProcess = [
    "Free In-Home Assessment",
    "Custom System Design",
    "Professional Installation",
    "System Testing & Commissioning",
    "Customer Training",
    "Warranty Registration"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Furnace Installation Calgary | AfterHours HVAC Solutions</title>
        <meta name="description" content="Professional furnace installation services in Calgary. High-efficiency gas, electric, and oil furnaces. Free estimates, expert installation, 10-year warranties." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-orange-600 text-white py-20">
        <div className="hvac-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-orange-500 text-white mb-4">
                Professional Installation
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Expert Furnace Installation in Calgary
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Stay warm all winter with a professionally installed, high-efficiency furnace. 
                Our certified technicians ensure optimal performance and maximum energy savings.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                  <Phone className="w-5 h-5 mr-2" />
                  Call (403) 613-6014
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900" asChild>
                  <Link href="/quote">Get Free Estimate</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <ThermometerSun className="w-16 h-16 text-orange-400 mb-4" />
                <h3 className="text-2xl font-bold mb-4">Why Choose Us?</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    15+ Years Experience
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    Licensed & Insured
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    10-Year Warranties
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    24/7 Emergency Service
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Furnace Types */}
      <section className="py-16">
        <div className="hvac-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Furnace Installation Options
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose from our selection of high-quality, energy-efficient furnaces designed for Calgary's climate.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {furnaceTypes.map((furnace, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <Wrench className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">{furnace.name}</h3>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {furnace.efficiency}
                    </Badge>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {furnace.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 mb-4">
                      Starting at {furnace.startingPrice}
                    </p>
                    <Button className="w-full" asChild>
                      <Link href="/quote">Get Quote</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Process */}
      <section className="py-16 bg-blue-50">
        <div className="hvac-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Installation Process
            </h2>
            <p className="text-lg text-gray-600">
              Professional installation ensures optimal performance and longevity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {installationProcess.map((step, index) => (
              <div key={index} className="bg-white rounded-lg p-6 text-center shadow-sm">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-gray-900">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="hvac-container text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready for a New Furnace?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Don't wait for your old furnace to fail. Schedule your free consultation today and ensure your family stays warm this winter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
              <Phone className="w-5 h-5 mr-2" />
              Call (403) 613-6014
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
              <Mail className="w-5 h-5 mr-2" />
              Email Jordan@Afterhourshvac.ca
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}