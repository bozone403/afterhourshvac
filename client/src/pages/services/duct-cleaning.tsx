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
  Wind,
  Leaf,
  Home,
  AlertCircle
} from "lucide-react";
import { Link } from "wouter";

export default function DuctCleaning() {
  const benefits = [
    {
      icon: Wind,
      title: "Improved Air Quality",
      description: "Remove dust, allergens, and contaminants for cleaner, healthier air."
    },
    {
      icon: Leaf,
      title: "Better Energy Efficiency",
      description: "Clean ducts allow your HVAC system to operate more efficiently."
    },
    {
      icon: Shield,
      title: "Reduced Allergies",
      description: "Eliminate allergens and irritants that trigger respiratory issues."
    },
    {
      icon: Home,
      title: "Odor Elimination",
      description: "Remove musty odors and improve overall indoor air freshness."
    }
  ];

  const cleaningProcess = [
    "Initial System Inspection",
    "Pre-Cleaning Air Quality Test",
    "Negative Pressure Setup",
    "Comprehensive Duct Cleaning",
    "Sanitization Treatment",
    "Final Quality Inspection"
  ];

  const warningSignsData = [
    "Visible dust around vents",
    "Musty or stale odors",
    "Increased allergy symptoms",
    "Higher energy bills",
    "Inconsistent room temperatures",
    "Excessive dust accumulation"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Professional Duct Cleaning Calgary | AfterHours HVAC Solutions</title>
        <meta name="description" content="Professional duct cleaning services in Calgary. Improve air quality, reduce allergies, increase energy efficiency. Licensed technicians, satisfaction guaranteed." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-700 via-blue-600 to-cyan-600 text-white py-20">
        <div className="hvac-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-green-500 text-white mb-4">
                Health & Efficiency
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Professional Duct Cleaning in Calgary
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Breathe easier with our comprehensive duct cleaning services. We remove dust, allergens, 
                and contaminants to improve your indoor air quality and HVAC efficiency.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                  <Phone className="w-5 h-5 mr-2" />
                  Call (403) 613-6014
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900" asChild>
                  <Link href="/quote">Free Air Quality Assessment</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <Wind className="w-16 h-16 text-green-400 mb-4" />
                <h3 className="text-2xl font-bold mb-4">Why Clean Your Ducts?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span>Improve indoor air quality</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span>Reduce energy costs by up to 20%</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span>Eliminate allergens and odors</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span>Extend HVAC system lifespan</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="hvac-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Benefits of Professional Duct Cleaning
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Clean ducts are essential for healthy indoor air and efficient HVAC operation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
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

      {/* Warning Signs */}
      <section className="py-16 bg-yellow-50">
        <div className="hvac-container">
          <div className="text-center mb-12">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Signs Your Ducts Need Cleaning
            </h2>
            <p className="text-lg text-gray-600">
              Don't ignore these warning signs that indicate your ducts need professional attention.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {warningSignsData.map((sign, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-yellow-500">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
                  {sign}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cleaning Process */}
      <section className="py-16 bg-blue-50">
        <div className="hvac-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Professional Cleaning Process
            </h2>
            <p className="text-lg text-gray-600">
              We follow industry best practices to ensure thorough and effective duct cleaning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cleaningProcess.map((step, index) => (
              <div key={index} className="bg-white rounded-lg p-6 text-center shadow-sm">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-gray-900">{step}</h3>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Card className="max-w-2xl mx-auto bg-green-50 border-green-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  Complete Service Package
                </h3>
                <p className="text-green-700 mb-4">
                  Our comprehensive duct cleaning service includes supply and return ducts, main trunk lines, 
                  grilles, registers, and HVAC unit cleaning.
                </p>
                <div className="text-3xl font-bold text-green-800 mb-4">
                  Starting at $3,199
                </div>
                <Button className="bg-green-600 hover:bg-green-700" asChild>
                  <Link href="/quote">Schedule Service</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="hvac-container text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Breathe Cleaner Air?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Schedule your professional duct cleaning service today and experience the difference clean ducts make.
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