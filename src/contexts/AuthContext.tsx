
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';

// User types
export type UserRole = 'student' | 'tutor' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

// Auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  userRole: UserRole;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'student@example.com',
    role: 'student',
    profileImage: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'tutor@example.com',
    role: 'tutor',
    profileImage: 'https://i.pravatar.cc/150?img=2'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>(null);

  // Check for saved user in localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      setUserRole(parsedUser.role);
    }
  }, []);

  // Login function with fake delay
  const login = async (email: string, password: string, role: UserRole): Promise<void> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = MOCK_USERS.find(u => u.email === email && u.role === role);
      
      if (foundUser && password === 'password') {
        setUser(foundUser);
        setIsAuthenticated(true);
        setUserRole(foundUser.role);
        localStorage.setItem('user', JSON.stringify(foundUser));
        toast.success(`Welcome back, ${foundUser.name}!`);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed: ' + (error as Error).message);
      throw error;
    }
  };

  // Signup function with fake delay
  const signup = async (name: string, email: string, password: string, role: UserRole): Promise<void> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const userExists = MOCK_USERS.some(u => u.email === email);
      
      if (userExists) {
        throw new Error('User already exists');
      }
      
      // Create new user
      const newUser: User = {
        id: (MOCK_USERS.length + 1).toString(),
        name,
        email,
        role,
        profileImage: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
      };
      
      // Add to mock users (in real app, this would be an API call)
      MOCK_USERS.push(newUser);
      
      // Auto login after signup
      setUser(newUser);
      setIsAuthenticated(true);
      setUserRole(newUser.role);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error('Signup failed: ' + (error as Error).message);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('user');
    toast.success('You have been logged out');
  };

  const value = {
    user,
    isAuthenticated,
    userRole,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
