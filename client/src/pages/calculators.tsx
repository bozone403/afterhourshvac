import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, Building, Flame, Snowflake, Wrench, DollarSign, Zap, File, Crown } from 'lucide-react';

const freeCalculators = [
  {
    id: 'btu-calculator',
    title: 'BTU Calculator',
    description: 'Calculate heating and cooling requirements with Ducane, Daikin & Lennox equipment recommendations',
    icon: Zap,
    link: '/calculators/btu-calculator',
    badge: 'Free Tool'
  },
  {
    id: 'energy-savings',
    title: 'Energy Savings Calculator',
    description: 'Calculate potential savings and environmental impact of HVAC upgrades',
    icon: DollarSign,
    link: '/calculators/energy-savings',
    badge: 'Free Tool'
  },
  {
    id: 'load-calculator',
    title: 'HVAC Load Calculator',
    description: 'Professional load calculations using Manual J principles with equipment sizing',
    icon: Calculator,
    link: '/calculators/load-calculator',
    badge: 'Free Tool'
  },
  {
    id: 'btu-legacy',
    title: 'Simple BTU Calculator',
    description: 'Basic BTU calculation for quick estimates',
    icon: Flame,
    link: '/calculators/btu',
    badge: 'Basic Tool'
  }
];

const proCalculators = [
  {
    id: 'material-estimator',
    title: 'Advanced Material Calculator',
    description: 'Real-time Alggin.com pricing with custom multipliers',
    icon: Calculator,
    link: '/pro-calculator',
    badge: 'Pro Only'
  },
  {
    id: 'commercial-estimator', 
    title: 'Commercial Load Calculator',
    description: 'Complex load calculations for commercial HVAC systems',
    icon: Building,
    link: '/calculators/commercial-estimator',
    badge: 'Pro Only'
  },
  {
    id: 'project-templates',
    title: 'Project Templates',
    description: 'Pre-built templates for common HVAC installations',
    icon: File,
    link: '/pro-calculator',
    badge: 'Pro Only'
  }
];



const Calculators = () => {
  return (
    <>
      <Helmet>
        <title>HVAC Calculators & Service Booking | AfterHours HVAC</title>
        <meta name="description" content="Free HVAC calculators for material costs and BTU requirements, plus online service booking with secure payment for Calgary area." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              HVAC Tools & <span className="text-orange-600">Services</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional calculators and streamlined service booking for Calgary HVAC needs
            </p>
          </div>

          {/* Free Calculators Section */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Free Calculators</h2>
              <p className="text-gray-600">Professional estimation tools at no cost</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {freeCalculators.map((calc) => {
                const IconComponent = calc.icon;
                return (
                  <Link key={calc.id} href={calc.link}>
                    <Card className="bg-white border-blue-200 hover:border-blue-300 transition-all cursor-pointer group shadow-sm">
                      <CardHeader className="text-center pb-4">
                        <div className="mx-auto mb-4 p-3 bg-blue-600 rounded-full w-fit group-hover:bg-blue-500 transition-colors">
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <Badge variant="secondary" className="w-fit mx-auto mb-2 bg-blue-100 text-blue-800">
                          {calc.badge}
                        </Badge>
                        <CardTitle className="text-gray-900 text-xl">{calc.title}</CardTitle>
                        <CardDescription className="text-gray-600">
                          {calc.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          Open Calculator
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Pro Calculators Section */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center bg-orange-100 border border-orange-200 rounded-full px-4 py-2 mb-4">
                <Crown className="h-4 w-4 text-orange-600 mr-2" />
                <span className="text-orange-600 text-sm font-medium">Pro Tools</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Professional Calculators</h2>
              <p className="text-gray-600">Advanced tools with real supplier pricing - $49/month</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {proCalculators.map((calc) => {
                const IconComponent = calc.icon;
                return (
                  <Link key={calc.id} href={calc.link}>
                    <Card className="bg-white border-orange-200 hover:bg-orange-50 hover:border-orange-300 transition-all cursor-pointer group relative shadow-sm">
                      <div className="absolute top-4 right-4">
                        <Crown className="h-5 w-5 text-orange-600" />
                      </div>
                      <CardHeader className="text-center pb-4">
                        <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full w-fit group-hover:bg-orange-200 transition-colors">
                          <IconComponent className="h-8 w-8 text-orange-600" />
                        </div>
                        <Badge variant="outline" className="w-fit mx-auto mb-2 border-orange-500 text-orange-600">
                          {calc.badge}
                        </Badge>
                        <CardTitle className="text-gray-900 text-xl">{calc.title}</CardTitle>
                        <CardDescription className="text-gray-600">
                          {calc.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Button className="w-full bg-orange-600 hover:bg-orange-700">
                          <Crown className="h-4 w-4 mr-2" />
                          Upgrade to Pro
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-16 text-center">
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Custom Work?</h3>
              <p className="text-gray-600 mb-6">
                For complex commercial projects or custom HVAC solutions, contact us directly for a personalized quote.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Get Custom Quote
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => window.open('tel:4036136014')}
                >
                  Call (403) 613-6014
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Calculators;