import React from 'react';
import { Link } from 'wouter';
import { ChevronRight, CheckCircle, AlertTriangle, Settings, Drill, Calendar } from 'lucide-react';
import SEO from '@/lib/seo';

// Service data
const services = [
  {
    id: "furnace",
    title: "Furnace Services",
    description: "Keep your home warm and comfortable with our comprehensive furnace services. From installation to repairs and maintenance, we ensure your heating system operates at peak efficiency.",
    image: "https://pixabay.com/get/g7696006344348f150a90b506ea85183b5103c6aeb9e59d665c97bfb1344bc4644453754400d47fe7f6da541296d314937040d55b61961cc2ee1a354c0030b84d_1280.jpg",
    features: [
      "High-efficiency furnace installations",
      "Emergency furnace repairs",
      "Routine maintenance and tune-ups",
      "Thermostat upgrades and installations",
      "Filter replacements and duct cleaning"
    ],
    priceRange: "$5,500 - $9,800",
    alt: "High-efficiency furnace installation being performed by technician"
  },
  {
    id: "ac",
    title: "Air Conditioning",
    description: "Stay cool during those hot summer months with our energy-efficient air conditioning services. We offer installation, maintenance, and repair for all types of AC systems.",
    image: "https://pixabay.com/get/g324e858daa6d34f44387769195ee1de1896e9cc84761d5beaee4d7d0c718bd4bfb010880cba958fc4ff5807772b62641d7ab74a8c2811d0bf98be78f46029ec0_1280.jpg",
    features: [
      "Energy-efficient AC installations",
      "AC repair and troubleshooting",
      "Seasonal maintenance and tune-ups",
      "Ductless mini-split systems",
      "Refrigerant recharging and leak detection"
    ],
    priceRange: "$4,800 - $8,900",
    alt: "Air conditioning condenser unit installation"
  },
  {
    id: "maintenance",
    title: "Maintenance Plans",
    description: "Prevent costly breakdowns and ensure your HVAC system operates efficiently year-round with our comprehensive maintenance plans.",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
    features: [
      "Annual inspections and tune-ups",
      "Priority scheduling for service calls",
      "Discounted repair services",
      "Filter replacements",
      "Extended equipment warranty"
    ],
    priceRange: "$1,200/year",
    alt: "HVAC technician performing system maintenance and inspection"
  },
  {
    id: "installation",
    title: "New Installations",
    description: "Start with the right equipment installed properly. Our expert team will design and install a complete HVAC system tailored to your specific needs and space.",
    image: "https://pixabay.com/get/g7d92f27d0f665cb3d302a582345b1d8fb4babcbbf8f3e637025ae9eafff05370821f3cd4d7170c5fc6b903fe9cf0900d4b3f7840294f077c8dc972129248cef6_1280.jpg",
    features: [
      "Custom system design",
      "Energy-efficient equipment selection",
      "Professional installation",
      "Ductwork design and installation",
      "Smart thermostat integration"
    ],
    priceRange: "Custom Quotes",
    alt: "New HVAC system installation with technician"
  },
  {
    id: "emergency",
    title: "Emergency Services",
    description: "When your HVAC system fails during extreme weather, we're available 24/7 to restore your comfort quickly. Our emergency response team is always ready.",
    image: "https://images.unsplash.com/photo-1600880292630-ee8a00403024?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
    features: [
      "24/7 emergency availability",
      "Rapid response times",
      "Same-day repair service",
      "Temporary solutions when needed",
      "No overtime fees for maintenance plan customers"
    ],
    priceRange: "$175 Service Deposit",
    alt: "Emergency HVAC service technician responding to a call"
  },
  {
    id: "commercial",
    title: "Commercial HVAC",
    description: "Keep your business comfortable and productive with our specialized commercial HVAC services. From rooftop units to complex system design, we've got you covered.",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
    features: [
      "Rooftop unit installation and service",
      "Preventative maintenance programs",
      "Building automation systems",
      "Energy efficiency upgrades",
      "Commercial refrigeration services"
    ],
    priceRange: "Based on Tonnage",
    alt: "Commercial rooftop HVAC units on a building"
  }
];

// Commercial pricing table
const commercialPricing = [
  { tonnage: "5-Ton RTU", priceRange: "$9,000 - $10,500" },
  { tonnage: "7.5-Ton RTU", priceRange: "$11,500 - $13,000" },
  { tonnage: "10-Ton RTU", priceRange: "$15,000 - $17,000" },
  { tonnage: "12.5-Ton RTU", priceRange: "$18,000 - $22,000" },
  { tonnage: "15-Ton RTU", priceRange: "$21,000 - $25,000" }
];

