import React from 'react';
import { Link } from 'wouter';
import { ChevronRight, Calculator, Lightbulb, ArrowRight, Lock } from 'lucide-react';
import SEO from '@/lib/seo';
import BasicCalculator from '@/components/calculators/BasicCalculator';
import EnergySavingsCalculator from '@/components/calculators/EnergySavingsCalculator';

const CalculatorsPage = () => {
  return (
    <>
      <SEO 
        title="HVAC Calculators | AfterHours HVAC"
        description="Use our free HVAC calculators to estimate costs, calculate energy savings, and make informed decisions about your heating and cooling systems."
      />
      
      <main>
        {/* Hero Section */}
        <section className="bg-dark-charcoal py-24">
          <div className="container mx-auto px-4">
            <nav className="py-4">
              <ol className="flex flex-wrap text-sm">
                <li className="flex items-center">
                  <Link href="/" className="text-muted-text hover:text-white transition-colors">Home</Link>
                  <ChevronRight className="h-4 w-4 mx-2 text-gray-500" />
                </li>
                <li className="text-white">Calculators</li>
              </ol>
            </nav>
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">HVAC Calculators</h1>
              <p className="text-lg text-muted-text">
                Use our specialized calculators to estimate costs, calculate energy savings, and make 
                informed decisions about your heating and cooling needs.
              </p>
            </div>
          </div>
        </section>

        {/* Calculators Section */}
        <section className="py-16 bg-charcoal">
          <div className="container mx-auto px-4">
            <div className="mb-16">
              <h2 className="text-3xl font-heading font-bold text-center mb-2">Free Calculators</h2>
              <p className="text-muted-text text-center max-w-2xl mx-auto mb-12">
                Our free tools help you estimate costs and potential savings for your HVAC projects
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Basic Estimator Calculator */}
                <div id="basic-calc">
                  <div className="mb-6 flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-fire/20 mr-3">
                      <Calculator className="h-5 w-5 text-fire" />
                    </div>
                    <h3 className="text-2xl font-heading font-semibold">Basic HVAC Estimator</h3>
                  </div>
                  
                  <BasicCalculator />
                </div>
                
                {/* Energy Savings Calculator */}
                <div id="energy-calc">
                  <div className="mb-6 flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-fire/20 mr-3">
                      <Lightbulb className="h-5 w-5 text-fire" />
                    </div>
                    <h3 className="text-2xl font-heading font-semibold">Energy Savings Calculator</h3>
                  </div>
                  
                  <EnergySavingsCalculator />
                </div>
              </div>
            </div>
            
            {/* Pro Calculator Promotion */}
            <div className="mt-20">
              <div className="bg-dark-card border border-gray-700 rounded-xl overflow-hidden">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-fire/30 to-electric/30"></div>
                  <div className="relative p-8 md:p-12">
                    <div className="md:flex items-center justify-between">
                      <div className="md:max-w-lg">
                        <h2 className="text-3xl font-heading font-bold mb-4">Pro Calculator</h2>
                        <p className="text-lg mb-6">
                          Unlock our comprehensive HVAC calculation system designed for contractors, 
                          property managers, and serious homeowners.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                          <ul className="space-y-3">
                            <li className="flex items-start">
                              <div className="flex-shrink-0 h-5 w-5 text-electric mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="ml-2 text-white">Detailed load calculations</span>
                            </li>
                            <li className="flex items-start">
                              <div className="flex-shrink-0 h-5 w-5 text-electric mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="ml-2 text-white">PDF quote exports</span>
                            </li>
                            <li className="flex items-start">
                              <div className="flex-shrink-0 h-5 w-5 text-electric mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="ml-2 text-white">Equipment sizing guides</span>
                            </li>
                          </ul>
                          
                          <ul className="space-y-3">
                            <li className="flex items-start">
                              <div className="flex-shrink-0 h-5 w-5 text-electric mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="ml-2 text-white">Regional material & labor pricing</span>
                            </li>
                            <li className="flex items-start">
                              <div className="flex-shrink-0 h-5 w-5 text-electric mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="ml-2 text-white">Multiple system comparisons</span>
                            </li>
                            <li className="flex items-start">
                              <div className="flex-shrink-0 h-5 w-5 text-electric mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="ml-2 text-white">Return on investment analysis</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <Link 
                            href="/calculators/pro-calculator" 
                            className="inline-flex items-center justify-center px-6 py-4 rounded-md shadow-md text-base font-medium text-white bg-fire hover:bg-fire/90 transition-colors"
                          >
                            Explore Pro Calculator
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Link>
                          <div>
                            <span className="text-2xl font-heading font-bold">$500</span>
                            <span className="text-muted-text ml-1">one-time</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="hidden md:block relative mt-8 md:mt-0">
                        <div className="bg-darkgray/40 backdrop-blur-sm p-6 border border-gray-700 rounded-xl w-64">
                          <div className="absolute -top-3 -right-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-fire text-white">
                              PRO ONLY
                            </span>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-medium text-muted-text mb-1">Duct Size</label>
                              <div className="h-8 bg-charcoal rounded border border-gray-600 opacity-75"></div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-muted-text mb-1">System CFM</label>
                              <div className="h-8 bg-charcoal rounded border border-gray-600 opacity-75"></div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-muted-text mb-1">Static Pressure</label>
                              <div className="h-8 bg-charcoal rounded border border-gray-600 opacity-75"></div>
                            </div>
                            <div className="pt-2 flex justify-center">
                              <div className="inline-flex items-center text-sm">
                                <Lock className="h-4 w-4 text-electric mr-1.5" />
                                <span className="text-electric">Pro Features Locked</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-dark-charcoal">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-heading font-bold text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                <div className="bg-dark-card border border-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-heading font-semibold mb-2">How accurate are these calculators?</h3>
                  <p className="text-muted-text">
                    Our calculators provide solid estimates based on industry averages and regional data. 
                    However, for precise quotes that account for your property's specific conditions, 
                    we recommend scheduling an on-site assessment with our technicians.
                  </p>
                </div>
                
                <div className="bg-dark-card border border-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-heading font-semibold mb-2">What makes the Pro Calculator worth the investment?</h3>
                  <p className="text-muted-text">
                    The Pro Calculator offers significantly more detailed analysis with Alberta-specific data. 
                    It's particularly valuable for contractors, property managers handling multiple units, 
                    and homeowners planning complex projects. The ROI planning tools alone can save thousands 
                    by helping you select the optimal system for your needs.
                  </p>
                </div>
                
                <div className="bg-dark-card border border-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-heading font-semibold mb-2">Can I save my calculation results?</h3>
                  <p className="text-muted-text">
                    The free calculators don't include saving functionality. The Pro Calculator allows you 
                    to save, export as PDF, and revisit multiple scenarios to compare different options 
                    and configurations over time.
                  </p>
                </div>
                
                <div className="bg-dark-card border border-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-heading font-semibold mb-2">Do the calculators account for Alberta's specific climate?</h3>
                  <p className="text-muted-text">
                    Yes, all our calculators are calibrated for Alberta's climate zones. The Pro Calculator 
                    offers even more granular regional customization for different areas within the province.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default CalculatorsPage;
