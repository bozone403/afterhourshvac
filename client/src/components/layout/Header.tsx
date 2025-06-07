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
              <div className="text-2xl md:text-3xl font-bold text-white font-header cursor-pointer">
                <span className="text-primary">After</span>
                <span className="text-secondary">Hours</span> 
                <span className="text-white">HVAC</span>
              </div>
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
              <div className={`text-white hover:text-primary transition-colors font-medium cursor-pointer ${isActive('/') ? 'text-primary' : ''}`}>Home</div>
            </Link>
            <Link href="/about">
              <div className={`text-white hover:text-primary transition-colors font-medium cursor-pointer ${isActive('/about') ? 'text-primary' : ''}`}>About</div>
            </Link>
            <Link href="/gallery">
              <div className={`text-white hover:text-primary transition-colors font-medium cursor-pointer ${isActive('/gallery') ? 'text-primary' : ''}`}>Gallery</div>
            </Link>
            <Link href="/pricing">
              <div className={`text-white hover:text-primary transition-colors font-medium cursor-pointer ${isActive('/pricing') ? 'text-primary' : ''}`}>Pricing</div>
            </Link>
            <Link href="/contact">
              <div className={`text-white hover:text-primary transition-colors font-medium cursor-pointer ${isActive('/contact') ? 'text-primary' : ''}`}>Contact</div>
            </Link>
            <Link href="/calculators">
              <div className={`text-white hover:text-primary transition-colors font-medium cursor-pointer ${isActive('/calculators') ? 'text-primary' : ''}`}>Calculators</div>
            </Link>
            <Link href="/forum">
              <div className={`text-white hover:text-primary transition-colors font-medium cursor-pointer ${isActive('/forum') ? 'text-primary' : ''}`}>Forum</div>
            </Link>
            
            {!user && (
              <>
                <Link href="/login">
                  <div className={`text-white hover:text-primary transition-colors font-medium cursor-pointer ${isActive('/login') ? 'text-primary' : ''}`}>Login</div>
                </Link>
                <Link href="/register">
                  <div className={`text-white hover:text-primary transition-colors font-medium cursor-pointer ${isActive('/register') ? 'text-primary' : ''}`}>Register</div>
                </Link>
              </>
            )}
            
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
                    {user && user.isAdmin && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/admin-dashboard')}>
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/admin-data')}>
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Data
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/admin-photos')}>
                          <Settings className="h-4 w-4 mr-2" />
                          Photo Management
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/supplier-data')}>
                          <Settings className="h-4 w-4 mr-2" />
                          Manual Data Entry
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/alggin-data')}>
                          <Settings className="h-4 w-4 mr-2" />
                          Alggin.com Import
                        </DropdownMenuItem>
                      </>
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
              <div 
                className={`text-white hover:text-primary transition-colors font-medium py-2 px-4 cursor-pointer ${isActive('/') ? 'text-primary' : ''}`}
                onClick={closeMobileMenu}
              >
                Home
              </div>
            </Link>
            <Link href="/about">
              <div 
                className={`text-white hover:text-primary transition-colors font-medium py-2 px-4 cursor-pointer ${isActive('/about') ? 'text-primary' : ''}`}
                onClick={closeMobileMenu}
              >
                About
              </div>
            </Link>
            <Link href="/gallery">
              <div 
                className={`text-white hover:text-primary transition-colors font-medium py-2 px-4 cursor-pointer ${isActive('/gallery') ? 'text-primary' : ''}`}
                onClick={closeMobileMenu}
              >
                Gallery
              </div>
            </Link>
            <Link href="/pricing">
              <div 
                className={`text-white hover:text-primary transition-colors font-medium py-2 px-4 cursor-pointer ${isActive('/pricing') ? 'text-primary' : ''}`}
                onClick={closeMobileMenu}
              >
                Pricing
              </div>
            </Link>
            <Link href="/contact">
              <div 
                className={`text-white hover:text-primary transition-colors font-medium py-2 px-4 cursor-pointer ${isActive('/contact') ? 'text-primary' : ''}`}
                onClick={closeMobileMenu}
              >
                Contact
              </div>
            </Link>
            <Link href="/calculators">
              <div 
                className={`text-white hover:text-primary transition-colors font-medium py-2 px-4 cursor-pointer ${isActive('/calculators') ? 'text-primary' : ''}`}
                onClick={closeMobileMenu}
              >
                Calculators
              </div>
            </Link>
            <Link href="/forum">
              <div 
                className={`text-white hover:text-primary transition-colors font-medium py-2 px-4 cursor-pointer ${isActive('/forum') ? 'text-primary' : ''}`}
                onClick={closeMobileMenu}
              >
                Forum
              </div>
            </Link>
            
            {user ? (
              <>
                <Link href="/pro-calculator">
                  <div 
                    className={`text-white hover:text-primary transition-colors font-medium py-2 px-4 cursor-pointer ${isActive('/pro-calculator') ? 'text-primary' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    Pro Calculator
                  </div>
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin">
                    <div 
                      className={`text-white hover:text-primary transition-colors font-medium py-2 px-4 cursor-pointer ${isActive('/admin') ? 'text-primary' : ''}`}
                      onClick={closeMobileMenu}
                    >
                      Admin Dashboard
                    </div>
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
                <div 
                  className={`text-white hover:text-primary transition-colors font-medium py-2 px-4 cursor-pointer ${isActive('/auth') ? 'text-primary' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Login / Register
                </div>
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
