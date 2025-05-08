import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us - AfterHours HVAC</title>
        <meta name="description" content="Learn about AfterHours HVAC - our story, our team, and our commitment to exceptional HVAC service throughout Alberta." />
      </Helmet>
      
      {/* Page Header */}
      <div className="relative pt-24 pb-10 bg-dark">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-header mb-4">About <span className="text-primary">Us</span></h1>
            <p className="text-lightgray max-w-3xl mx-auto">Founded on a commitment to exceptional service and technical expertise, AfterHours HVAC has built a reputation for reliability and quality workmanship in Alberta.</p>
          </div>
        </div>
      </div>
      
      {/* About Section */}
      <section className="bg-dark py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-header mb-6">The AfterHours <span className="text-primary">Difference</span></h2>
              <p className="text-lightgray mb-6">When everyone else is closed for the day, we're still working hard to keep your heating and cooling systems functioning at peak performance. Our mission is to provide unparalleled HVAC services with a focus on reliability, quality workmanship, and customer satisfaction.</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="bg-primary rounded-full p-2 mr-4 mt-1">
                    <i className="fas fa-clock text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold font-header mb-1">24/7 Emergency Service</h3>
                    <p className="text-lightgray">We're available around the clock because HVAC emergencies don't follow business hours.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary rounded-full p-2 mr-4 mt-1">
                    <i className="fas fa-certificate text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold font-header mb-1">Licensed & Certified</h3>
                    <p className="text-lightgray">Our technicians are fully licensed, insured, and certified to handle all HVAC systems.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary rounded-full p-2 mr-4 mt-1">
                    <i className="fas fa-shield-alt text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold font-header mb-1">Satisfaction Guaranteed</h3>
                    <p className="text-lightgray">We stand behind our work with robust warranties and a commitment to customer satisfaction.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <a className="bg-primary hover:bg-opacity-80 text-white py-3 px-6 rounded-md transition-all font-semibold shadow-lg">
                    Contact Us
                  </a>
                </Link>
                <a 
                  href="https://g.page/r/CQEE3GNkblpDEAI/review" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-dark border border-lightgray text-white hover:bg-darkgray py-3 px-6 rounded-md transition-all font-semibold"
                >
                  <i className="fas fa-star mr-2"></i> Read Reviews
                </a>
              </div>
            </div>
            
            <div>
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80" 
                  alt="HVAC technician installing equipment" 
                  className="rounded-lg shadow-lg object-cover h-64"
                />
                
                <img 
                  src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="Commercial rooftop HVAC installation" 
                  className="rounded-lg shadow-lg object-cover h-40"
                />
                
                <img 
                  src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="HVAC technician explaining system to customer" 
                  className="rounded-lg shadow-lg object-cover h-40"
                />
                
                <img 
                  src="https://pixabay.com/get/g50ed5e0a3b904f1fba03de63d669017f97b36a7d0a3e96c0793fc9861d4bc7bd54b81db80bb30882ddb305b295fad8840a82fe2335ac292ae9ff91d926904ec4_1280.jpg" 
                  alt="High-efficiency furnace installation" 
                  className="rounded-lg shadow-lg object-cover h-64"
                />
              </div>
            </div>
          </div>
          
          {/* Staff Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-header mb-4">Meet Our <span className="text-primary">Team</span></h2>
              <p className="text-lightgray max-w-3xl mx-auto">We combine experienced HVAC professionals with cutting-edge AI support for unprecedented service quality.</p>
            </div>
            
            <div className="mb-16">
              <h3 className="text-2xl font-bold font-header mb-6 border-b border-gray-700 pb-2">Human Staff</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Staff Member 1 */}
                <div className="bg-darkgray rounded-lg overflow-hidden border border-gray-700">
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-2xl font-bold">JB</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold font-header">Jordan Boisclair</h4>
                        <p className="text-primary mb-2">Owner, Lead Field Technician</p>
                        <p className="text-lightgray text-sm">Founder with extensive field experience and a passion for quality HVAC solutions.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Staff Member 2 */}
                <div className="bg-darkgray rounded-lg overflow-hidden border border-gray-700">
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-2xl font-bold">EM</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold font-header">Earl MacRae</h4>
                        <p className="text-secondary mb-2">Co-Founder, Compliance</p>
                        <p className="text-lightgray text-sm">Code and compliance expert ensuring all installations meet or exceed building standards.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Staff Member 3 */}
                <div className="bg-darkgray rounded-lg overflow-hidden border border-gray-700">
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-2xl font-bold">DT</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold font-header">Derek Thompson</h4>
                        <p className="text-primary mb-2">Senior Service Tech</p>
                        <p className="text-lightgray text-sm">Retrofit specialist with deep knowledge of upgrading existing HVAC systems for maximum efficiency.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold font-header mb-6 border-b border-gray-700 pb-2">AI Staff</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* AI Staff Member 1 */}
                <div className="bg-dark rounded-lg overflow-hidden border border-gray-700 p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-primary bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-robot text-primary"></i>
                    </div>
                    <div>
                      <h5 className="font-bold font-header">Atlas</h5>
                      <p className="text-xs text-lightgray">Executive Intelligence</p>
                    </div>
                  </div>
                </div>
                
                {/* AI Staff Member 2 */}
                <div className="bg-dark rounded-lg overflow-hidden border border-gray-700 p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-secondary bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-hard-hat text-secondary"></i>
                    </div>
                    <div>
                      <h5 className="font-bold font-header">Earl (AI)</h5>
                      <p className="text-xs text-lightgray">Virtual HVAC Foreman</p>
                    </div>
                  </div>
                </div>
                
                {/* AI Staff Member 3 */}
                <div className="bg-dark rounded-lg overflow-hidden border border-gray-700 p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-primary bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-calculator text-primary"></i>
                    </div>
                    <div>
                      <h5 className="font-bold font-header">Penny LedgerAI</h5>
                      <p className="text-xs text-lightgray">Admin & Invoicing</p>
                    </div>
                  </div>
                </div>
                
                {/* AI Staff Member 4 */}
                <div className="bg-dark rounded-lg overflow-hidden border border-gray-700 p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-secondary bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-calendar-check text-secondary"></i>
                    </div>
                    <div>
                      <h5 className="font-bold font-header">Rosie FlowAI</h5>
                      <p className="text-xs text-lightgray">Dispatch & Scheduling</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Service Areas */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-header mb-4">Service <span className="text-primary">Areas</span></h2>
              <p className="text-lightgray max-w-3xl mx-auto">We provide comprehensive HVAC services throughout Calgary and surrounding areas in Alberta.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-darkgray rounded-lg overflow-hidden h-full">
                  {/* Google Map Embed */}
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d321202.8130375833!2d-114.36801981347658!3d51.02757586482484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x537170039f843fd5%3A0x266d3bb1b652b63a!2sCalgary%2C%20AB%2C%20Canada!5e0!3m2!1sen!2sus!4v1652280085779!5m2!1sen!2sus" 
                    width="100%" 
                    height="450" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Service Territory Map"
                    className="w-full h-full min-h-[400px]"
                  ></iframe>
                </div>
              </div>
              
              <div>
                <div className="bg-darkgray rounded-lg overflow-hidden border border-gray-700 h-full">
                  <div className="p-6">
                    <h3 className="text-xl font-bold font-header mb-4">Areas We Serve</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <i className="fas fa-map-pin text-primary mt-1 mr-3"></i>
                        <div>
                          <span className="font-medium">Calgary</span>
                          <p className="text-sm text-lightgray">Full service area including all neighborhoods and suburbs</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-map-pin text-primary mt-1 mr-3"></i>
                        <div>
                          <span className="font-medium">Lethbridge</span>
                          <p className="text-sm text-lightgray">Comprehensive residential and commercial services</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-map-pin text-primary mt-1 mr-3"></i>
                        <div>
                          <span className="font-medium">Coaldale</span>
                          <p className="text-sm text-lightgray">Complete HVAC sales, service, and installation</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-map-pin text-primary mt-1 mr-3"></i>
                        <div>
                          <span className="font-medium">Taber</span>
                          <p className="text-sm text-lightgray">Residential and light commercial services</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-map-pin text-primary mt-1 mr-3"></i>
                        <div>
                          <span className="font-medium">Fort Macleod</span>
                          <p className="text-sm text-lightgray">Full HVAC service and emergency support</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-map-pin text-primary mt-1 mr-3"></i>
                        <div>
                          <span className="font-medium">Rural Regions</span>
                          <p className="text-sm text-lightgray">Serving farms, acreages, and rural properties</p>
                        </div>
                      </li>
                    </ul>
                    
                    <div className="mt-6 pt-4 border-t border-gray-700">
                      <p className="text-lightgray mb-4">Outside our service area? Contact us anyway - we have partner contractors who may be able to help.</p>
                      <a 
                        href="tel:4036136014" 
                        className="inline-flex items-center text-primary hover:text-white hover:bg-primary border border-primary py-2 px-4 rounded-md transition-all"
                      >
                        <i className="fas fa-phone-alt mr-2"></i> Ask About Your Location
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

export default About;
