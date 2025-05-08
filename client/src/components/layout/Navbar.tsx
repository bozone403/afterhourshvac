import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'bg-charcoal/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    )}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center">
            <span className="text-fire font-heading font-bold text-2xl">AfterHours</span>
            <span className="text-electric font-heading font-bold ml-1 text-2xl">HVAC</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                onClick={closeMenu}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
                  location === link.path ? 'text-electric' : 'text-white hover:text-electric'
                )}
              >
                {link.name}
              </Link>
            ))}
            <a 
              href="tel:4036136014"
              className="ml-4 flex items-center px-4 py-2 bg-fire hover:bg-fire/90 text-white rounded-md font-medium transition duration-200"
            >
              <Phone className="h-4 w-4 mr-2" />
              (403) 613-6014
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button 
              type="button" 
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-fire focus:outline-none"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden bg-dark-charcoal border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={closeMenu}
                className={cn(
                  'block px-3 py-2 rounded-md text-base font-medium',
                  location === link.path 
                    ? 'bg-fire text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                )}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="tel:4036136014"
              className="block px-3 py-2 rounded-md text-base font-medium text-white bg-fire hover:bg-fire/90"
            >
              Call (403) 613-6014
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
