import React, { useState } from "react";
import { useLocation } from "wouter";
import { useStaticAuth } from "@/hooks/use-static-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, Mail, Phone, Building, Shield, CheckCircle, Eye, EyeOff, Crown } from "lucide-react";
import { Helmet } from "react-helmet-async";

// Registration form schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
  email: z.string().email("Valid email address is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  company: z.string().optional().or(z.literal("")),
  userType: z.enum(["customer", "professional"], {
    required_error: "Please select your account type",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [location, navigate] = useLocation();
  const { user, isLoading, registerMutation } = useStaticAuth();

  // Get user type from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const userTypeFromUrl = urlParams.get('type') === 'professional' ? 'professional' : 'customer';

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      phone: "",
      firstName: "",
      lastName: "",
      company: "",
      userType: userTypeFromUrl,
    },
  });

  // Handle registration
  const onRegister = async (data: RegisterFormValues) => {
    try {
      await registerMutation.mutate({
        ...data,
        membershipType: data.userType === 'professional' ? 'basic' : 'customer',
      });
      
      // If professional, redirect to membership selection
      if (data.userType === 'professional') {
        navigate('/membership');
      } else {
        navigate('/customer-dashboard');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  // Redirect if already logged in
  if (user) {
    if (user.isAdmin) {
      navigate('/admin');
    } else if (user.isProfessional) {
      navigate('/pro-dashboard');
    } else {
      navigate('/customer-dashboard');
    }
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Sign Up - AfterHours HVAC</title>
        <meta name="description" content="Create your AfterHours HVAC account. Choose between customer or professional membership." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
            <CardDescription className="text-gray-600">
              Join AfterHours HVAC - Choose your account type below
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Account Type Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card 
                className={`cursor-pointer transition-all ${
                  registerForm.watch('userType') === 'customer' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => registerForm.setValue('userType', 'customer')}
              >
                <CardContent className="p-4 text-center">
                  <User className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="font-semibold">Customer</div>
                  <div className="text-xs text-gray-600">Homeowner</div>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all ${
                  registerForm.watch('userType') === 'professional' 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => registerForm.setValue('userType', 'professional')}
              >
                <CardContent className="p-4 text-center">
                  <Crown className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <div className="font-semibold">Professional</div>
                  <div className="text-xs text-gray-600">HVAC Tech</div>
                </CardContent>
              </Card>
            </div>

            {/* Registration Form */}
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                
                {/* Personal Information */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={registerForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="(403) 555-0123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {registerForm.watch('userType') === 'professional' && (
                  <FormField
                    control={registerForm.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Your HVAC Company" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                <Button
                  type="submit"
                  className="w-full"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Account
                </Button>

                {registerForm.watch('userType') === 'professional' && (
                  <div className="text-center">
                    <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                      <Crown className="h-3 w-3 mr-1" />
                      Professional accounts require membership selection
                    </Badge>
                  </div>
                )}

              </form>
            </Form>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/auth')}>
                Sign in here
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
