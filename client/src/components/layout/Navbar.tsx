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
      isScrolled 
        ? 'bg-slate-900/95 backdrop-blur-md shadow-2xl border-b border-white/10' 
        : 'bg-gradient-to-r from-slate-900/80 via-blue-900/80 to-slate-900/80 backdrop-blur-sm'
    )}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center group">
            <span className="text-white font-black text-2xl transition-all group-hover:text-amber-400">AfterHours</span>
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent font-black ml-2 text-2xl">HVAC</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                onClick={closeMenu}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200',
                  location === link.path 
                    ? 'text-amber-400 bg-white/10' 
                    : 'text-white hover:text-amber-400 hover:bg-white/5'
                )}
              >
                {link.name}
              </Link>
            ))}
            <a 
              href="tel:4036136014"
              className="ml-4 flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg shadow-amber-500/50 hover:scale-105"
            >
              <Phone className="h-4 w-4 mr-2" />
              (403) 613-6014
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button 
              type="button" 
              className="inline-flex items-center justify-center p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors text-white"
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

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-md border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={closeMenu}
                className={cn(
                  'block px-3 py-2 rounded-lg text-base font-semibold transition-all',
                  location === link.path 
                    ? 'bg-white/10 text-amber-400' 
                    : 'text-white hover:bg-white/5 hover:text-amber-400'
                )}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="tel:4036136014"
              className="block px-3 py-2 rounded-lg text-base font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 mt-2"
            >
              <Phone className="h-4 w-4 mr-2 inline" />
              (403) 613-6014
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
