import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Link, useLocation } from 'wouter';

const Pricing = () => {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('residential');
  
  const handlePayDeposit = () => {
    setLocation('/checkout?service=deposit&amount=175');
  };
  
  const handlePayEmergency = (time: string) => {
    const amount = time === 'evening' ? 250 : 275;
    setLocation(`/checkout?service=emergency&amount=${amount}&time=${time}`);
  };
  
  const handleSelectMaintenancePlan = (plan: string) => {
    const amounts = {
      basic: 399,
      premium: 799,
      commercial: 1200
    };
    setLocation(`/checkout?service=maintenance&plan=${plan}&amount=${amounts[plan as keyof typeof amounts]}`);
  };
  
  return (
    <>
      <Helmet>
        <title>HVAC Pricing & Packages - AfterHours HVAC</title>
        <meta name="description" content="Transparent pricing for HVAC services in Calgary and surrounding areas. View our residential and commercial heating and cooling service rates and packages." />
      </Helmet>
      
      {/* Page Header */}
      <div className="relative pt-24 pb-10 bg-dark">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-header mb-4">Transparent <span className="text-primary">Pricing & Packages</span></h1>
            <p className="text-lightgray max-w-3xl mx-auto">We offer competitive pricing and flexible payment options for all our HVAC services.</p>
          </div>
        </div>
      </div>
      
      {/* Pricing Section */}
      <section className="bg-dark py-16">
        <div className="container mx-auto px-4">
          {/* Pricing Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center space-x-2 mb-8">
              <button 
                onClick={() => setActiveTab('residential')} 
                className={`${activeTab === 'residential' ? 'bg-primary text-white' : 'bg-dark text-white border border-gray-700'} py-2 px-6 rounded-md font-medium mb-2`}
              >
                Residential
              </button>
              <button 
                onClick={() => setActiveTab('commercial')} 
                className={`${activeTab === 'commercial' ? 'bg-primary text-white' : 'bg-dark text-white border border-gray-700'} py-2 px-6 rounded-md font-medium mb-2`}
              >
                Commercial
              </button>
              <button 
                onClick={() => setActiveTab('maintenance')} 
                className={`${activeTab === 'maintenance' ? 'bg-primary text-white' : 'bg-dark text-white border border-gray-700'} py-2 px-6 rounded-md font-medium mb-2`}
              >
                Maintenance
              </button>
              <button 
                onClick={() => setActiveTab('emergency')} 
                className={`${activeTab === 'emergency' ? 'bg-primary text-white' : 'bg-dark text-white border border-gray-700'} py-2 px-6 rounded-md font-medium mb-2`}
              >
                Emergency
              </button>
            </div>
            
            {/* Residential Tab Content */}
            {activeTab === 'residential' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Residential Furnace */}
                <div className="bg-darkgray rounded-lg overflow-hidden border border-gray-700">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold font-header">Furnace Systems</h3>
                      <span className="text-primary"><i className="fas fa-fire text-2xl"></i></span>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">High-Efficiency (96%+)</span>
                        <span className="font-semibold">$5,500 - $9,800</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">Standard Installation</span>
                        <span className="font-semibold">Included</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">Removal of Old Unit</span>
                        <span className="font-semibold">Included</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Warranty</span>
                        <span className="font-semibold">10 Years</span>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <a 
                        href="https://calendar.app.google/NXZB4v1PP57HhARL7" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-full bg-primary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold text-center"
                      >
                        Book Consultation
                      </a>
                      <div className="text-center mt-3 text-sm text-lightgray">
                        * Upfront payment required
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Residential AC */}
                <div className="bg-darkgray rounded-lg overflow-hidden border border-gray-700">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold font-header">AC Systems</h3>
                      <span className="text-secondary"><i className="fas fa-snowflake text-2xl"></i></span>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">High-Efficiency Units</span>
                        <span className="font-semibold">$4,800 - $8,900</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">Standard Installation</span>
                        <span className="font-semibold">Included</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">Removal of Old Unit</span>
                        <span className="font-semibold">Included</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Warranty</span>
                        <span className="font-semibold">10 Years</span>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <a 
                        href="https://calendar.app.google/NXZB4v1PP57HhARL7" 
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="block w-full bg-secondary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold text-center"
                      >
                        Book Consultation
                      </a>
                      <div className="text-center mt-3 text-sm text-lightgray">
                        * Upfront payment required
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Residential Repairs */}
                <div className="bg-darkgray rounded-lg overflow-hidden border border-gray-700">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold font-header">Repair Services</h3>
                      <span className="text-primary"><i className="fas fa-tools text-2xl"></i></span>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">Service Call</span>
                        <span className="font-semibold">$175</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">Diagnostic Fee</span>
                        <span className="font-semibold">Included</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">Parts Replacement</span>
                        <span className="font-semibold">+ Cost of Parts</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Labor Rate</span>
                        <span className="font-semibold">$125/hr</span>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <button 
                        onClick={handlePayDeposit}
                        className="block w-full bg-primary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold text-center"
                      >
                        Pay Deposit
                      </button>
                      <div className="text-center mt-3 text-sm text-lightgray">
                        * Service deposit applied to final bill
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Commercial Tab Content */}
            {activeTab === 'commercial' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-darkgray rounded-lg overflow-hidden border border-gray-700">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold font-header">RTU By Tonnage</h3>
                      <span className="text-secondary"><i className="fas fa-building text-2xl"></i></span>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">5-Ton RTU</span>
                        <span className="font-semibold">$9,000 - $10,500</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">7.5-Ton RTU</span>
                        <span className="font-semibold">$11,500 - $13,000</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">10-Ton RTU</span>
                        <span className="font-semibold">$15,000 - $17,000</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">12.5-Ton RTU</span>
                        <span className="font-semibold">$18,000 - $22,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">15-Ton RTU</span>
                        <span className="font-semibold">$21,000 - $25,000</span>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Link href="/contact">
                        <a className="block w-full bg-secondary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold text-center">
                          Request Quote
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="bg-darkgray rounded-lg overflow-hidden border border-gray-700">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold font-header">Commercial Services</h3>
                      <span className="text-primary"><i className="fas fa-tools text-2xl"></i></span>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">Service Call</span>
                        <span className="font-semibold">$250</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">Preventative Maintenance</span>
                        <span className="font-semibold">Custom Quote</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">System Commissioning</span>
                        <span className="font-semibold">$150/hour</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">Refrigerant Charge</span>
                        <span className="font-semibold">$85/lb + Labor</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Comprehensive Contracts</span>
                        <span className="font-semibold">Ask for Details</span>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <a 
                        href="https://calendar.app.google/NXZB4v1PP57HhARL7" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-primary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold text-center"
                      >
                        Schedule Consultation
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Maintenance Tab Content */}
            {activeTab === 'maintenance' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-darkgray rounded-lg overflow-hidden border border-gray-700">
                  <div className="bg-dark py-3 text-center">
                    <h3 className="text-xl font-bold font-header">Basic Plan</h3>
                  </div>
                  <div className="p-6">
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-white">$399<span className="text-sm font-normal text-lightgray">/year</span></div>
                      <p className="text-lightgray mt-2">Annual maintenance for one system</p>
                    </div>
                    
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center">
                        <i className="fas fa-check text-primary mr-3"></i>
                        <span>Annual inspection</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-check text-primary mr-3"></i>
                        <span>Filter replacement</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-check text-primary mr-3"></i>
                        <span>System cleaning</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-check text-primary mr-3"></i>
                        <span>10% off repairs</span>
                      </div>
                      <div className="flex items-center text-lightgray">
                        <i className="fas fa-times mr-3"></i>
                        <span>Priority scheduling</span>
                      </div>
                      <div className="flex items-center text-lightgray">
                        <i className="fas fa-times mr-3"></i>
                        <span>No overtime fees</span>
                      </div>
                    </div>
                    
                    <div>
                      <button 
                        onClick={() => handleSelectMaintenancePlan('basic')}
                        className="block w-full bg-primary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold text-center"
                      >
                        Select Plan
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-darkgray rounded-lg overflow-hidden border border-primary transform scale-105 shadow-xl">
                  <div className="bg-primary py-3 text-center">
                    <h3 className="text-xl font-bold font-header text-white">Premium Plan</h3>
                  </div>
                  <div className="p-6">
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-white">$799<span className="text-sm font-normal text-lightgray">/year</span></div>
                      <p className="text-lightgray mt-2">Complete coverage for two systems</p>
                    </div>
                    
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center">
                        <i className="fas fa-check text-primary mr-3"></i>
                        <span>Bi-annual inspections</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-check text-primary mr-3"></i>
                        <span>Filter replacement (3x/year)</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-check text-primary mr-3"></i>
                        <span>Deep system cleaning</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-check text-primary mr-3"></i>
                        <span>15% off repairs</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-check text-primary mr-3"></i>
                        <span>Priority scheduling</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-check text-primary mr-3"></i>
                        <span>24/7 phone support</span>
                      </div>
                    </div>
                    
                    <div>
                      <button 
                        onClick={() => handleSelectMaintenancePlan('premium')}
                        className="block w-full bg-primary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold text-center"
                      >
                        Select Plan
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-darkgray rounded-lg overflow-hidden border border-gray-700">
                  <div className="bg-dark py-3 text-center">
                    <h3 className="text-xl font-bold font-header">Commercial Plan</h3>
                  </div>
                  <div className="p-6">
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-white">$1,200<span className="text-sm font-normal text-lightgray">/year</span></div>
                      <p className="text-lightgray mt-2">Custom business solution</p>
                    </div>
                    
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center">
                        <i className="fas fa-check text-primary mr-3"></i>
                        <span>Quarterly maintenance</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-check text-primary mr-3"></i>
                        <span>Customized schedule</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-check text-primary mr-3"></i>
                        <span>Filter program</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-check text-primary mr-3"></i>
                        <span>20% off repairs</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-check text-primary mr-3"></i>
                        <span>Same-day service</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-check text-primary mr-3"></i>
                        <span>Dedicated account manager</span>
                      </div>
                    </div>
                    
                    <div>
                      <button 
                        onClick={() => handleSelectMaintenancePlan('commercial')}
                        className="block w-full bg-secondary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold text-center"
                      >
                        Select Plan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Emergency Tab Content */}
            {activeTab === 'emergency' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-darkgray rounded-lg overflow-hidden border border-gray-700">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold font-header">Regular Hours</h3>
                      <span className="text-secondary"><i className="fas fa-sun text-2xl"></i></span>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">Service Deposit</span>
                        <span className="font-semibold">$175</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">Monday - Friday</span>
                        <span className="font-semibold">8am - 5pm</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">Hourly Rate</span>
                        <span className="font-semibold">$125/hour</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Response Time</span>
                        <span className="font-semibold">Same Day</span>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <a 
                        href="tel:4036136014" 
                        className="block w-full bg-secondary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold text-center"
                      >
                        <i className="fas fa-phone-alt mr-2"></i> Call Now
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="bg-darkgray rounded-lg overflow-hidden border border-gray-700">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold font-header">After Hours</h3>
                      <span className="text-primary"><i className="fas fa-moon text-2xl"></i></span>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">Evening (5pm-12am)</span>
                        <span className="font-semibold">$250 (2hr min)</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">Overnight (12am-8am)</span>
                        <span className="font-semibold">$275 (3hr min)</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="font-medium">Weekends & Holidays</span>
                        <span className="font-semibold">After Hours Rates</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Response Time</span>
                        <span className="font-semibold">ASAP</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 space-y-3">
                      <button 
                        onClick={() => handlePayEmergency('evening')}
                        className="block w-full bg-primary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold text-center"
                      >
                        Pay Evening Deposit ($250)
                      </button>
                      <button 
                        onClick={() => handlePayEmergency('overnight')}
                        className="block w-full bg-primary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold text-center"
                      >
                        Pay Overnight Deposit ($275)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-lightgray mb-4">Need something not listed here? Contact us for a custom quote.</p>
            <Link href="/contact">
              <a className="inline-flex items-center bg-secondary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold shadow-lg">
                <i className="fas fa-clipboard-list mr-2"></i> Request Custom Quote
              </a>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Calgary Note */}
      <section className="bg-darkgray py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-dark p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold font-header mb-3 flex items-center">
                <i className="fas fa-info-circle text-primary mr-2"></i>
                Calgary Efficiency Standards
              </h3>
              <p className="text-lightgray mb-4">
                Please note that due to Calgary's building and energy codes, we can no longer install low or mid-efficiency furnaces or 13-14 SEER AC units within city limits. All equipment we install meets or exceeds the current efficiency requirements. This helps ensure energy savings and environmental compliance.
              </p>
              <p className="text-sm text-lightgray">
                We're committed to providing the most efficient and code-compliant systems for all our customers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Pricing;
