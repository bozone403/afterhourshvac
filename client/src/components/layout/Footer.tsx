import { Link } from 'wouter';

const Footer = () => {
  return (
    <footer className="bg-darkgray pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <h3 className="text-xl font-bold font-header mb-4">AfterHours HVAC</h3>
            <p className="text-lightgray mb-4">Professional heating, cooling, and ventilation services for residential and commercial clients throughout Alberta.</p>
            <div className="flex items-center space-x-2">
              <a href="tel:4036136014" className="bg-primary hover:bg-opacity-80 text-white py-2 px-4 rounded-md transition-all font-medium text-sm">
                <i className="fas fa-phone-alt mr-2"></i> (403) 613-6014
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold font-header mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/"><a className="text-lightgray hover:text-white transition-colors">Home</a></Link></li>
              <li><Link href="/about"><a className="text-lightgray hover:text-white transition-colors">About Us</a></Link></li>
              <li><Link href="/gallery"><a className="text-lightgray hover:text-white transition-colors">Gallery</a></Link></li>
              <li><Link href="/pricing"><a className="text-lightgray hover:text-white transition-colors">Pricing</a></Link></li>
              <li><Link href="/calculators"><a className="text-lightgray hover:text-white transition-colors">Calculators</a></Link></li>
              <li><Link href="/contact"><a className="text-lightgray hover:text-white transition-colors">Contact</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold font-header mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li><Link href="/pricing"><a className="text-lightgray hover:text-white transition-colors">Furnace Installation</a></Link></li>
              <li><Link href="/pricing"><a className="text-lightgray hover:text-white transition-colors">AC Services</a></Link></li>
              <li><Link href="/pricing"><a className="text-lightgray hover:text-white transition-colors">Maintenance Plans</a></Link></li>
              <li><Link href="/pricing"><a className="text-lightgray hover:text-white transition-colors">Commercial HVAC</a></Link></li>
              <li><Link href="/pricing"><a className="text-lightgray hover:text-white transition-colors">Emergency Services</a></Link></li>
              <li><Link href="/pricing"><a className="text-lightgray hover:text-white transition-colors">New Construction</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold font-header mb-4">Service Areas</h3>
            <ul className="space-y-2">
              <li><Link href="/contact"><a className="text-lightgray hover:text-white transition-colors">Calgary</a></Link></li>
              <li><Link href="/contact"><a className="text-lightgray hover:text-white transition-colors">Lethbridge</a></Link></li>
              <li><Link href="/contact"><a className="text-lightgray hover:text-white transition-colors">Coaldale</a></Link></li>
              <li><Link href="/contact"><a className="text-lightgray hover:text-white transition-colors">Taber</a></Link></li>
              <li><Link href="/contact"><a className="text-lightgray hover:text-white transition-colors">Fort Macleod</a></Link></li>
              <li><Link href="/contact"><a className="text-lightgray hover:text-white transition-colors">Rural Areas</a></Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-700 text-center">
          <p className="text-lightgray text-sm">© {new Date().getFullYear()} AfterHours HVAC. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <Link href="/privacy-policy"><a className="text-lightgray hover:text-white transition-colors text-sm">Privacy Policy</a></Link>
            <Link href="/terms-of-service"><a className="text-lightgray hover:text-white transition-colors text-sm">Terms of Service</a></Link>
            <Link href="/sitemap"><a className="text-lightgray hover:text-white transition-colors text-sm">Sitemap</a></Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
