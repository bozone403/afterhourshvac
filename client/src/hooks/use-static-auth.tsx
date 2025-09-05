import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { isAdminEmail } from "@/lib/static-api";
import { useToast } from "@/hooks/use-toast";

// User roles in the system
export type UserRole = 'customer' | 'professional' | 'admin';

// Membership types
export type MembershipType = 'free' | 'basic' | 'pro' | 'lifetime';

type StaticUser = {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  isAdmin: boolean;
  isCustomer: boolean;
  isProfessional: boolean;
  hasProAccess: boolean;
  membershipType: MembershipType;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt?: string;
  // Legacy compatibility fields
  hasPro?: boolean;
  has_pro_access?: boolean;
};

type RegisterData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType: UserRole;
};

type MutationResult = { 
  success: boolean; 
  error?: { message: string };
};

type StaticAuthContextType = {
  user: StaticUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loginMutation: { 
    mutate: (data: LoginData) => Promise<MutationResult>; 
    isPending: boolean;
    error?: { message: string };
  };
  registerMutation: { 
    mutate: (data: RegisterData) => Promise<MutationResult>; 
    isPending: boolean;
    error?: { message: string };
  };
};

type LoginData = {
  email: string;
  password: string;
};

// Create the static auth context
export const StaticAuthContext = createContext<StaticAuthContextType | null>(null);

// Provider component for static deployment
export function StaticAuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<StaticUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('hvac_auth_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('hvac_auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // For admin users, check if email is in the allowed list
      if (isAdminEmail(email)) {
        // Admin login - in a real app, this would validate against a database
        // For now, we'll use a simple password check for demo purposes
        if (password !== 'password') {
          toast({
            title: "Invalid Credentials",
            description: "The email or password you entered is incorrect.",
            variant: "destructive",
          });
          setIsLoading(false);
          return false;
        }
        
        const adminUser: StaticUser = {
          id: 1,
          username: email, // Using email as username for admin users
          email: email,
          role: 'admin',
          isAdmin: true,
          isCustomer: false,
          isProfessional: false,
          hasProAccess: true,
          membershipType: 'lifetime',
          hasPro: true,
          has_pro_access: true
        };

        setUser(adminUser);
        localStorage.setItem('hvac_auth_user', JSON.stringify(adminUser));
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${adminUser.username}!`,
        });

        setIsLoading(false);
        return true;
      } else {
        // Customer login - check localStorage for registered users
        const registeredUsers = JSON.parse(localStorage.getItem('hvac_registered_users') || '[]');
        const foundUser = registeredUsers.find((u: any) => u.email === email && u.password === password);
        
        if (foundUser) {
          const userRole: UserRole = foundUser.userType || 'customer';
          const customerUser: StaticUser = {
            id: foundUser.id,
            username: foundUser.email.split('@')[0],
            email: foundUser.email,
            role: userRole,
            isAdmin: false,
            isCustomer: userRole === 'customer',
            isProfessional: userRole === 'professional',
            hasProAccess: foundUser.membershipType === 'pro' || foundUser.membershipType === 'lifetime',
            membershipType: foundUser.membershipType || 'free',
            firstName: foundUser.firstName,
            lastName: foundUser.lastName,
            phone: foundUser.phone,
            createdAt: foundUser.createdAt,
            hasPro: foundUser.membershipType === 'pro' || foundUser.membershipType === 'lifetime',
            has_pro_access: foundUser.membershipType === 'pro' || foundUser.membershipType === 'lifetime'
          };

          setUser(customerUser);
          localStorage.setItem('hvac_auth_user', JSON.stringify(customerUser));
          
          toast({
            title: "Login successful",
            description: `Welcome back, ${customerUser.firstName || customerUser.username}!`,
          });

          setIsLoading(false);
          return true;
        } else {
          toast({
            title: "Invalid Credentials",
            description: "Please check your email and password.",
            variant: "destructive",
          });
          setIsLoading(false);
          return false;
        }
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred during login.",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Get existing users
      const registeredUsers = JSON.parse(localStorage.getItem('hvac_registered_users') || '[]');
      
      // Check if user already exists
      if (registeredUsers.find((u: any) => u.email === data.email)) {
        toast({
          title: "Registration failed",
          description: "An account with this email already exists.",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }

      // Create new user
      const newUser = {
        id: Date.now(),
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        userType: data.userType,
        membershipType: 'free',
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      registeredUsers.push(newUser);
      localStorage.setItem('hvac_registered_users', JSON.stringify(registeredUsers));

      // Auto-login the new user
      const customerUser: StaticUser = {
        id: newUser.id,
        username: newUser.email.split('@')[0],
        email: newUser.email,
        role: newUser.userType,
        isAdmin: false,
        isCustomer: newUser.userType === 'customer',
        isProfessional: newUser.userType === 'professional',
        hasProAccess: false,
        membershipType: 'free',
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone,
        createdAt: newUser.createdAt,
        hasPro: false,
        has_pro_access: false
      };

      setUser(customerUser);
      localStorage.setItem('hvac_auth_user', JSON.stringify(customerUser));
      
      toast({
        title: "Registration successful",
        description: `Welcome to AfterHours HVAC, ${newUser.firstName}!`,
      });

      setIsLoading(false);
      return true;
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "An error occurred during registration.",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hvac_auth_user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const [loginError, setLoginError] = useState<{ message: string } | undefined>(undefined);
  const [isLoginPending, setIsLoginPending] = useState(false);
  const [registerError, setRegisterError] = useState<{ message: string } | undefined>(undefined);
  const [isRegisterPending, setIsRegisterPending] = useState(false);

  type MutationResult = { success: boolean; error?: { message: string } };

  const loginMutation = {
    mutate: async (data: { email: string; password: string }, options?: { onSuccess?: (result: MutationResult) => void }) => {
      setIsLoginPending(true);
      setLoginError(undefined);
      try {
        const success = await login(data.email, data.password);
        const result: MutationResult = success 
          ? { success: true }
          : { 
              success: false, 
              error: { message: 'Invalid email or password' } 
            };
        
        if (!result.success) {
          setLoginError(result.error);
        }
        
        options?.onSuccess?.(result);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Login failed';
        const errorObj = { message: errorMessage };
        setLoginError(errorObj);
        const result = { success: false, error: errorObj };
        options?.onSuccess?.(result);
        return result;
      } finally {
        setIsLoginPending(false);
      }
    },
    isPending: isLoginPending,
    error: loginError
  };

  const registerMutation = {
    mutate: async (data: RegisterData): Promise<MutationResult> => {
      setIsRegisterPending(true);
      setRegisterError(undefined);
      try {
        const success = await register(data);
        if (!success) {
          const error = { message: 'Registration failed' };
          setRegisterError(error);
          return { success: false, error };
        }
        return { success: true };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Registration failed';
        const errorObj = { message: errorMessage };
        setRegisterError(errorObj);
        return { success: false, error: errorObj };
      } finally {
        setIsRegisterPending(false);
      }
    },
    isPending: isRegisterPending,
    error: registerError
  };

  return (
    <StaticAuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loginMutation,
        registerMutation,
      }}
    >
      {children}
    </StaticAuthContext.Provider>
  );
}

// Hook to use the static auth context
export function useStaticAuth() {
  const context = useContext(StaticAuthContext);
  if (!context) {
    throw new Error("useStaticAuth must be used within a StaticAuthProvider");
  }
  return context;
}
