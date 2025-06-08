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
  Calendar,
  AlertTriangle,
  Zap
} from "lucide-react";
import { Link } from "wouter";

export default function HVACMaintenance() {
  const maintenancePlans = [
    {
      name: "Basic Plan",
      price: "$1,055/year",
      description: "Essential maintenance for residential HVAC systems",
      features: [
        "Annual tune-up",
        "Basic cleaning",
        "Safety inspection",
        "Priority scheduling",
        "10% discount on repairs"
      ]
    },
    {
      name: "Premium Plan",
      price: "$1,755/year",
      description: "Comprehensive maintenance and priority service",
      features: [
        "Bi-annual tune-ups",
        "Comprehensive cleaning",
        "Detailed inspection",
        "Priority emergency service",
        "15% discount on repairs",
        "Free filter replacements"
      ],
      popular: true
    },
    {
      name: "Commercial Plan",
      price: "$2,499/year",
      description: "Professional maintenance for commercial properties",
      features: [
        "Quarterly maintenance",
        "Commercial-grade service",
        "24/7 emergency support",
        "Preventive maintenance",
        "20% discount on all services",
        "Customized service plan"
      ]
    }
  ];

  const maintenanceBenefits = [
    {
      icon: Clock,
      title: "Extended Equipment Life",
      description: "Regular maintenance extends HVAC system lifespan by 5-10 years"
    },
    {
      icon: Zap,
      title: "Energy Savings",
      description: "Well-maintained systems use up to 15% less energy"
    },
    {
      icon: Shield,
      title: "Prevent Breakdowns",
      description: "90% of major repairs can be prevented with regular maintenance"
    },
    {
      icon: Star,
      title: "Warranty Protection",
      description: "Maintain manufacturer warranties with documented service"
    }
  ];

  const maintenanceChecklist = [
    "Filter inspection and replacement",
    "Thermostat calibration",
    "Electrical connections check",
    "Refrigerant level testing",
    "Ductwork inspection",
    "Coil cleaning",
    "Belt and motor inspection",
    "Safety controls testing",
    "Performance optimization",
    "System efficiency report"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>HVAC Maintenance Services Calgary | AfterHours HVAC Solutions</title>
        <meta name="description" content="Professional HVAC maintenance services in Calgary. Extend equipment life, improve efficiency, prevent breakdowns. Annual and bi-annual plans available." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-blue-600 to-teal-600 text-white py-20">
        <div className="hvac-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-green-500 text-white mb-4">
                Preventive Care
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Professional HVAC Maintenance in Calgary
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Keep your HVAC system running efficiently year-round with our comprehensive 
                maintenance programs. Prevent costly breakdowns and extend equipment life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                  <Phone className="w-5 h-5 mr-2" />
                  Call (403) 613-6014
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900" asChild>
                  <Link href="/shop/maintenance-plans">View Plans</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <Calendar className="w-16 h-16 text-green-400 mb-4" />
                <h3 className="text-2xl font-bold mb-4">Why Choose Maintenance?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span>Save up to 30% on energy costs</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span>Prevent 90% of major breakdowns</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span>Extend equipment life by 5-10 years</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span>Priority emergency service</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Maintenance Plans */}
      <section className="py-16">
        <div className="hvac-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Maintenance Plans
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose the maintenance plan that best fits your needs and budget.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {maintenancePlans.map((plan, index) => (
              <Card key={index} className={`h-full ${plan.popular ? 'ring-2 ring-orange-500' : ''}`}>
                <CardContent className="p-6">
                  {plan.popular && (
                    <Badge className="bg-orange-500 text-white mb-4">Most Popular</Badge>
                  )}
                  <div className="text-center mb-6">
                    <Wrench className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-2xl font-bold text-green-600 mb-2">{plan.price}</p>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="text-center">
                    <Button className="w-full" asChild>
                      <Link href="/shop/maintenance-plans">Select Plan</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-green-50">
        <div className="hvac-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Benefits of Regular Maintenance
            </h2>
            <p className="text-lg text-gray-600">
              Professional maintenance delivers measurable benefits for your comfort and wallet.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {maintenanceBenefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <benefit.icon className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Maintenance Checklist */}
      <section className="py-16">
        <div className="hvac-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Maintenance Checklist
            </h2>
            <p className="text-lg text-gray-600">
              Our thorough inspection covers every aspect of your HVAC system.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {maintenanceChecklist.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  {item}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="hvac-container text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Protect Your Investment?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Don't wait for expensive breakdowns. Schedule your maintenance service today and enjoy peace of mind all year long.
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