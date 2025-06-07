import { Helmet } from 'react-helmet-async';
import { ProAccessGuard } from '@/components/pro-access-guard';
import MaterialEstimator from './calculators/material-estimator-alggin';

const ProCalculator = () => {
  return (
    <ProAccessGuard feature="Professional Material Calculator">
      <Helmet>
        <title>Pro Calculator - AfterHours HVAC Professional Tools</title>
        <meta name="description" content="Professional HVAC material calculator with real-time Alggin.com pricing for accurate project estimates." />
      </Helmet>
      <MaterialEstimator />
    </ProAccessGuard>
  );
};

export default ProCalculator;