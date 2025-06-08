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
  Zap,
  TrendingDown,
  Home,
  BarChart3,
  Thermometer,
  DollarSign
} from "lucide-react";
import { Link } from "wouter";

export default function EnergyAudit() {
  const auditServices = [
    {
      name: "Residential Energy Audit",
      price: "$399",
      description: "Comprehensive home energy assessment",
      features: [
        "Thermal imaging inspection",
        "Air leakage testing",
        "HVAC efficiency analysis",
        "Insulation evaluation",
        "Detailed savings report",
        "Rebate application assistance"
      ]
    },
    {
      name: "Commercial Energy Audit",
      price: "$899",
      description: "Professional building energy analysis",
      features: [
        "Complete building envelope assessment",
        "HVAC system optimization",
        "Lighting efficiency review",
        "Energy consumption monitoring",
        "ROI analysis for upgrades",
        "Utility rebate maximization"
      ],
      popular: true
    },
    {
      name: "Pre-Purchase Inspection",
      price: "$299",
      description: "Energy assessment for home buyers",
      features: [
        "HVAC system condition report",
        "Energy efficiency rating",
        "Potential upgrade costs",
        "Annual energy cost estimate",
        "Negotiation leverage report"
      ]
    }
  ];

  const auditBenefits = [
    {
      icon: DollarSign,
      title: "Save 20-30% on Energy Bills",
      description: "Identify and fix energy waste to reduce monthly costs"
    },
    {
      icon: Home,
      title: "Improve Comfort",
      description: "Eliminate drafts, hot spots, and temperature inconsistencies"
    },
    {
      icon: TrendingDown,
      title: "Reduce Carbon Footprint",
      description: "Lower your environmental impact with energy efficiency"
    },
    {
      icon: BarChart3,
      title: "Increase Home Value",
      description: "Energy-efficient homes sell for 3-5% more than average"
    }
  ];

  const auditProcess = [
    "Initial consultation and inspection",
    "Thermal imaging and blower door testing",
    "HVAC system performance analysis",
    "Insulation and air sealing assessment",
    "Energy usage pattern review",
    "Detailed report with recommendations",
    "Rebate and financing guidance",
    "Follow-up implementation support"
  ];

  const commonFindings = [
    "Air leaks around windows and doors",
    "Inadequate insulation in attics/basements",
    "Inefficient HVAC equipment",
    "Ductwork leaks and poor design",
    "Outdated windows and doors",
    "Poor ventilation systems"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Energy Audit Services Calgary | AfterHours HVAC Solutions</title>
        <meta name="description" content="Professional energy audit services in Calgary. Identify energy waste, reduce bills by 20-30%, improve comfort. Thermal imaging, rebate assistance included." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-700 via-teal-600 to-blue-700 text-white py-20">
        <div className="hvac-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-teal-500 text-white mb-4">
                Energy Efficiency
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Professional Energy Audits in Calgary
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Discover how to save 20-30% on your energy bills with our comprehensive energy audits. 
                We use advanced thermal imaging and testing to identify energy waste and improvement opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                  <Phone className="w-5 h-5 mr-2" />
                  Call (403) 613-6014
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900" asChild>
                  <Link href="/quote">Schedule Audit</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <Zap className="w-16 h-16 text-teal-400 mb-4" />
                <h3 className="text-2xl font-bold mb-4">Energy Audit Benefits</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span>Save $200-500+ annually</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span>Improve indoor comfort</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span>Qualify for rebates & incentives</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span>Increase property value</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audit Services */}
      <section className="py-16">
        <div className="hvac-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Energy Audit Services
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose the energy audit service that best fits your property and goals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {auditServices.map((service, index) => (
              <Card key={index} className={`h-full ${service.popular ? 'ring-2 ring-orange-500' : ''}`}>
                <CardContent className="p-6">
                  {service.popular && (
                    <Badge className="bg-orange-500 text-white mb-4">Most Popular</Badge>
                  )}
                  <div className="text-center mb-6">
                    <Thermometer className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                    <p className="text-2xl font-bold text-teal-600 mb-2">{service.price}</p>
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
                    <Button className="w-full" asChild>
                      <Link href="/quote">Schedule Audit</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-teal-50">
        <div className="hvac-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Get an Energy Audit?
            </h2>
            <p className="text-lg text-gray-600">
              Professional energy audits deliver measurable results and long-term savings.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {auditBenefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <benefit.icon className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Audit Process */}
      <section className="py-16">
        <div className="hvac-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Comprehensive Audit Process
            </h2>
            <p className="text-lg text-gray-600">
              We use advanced technology and proven methods to identify all energy improvement opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {auditProcess.map((step, index) => (
              <div key={index} className="bg-white rounded-lg p-6 text-center shadow-sm">
                <div className="w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Findings */}
      <section className="py-16 bg-yellow-50">
        <div className="hvac-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Common Energy Waste Issues We Find
            </h2>
            <p className="text-lg text-gray-600">
              These common problems could be costing you hundreds of dollars each year.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {commonFindings.map((finding, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-yellow-500">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                  {finding}
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
            Ready to Start Saving Energy?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Schedule your professional energy audit today and discover how much you can save on your energy bills.
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