import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Mail, 
  Users,
  MapPin,
  Clock,
  DollarSign,
  Star,
  CheckCircle,
  Wrench,
  Truck,
  Award,
  Heart,
  Shield,
  Calendar
} from "lucide-react";
import { Link } from "wouter";

export default function Careers() {
  const openPositions = [
    {
      title: "HVAC Service Technician",
      type: "Full-Time",
      location: "Calgary, AB",
      salary: "$70,000 - $95,000",
      experience: "3+ Years",
      description: "Join our team as an experienced HVAC service technician. You'll diagnose, repair, and maintain residential and commercial HVAC systems.",
      requirements: [
        "Red Seal HVAC certification or equivalent",
        "3+ years residential/commercial HVAC experience",
        "Valid driver's license and clean driving record",
        "Strong diagnostic and problem-solving skills",
        "Excellent customer service skills",
        "Physical ability to work in various conditions"
      ],
      benefits: [
        "Competitive salary + performance bonuses",
        "Company vehicle and gas card",
        "Health and dental benefits",
        "Tool allowance",
        "Ongoing training and certification",
        "Flexible scheduling options"
      ]
    },
    {
      title: "HVAC Installation Specialist",
      type: "Full-Time",
      location: "Calgary, AB",
      salary: "$65,000 - $85,000",
      experience: "2+ Years",
      description: "Seeking skilled installation specialist for residential and light commercial HVAC system installations.",
      requirements: [
        "HVAC installation experience",
        "Knowledge of ductwork and electrical connections",
        "Ability to read blueprints and technical drawings",
        "Strong attention to detail",
        "Team player with good communication skills",
        "Physical stamina for installation work"
      ],
      benefits: [
        "Competitive hourly rate",
        "Performance-based bonuses",
        "Company tools and equipment",
        "Health benefits after probation",
        "Training opportunities",
        "Advancement potential"
      ]
    },
    {
      title: "HVAC Apprentice",
      type: "Full-Time",
      location: "Calgary, AB",
      salary: "$45,000 - $55,000",
      experience: "Entry Level",
      description: "Perfect opportunity for someone starting their HVAC career. We provide comprehensive training and mentorship.",
      requirements: [
        "High school diploma or equivalent",
        "Interest in HVAC trade",
        "Strong work ethic and reliability",
        "Willingness to learn and take direction",
        "Basic hand tool knowledge helpful",
        "Physically fit for demanding work"
      ],
      benefits: [
        "Paid apprenticeship program",
        "Mentorship from experienced technicians",
        "Education assistance",
        "Career progression pathway",
        "Health benefits",
        "Job security in growing field"
      ]
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: "Competitive Compensation",
      description: "Industry-leading wages plus performance bonuses and profit sharing"
    },
    {
      icon: Shield,
      title: "Comprehensive Benefits",
      description: "Health, dental, vision insurance, and retirement savings plan"
    },
    {
      icon: Truck,
      title: "Company Vehicle",
      description: "Take-home service vehicle with gas card for technician positions"
    },
    {
      icon: Award,
      title: "Training & Development",
      description: "Ongoing education, certification support, and career advancement"
    },
    {
      icon: Calendar,
      title: "Work-Life Balance",
      description: "Flexible scheduling, paid time off, and family-friendly policies"
    },
    {
      icon: Heart,
      title: "Team Culture",
      description: "Supportive work environment with team events and recognition"
    }
  ];

  const whyJoinUs = [
    "Family-owned business with 15+ years of stability",
    "Growing company with advancement opportunities",
    "Supportive team environment and mentorship",
    "Latest tools and technology",
    "Diverse project types and challenges",
    "Strong reputation in Calgary market",
    "Commitment to safety and quality",
    "Employee recognition programs"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Careers at AfterHours HVAC - Join Calgary's Premier HVAC Team</title>
        <meta name="description" content="Join the AfterHours HVAC team in Calgary. We're hiring experienced HVAC technicians, installers, and apprentices. Competitive pay, benefits, and growth opportunities." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-orange-600 text-white py-20">
        <div className="hvac-container">
          <div className="text-center">
            <Badge className="bg-orange-500 text-white mb-4">
              We're Hiring!
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Join the AfterHours HVAC Team
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Build your career with Calgary's premier HVAC company. We offer competitive compensation, 
              comprehensive benefits, and opportunities for professional growth in a supportive team environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                <Phone className="w-5 h-5 mr-2" />
                Call (403) 613-6014
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900">
                <Mail className="w-5 h-5 mr-2" />
                Email Jordan@Afterhourshvac.ca
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16">
        <div className="hvac-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Current Openings
            </h2>
            <p className="text-lg text-gray-600">
              Explore our available positions and find your next career opportunity.
            </p>
          </div>

          <div className="space-y-8">
            {openPositions.map((position, index) => (
              <Card key={index} className="shadow-lg border-0">
                <CardHeader className="border-b border-gray-100">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl text-gray-900 mb-2">{position.title}</CardTitle>
                      <div className="flex flex-wrap gap-3">
                        <Badge className="bg-blue-100 text-blue-600">{position.type}</Badge>
                        <Badge className="bg-green-100 text-green-600">{position.location}</Badge>
                        <Badge className="bg-orange-100 text-orange-600">{position.salary}</Badge>
                        <Badge className="bg-purple-100 text-purple-600">{position.experience}</Badge>
                      </div>
                    </div>
                    <Button className="bg-orange-500 hover:bg-orange-600 shrink-0">
                      Apply Now
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-700 mb-6 leading-relaxed">{position.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        Requirements
                      </h4>
                      <ul className="space-y-2">
                        {position.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="text-sm text-gray-600 flex items-start">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Star className="w-5 h-5 text-orange-500 mr-2" />
                        Benefits
                      </h4>
                      <ul className="space-y-2">
                        {position.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="text-sm text-gray-600 flex items-start">
                            <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Overview */}
      <section className="py-16 bg-blue-50">
        <div className="hvac-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Work at AfterHours HVAC?
            </h2>
            <p className="text-lg text-gray-600">
              We believe in taking care of our team so they can take care of our customers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardContent className="p-6">
                  <benefit.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16">
        <div className="hvac-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose AfterHours HVAC?
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Join a company that values its employees and invests in their success. 
                We're more than just a workplace – we're a family.
              </p>
              
              <div className="grid grid-cols-1 gap-3">
                {whyJoinUs.map((reason, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-0">
                <Users className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Team Environment</h3>
                <p className="text-gray-700 text-sm">
                  Work alongside experienced professionals who are committed to excellence 
                  and supporting each other's growth.
                </p>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-0">
                <Award className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Professional Growth</h3>
                <p className="text-gray-700 text-sm">
                  Advance your skills with ongoing training, certifications, and 
                  opportunities to take on new challenges.
                </p>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-0">
                <Heart className="w-8 h-8 text-orange-600 mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Work-Life Balance</h3>
                <p className="text-gray-700 text-sm">
                  Enjoy flexible scheduling, competitive time off, and a company 
                  culture that values your personal time.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 bg-gray-100">
        <div className="hvac-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How to Apply
            </h2>
            <p className="text-lg text-gray-600">
              Ready to join our team? Here's how to get started.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  1
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
                <p className="text-sm text-gray-600">
                  Call or email us about the position you're interested in
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  2
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Submit Resume</h3>
                <p className="text-sm text-gray-600">
                  Send your resume and cover letter highlighting your experience
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  3
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Interview</h3>
                <p className="text-sm text-gray-600">
                  Meet with our team to discuss the role and your qualifications
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  4
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Join the Team</h3>
                <p className="text-sm text-gray-600">
                  Start your new career with comprehensive onboarding and training
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="hvac-container text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Career with Us?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Don't see the perfect position? We're always looking for talented individuals. 
            Contact us to discuss opportunities.
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
  );
}