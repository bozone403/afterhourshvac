import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Award,
  Users,
  Clock,
  Shield,
  Star,
  CheckCircle,
  Phone,
  Calendar,
  Wrench,
  Heart,
  ThermometerSun,
  Snowflake,
  Wind,
  Settings,
  Target,
  Eye,
  Zap,
  TrendingUp
} from "lucide-react";

const About = () => {
  const stats = [
    { number: "15+", label: "Years in Business", icon: Award },
    { number: "2000+", label: "Satisfied Customers", icon: Users },
    { number: "24/7", label: "Emergency Service", icon: Clock },
    { number: "100%", label: "Licensed & Insured", icon: Shield }
  ];

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "Your comfort and satisfaction are our top priorities. We go above and beyond to ensure every job exceeds expectations."
    },
    {
      icon: Shield,
      title: "Quality Workmanship",
      description: "Every installation and repair is performed to the highest industry standards with attention to detail and precision."
    },
    {
      icon: Clock,
      title: "Reliable Service",
      description: "When you need us, we're there. Prompt response times and dependable service you can count on."
    },
    {
      icon: Zap,
      title: "Energy Efficient",
      description: "We promote sustainable solutions that reduce energy costs and environmental impact for a better future."
    }
  ];

  const services = [
    {
      icon: ThermometerSun,
      title: "Heating Systems",
      description: "Expert furnace installation, repair, and maintenance to keep your home warm and comfortable.",
      features: ["High-Efficiency Furnaces", "Heat Pumps", "Boiler Systems", "Radiant Heating"]
    },
    {
      icon: Snowflake,
      title: "Cooling Solutions",
      description: "Professional air conditioning services for optimal indoor climate control year-round.",
      features: ["Central Air Systems", "Ductless Mini-Splits", "Heat Pumps", "AC Maintenance"]
    },
    {
      icon: Wind,
      title: "Ventilation",
      description: "Comprehensive ductwork and ventilation services for improved air quality and system efficiency.",
      features: ["Duct Cleaning", "Duct Repair", "Air Quality Testing", "Ventilation Design"]
    },
    {
      icon: Settings,
      title: "Maintenance",
      description: "Preventive maintenance programs to extend system life and prevent costly breakdowns.",
      features: ["Annual Inspections", "Filter Replacement", "System Tune-ups", "Performance Optimization"]
    }
  ];

  const certifications = [
    "Licensed HVAC Contractors",
    "Comprehensive Liability Insurance",
    "Better Business Bureau Accredited",
    "Energy Star Partner",
    "Manufacturer Certified Technicians",
    "Safety Training Certified"
  ];

  const teamMembers = [
    {
      name: "Jordan Bozanich",
      role: "Owner & Master Technician",
      experience: "15+ Years Experience",
      specialties: ["Commercial HVAC", "System Design", "Energy Audits"]
    },
    {
      name: "Sarah Thompson",
      role: "Senior HVAC Technician",
      experience: "10+ Years Experience", 
      specialties: ["Residential Service", "Heat Pumps", "Indoor Air Quality"]
    },
    {
      name: "Mike Rodriguez",
      role: "Installation Specialist",
      experience: "8+ Years Experience",
      specialties: ["New Construction", "System Upgrades", "Ductwork"]
    },
    {
      name: "Lisa Chen",
      role: "Customer Service Manager",
      experience: "5+ Years Experience",
      specialties: ["Customer Relations", "Service Scheduling", "Quality Assurance"]
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Us - Calgary's Trusted HVAC Experts | AfterHours HVAC</title>
        <meta name="description" content="Learn about AfterHours HVAC - Calgary's premier heating and cooling experts with 15+ years of experience. Licensed, insured, and committed to excellence." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="hvac-gradient-hero text-white">
          <div className="hvac-container py-24">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <Badge className="bg-orange-500 text-white px-6 py-2 text-lg font-semibold">
                Calgary's HVAC Experts Since 2009
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Your Trusted Partner for Comfort Solutions
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
                For over 15 years, AfterHours HVAC has been Calgary's go-to source for professional 
                heating, cooling, and ventilation services. We're not just technicians – we're your 
                neighbors, committed to keeping your family comfortable year-round.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="hvac-section bg-white">
          <div className="hvac-container">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card group hover:scale-105 transition-transform duration-300">
                  <stat.icon className="w-10 h-10 text-blue-600 mx-auto mb-4 group-hover:text-orange-500 transition-colors" />
                  <div className="stat-number text-4xl">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="hvac-section">
          <div className="hvac-container">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <h2 className="hvac-heading-lg mb-6">Our Story</h2>
                  <div className="space-y-6 hvac-text-base">
                    <p>
                      Founded in 2009 by Jordan Bozanich, AfterHours HVAC began with a simple mission: 
                      to provide Calgary families and businesses with reliable, professional HVAC services 
                      when they need them most – including after hours and on weekends.
                    </p>
                    <p>
                      What started as a one-person operation has grown into Calgary's most trusted HVAC 
                      service company, but we've never lost sight of our core values: exceptional customer 
                      service, quality workmanship, and honest, transparent pricing.
                    </p>
                    <p>
                      Today, our team of certified technicians continues to serve the Greater Calgary Area 
                      with the same dedication to excellence that has earned us over 2,000 satisfied customers 
                      and countless referrals from friends and neighbors.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="hvac-button-primary" asChild>
                    <Link href="/contact">Get Your Free Quote</Link>
                  </Button>
                  <Button variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white" asChild>
                    <Link href="/reviews">Read Customer Reviews</Link>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="pro-card">
                    <Target className="w-8 h-8 text-blue-600 mb-4" />
                    <h4 className="font-bold text-gray-900 mb-3">Our Mission</h4>
                    <p className="text-sm text-gray-700">
                      To provide exceptional HVAC services that keep Calgary families and businesses 
                      comfortable while building lasting relationships based on trust and reliability.
                    </p>
                  </div>
                  <div className="emergency-card">
                    <TrendingUp className="w-8 h-8 text-red-600 mb-4" />
                    <h4 className="font-bold text-gray-900 mb-3">Our Growth</h4>
                    <p className="text-sm text-gray-700">
                      From humble beginnings to Calgary's premier HVAC service provider, we've grown 
                      through referrals and repeat customers who trust our expertise.
                    </p>
                  </div>
                </div>
                <div className="space-y-6 pt-8">
                  <div className="success-card">
                    <Eye className="w-8 h-8 text-green-600 mb-4" />
                    <h4 className="font-bold text-gray-900 mb-3">Our Vision</h4>
                    <p className="text-sm text-gray-700">
                      To be Western Canada's most trusted HVAC company, known for innovation, 
                      sustainability, and unmatched customer satisfaction.
                    </p>
                  </div>
                  <div className="hvac-card">
                    <Heart className="w-8 h-8 text-orange-500 mb-4" />
                    <h4 className="font-bold text-gray-900 mb-3">Our Promise</h4>
                    <p className="text-sm text-gray-700">
                      Every job is completed to the highest standards with a focus on quality, 
                      safety, and customer satisfaction – guaranteed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="hvac-section bg-white">
          <div className="hvac-container">
            <div className="text-center mb-16">
              <h2 className="hvac-heading-lg mb-4">Our Core Values</h2>
              <p className="hvac-text-lg max-w-3xl mx-auto">
                These fundamental principles guide every decision we make and every service we provide.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="hvac-card text-center border-0 hover:scale-105 transition-transform duration-300">
                  <CardHeader className="pb-4">
                    <value.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <CardTitle className="text-xl font-bold text-gray-900">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="hvac-section">
          <div className="hvac-container">
            <div className="text-center mb-16">
              <h2 className="hvac-heading-lg mb-4">Complete HVAC Solutions</h2>
              <p className="hvac-text-lg max-w-3xl mx-auto">
                From emergency repairs to new installations, we provide comprehensive heating, 
                cooling, and ventilation services for residential and commercial properties.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="hvac-card border-0 hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 bg-blue-50 rounded-xl">
                        <service.icon className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">{service.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                      {service.description}
                    </CardDescription>
                    <div className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="hvac-section bg-white">
          <div className="hvac-container">
            <div className="text-center mb-16">
              <h2 className="hvac-heading-lg mb-4">Meet Our Expert Team</h2>
              <p className="hvac-text-lg max-w-3xl mx-auto">
                Our certified technicians bring decades of combined experience and a commitment 
                to excellence in every job we complete.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="hvac-card text-center border-0 hover:scale-105 transition-transform duration-300">
                  <CardHeader className="pb-4">
                    <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900">{member.name}</CardTitle>
                    <CardDescription className="text-blue-600 font-semibold">{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge className="bg-orange-100 text-orange-600 mb-4">{member.experience}</Badge>
                    <div className="space-y-2">
                      {member.specialties.map((specialty, idx) => (
                        <div key={idx} className="text-sm text-gray-600">
                          • {specialty}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        <section className="hvac-section">
          <div className="hvac-container">
            <div className="text-center mb-16">
              <h2 className="hvac-heading-lg mb-4">Licensed, Certified & Insured</h2>
              <p className="hvac-text-lg max-w-3xl mx-auto">
                We maintain the highest industry certifications and insurance coverage to protect 
                our customers and ensure quality workmanship on every job.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert, index) => (
                <div key={index} className="hvac-card flex items-center space-x-4 p-6">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="font-semibold text-gray-900">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="hvac-section hvac-gradient-hero">
          <div className="hvac-container text-center">
            <div className="max-w-4xl mx-auto text-white space-y-8">
              <h2 className="text-3xl lg:text-4xl font-bold">Ready to Experience the AfterHours Difference?</h2>
              <p className="text-xl text-blue-100">
                Join thousands of satisfied customers who trust AfterHours HVAC for all their 
                heating and cooling needs. Contact us today for your free consultation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                    Get Free Quote
                  </Link>
                </Button>
              </div>

              <div className="flex items-center justify-center space-x-6 pt-8">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-blue-100">5.0 Rating • 500+ Reviews</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;