import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  Home, 
  Wrench, 
  Clock, 
  Shield, 
  FileText, 
  Calendar,
  Phone,
  Mail,
  Building,
  Thermometer,
  Wind,
  Droplets,
  Settings
} from "lucide-react";
import { Link } from "wouter";

const ResidentialServices = () => {
  const capabilities = [
    {
      icon: Thermometer,
      title: "High-Efficiency Furnaces & Air Conditioners",
      description: "Premium heating and cooling systems sized specifically for your home"
    },
    {
      icon: Wind,
      title: "Heat Pump & Hybrid Dual-Fuel Systems",
      description: "Advanced energy-efficient solutions for year-round comfort"
    },
    {
      icon: Droplets,
      title: "In-Floor Hydronic Heating Systems",
      description: "Luxurious radiant floor heating for ultimate comfort"
    },
    {
      icon: Wind,
      title: "HRVs / ERVs & Indoor Air Quality Solutions",
      description: "Fresh air ventilation and air purification systems"
    },
    {
      icon: Settings,
      title: "Multi-Zone Systems & Smart Thermostat Integration",
      description: "Customized climate control for every area of your home"
    },
    {
      icon: Wrench,
      title: "Custom Sheet Metal Fabrication",
      description: "Precision-crafted ductwork and custom components"
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "Blueprint Analysis",
      description: "We start with your architectural plans to perform comprehensive Manual J heat loss/gain calculations."
    },
    {
      step: "2", 
      title: "System Design",
      description: "We design a complete HVAC system, including Manual S equipment selection and Manual D duct design, ensuring optimal airflow and comfort."
    },
    {
      step: "3",
      title: "Phased Installation", 
      description: "Our installation is phased to match your construction schedule, from rough-in to finishing, ensuring no delays."
    },
    {
      step: "4",
      title: "Commissioning & Handover",
      description: "Every system is fully commissioned, tested, and balanced. We provide a complete handover package for you and the homeowner."
    }
  ];

  const valueProps = [
    {
      icon: Clock,
      title: "Reliability is Everything",
      description: "We meet deadlines, period. We show up when we say we will, our installs are clean, and we integrate seamlessly with other trades."
    },
    {
      icon: FileText,
      title: "Design-First Approach", 
      description: "We don't just guess at sizes. We perform proper Manual J/S/D calculations to engineer a system perfectly sized for your home's unique design."
    },
    {
      icon: Shield,
      title: "Problem Prevention",
      description: "Our meticulous work reduces post-possession callbacks from homeowners. A clean install today saves warranty headaches tomorrow."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Building className="h-12 w-12 text-white mr-4" />
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              For Builders & Custom Homes
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
            Your Partner in Building Performance & Comfort
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto">
            <p className="text-lg text-white leading-relaxed">
              At AfterHours HVAC, we understand that a successful custom home build depends on reliable, professional trades who meet deadlines and deliver quality work. We specialize in providing design-first HVAC solutions that integrate seamlessly into your project timeline, reducing callbacks and ensuring total client satisfaction.
            </p>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Why Builders Choose AfterHours HVAC
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

      {/* Our Process */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Our Organized Process
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <Card key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                    <CardTitle className="text-lg text-gray-900">{step.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Capabilities */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Our Capabilities
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((capability, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <capability.icon className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">{capability.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{capability.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Project Gallery with Real Images */}
      <section className="py-16 px-4 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6 text-white">
              Professional Installation Gallery
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              See the quality and precision that Calgary's premier builders trust. Every installation showcases our commitment to craftsmanship and attention to detail.
            </p>
          </div>

          {/* Project Categories */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 group hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <Home className="h-12 w-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold text-white mb-2">Custom Home Builds</h3>
                </div>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>High-efficiency furnace installations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Custom ductwork design & fabrication</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Smart thermostats & zoning systems</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Heat recovery ventilation (HRV)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 group hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <Building className="h-12 w-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold text-white mb-2">New Construction</h3>
                </div>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Mechanical room design & layout</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Precision duct sizing & installation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Clean exterior penetrations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Code compliance & inspections</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 group hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <Settings className="h-12 w-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold text-white mb-2">Luxury Features</h3>
                </div>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>In-floor radiant heating systems</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Whole-home air purification</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Multi-zone climate control</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Smart home integration</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quality Standards */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Our Quality Standards</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Manual J/S/D</h4>
                <p className="text-gray-300 text-sm">Proper load calculations and system sizing for optimal efficiency</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">On Schedule</h4>
                <p className="text-gray-300 text-sm">Reliable project timelines that keep your build on track</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Clean Work</h4>
                <p className="text-gray-300 text-sm">Tidy installations that reduce callbacks and warranty issues</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Professional</h4>
                <p className="text-gray-300 text-sm">Skilled trades who integrate seamlessly with your team</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
              <Link href="/reviews">View Builder Testimonials</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Partner with us on your next project
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Submit your blueprints for a comprehensive bid and discover why Calgary's premier builders trust AfterHours HVAC.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="bg-blue-50 border-2 border-blue-200">
              <CardContent className="p-6 text-center">
                <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Call for Immediate Response</h3>
                <p className="text-gray-600 mb-4">Speak directly with our project coordinator</p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <a href="tel:4036136014">(403) 613-6014</a>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-2 border-green-200">
              <CardContent className="p-6 text-center">
                <Mail className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Your Blueprints</h3>
                <p className="text-gray-600 mb-4">Send plans for detailed project assessment</p>
                <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                  <a href="mailto:Jordan@Afterhourshvac.ca">Jordan@Afterhourshvac.ca</a>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-6">
              Join the growing list of builders who rely on AfterHours HVAC for professional, on-time HVAC solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                <Link href="/contact">Request Project Quote</Link>
              </Button>
              <Button asChild variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3">
                <Link href="/calendar-booking">Schedule Consultation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResidentialServices;