import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-dark bg-opacity-95 shadow-md' : 'bg-dark bg-opacity-80'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-2xl md:text-3xl font-bold text-white font-header">
                <span className="text-primary">After</span>
                <span className="text-secondary">Hours</span> 
                <span className="text-white">HVAC</span>
              </a>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button 
              onClick={toggleMobileMenu} 
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <i className="fas fa-bars text-2xl"></i>
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/">
              <a className={`text-white hover:text-primary transition-colors font-medium ${isActive('/') ? 'text-primary' : ''}`}>Home</a>
            </Link>
            <Link href="/about">
              <a className={`text-white hover:text-primary transition-colors font-medium ${isActive('/about') ? 'text-primary' : ''}`}>About</a>
            </Link>
            <Link href="/gallery">
              <a className={`text-white hover:text-primary transition-colors font-medium ${isActive('/gallery') ? 'text-primary' : ''}`}>Gallery</a>
            </Link>
            <Link href="/pricing">
              <a className={`text-white hover:text-primary transition-colors font-medium ${isActive('/pricing') ? 'text-primary' : ''}`}>Pricing</a>
            </Link>
            <Link href="/contact">
              <a className={`text-white hover:text-primary transition-colors font-medium ${isActive('/contact') ? 'text-primary' : ''}`}>Contact</a>
            </Link>
            <a 
              href="tel:4036136014" 
              className="bg-primary hover:bg-opacity-80 text-white py-2 px-4 rounded-md transition-all font-semibold"
            >
              <i className="fas fa-phone-alt mr-2"></i>(403) 613-6014
            </a>
          </nav>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`lg:hidden bg-darkgray transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-screen' : 'max-h-0'}`}>
        <div className="container mx-auto px-4 py-2">
          <nav className="flex flex-col space-y-4 py-4">
            <Link href="/">
              <a 
                className={`text-white hover:text-primary transition-colors font-medium py-2 px-4 ${isActive('/') ? 'text-primary' : ''}`}
                onClick={closeMobileMenu}
              >
                Home
              </a>
            </Link>
            <Link href="/about">
              <a 
                className={`text-white hover:text-primary transition-colors font-medium py-2 px-4 ${isActive('/about') ? 'text-primary' : ''}`}
                onClick={closeMobileMenu}
              >
                About
              </a>
            </Link>
            <Link href="/gallery">
              <a 
                className={`text-white hover:text-primary transition-colors font-medium py-2 px-4 ${isActive('/gallery') ? 'text-primary' : ''}`}
                onClick={closeMobileMenu}
              >
                Gallery
              </a>
            </Link>
            <Link href="/pricing">
              <a 
                className={`text-white hover:text-primary transition-colors font-medium py-2 px-4 ${isActive('/pricing') ? 'text-primary' : ''}`}
                onClick={closeMobileMenu}
              >
                Pricing
              </a>
            </Link>
            <Link href="/contact">
              <a 
                className={`text-white hover:text-primary transition-colors font-medium py-2 px-4 ${isActive('/contact') ? 'text-primary' : ''}`}
                onClick={closeMobileMenu}
              >
                Contact
              </a>
            </Link>
            <a 
              href="tel:4036136014" 
              className="bg-primary hover:bg-opacity-80 text-white py-3 px-4 rounded-md transition-all font-semibold text-center"
              onClick={closeMobileMenu}
            >
              <i className="fas fa-phone-alt mr-2"></i>(403) 613-6014
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
