import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
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
  Mail,
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
  TrendingUp,
  Building,
  MapPin
} from "lucide-react";

const About = () => {
  const stats = [
    { number: "15+", label: "Years in Business", icon: Award },
    { number: "5000+", label: "Satisfied Customers", icon: Users },
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

  // Fetch team members from admin panel
  const { data: teamMembers = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/team-members"],
    initialData: [
      {
        id: 1,
        name: "Jordan Boisclair",
        role: "Owner & Master Technician",
        experience: "15+ Years Experience",
        specialties: ["Commercial HVAC", "System Design", "Energy Audits"],
        description: "Leading AfterHours HVAC with expertise in complex commercial systems and energy-efficient solutions.",
        imageUrl: ""
      },
      {
        id: 2,
        name: "Derek Thompson",
        role: "Senior Field Technician",
        experience: "12+ Years Experience", 
        specialties: ["Residential Service", "Emergency Repairs", "Installation"],
        description: "Expert technician specializing in residential HVAC systems and emergency service calls.",
        imageUrl: ""
      }
    ]
  });

  return (
    <>
      <Helmet>
        <title>About AfterHours HVAC - Calgary's Premier HVAC Experts | Professional Heating & Cooling</title>
        <meta name="description" content="Learn about AfterHours HVAC - Calgary's premier heating and cooling experts with 15+ years of experience. Licensed, insured, and committed to excellence. Meet our team of professionals." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-orange-600 text-white py-20">
          <div className="hvac-container">
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
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-lg px-8 py-4">
                  <Phone className="w-5 h-5 mr-2" />
                  Call (403) 613-6014
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
        <section className="py-16 bg-white">
          <div className="hvac-container">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center border-0 shadow-lg hover:scale-105 transition-transform duration-300">
                  <CardContent className="p-6">
                    <stat.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 bg-blue-50">
          <div className="hvac-container">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                  <div className="space-y-6 text-gray-700 leading-relaxed">
                    <p>
                      Founded in 2009 by Jordan Boisclair, AfterHours HVAC began with a simple mission: 
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
                      with the same dedication to excellence that has earned us over 5,000 satisfied customers 
                      and countless referrals from friends and neighbors.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                    <Link href="/contact">Get Your Free Quote</Link>
                  </Button>
                  <Button variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white" asChild>
                    <Link href="/reviews">Read Customer Reviews</Link>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Card className="p-6 bg-white border-0 shadow-lg">
                    <Target className="w-8 h-8 text-blue-600 mb-4" />
                    <h4 className="font-bold text-gray-900 mb-3">Our Mission</h4>
                    <p className="text-sm text-gray-700">
                      To provide exceptional HVAC services that keep Calgary families and businesses 
                      comfortable while building lasting relationships based on trust and reliability.
                    </p>
                  </Card>
                  <Card className="p-6 bg-red-50 border-0 shadow-lg">
                    <TrendingUp className="w-8 h-8 text-red-600 mb-4" />
                    <h4 className="font-bold text-gray-900 mb-3">Our Growth</h4>
                    <p className="text-sm text-gray-700">
                      From humble beginnings to Calgary's premier HVAC service provider, we've grown 
                      through referrals and repeat customers who trust our expertise.
                    </p>
                  </Card>
                </div>
                <div className="space-y-6 pt-8">
                  <Card className="p-6 bg-green-50 border-0 shadow-lg">
                    <Eye className="w-8 h-8 text-green-600 mb-4" />
                    <h4 className="font-bold text-gray-900 mb-3">Our Vision</h4>
                    <p className="text-sm text-gray-700">
                      To be Western Canada's most trusted HVAC company, known for innovation, 
                      sustainability, and unmatched customer satisfaction.
                    </p>
                  </Card>
                  <Card className="p-6 bg-orange-50 border-0 shadow-lg">
                    <Heart className="w-8 h-8 text-orange-500 mb-4" />
                    <h4 className="font-bold text-gray-900 mb-3">Our Promise</h4>
                    <p className="text-sm text-gray-700">
                      Every job is completed to the highest standards with a focus on quality, 
                      safety, and customer satisfaction – guaranteed.
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-16 bg-white">
          <div className="hvac-container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                These fundamental principles guide every decision we make and every service we provide.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center border-0 shadow-lg hover:scale-105 transition-transform duration-300">
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

        {/* Team Section */}
        <section className="py-16 bg-gray-100">
          <div className="hvac-container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Expert Team</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our certified professionals bring decades of combined experience and a commitment 
                to excellence in every job we complete.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {teamMembers.map((member, index) => (
                <Card key={index} className="text-center border-0 shadow-lg hover:scale-105 transition-transform duration-300">
                  <CardHeader className="pb-4">
                    <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users className="w-12 h-12 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">{member.name}</CardTitle>
                    <CardDescription className="text-blue-600 font-semibold text-lg">{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Badge className="bg-orange-100 text-orange-600">{member.experience}</Badge>
                    <p className="text-sm text-gray-600 leading-relaxed">{member.description}</p>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-gray-900 text-sm">Specialties:</h4>
                      {member.specialties.map((specialty: string, idx: number) => (
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

        {/* Services Overview */}
        <section className="py-16 bg-white">
          <div className="hvac-container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete HVAC Solutions</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                From emergency repairs to new installations, we provide comprehensive heating, 
                cooling, and ventilation services for residential and commercial properties.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
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

        {/* Certifications */}
        <section className="py-16 bg-blue-50">
          <div className="hvac-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Licensed, Certified & Insured</h2>
              <p className="text-lg text-gray-600">
                We maintain the highest professional standards and certifications in the industry.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert, index) => (
                <Card key={index} className="text-center border-0 shadow-lg">
                  <CardContent className="p-6">
                    <Shield className="w-8 h-8 text-green-500 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900">{cert}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="hvac-container text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Experience the AfterHours Difference?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust AfterHours HVAC for all their heating and cooling needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                <Phone className="w-5 h-5 mr-2" />
                Call (403) 613-6014
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                <Mail className="w-5 h-5 mr-2" />
                Email Jordan@Afterhourshvac.ca
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;