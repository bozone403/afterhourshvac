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
              <li><Link href="/"><div className="text-lightgray hover:text-white transition-colors cursor-pointer">Home</div></Link></li>
              <li><Link href="/about"><div className="text-lightgray hover:text-white transition-colors cursor-pointer">About Us</div></Link></li>
              <li><Link href="/gallery"><div className="text-lightgray hover:text-white transition-colors cursor-pointer">Gallery</div></Link></li>
              <li><Link href="/pricing"><div className="text-lightgray hover:text-white transition-colors cursor-pointer">Pricing</div></Link></li>
              <li><Link href="/calculators"><div className="text-lightgray hover:text-white transition-colors cursor-pointer">Calculators</div></Link></li>
              <li><Link href="/contact"><div className="text-lightgray hover:text-white transition-colors cursor-pointer">Contact</div></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold font-header mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li><Link href="/pricing"><div className="text-lightgray hover:text-white transition-colors cursor-pointer">Furnace Installation</div></Link></li>
              <li><Link href="/pricing"><div className="text-lightgray hover:text-white transition-colors cursor-pointer">AC Services</div></Link></li>
              <li><Link href="/pricing"><div className="text-lightgray hover:text-white transition-colors cursor-pointer">Maintenance Plans</div></Link></li>
              <li><Link href="/pricing"><div className="text-lightgray hover:text-white transition-colors cursor-pointer">Commercial HVAC</div></Link></li>
              <li><Link href="/pricing"><div className="text-lightgray hover:text-white transition-colors cursor-pointer">Emergency Services</div></Link></li>
              <li><Link href="/pricing"><div className="text-lightgray hover:text-white transition-colors cursor-pointer">New Construction</div></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold font-header mb-4">Service Areas</h3>
            <ul className="space-y-2">
              <li><Link href="/contact"><div className="text-lightgray hover:text-white transition-colors cursor-pointer">Calgary</div></Link></li>
              <li><Link href="/contact"><div className="text-lightgray hover:text-white transition-colors cursor-pointer">Lethbridge</div></Link></li>
              <li><Link href="/contact"><div className="text-lightgray hover:text-white transition-colors cursor-pointer">Coaldale</div></Link></li>
              <li><Link href="/contact"><div className="text-lightgray hover:text-white transition-colors cursor-pointer">Taber</div></Link></li>
              <li><Link href="/contact"><div className="text-lightgray hover:text-white transition-colors cursor-pointer">Fort Macleod</div></Link></li>
              <li><Link href="/contact"><div className="text-lightgray hover:text-white transition-colors cursor-pointer">Rural Areas</div></Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-700 text-center">
          <p className="text-lightgray text-sm">© {new Date().getFullYear()} AfterHours HVAC. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <Link href="/privacy-policy"><div className="text-lightgray hover:text-white transition-colors text-sm cursor-pointer">Privacy Policy</div></Link>
            <Link href="/terms-of-service"><div className="text-lightgray hover:text-white transition-colors text-sm cursor-pointer">Terms of Service</div></Link>
            <Link href="/sitemap"><div className="text-lightgray hover:text-white transition-colors text-sm cursor-pointer">Sitemap</div></Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
