import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, Building, Flame, Snowflake, Wrench, DollarSign, Zap } from 'lucide-react';

const calculators = [
  {
    id: 'material-estimator',
    title: 'Material Cost Estimator',
    description: 'Calculate job costs with real supplier pricing and your multipliers',
    icon: Calculator,
    link: '/calculators/material-estimator',
    type: 'free',
    badge: 'Free Tool'
  },
  {
    id: 'commercial-estimator', 
    title: 'Commercial Job Estimator',
    description: 'Comprehensive commercial HVAC project cost calculator',
    icon: Building,
    link: '/calculators/commercial-estimator',
    type: 'free',
    badge: 'Free Tool'
  },
  {
    id: 'btu',
    title: 'BTU Calculator',
    description: 'Calculate heating and cooling requirements for any space',
    icon: Zap,
    link: '/calculators/btu',
    type: 'free',
    badge: 'Free Tool'
  }
];



const Calculators = () => {
  return (
    <>
      <Helmet>
        <title>HVAC Calculators & Service Booking | AfterHours HVAC</title>
        <meta name="description" content="Free HVAC calculators for material costs and BTU requirements, plus online service booking with secure payment for Calgary area." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              HVAC Tools & <span className="text-blue-400">Services</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Professional calculators and streamlined service booking for Calgary HVAC needs
            </p>
          </div>

          {/* Free Calculators Section */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Free Calculators</h2>
              <p className="text-slate-400">Professional estimation tools at no cost</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {calculators.map((calc) => {
                const IconComponent = calc.icon;
                return (
                  <Link key={calc.id} href={calc.link}>
                    <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all cursor-pointer group">
                      <CardHeader className="text-center pb-4">
                        <div className="mx-auto mb-4 p-3 bg-blue-600 rounded-full w-fit group-hover:bg-blue-500 transition-colors">
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <Badge variant="secondary" className="w-fit mx-auto mb-2">
                          {calc.badge}
                        </Badge>
                        <CardTitle className="text-white text-xl">{calc.title}</CardTitle>
                        <CardDescription className="text-slate-300">
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



          {/* Contact Section */}
          <div className="mt-16 text-center">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Need Custom Work?</h3>
              <p className="text-slate-300 mb-6">
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