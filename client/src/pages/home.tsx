import { Helmet } from 'react-helmet-async';
import HeroSection from '@/components/home/HeroSection';
import ServicesGrid from '@/components/home/ServicesGrid';
import QuickContactWidget from '@/components/home/QuickContactWidget';
import { Link } from 'wouter';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>AfterHours HVAC - When Everyone Else Closes, We Keep The Heat On</title>
        <meta name="description" content="Professional HVAC services in Calgary and surrounding areas. 24/7 emergency repairs, installations, and maintenance for residential and commercial properties." />
      </Helmet>
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Services Grid */}
      <ServicesGrid />
      
      {/* Quick Contact Widget */}
      <QuickContactWidget />
      
      {/* Blog Section Preview */}
      <section className="bg-darkgray py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-header mb-4">HVAC <span className="text-primary">Knowledge Hub</span></h2>
            <p className="text-lightgray max-w-3xl mx-auto">Expert tips, insights, and guides to help you make informed decisions about your heating and cooling systems.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Blog Post 1 */}
            <div className="bg-dark rounded-lg overflow-hidden border border-gray-700 transition-transform hover:transform hover:scale-105">
              <img 
                src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80" 
                alt="Furnace maintenance by HVAC technician" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center space-x-2 text-sm text-lightgray mb-3">
                  <span><i className="far fa-calendar-alt mr-1"></i> October 12, 2023</span>
                  <span>•</span>
                  <span><i className="far fa-clock mr-1"></i> 8 min read</span>
                </div>
                <h3 className="text-2xl font-bold font-header mb-4">How to Prepare Your Furnace for Winter</h3>
                <p className="text-lightgray mb-4">Essential maintenance steps to ensure your heating system runs efficiently and reliably throughout the cold Alberta winter months.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-darkgray rounded-full px-3 py-1">Furnace Tips</span>
                  <span className="text-xs bg-darkgray rounded-full px-3 py-1">Winter Prep</span>
                  <span className="text-xs bg-darkgray rounded-full px-3 py-1">Maintenance</span>
                </div>
                <Link href="/blog/prepare-furnace-winter">
                  <div className="inline-flex items-center text-secondary hover:text-primary transition-colors font-medium cursor-pointer">
                    Read Full Article <i className="fas fa-arrow-right ml-2"></i>
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Blog Post 2 */}
            <div className="bg-dark rounded-lg overflow-hidden border border-gray-700 transition-transform hover:transform hover:scale-105">
              <img 
                src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80" 
                alt="Commercial HVAC rooftop units" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center space-x-2 text-sm text-lightgray mb-3">
                  <span><i className="far fa-calendar-alt mr-1"></i> September 28, 2023</span>
                  <span>•</span>
                  <span><i className="far fa-clock mr-1"></i> 10 min read</span>
                </div>
                <h3 className="text-2xl font-bold font-header mb-4">Commercial vs Residential HVAC: What's the Difference?</h3>
                <p className="text-lightgray mb-4">An in-depth comparison of commercial and residential HVAC systems, including design considerations, complexity, and maintenance requirements.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-darkgray rounded-full px-3 py-1">Commercial</span>
                  <span className="text-xs bg-darkgray rounded-full px-3 py-1">Residential</span>
                  <span className="text-xs bg-darkgray rounded-full px-3 py-1">System Design</span>
                </div>
                <Link href="/blog/commercial-vs-residential-hvac">
                  <div className="inline-flex items-center text-secondary hover:text-primary transition-colors font-medium cursor-pointer">
                    Read Full Article <i className="fas fa-arrow-right ml-2"></i>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/blog">
              <div className="inline-flex items-center bg-dark border border-primary text-primary hover:bg-primary hover:text-white py-3 px-6 rounded-md transition-all font-semibold cursor-pointer">
                <i className="fas fa-book-open mr-2"></i> View All Articles
              </div>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="bg-dark py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-header mb-4">Get In <span className="text-primary">Touch</span></h2>
            <p className="text-lightgray max-w-3xl mx-auto">Have questions or need service? Contact our team for prompt, professional assistance.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-darkgray rounded-lg overflow-hidden border border-gray-700">
                <div className="p-6">
                  <h3 className="text-xl font-bold font-header mb-6">Get Started Today</h3>
                  <p className="text-lightgray mb-4">Ready to improve your HVAC system? Contact us for a free consultation.</p>
                  <Link href="/contact">
                    <div className="bg-primary hover:bg-primary/80 text-white py-3 px-6 rounded-md transition-all font-semibold text-center cursor-pointer">
                      Get Free Quote
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-darkgray rounded-lg overflow-hidden border border-gray-700 h-full">
                <div className="p-6">
                  <h3 className="text-xl font-bold font-header mb-6">Contact Information</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-primary rounded-full p-2 mr-4 mt-1">
                        <i className="fas fa-phone-alt text-white"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Phone</h4>
                        <a href="tel:4036136014" className="text-lightgray hover:text-white transition-colors">(403) 613-6014</a>
                        <p className="text-sm text-lightgray mt-1">Available 24/7 for emergencies</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary rounded-full p-2 mr-4 mt-1">
                        <i className="fas fa-envelope text-white"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Email</h4>
                        <a href="mailto:Jordan@AfterhoursHVAC.ca" className="text-lightgray hover:text-white transition-colors">Jordan@AfterhoursHVAC.ca</a>
                        <p className="text-sm text-lightgray mt-1">We typically respond within 24 hours</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary rounded-full p-2 mr-4 mt-1">
                        <i className="fas fa-calendar-alt text-white"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Book Online</h4>
                        <a href="https://calendar.app.google/NXZB4v1PP57HhARL7" target="_blank" rel="noopener noreferrer" className="text-lightgray hover:text-white transition-colors">Schedule an Appointment</a>
                        <p className="text-sm text-lightgray mt-1">Select a convenient date and time</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary rounded-full p-2 mr-4 mt-1">
                        <i className="fas fa-clock text-white"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Business Hours</h4>
                        <p className="text-lightgray">Monday - Friday: 8:00 AM - 5:00 PM</p>
                        <p className="text-lightgray">Emergency Service: 24/7/365</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary rounded-full p-2 mr-4 mt-1">
                        <i className="fas fa-star text-white"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Reviews</h4>
                        <a href="https://g.page/r/CQEE3GNkblpDEAI/review" target="_blank" rel="noopener noreferrer" className="text-lightgray hover:text-white transition-colors">Google Business</a>
                        <p className="text-sm text-lightgray mt-1">Share your experience with us</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-700">
                    <div className="flex justify-center space-x-4">
                      <a href="#" className="text-lightgray hover:text-primary transition-colors">
                        <i className="fab fa-facebook-f text-xl"></i>
                      </a>
                      <a href="#" className="text-lightgray hover:text-primary transition-colors">
                        <i className="fab fa-instagram text-xl"></i>
                      </a>
                      <a href="#" className="text-lightgray hover:text-primary transition-colors">
                        <i className="fab fa-linkedin-in text-xl"></i>
                      </a>
                      <a href="https://g.page/r/CQEE3GNkblpDEAI/review" target="_blank" rel="noopener noreferrer" className="text-lightgray hover:text-primary transition-colors">
                        <i className="fab fa-google text-xl"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
