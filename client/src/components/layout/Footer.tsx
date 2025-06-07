import { Link } from 'wouter';

const Footer = () => {
  return (
    <footer className="bg-gray-900 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <h3 className="text-xl font-bold font-header mb-4 text-white">
              <span className="text-orange-500">After</span>
              <span className="text-blue-400">Hours</span> 
              <span className="text-white">HVAC</span>
            </h3>
            <p className="text-gray-300 mb-4">Professional heating, cooling, and ventilation services for residential and commercial clients throughout Alberta.</p>
            <div className="flex items-center space-x-2">
              <a href="tel:4036136014" className="bg-primary hover:bg-opacity-80 text-white py-2 px-4 rounded-md transition-all font-medium text-sm">
                <i className="fas fa-phone-alt mr-2"></i> (403) 613-6014
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold font-header mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/"><div className="text-gray-300 hover:text-white transition-colors cursor-pointer">Home</div></Link></li>
              <li><Link href="/about"><div className="text-gray-300 hover:text-white transition-colors cursor-pointer">About Us</div></Link></li>
              <li><Link href="/gallery"><div className="text-gray-300 hover:text-white transition-colors cursor-pointer">Gallery</div></Link></li>
              <li><Link href="/membership"><div className="text-gray-300 hover:text-white transition-colors cursor-pointer">Membership</div></Link></li>
              <li><Link href="/calculators"><div className="text-gray-300 hover:text-white transition-colors cursor-pointer">Calculators</div></Link></li>
              <li><Link href="/contact"><div className="text-gray-300 hover:text-white transition-colors cursor-pointer">Contact</div></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold font-header mb-4 text-white">Our Services</h3>
            <ul className="space-y-2">
              <li><Link href="/membership"><div className="text-gray-300 hover:text-white transition-colors cursor-pointer">Furnace Installation</div></Link></li>
              <li><Link href="/membership"><div className="text-gray-300 hover:text-white transition-colors cursor-pointer">AC Services</div></Link></li>
              <li><Link href="/membership"><div className="text-gray-300 hover:text-white transition-colors cursor-pointer">Maintenance Plans</div></Link></li>
              <li><Link href="/membership"><div className="text-gray-300 hover:text-white transition-colors cursor-pointer">Commercial HVAC</div></Link></li>
              <li><Link href="/membership"><div className="text-gray-300 hover:text-white transition-colors cursor-pointer">Emergency Services</div></Link></li>
              <li><Link href="/membership"><div className="text-gray-300 hover:text-white transition-colors cursor-pointer">New Construction</div></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold font-header mb-4 text-white">Service Areas</h3>
            <ul className="space-y-2">
              <li><Link href="/contact"><div className="text-gray-300 hover:text-white transition-colors cursor-pointer">Calgary</div></Link></li>
              <li><Link href="/contact"><div className="text-gray-300 hover:text-white transition-colors cursor-pointer">Lethbridge</div></Link></li>
              <li><Link href="/contact"><div className="text-gray-300 hover:text-white transition-colors cursor-pointer">Coaldale</div></Link></li>
              <li><Link href="/contact"><div className="text-gray-300 hover:text-white transition-colors cursor-pointer">Taber</div></Link></li>
              <li><Link href="/contact"><div className="text-gray-300 hover:text-white transition-colors cursor-pointer">Fort Macleod</div></Link></li>
              <li><Link href="/contact"><div className="text-gray-300 hover:text-white transition-colors cursor-pointer">Rural Areas</div></Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-300 text-sm">© {new Date().getFullYear()} AfterHours HVAC. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <Link href="/privacy-policy"><div className="text-gray-300 hover:text-white transition-colors text-sm cursor-pointer">Privacy Policy</div></Link>
            <Link href="/terms-of-service"><div className="text-gray-300 hover:text-white transition-colors text-sm cursor-pointer">Terms of Service</div></Link>
            <Link href="/sitemap"><div className="text-gray-300 hover:text-white transition-colors text-sm cursor-pointer">Sitemap</div></Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
