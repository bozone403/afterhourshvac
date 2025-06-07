import { Link } from "wouter";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Wrench,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Star,
  Award,
  Shield,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const serviceLinks = [
    { name: "Furnace Installation", href: "/services/furnace-install" },
    { name: "AC Repair & Installation", href: "/services/ac-repair" },
    { name: "Duct Cleaning", href: "/services/duct-cleaning" },
    { name: "HVAC Maintenance", href: "/services/maintenance" },
    { name: "Emergency Service", href: "/emergency" },
    { name: "Energy Audits", href: "/services/energy-audit" }
  ];

  const calculatorLinks = [
    { name: "BTU Calculator", href: "/calculators/btu" },
    { name: "Energy Savings Calculator", href: "/calculators/energy-savings" },
    { name: "Load Calculator", href: "/calculators/load-calculator" },
    { name: "Material Estimator", href: "/calculators/material-estimator" }
  ];

  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Service Areas", href: "/service-areas" },
    { name: "Careers", href: "/careers" },
    { name: "Reviews", href: "/reviews" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" }
  ];

  const serviceAreas = [
    "Calgary", "Airdrie", "Okotoks", "Cochrane", "Canmore", "Strathmore",
    "High River", "Chestermere", "Red Deer", "Medicine Hat", "Lethbridge", "Camrose"
  ];

  const certifications = [
    { name: "Licensed & Insured", icon: Shield },
    { name: "BBB Accredited", icon: Award },
    { name: "Energy Star Partner", icon: Zap },
    { name: "24/7 Emergency", icon: Clock }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="hvac-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="hvac-gradient-primary p-3 rounded-xl shadow-lg">
                <Wrench className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">AfterHours</h3>
                <p className="text-blue-400 font-medium">HVAC Solutions</p>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed">
              Calgary's trusted HVAC experts providing professional heating, cooling, 
              and ventilation services with 24/7 emergency support since 2009.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold">(403) 555-0123</p>
                  <p className="text-sm text-gray-400">24/7 Emergency Line</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold">info@afterhourshvac.ca</p>
                  <p className="text-sm text-gray-400">Get a Free Quote</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Calgary, Alberta</p>
                  <p className="text-sm text-gray-400">Serving Greater Calgary Area</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4 className="footer-heading">Our Services</h4>
            <div className="space-y-3">
              {serviceLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="footer-link block hover:text-orange-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Tools & Resources */}
          <div className="footer-section">
            <h4 className="footer-heading">Tools & Resources</h4>
            <div className="space-y-3">
              {calculatorLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="footer-link block hover:text-orange-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <Link href="/pro-calculator" className="footer-link block hover:text-orange-400 transition-colors flex items-center space-x-2">
                <span>Pro Calculator</span>
                <Badge className="bg-orange-500 text-white text-xs">Pro</Badge>
              </Link>
              <Link href="/forum" className="footer-link block hover:text-orange-400 transition-colors">
                HVAC Forum
              </Link>
            </div>
          </div>

          {/* Company */}
          <div className="footer-section">
            <h4 className="footer-heading">Company</h4>
            <div className="space-y-3">
              {companyLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="footer-link block hover:text-orange-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Reviews */}
            <div className="mt-6 p-4 bg-gray-800 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-semibold">5.0</span>
              </div>
              <p className="text-sm text-gray-300">500+ Happy Customers</p>
              <p className="text-xs text-gray-400 mt-1">Google Reviews</p>
            </div>
          </div>
        </div>

        {/* Service Areas */}
        <div className="mt-16 pt-12 border-t border-gray-800">
          <h4 className="footer-heading text-center mb-8">Service Areas</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {serviceAreas.map((area) => (
              <div key={area} className="text-center">
                <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  {area}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert) => (
              <div key={cert.name} className="flex items-center space-x-3 p-4 bg-gray-800 rounded-xl">
                <cert.icon className="w-6 h-6 text-orange-500" />
                <span className="text-sm font-medium">{cert.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency CTA */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Emergency HVAC Service Available 24/7</h3>
            <p className="text-lg mb-6 text-red-100">
              Heating or cooling emergency? Don't wait - our certified technicians are standing by.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 font-bold">
                <Phone className="w-5 h-5 mr-2" />
                Call Emergency Line: (403) 555-0123
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-red-600" asChild>
                <Link href="/emergency">
                  <Clock className="w-5 h-5 mr-2" />
                  Request Emergency Service
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="hvac-container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {currentYear} AfterHours HVAC Solutions. All rights reserved.
            </div>
            
            <div className="flex flex-wrap items-center space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                Sitemap
              </Link>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Made with</span>
                <span className="text-red-500">♥</span>
                <span className="text-gray-400">in Calgary</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;