const ServiceDetailCard = ({ service }: { service: typeof services[0] }) => {
  return (
    <div id={service.id} className="scroll-mt-24 bg-dark-card border border-gray-700 rounded-xl overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3">
          <img 
            src={service.image} 
            alt={service.alt} 
            className="h-64 md:h-full w-full object-cover"
          />
        </div>
        <div className="p-6 md:w-2/3">
          <h3 className="text-2xl font-heading font-bold mb-3">{service.title}</h3>
          <p className="text-muted-text mb-5">{service.description}</p>
          
          <h4 className="font-heading font-semibold text-lg mb-3">What We Offer:</h4>
          <ul className="space-y-2 mb-6">
            {service.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="text-electric h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          
          <div className="flex items-center justify-between mt-6">
            <div>
              <span className="text-sm text-muted-text">Starting at</span>
              <div className="text-xl font-heading font-bold text-electric">{service.priceRange}</div>
            </div>
            <div className="flex space-x-3">
              <Link 
                href="/pricing"
                className="px-4 py-2 bg-transparent border border-gray-700 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                View Pricing
              </Link>
              <a 
                href="https://calendar.app.google/NXZB4v1PP57HhARL7"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-fire text-white rounded-md hover:bg-fire/90 transition-colors"
              >
                Book Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServicesBreadcrumb = () => (
  <nav className="py-4">
    <ol className="flex flex-wrap text-sm">
      <li className="flex items-center">
        <Link href="/" className="text-muted-text hover:text-white transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-500" />
      </li>
      <li className="text-white">Services</li>
    </ol>
  </nav>
);

const ServicesPage = () => {
  return (
    <>
      <SEO 
        title="HVAC Services | AfterHours HVAC"
        description="From furnace installations and air conditioning to emergency repairs and commercial HVAC, AfterHours HVAC provides comprehensive heating and cooling services across Alberta."
      />
      
      <main>
        {/* Hero Section */}
        <section className="bg-dark-charcoal py-24">
          <div className="container mx-auto px-4">
            <ServicesBreadcrumb />
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Our HVAC Services</h1>
              <p className="text-lg text-muted-text">
                From routine maintenance to emergency repairs and new installations, we provide comprehensive 
                heating and cooling solutions for residential and commercial properties throughout Alberta.
              </p>
            </div>
          </div>
        </section>

        {/* Services Introduction */}
        <section className="py-12 bg-charcoal">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-dark-card p-6 rounded-xl border border-gray-700">
                <div className="w-12 h-12 rounded-full bg-fire/20 flex items-center justify-center mb-4">
                  <Settings className="text-fire h-6 w-6" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3">Expert Technicians</h3>
                <p className="text-muted-text">
                  Our highly trained team has the skills and experience to handle any HVAC challenge, 
                  ensuring quality workmanship and lasting solutions.
                </p>
              </div>
              
              <div className="bg-dark-card p-6 rounded-xl border border-gray-700">
                <div className="w-12 h-12 rounded-full bg-fire/20 flex items-center justify-center mb-4">
                  <AlertTriangle className="text-fire h-6 w-6" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3">24/7 Emergency Service</h3>
                <p className="text-muted-text">
                  Heating or cooling emergencies don't wait for business hours, and neither do we. 
                  Our technicians are available around the clock.
                </p>
              </div>
              
              <div className="bg-dark-card p-6 rounded-xl border border-gray-700">
                <div className="w-12 h-12 rounded-full bg-fire/20 flex items-center justify-center mb-4">
                  <Drill className="text-fire h-6 w-6" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3">Quality Equipment</h3>
                <p className="text-muted-text">
                  We install and service only high-quality, energy-efficient equipment that meets 
                  Alberta's specific climate needs and regulatory requirements.
                </p>
              </div>
            </div>
            
            {/* Service Areas */}
            <div className="bg-dark-card p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-heading font-bold mb-3">Service Areas</h3>
              <p className="text-muted-text mb-4">
                We proudly serve homes and businesses throughout these Alberta communities:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {["Calgary", "Lethbridge", "Coaldale", "Taber", "Fort Macleod", "Rural Areas"].map((area, index) => (
                  <div key={index} className="bg-charcoal rounded-lg p-3 text-center">
                    {area}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Service Details Section */}
        <section className="py-16 bg-dark-charcoal">
          <div className="container mx-auto px-4">
            <div className="space-y-12">
              {services.map((service, index) => (
                <ServiceDetailCard key={index} service={service} />
              ))}
            </div>
          </div>
        </section>

        {/* Commercial RTU Pricing */}
        <section className="py-16 bg-charcoal">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-heading font-bold text-center mb-10">Commercial RTU Pricing</h2>
            
            <div className="max-w-2xl mx-auto bg-dark-card rounded-xl border border-gray-700 overflow-hidden">
              <div className="p-6 bg-gray-800">
                <h3 className="text-xl font-heading font-bold">Rooftop Unit Pricing Guide</h3>
                <p className="text-muted-text">Base pricing for commercial rooftop units (equipment only)</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-dark-charcoal">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-text uppercase tracking-wider">
                        Unit Size
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-muted-text uppercase tracking-wider">
                        Price Range
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {commercialPricing.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {item.tonnage}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          {item.priceRange}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-6 border-t border-gray-700">
                <p className="text-sm text-muted-text mb-4">
                  * Prices shown are equipment only. Installation costs vary based on site conditions, 
                  access requirements, and additional components needed.
                </p>
                <p className="text-sm text-muted-text">
                  * For a detailed quote specific to your commercial property, please contact us for an on-site assessment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Booking CTA */}
        <section className="py-16 bg-dark-charcoal">
          <div className="container mx-auto px-4">
            <div className="bg-charcoal border border-gray-700 rounded-xl p-8 text-center max-w-3xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-fire/20 flex items-center justify-center mb-6 mx-auto">
                <Calendar className="text-fire h-8 w-8" />
              </div>
              <h2 className="text-3xl font-heading font-bold mb-4">Ready to Schedule Service?</h2>
              <p className="text-muted-text mb-8">
                Book your service appointment online or contact us to discuss your specific HVAC needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://calendar.app.google/NXZB4v1PP57HhARL7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-electric text-charcoal rounded-md font-medium hover:bg-electric/90 transition-colors"
                >
                  Book Online
                </a>
                <Link 
                  href="/contact"
                  className="px-6 py-3 bg-fire text-white rounded-md font-medium hover:bg-fire/90 transition-colors"
                >
                  Contact Us
                </Link>
                <a 
                  href="tel:4036136014"
                  className="px-6 py-3 bg-transparent border border-gray-700 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Call (403) 613-6014
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ServicesPage;
