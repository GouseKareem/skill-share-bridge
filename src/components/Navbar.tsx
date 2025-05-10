
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from './ThemeProvider';
import { Moon, Sun, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout, userRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const getDashboardLink = () => {
    if (userRole === 'student') return '/student-dashboard';
    if (userRole === 'tutor') return '/tutor-dashboard';
    return '/';
  };
  
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TutorMatch
            </span>
          </Link>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/tutors" className="text-foreground hover:text-primary transition-colors">
              Find Tutors
            </Link>
            <Link to="/how-it-works" className="text-foreground hover:text-primary transition-colors">
              How It Works
            </Link>
            {isAuthenticated && (
              <Link to={getDashboardLink()} className="text-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
            )}
          </nav>
          
          {/* Right side - Authentication and Theme toggle */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.profileImage} alt={user?.name} />
                      <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={getDashboardLink()}>Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button onClick={() => navigate('/signup')}>
                  Sign Up
                </Button>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 bg-background border-t border-border">
            <Link
              to="/"
              className="block px-4 py-2 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/tutors"
              className="block px-4 py-2 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Tutors
            </Link>
            <Link
              to="/how-it-works"
              className="block px-4 py-2 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            {isAuthenticated && (
              <Link
                to={getDashboardLink()}
                className="block px-4 py-2 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
