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
  Snowflake,
  Zap,
  AlertTriangle
} from "lucide-react";
import { Link } from "wouter";

export default function ACRepair() {
  const services = [
    {
      title: "AC Repair & Diagnostics",
      description: "Complete diagnosis and repair of all AC system issues",
      features: ["System Diagnostics", "Refrigerant Leak Repair", "Compressor Service", "Electrical Repairs"],
      price: "Starting at $150"
    },
    {
      title: "AC Installation",
      description: "Professional installation of new air conditioning systems",
      features: ["Central Air Systems", "Ductless Mini-Splits", "Heat Pumps", "Smart Thermostats"],
      price: "Starting at $2,800"
    },
    {
      title: "AC Maintenance",
      description: "Regular maintenance to keep your AC running efficiently",
      features: ["Filter Replacement", "Coil Cleaning", "System Tune-up", "Preventive Inspection"],
      price: "Starting at $120"
    }
  ];

  const commonIssues = [
    "AC Not Cooling",
    "Strange Noises",
    "High Energy Bills",
    "Frozen Coils",
    "Poor Air Flow",
    "Thermostat Issues"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>AC Repair & Installation Calgary | AfterHours HVAC Solutions</title>
        <meta name="description" content="Expert AC repair and installation services in Calgary. 24/7 emergency service, licensed technicians, satisfaction guaranteed. Call (403) 613-6014 today." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-800 text-white py-20">
        <div className="hvac-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-cyan-500 text-white mb-4">
                Emergency Service Available
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                AC Repair & Installation in Calgary
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Stay cool all summer with professional AC repair and installation services. 
                Our certified technicians provide fast, reliable solutions for all your cooling needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                  <Phone className="w-5 h-5 mr-2" />
                  Emergency: (403) 613-6014
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900" asChild>
                  <Link href="/quote">Get Free Estimate</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <Snowflake className="w-16 h-16 text-cyan-400 mb-4" />
                <h3 className="text-2xl font-bold mb-4">Emergency AC Service</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    24/7 Emergency Response
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    Same-Day Service Available
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    Licensed & Insured
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    Satisfaction Guaranteed
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="hvac-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Complete AC Services
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From emergency repairs to new installations, we provide comprehensive air conditioning services.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <Snowflake className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 mb-4">
                      {service.price}
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

      {/* Common Issues */}
      <section className="py-16 bg-cyan-50">
        <div className="hvac-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Common AC Problems We Fix
            </h2>
            <p className="text-lg text-gray-600">
              Don't suffer in the heat. We diagnose and repair all AC issues quickly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {commonIssues.map((issue, index) => (
              <div key={index} className="bg-white rounded-lg p-6 text-center shadow-sm border-l-4 border-cyan-500">
                <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900">{issue}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency CTA */}
      <section className="py-16 bg-red-600 text-white">
        <div className="hvac-container text-center">
          <Clock className="w-16 h-16 mx-auto mb-6 text-red-200" />
          <h2 className="text-3xl font-bold mb-4">
            AC Emergency? We're Here 24/7
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Don't sweat it out! Our emergency technicians are available around the clock to restore your comfort.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
              <Phone className="w-5 h-5 mr-2" />
              Call Now: (403) 613-6014
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
              <Mail className="w-5 h-5 mr-2" />
              Email Jordan@Afterhourshvac.ca
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}