import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  User, 
  LogOut, 
  Settings, 
  Calculator, 
  Menu,
  LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();

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

  const handleLogout = () => {
    logoutMutation.mutate();
    navigate('/');
    closeMobileMenu();
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
              <Menu className="h-6 w-6" />
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4">
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
            <Link href="/calculators">
              <a className={`text-white hover:text-primary transition-colors font-medium ${isActive('/calculators') ? 'text-primary' : ''}`}>Calculators</a>
            </Link>
            
            <div className="ml-2 flex items-center space-x-2">
              <a 
                href="tel:4036136014" 
                className="bg-primary hover:bg-primary/80 text-white py-2 px-4 rounded-md transition-all font-semibold"
              >
                <i className="fas fa-phone-alt mr-2"></i>(403) 613-6014
              </a>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-2">
                      <User className="h-4 w-4 mr-1" />
                      {user.username}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/pro-calculator')}>
                      <Calculator className="h-4 w-4 mr-2" />
                      Pro Calculator
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-2"
                  onClick={() => navigate('/auth')}
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Login
                </Button>
              )}
            </div>
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
            <Link href="/calculators">
              <a 
                className={`text-white hover:text-primary transition-colors font-medium py-2 px-4 ${isActive('/calculators') ? 'text-primary' : ''}`}
                onClick={closeMobileMenu}
              >
                Calculators
              </a>
            </Link>
            
            {user ? (
              <>
                <Link href="/pro-calculator">
                  <a 
                    className={`text-white hover:text-primary transition-colors font-medium py-2 px-4 ${isActive('/pro-calculator') ? 'text-primary' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    Pro Calculator
                  </a>
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin">
                    <a 
                      className={`text-white hover:text-primary transition-colors font-medium py-2 px-4 ${isActive('/admin') ? 'text-primary' : ''}`}
                      onClick={closeMobileMenu}
                    >
                      Admin Dashboard
                    </a>
                  </Link>
                )}
                <button
                  className="text-white hover:text-primary transition-colors font-medium py-2 px-4 text-left"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/auth">
                <a 
                  className={`text-white hover:text-primary transition-colors font-medium py-2 px-4 ${isActive('/auth') ? 'text-primary' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Login / Register
                </a>
              </Link>
            )}
            
            <a 
              href="tel:4036136014" 
              className="bg-primary hover:bg-opacity-80 text-white py-3 px-4 rounded-md transition-all font-semibold text-center"
              onClick={closeMobileMenu}
            >
              <i className="fas fa-phone-alt mr-2"></i>(403) 613-6014
            </a>
            
            <a 
              href="mailto:Jordan@Afterhourshvac.ca" 
              className="bg-secondary hover:bg-opacity-80 text-white py-3 px-4 rounded-md transition-all font-semibold text-center"
              onClick={closeMobileMenu}
            >
              <i className="fas fa-envelope mr-2"></i>Jordan@Afterhourshvac.ca
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
