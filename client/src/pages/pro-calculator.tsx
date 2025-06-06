import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';
import { useLocation } from 'wouter';
import MaterialEstimator from './calculators/material-estimator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Loader2 } from 'lucide-react';

const ProCalculator = () => {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
      return;
    }
    
    if (!isLoading && user && !user.hasPro && !user.isAdmin) {
      navigate('/membership');
      return;
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!user.hasPro && !user.isAdmin) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-4">
        <Card className="bg-slate-800 border-slate-700 max-w-md">
          <CardHeader className="text-center">
            <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <CardTitle className="text-white">Pro Access Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-300 mb-4">
              This calculator requires Pro membership to access.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Pro Material Calculator - AfterHours HVAC</title>
        <meta name="description" content="Advanced material cost calculator with real Alggin.com pricing for HVAC professionals." />
      </Helmet>
      
      <div className="min-h-screen bg-dark">
        <div className="bg-slate-800/50 border-b border-slate-700 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-3">
              <Crown className="h-6 w-6 text-yellow-500" />
              <h1 className="text-xl font-bold text-white">Pro Material Calculator</h1>
              <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-sm font-medium">
                Pro Member
              </span>
            </div>
          </div>
        </div>
        
        <MaterialEstimator />
      </div>
    </>
  );
};

export default ProCalculator;