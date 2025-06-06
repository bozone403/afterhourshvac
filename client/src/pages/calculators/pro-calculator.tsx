import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import ProtectedRoute from '@/components/ProtectedRoute';
import MaterialEstimator from './material-estimator';
import CommercialEstimator from './commercial-estimator';
import { Calculator, Crown, Zap, TrendingUp, Settings } from 'lucide-react';

const ProCalculator = () => {
  const [activeTab, setActiveTab] = useState('material');

  const proTools = [
    {
      id: 'material',
      title: 'Advanced Material Calculator',
      description: 'Real-time pricing from Alggin.com with custom multipliers',
      icon: Calculator,
      badge: 'Real Pricing'
    },
    {
      id: 'commercial',
      title: 'Commercial Load Calculator',
      description: 'Complex load calculations for commercial HVAC systems',
      icon: TrendingUp,
      badge: 'Professional'
    },
    {
      id: 'templates',
      title: 'Project Templates',
      description: 'Pre-built templates for common HVAC installations',
      icon: Settings,
      badge: 'Templates'
    }
  ];

  return (
    <ProtectedRoute 
      requiresPro={true}
      fallbackTitle="Pro HVAC Calculator Suite"
      fallbackDescription="Access advanced calculation tools with real supplier pricing and professional templates designed for HVAC contractors."
    >
      <Helmet>
        <title>Pro Calculator Suite | AfterHours HVAC</title>
        <meta name="description" content="Professional HVAC calculation tools with real supplier pricing and advanced features for contractors and engineers." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-green-600/10 border border-green-600/20 rounded-full px-4 py-2 mb-4">
              <Crown className="h-4 w-4 text-green-400 mr-2" />
              <span className="text-green-400 text-sm font-medium">Pro Tools</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Calculator className="h-10 w-10 text-green-400" />
              Pro Calculator Suite
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Advanced HVAC calculation tools with real supplier pricing and professional features
            </p>
          </div>

          {/* Pro Tools Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {proTools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Card 
                  key={tool.id}
                  className={`cursor-pointer transition-all hover:border-green-600/50 ${
                    activeTab === tool.id 
                      ? 'bg-green-600/10 border-green-600/30' 
                      : 'bg-slate-800/50 border-slate-700'
                  }`}
                  onClick={() => setActiveTab(tool.id)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-3 p-3 bg-green-600/10 rounded-full w-fit">
                      <IconComponent className="h-6 w-6 text-green-400" />
                    </div>
                    <Badge variant="outline" className="w-fit mx-auto mb-2 border-green-500 text-green-400">
                      {tool.badge}
                    </Badge>
                    <CardTitle className="text-white text-lg">{tool.title}</CardTitle>
                    <CardDescription className="text-slate-300 text-sm">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {/* Calculator Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800 mb-8">
              <TabsTrigger value="material">Material Calculator</TabsTrigger>
              <TabsTrigger value="commercial">Commercial Load</TabsTrigger>
              <TabsTrigger value="templates">Project Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="material">
              <MaterialEstimator />
            </TabsContent>

            <TabsContent value="commercial">
              <CommercialEstimator />
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Project Templates</CardTitle>
                  <CardDescription>Pre-built templates for common HVAC installations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      'Residential Furnace Replacement',
                      'Split System AC Installation', 
                      'Commercial Rooftop Unit',
                      'Heat Pump Installation',
                      'Ductwork Replacement',
                      'Maintenance Service'
                    ].map((template, index) => (
                      <Card key={index} className="bg-slate-900/50 border-slate-600 hover:border-green-600/50 transition-colors cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-white">{template}</h4>
                              <p className="text-xs text-slate-400 mt-1">Professional template</p>
                            </div>
                            <Zap className="h-4 w-4 text-green-400" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Pro Benefits Footer */}
          <div className="mt-16 bg-slate-800/30 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Pro Member Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
              <div>
                <Crown className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <h4 className="font-medium text-white mb-1">Real Pricing</h4>
                <p className="text-slate-400">Live supplier data from Alggin.com</p>
              </div>
              <div>
                <Calculator className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <h4 className="font-medium text-white mb-1">Advanced Tools</h4>
                <p className="text-slate-400">Professional calculation features</p>
              </div>
              <div>
                <TrendingUp className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <h4 className="font-medium text-white mb-1">Export PDF</h4>
                <p className="text-slate-400">Professional quote generation</p>
              </div>
              <div>
                <Settings className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <h4 className="font-medium text-white mb-1">Templates</h4>
                <p className="text-slate-400">Pre-built project templates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProCalculator;