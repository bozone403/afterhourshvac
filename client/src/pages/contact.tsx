import React from 'react';
import { Helmet } from 'react-helmet-async';
import ContactForm from '@/components/forms/ContactForm';
import ServiceAreaBanner from '@/components/contact/ServiceAreaBanner';

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us - AfterHours HVAC</title>
        <meta name="description" content="Contact AfterHours HVAC for 24/7 emergency service, installation quotes, and maintenance plans. Serving Calgary, Lethbridge, and surrounding areas." />
      </Helmet>
      
      {/* Service Area Banner */}
      <ServiceAreaBanner />
      
      {/* Page Header */}
      <div className="relative pt-24 pb-10 bg-dark">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-header mb-4">Get In <span className="text-primary">Touch</span></h1>
            <p className="text-lightgray max-w-3xl mx-auto">Have questions or need service? Contact our team for prompt, professional assistance.</p>
          </div>
        </div>
      </div>
      
      {/* Contact Section */}
      <section className="bg-dark py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-darkgray rounded-lg overflow-hidden border border-gray-700">
                <div className="p-6">
                  <h3 className="text-xl font-bold font-header mb-6">Send Us a Message</h3>
                  <ContactForm />
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
                        <a 
                          href="tel:4036136014" 
                          className="text-lightgray hover:text-white transition-colors"
                        >
                          (403) 613-6014
                        </a>
                        <p className="text-sm text-lightgray mt-1">Available 24/7 for emergencies</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary rounded-full p-2 mr-4 mt-1">
                        <i className="fas fa-envelope text-white"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Email</h4>
                        <a 
                          href="mailto:Jordan@AfterhoursHVAC.ca" 
                          className="text-lightgray hover:text-white transition-colors"
                        >
                          Jordan@AfterhoursHVAC.ca
                        </a>
                        <p className="text-sm text-lightgray mt-1">We typically respond within 24 hours</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary rounded-full p-2 mr-4 mt-1">
                        <i className="fas fa-calendar-alt text-white"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Book Online</h4>
                        <a 
                          href="https://calendar.app.google/NXZB4v1PP57HhARL7" 
                          target="_blank"
                          rel="noopener noreferrer" 
                          className="text-lightgray hover:text-white transition-colors"
                        >
                          Schedule an Appointment
                        </a>
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
                        <a 
                          href="https://g.page/r/CQEE3GNkblpDEAI/review" 
                          target="_blank"
                          rel="noopener noreferrer" 
                          className="text-lightgray hover:text-white transition-colors"
                        >
                          Google Business
                        </a>
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
                      <a 
                        href="https://g.page/r/CQEE3GNkblpDEAI/review" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-lightgray hover:text-primary transition-colors"
                      >
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
      
      {/* Map Section */}
      <section className="bg-darkgray py-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-header mb-4">Our Service <span className="text-primary">Areas</span></h2>
            <p className="text-lightgray max-w-3xl mx-auto">We provide HVAC services throughout Calgary and surrounding areas in Alberta.</p>
          </div>
          
          <div className="bg-dark p-1 rounded-lg overflow-hidden border border-gray-700">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d321202.8130375833!2d-114.36801981347658!3d51.02757586482484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x537170039f843fd5%3A0x266d3bb1b652b63a!2sCalgary%2C%20AB%2C%20Canada!5e0!3m2!1sen!2sus!4v1652280085779!5m2!1sen!2sus" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="AfterHours HVAC Service Area Map"
              className="w-full rounded-lg"
            ></iframe>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-8">
            <div className="bg-dark border border-gray-700 p-3 rounded-lg text-center">
              <i className="fas fa-map-marker-alt text-primary mb-2"></i>
              <h4 className="font-medium">Calgary</h4>
            </div>
            <div className="bg-dark border border-gray-700 p-3 rounded-lg text-center">
              <i className="fas fa-map-marker-alt text-primary mb-2"></i>
              <h4 className="font-medium">Lethbridge</h4>
            </div>
            <div className="bg-dark border border-gray-700 p-3 rounded-lg text-center">
              <i className="fas fa-map-marker-alt text-primary mb-2"></i>
              <h4 className="font-medium">Coaldale</h4>
            </div>
            <div className="bg-dark border border-gray-700 p-3 rounded-lg text-center">
              <i className="fas fa-map-marker-alt text-primary mb-2"></i>
              <h4 className="font-medium">Taber</h4>
            </div>
            <div className="bg-dark border border-gray-700 p-3 rounded-lg text-center">
              <i className="fas fa-map-marker-alt text-primary mb-2"></i>
              <h4 className="font-medium">Fort Macleod</h4>
            </div>
            <div className="bg-dark border border-gray-700 p-3 rounded-lg text-center">
              <i className="fas fa-map-marker-alt text-primary mb-2"></i>
              <h4 className="font-medium">Rural Areas</h4>
            </div>
          </div>
        </div>
      </section>
      
      {/* Emergency Contact */}
      <section className="bg-primary py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold font-header text-white mb-2">
                <i className="fas fa-exclamation-triangle mr-3"></i>
                Emergency HVAC Service Available 24/7
              </h2>
              <p className="text-white text-opacity-90 max-w-xl">
                Don't wait until morning for heating or cooling emergencies. Our skilled technicians are on call around the clock to restore comfort to your home or business.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="tel:4036136014" 
                className="bg-white text-primary hover:bg-gray-100 py-3 px-6 rounded-md transition-all font-semibold text-center"
              >
                <i className="fas fa-phone-alt mr-2"></i> (403) 613-6014
              </a>
              <a 
                href="https://calendar.app.google/NXZB4v1PP57HhARL7" 
                target="_blank"
                rel="noopener noreferrer" 
                className="bg-dark text-white hover:bg-opacity-90 py-3 px-6 rounded-md transition-all font-semibold text-center"
              >
                <i className="fas fa-calendar-alt mr-2"></i> Schedule Service
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
