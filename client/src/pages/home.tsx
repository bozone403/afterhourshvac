import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Thermometer, 
  Snowflake, 
  Wrench, 
  Clock, 
  Shield, 
  CheckCircle, 
  Star,
  Phone,
  MapPin,
  Calendar,
  ArrowRight,
  Award,
  Users,
  Zap,
  Heart,
  ThermometerSun,
  Wind,
  Settings,
  TrendingUp
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import CertificationLogos from "@/components/CertificationLogos";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch carousel images
  const { data: carouselImages = [] } = useQuery({
    queryKey: ["/api/carousel"],
  });

  // Fetch services
  const { data: services = [] } = useQuery({
    queryKey: ["/api/gallery/services"],
  });

  // Auto-rotate carousel
  useEffect(() => {
    if (carouselImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [carouselImages.length]);

  const stats = [
    { number: "2000+", label: "Happy Customers", icon: Users },
    { number: "15+", label: "Years Experience", icon: Award },
    { number: "24/7", label: "Emergency Service", icon: Clock },
    { number: "100%", label: "Satisfaction Rate", icon: Heart }
  ];

  const primaryServices = [
    {
      icon: ThermometerSun,
      title: "Furnace Installation",
      description: "High-efficiency furnace installation and replacement with expert precision",
      features: ["Energy Efficient", "Professional Installation", "Warranty Included"],
      link: "/services/furnace-install"
    },
    {
      icon: Snowflake,
      title: "Air Conditioning",
      description: "Complete AC installation, repair, and maintenance services",
      features: ["Cool Comfort", "Energy Savings", "Quick Service"],
      link: "/services/ac-repair"
    },
    {
      icon: Wind,
      title: "Duct Cleaning",
      description: "Professional ductwork cleaning and ventilation services",
      features: ["Better Air Quality", "Improved Efficiency", "Health Benefits"],
      link: "/services/duct-cleaning"
    },
    {
      icon: Settings,
      title: "HVAC Maintenance",
      description: "Preventive maintenance to keep your system running efficiently",
      features: ["Regular Inspections", "Cost Savings", "Extended Lifespan"],
      link: "/services/maintenance"
    }
  ];

  const features = [
    "Licensed & Insured Technicians",
    "24/7 Emergency Service Available",
    "Free Estimates on New Installations",
    "Warranty on All Work Performed",
    "Energy-Efficient Solutions",
    "Serving Calgary & Surrounding Areas"
  ];

  return (
    <>
      <Helmet>
        <title>Professional HVAC Services Calgary | AfterHours HVAC</title>
        <meta name="description" content="Calgary's trusted HVAC experts providing furnace installation, AC repair, duct cleaning, and emergency services. Licensed, insured, and available 24/7." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section with Carousel */}
        <section className="relative hvac-gradient-hero overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* Carousel Background */}
          {carouselImages.length > 0 && (
            <div className="absolute inset-0">
              {carouselImages.map((image: any, index: number) => (
                <div
                  key={image.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide ? "opacity-30" : "opacity-0"
                  }`}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="relative hvac-container py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-white space-y-8 fade-in">
                <div className="space-y-4">
                  <Badge className="bg-orange-500 text-white px-4 py-2 text-sm font-semibold">
                    Calgary's #1 HVAC Experts
                  </Badge>
                  <h1 className="hvac-heading-xl">
                    Professional HVAC Solutions for Your Home
                  </h1>
                  <p className="text-xl text-blue-100 leading-relaxed">
                    Expert heating, cooling, and ventilation services with 24/7 emergency support. 
                    Licensed technicians, quality workmanship, and customer satisfaction guaranteed.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="hvac-button-secondary text-lg px-8 py-4">
                    <Phone className="w-5 h-5 mr-2" />
                    Call (403) 555-0123
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-900 text-lg px-8 py-4"
                    asChild
                  >
                    <Link href="/contact">
                      <Calendar className="w-5 h-5 mr-2" />
                      Schedule Service
                    </Link>
                  </Button>
                </div>

                <div className="flex items-center space-x-6 pt-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-blue-100">5.0 Rating • 500+ Reviews</span>
                </div>
              </div>

              <div className="lg:justify-self-end slide-up">
                <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Get Free Estimate</h3>
                  <form className="space-y-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="hvac-input"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="hvac-input"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="hvac-input"
                    />
                    <select className="hvac-input">
                      <option>Select Service</option>
                      <option>Furnace Installation</option>
                      <option>AC Repair</option>
                      <option>Duct Cleaning</option>
                      <option>Emergency Service</option>
                    </select>
                    <Button className="w-full hvac-button-primary text-lg py-3">
                      Get My Free Quote
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Indicators */}
          {carouselImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {carouselImages.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </section>

        {/* Stats Section */}
        <section className="hvac-section bg-white">
          <div className="hvac-container">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card group hover:scale-105 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-3 group-hover:text-orange-500 transition-colors" />
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="hvac-section">
          <div className="hvac-container">
            <div className="text-center mb-16">
              <h2 className="hvac-heading-lg mb-4">Our Professional Services</h2>
              <p className="hvac-text-lg max-w-3xl mx-auto">
                Comprehensive HVAC solutions for residential and commercial properties. 
                Expert installation, repair, and maintenance services you can trust.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {primaryServices.map((service, index) => (
                <Card key={index} className="service-card border-0 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <service.icon className="service-card-icon mx-auto" />
                    <CardTitle className="text-xl font-bold text-gray-900">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 mb-4 leading-relaxed">
                      {service.description}
                    </CardDescription>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="w-full hvac-button-primary">
                      <Link href={service.link}>
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="hvac-section bg-white">
          <div className="hvac-container">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <h2 className="hvac-heading-lg mb-4">Why Choose AfterHours HVAC?</h2>
                  <p className="hvac-text-lg">
                    With over 15 years of experience serving Calgary, we're your trusted partner 
                    for all heating and cooling needs. Our commitment to excellence sets us apart.
                  </p>
                </div>

                <div className="feature-list">
                  {features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <CheckCircle className="feature-check" />
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="hvac-button-primary" asChild>
                    <Link href="/about">Learn More About Us</Link>
                  </Button>
                  <Button variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white" asChild>
                    <Link href="/contact">Get In Touch</Link>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="pro-card">
                    <Shield className="w-8 h-8 text-blue-600 mb-3" />
                    <h4 className="font-bold text-gray-900 mb-2">Licensed & Insured</h4>
                    <p className="text-sm text-gray-600">Fully certified technicians with comprehensive insurance coverage</p>
                  </div>
                  <div className="emergency-card">
                    <Clock className="w-8 h-8 text-red-600 mb-3" />
                    <h4 className="font-bold text-gray-900 mb-2">24/7 Emergency</h4>
                    <p className="text-sm text-gray-600">Round-the-clock emergency HVAC services when you need us most</p>
                  </div>
                </div>
                <div className="space-y-6 pt-8">
                  <div className="success-card">
                    <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
                    <h4 className="font-bold text-gray-900 mb-2">Energy Efficient</h4>
                    <p className="text-sm text-gray-600">Modern solutions that reduce energy costs and environmental impact</p>
                  </div>
                  <div className="hvac-card">
                    <Zap className="w-8 h-8 text-orange-500 mb-3" />
                    <h4 className="font-bold text-gray-900 mb-2">Fast Response</h4>
                    <p className="text-sm text-gray-600">Quick response times with same-day service availability</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency CTA Section */}
        <section className="hvac-section hvac-gradient-hero">
          <div className="hvac-container text-center">
            <div className="max-w-4xl mx-auto text-white space-y-8">
              <h2 className="text-3xl lg:text-4xl font-bold">Need Emergency HVAC Service?</h2>
              <p className="text-xl text-blue-100">
                Don't let heating or cooling problems disrupt your comfort. Our emergency team is standing by 24/7 
                to restore your system quickly and efficiently.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="hvac-button-secondary text-lg px-8 py-4">
                  <Phone className="w-5 h-5 mr-2" />
                  Emergency: (403) 555-0123
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-900 text-lg px-8 py-4"
                  asChild
                >
                  <Link href="/emergency">
                    <Wrench className="w-5 h-5 mr-2" />
                    Request Emergency Service
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        <CertificationLogos />

        {/* Service Areas Section */}
        <section className="hvac-section bg-gray-50">
          <div className="hvac-container text-center">
            <h2 className="hvac-heading-lg mb-8">Proudly Serving Calgary & Area</h2>
            <div className="flex items-center justify-center mb-8">
              <MapPin className="w-6 h-6 text-blue-600 mr-2" />
              <span className="text-lg text-gray-700">Professional HVAC Services Across the Region</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
              {["Calgary", "Airdrie", "Okotoks", "Cochrane", "Canmore", "Strathmore", "High River", "Chestermere", "Red Deer", "Medicine Hat", "Lethbridge", "Camrose"].map((city) => (
                <div key={city} className="bg-white rounded-2xl px-6 py-4 text-gray-800 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  {city}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;