import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { calculateEnergySavings, formatCurrency } from '@/lib/utils';

interface CalculatorFormState {
  propertyType: string;
  squareFootage: string;
  currentSystemAge: string;
  furnaceType: string;
  acType: string;
  annualUtilityCost: string;
}

interface CalculatorResults {
  currentCost: number;
  newCost: number;
  savings: number;
  roi: number;
}

const Calculators = () => {
  const [location, setLocation] = useLocation();
  const [activeCalculator, setActiveCalculator] = useState<'basic' | 'energy' | 'pro'>('basic');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<CalculatorResults | null>(null);
  
  const [formData, setFormData] = useState<CalculatorFormState>({
    propertyType: 'residential',
    squareFootage: '',
    currentSystemAge: '',
    furnaceType: 'standard',
    acType: 'standard',
    annualUtilityCost: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset results when inputs change
    if (showResults) {
      setShowResults(false);
    }
  };

  const handlePropertyTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      propertyType: type
    }));
    
    // Reset results when inputs change
    if (showResults) {
      setShowResults(false);
    }
  };

  const handleCalculate = (calculator: 'basic' | 'energy') => {
    if (!formData.squareFootage || !formData.currentSystemAge) {
      alert('Please fill in all required fields');
      return;
    }

    // Convert square footage to number
    const squareFootage = parseInt(formData.squareFootage);

    // Calculate new system efficiency based on selected type
    let newEfficiency = 0.92; // Default high-efficiency

    if (activeCalculator === 'energy') {
      if (formData.furnaceType === 'premium') {
        newEfficiency = 0.96;
      } else if (formData.furnaceType === 'standard') {
        newEfficiency = 0.92;
      }
    }

    // Calculate results
    const calculationResults = calculateEnergySavings(
      squareFootage,
      formData.currentSystemAge,
      newEfficiency
    );

    setResults(calculationResults);
    setShowResults(true);
  };

  const handleUpgradeToPro = () => {
    setLocation('/pro-calculator');
  };

  return (
    <>
      <Helmet>
        <title>HVAC Calculators - AfterHours HVAC</title>
        <meta name="description" content="Use our free HVAC calculators to estimate system costs, energy savings, and more. Upgrade to our Pro Calculator for comprehensive quotes and load calculations." />
      </Helmet>
      
      {/* Page Header */}
      <div className="relative pt-24 pb-10 bg-dark">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-header mb-4">HVAC <span className="text-primary">Calculators</span></h1>
            <p className="text-lightgray max-w-3xl mx-auto">Use our interactive tools to find the right HVAC solution for your home or business.</p>
          </div>
        </div>
      </div>
      
      {/* Calculator Tabs */}
      <section className="bg-dark py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center space-x-2 mb-10">
            <button 
              onClick={() => setActiveCalculator('basic')} 
              className={`px-4 py-2 rounded-md font-medium mb-2 ${activeCalculator === 'basic' ? 'bg-primary text-white' : 'bg-darkgray text-white border border-gray-700'}`}
            >
              Basic Estimator
            </button>
            <button 
              onClick={() => setActiveCalculator('energy')} 
              className={`px-4 py-2 rounded-md font-medium mb-2 ${activeCalculator === 'energy' ? 'bg-primary text-white' : 'bg-darkgray text-white border border-gray-700'}`}
            >
              Energy Savings
            </button>
            <button 
              onClick={() => setActiveCalculator('pro')} 
              className={`px-4 py-2 rounded-md font-medium mb-2 ${activeCalculator === 'pro' ? 'bg-primary text-white' : 'bg-darkgray text-white border border-gray-700'}`}
            >
              Pro Calculator <span className="ml-1 text-xs px-1.5 py-0.5 bg-secondary rounded-full">PRO</span>
            </button>
          </div>
          
          {/* Basic Estimator Calculator */}
          {activeCalculator === 'basic' && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-darkgray rounded-lg shadow-xl overflow-hidden border border-gray-700">
                <div className="bg-dark px-6 py-4 border-b border-gray-700">
                  <h3 className="text-xl font-bold font-header text-white">Basic HVAC System Estimator</h3>
                </div>
                
                <div className="p-6">
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-lightgray mb-1">Property Type</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div 
                          className={`bg-dark rounded-md p-4 border ${formData.propertyType === 'residential' ? 'border-primary' : 'border-gray-700'} cursor-pointer hover:border-primary transition-colors`}
                          onClick={() => handlePropertyTypeChange('residential')}
                        >
                          <div className="flex items-center">
                            <input 
                              type="radio" 
                              name="propertyType" 
                              className="mr-3" 
                              checked={formData.propertyType === 'residential'}
                              onChange={() => handlePropertyTypeChange('residential')}
                            />
                            <label className="cursor-pointer">
                              <div className="font-medium">Residential</div>
                              <div className="text-xs text-lightgray">Homes & Condos</div>
                            </label>
                          </div>
                        </div>
                        
                        <div 
                          className={`bg-dark rounded-md p-4 border ${formData.propertyType === 'commercial' ? 'border-primary' : 'border-gray-700'} cursor-pointer hover:border-primary transition-colors`}
                          onClick={() => handlePropertyTypeChange('commercial')}
                        >
                          <div className="flex items-center">
                            <input 
                              type="radio" 
                              name="propertyType" 
                              className="mr-3"
                              checked={formData.propertyType === 'commercial'}
                              onChange={() => handlePropertyTypeChange('commercial')}
                            />
                            <label className="cursor-pointer">
                              <div className="font-medium">Commercial</div>
                              <div className="text-xs text-lightgray">Offices & Retail</div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="squareFootage" className="block text-sm font-medium text-lightgray mb-1">Square Footage</label>
                      <input 
                        type="number" 
                        id="squareFootage" 
                        name="squareFootage"
                        placeholder="Enter square feet" 
                        className="w-full bg-dark border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.squareFootage}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="currentSystemAge" className="block text-sm font-medium text-lightgray mb-1">Current System Age</label>
                      <select 
                        id="currentSystemAge" 
                        name="currentSystemAge"
                        className="w-full bg-dark border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.currentSystemAge}
                        onChange={handleInputChange}
                      >
                        <option value="">Select age range</option>
                        <option value="0-5">0-5 years</option>
                        <option value="6-10">6-10 years</option>
                        <option value="11-15">11-15 years</option>
                        <option value="16+">16+ years</option>
                      </select>
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <button 
                        type="button" 
                        className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-all font-medium"
                        onClick={() => {
                          setFormData({
                            propertyType: 'residential',
                            squareFootage: '',
                            currentSystemAge: '',
                            furnaceType: 'standard',
                            acType: 'standard',
                            annualUtilityCost: ''
                          });
                          setShowResults(false);
                        }}
                      >
                        Reset
                      </button>
                      <button 
                        type="button" 
                        className="bg-primary hover:bg-opacity-80 text-white py-2 px-4 rounded-md transition-all font-medium"
                        onClick={() => handleCalculate('basic')}
                      >
                        Calculate Estimate
                      </button>
                    </div>
                    
                    {showResults && results && (
                      <div className="mt-6 p-4 bg-dark border border-gray-700 rounded-lg">
                        <h4 className="font-bold mb-3 font-header text-lg">System Estimate Results</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-darkgray p-4 rounded-lg">
                            <h5 className="font-semibold mb-2">Recommended System</h5>
                            <p className="text-lightgray mb-1">
                              {formData.propertyType === 'residential' ? 'High-Efficiency Residential' : 'Commercial'} HVAC System
                            </p>
                            <p className="text-sm text-lightgray">
                              Based on your {formData.squareFootage} sq ft {formData.propertyType} property
                            </p>
                          </div>
                          
                          <div className="bg-darkgray p-4 rounded-lg">
                            <h5 className="font-semibold mb-2">Estimated Price Range</h5>
                            <p className="text-2xl font-bold text-primary">
                              {formData.propertyType === 'residential' 
                                ? `$${Math.round(parseInt(formData.squareFootage) * 5.5).toLocaleString()} - $${Math.round(parseInt(formData.squareFootage) * 9).toLocaleString()}`
                                : `$${Math.round(parseInt(formData.squareFootage) * 7.5).toLocaleString()} - $${Math.round(parseInt(formData.squareFootage) * 12).toLocaleString()}`
                              }
                            </p>
                            <p className="text-sm text-lightgray">Complete system with installation</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-lightgray">Potential Energy Savings</p>
                              <p className="text-lg font-semibold text-secondary">
                                Up to {formData.currentSystemAge === '16+' ? '40' : formData.currentSystemAge === '11-15' ? '30' : formData.currentSystemAge === '6-10' ? '20' : '10'}% reduction in energy costs
                              </p>
                            </div>
                            <div>
                              <a 
                                href="https://calendar.app.google/NXZB4v1PP57HhARL7" 
                                target="_blank"
                                rel="noopener noreferrer" 
                                className="bg-secondary text-white py-2 px-4 rounded-md inline-block hover:bg-opacity-80 transition-all"
                              >
                                Book Consultation
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          )}
          
          {/* Energy Savings Calculator */}
          {activeCalculator === 'energy' && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-darkgray rounded-lg shadow-xl overflow-hidden border border-gray-700">
                <div className="bg-dark px-6 py-4 border-b border-gray-700">
                  <h3 className="text-xl font-bold font-header text-white">HVAC Energy Savings Calculator</h3>
                </div>
                
                <div className="p-6">
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-lightgray mb-1">Property Type</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div 
                          className={`bg-dark rounded-md p-4 border ${formData.propertyType === 'residential' ? 'border-primary' : 'border-gray-700'} cursor-pointer hover:border-primary transition-colors`}
                          onClick={() => handlePropertyTypeChange('residential')}
                        >
                          <div className="flex items-center">
                            <input 
                              type="radio" 
                              name="propertyType" 
                              className="mr-3" 
                              checked={formData.propertyType === 'residential'}
                              onChange={() => handlePropertyTypeChange('residential')}
                            />
                            <label className="cursor-pointer">
                              <div className="font-medium">Residential</div>
                              <div className="text-xs text-lightgray">Homes & Condos</div>
                            </label>
                          </div>
                        </div>
                        
                        <div 
                          className={`bg-dark rounded-md p-4 border ${formData.propertyType === 'commercial' ? 'border-primary' : 'border-gray-700'} cursor-pointer hover:border-primary transition-colors`}
                          onClick={() => handlePropertyTypeChange('commercial')}
                        >
                          <div className="flex items-center">
                            <input 
                              type="radio" 
                              name="propertyType" 
                              className="mr-3"
                              checked={formData.propertyType === 'commercial'}
                              onChange={() => handlePropertyTypeChange('commercial')}
                            />
                            <label className="cursor-pointer">
                              <div className="font-medium">Commercial</div>
                              <div className="text-xs text-lightgray">Offices & Retail</div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="squareFootage" className="block text-sm font-medium text-lightgray mb-1">Square Footage</label>
                      <input 
                        type="number" 
                        id="squareFootage" 
                        name="squareFootage"
                        placeholder="Enter square feet" 
                        className="w-full bg-dark border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.squareFootage}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="currentSystemAge" className="block text-sm font-medium text-lightgray mb-1">Current System Age</label>
                      <select 
                        id="currentSystemAge" 
                        name="currentSystemAge"
                        className="w-full bg-dark border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.currentSystemAge}
                        onChange={handleInputChange}
                      >
                        <option value="">Select age range</option>
                        <option value="0-5">0-5 years</option>
                        <option value="6-10">6-10 years</option>
                        <option value="11-15">11-15 years</option>
                        <option value="16+">16+ years</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="annualUtilityCost" className="block text-sm font-medium text-lightgray mb-1">Annual Utility Cost (optional)</label>
                      <input 
                        type="number" 
                        id="annualUtilityCost" 
                        name="annualUtilityCost"
                        placeholder="Enter your annual heating/cooling costs" 
                        className="w-full bg-dark border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.annualUtilityCost}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="furnaceType" className="block text-sm font-medium text-lightgray mb-1">New Furnace Type</label>
                      <select 
                        id="furnaceType" 
                        name="furnaceType"
                        className="w-full bg-dark border border-gray-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.furnaceType}
                        onChange={handleInputChange}
                      >
                        <option value="standard">Standard High-Efficiency (92%)</option>
                        <option value="premium">Premium High-Efficiency (96%+)</option>
                      </select>
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <button 
                        type="button" 
                        className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-all font-medium"
                        onClick={() => {
                          setFormData({
                            propertyType: 'residential',
                            squareFootage: '',
                            currentSystemAge: '',
                            furnaceType: 'standard',
                            acType: 'standard',
                            annualUtilityCost: ''
                          });
                          setShowResults(false);
                        }}
                      >
                        Reset
                      </button>
                      <button 
                        type="button" 
                        className="bg-primary hover:bg-opacity-80 text-white py-2 px-4 rounded-md transition-all font-medium"
                        onClick={() => handleCalculate('energy')}
                      >
                        Calculate Savings
                      </button>
                    </div>
                    
                    {showResults && results && (
                      <div className="mt-6 p-4 bg-dark border border-gray-700 rounded-lg">
                        <h4 className="font-bold mb-3 font-header text-lg">Estimated Annual Savings</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-lightgray">Current Annual Cost</p>
                            <p className="text-xl font-semibold text-white">
                              {formatCurrency(results.currentCost)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-lightgray">New System Annual Cost</p>
                            <p className="text-xl font-semibold text-secondary">
                              {formatCurrency(results.newCost)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-lightgray">Annual Savings</p>
                              <p className="text-2xl font-bold text-primary">
                                {formatCurrency(results.savings)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-lightgray">ROI Timeline</p>
                              <p className="text-lg font-semibold text-white">
                                {results.roi} years
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          )}
          
          {/* Pro Calculator Teaser */}
          {activeCalculator === 'pro' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-darkgray rounded-lg overflow-hidden border border-gray-700 shadow-xl">
                <div className="bg-dark p-6 border-b border-gray-700">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <h3 className="text-2xl font-bold font-header text-white mb-4 md:mb-0">Pro Calculator Access</h3>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-primary text-white text-sm rounded-full">$500 One-time</span>
                      <span className="px-3 py-1 bg-dark text-white text-sm border border-gray-700 rounded-full">Lifetime Access</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xl font-semibold font-header mb-4">Pro Features Include:</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <i className="fas fa-check-circle text-primary mt-1 mr-3"></i>
                          <span>Alberta-specific pricing defaults for all equipment</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fas fa-check-circle text-primary mt-1 mr-3"></i>
                          <span>Editable per-region material/labor pricing</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fas fa-check-circle text-primary mt-1 mr-3"></i>
                          <span>Save multiple pricing profiles for different scenarios</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fas fa-check-circle text-primary mt-1 mr-3"></i>
                          <span>Load calculation override inputs for custom projects</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fas fa-check-circle text-primary mt-1 mr-3"></i>
                          <span>Professional PDF quote export with your branding</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fas fa-check-circle text-primary mt-1 mr-3"></i>
                          <span>Side-by-side quote comparison for customer options</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fas fa-check-circle text-primary mt-1 mr-3"></i>
                          <span>Markup + Margin calculation with profit analytics</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-dark p-6 rounded-lg border border-gray-700">
                      <h4 className="text-xl font-semibold font-header mb-4">Preview:</h4>
                      <p className="text-lightgray mb-4">The Pro Calculator includes all features from our free calculators plus these professional tools:</p>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                          <span>Basic Calculator</span>
                          <span className="text-green-400"><i className="fas fa-check"></i></span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                          <span>Energy Savings Tool</span>
                          <span className="text-green-400"><i className="fas fa-check"></i></span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                          <span>Load Calculations</span>
                          <span className="text-green-400"><i className="fas fa-check"></i></span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                          <span>PDF Quote Export</span>
                          <span className="text-green-400"><i className="fas fa-check"></i></span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Quote Comparison Tool</span>
                          <span className="text-green-400"><i className="fas fa-check"></i></span>
                        </div>
                      </div>
                      
                      <div className="pt-3">
                        <button 
                          onClick={handleUpgradeToPro}
                          className="block w-full bg-primary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold text-center"
                        >
                          <i className="fas fa-lock mr-2"></i> Unlock Pro Access
                        </button>
                        <p className="text-center text-sm text-lightgray mt-3">
                          One-time payment for lifetime access
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-4 bg-dark rounded-lg border border-gray-700">
                    <h4 className="font-semibold mb-2">Perfect For:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="flex items-center">
                        <i className="fas fa-hard-hat text-primary mr-2"></i>
                        <span>HVAC Contractors</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-building text-primary mr-2"></i>
                        <span>Property Managers</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-hammer text-primary mr-2"></i>
                        <span>Home Builders</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Calculators;
