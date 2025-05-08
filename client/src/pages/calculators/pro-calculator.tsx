import React, { useState } from 'react';
import { Link } from 'wouter';
import { ChevronRight, CheckCircle, Lock, CreditCard, Mail, User, Shield } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SEO from '@/lib/seo';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const purchaseFormSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
});

type PurchaseFormValues = z.infer<typeof purchaseFormSchema>;

const ProCalculatorPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = async (values: PurchaseFormValues) => {
    setIsLoading(true);
    
    try {
      // Create payment intent with the API
      const response = await apiRequest("POST", "/api/create-payment-intent", values);
      
      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }
      
      const data = await response.json();
      
      // Redirect to checkout page with client secret
      window.location.href = `/checkout?client_secret=${data.clientSecret}&access_id=${data.accessId}`;
    } catch (error) {
      console.error("Error creating payment intent:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process your request. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Pro Calculator | AfterHours HVAC"
        description="Unlock our comprehensive HVAC calculation system designed for contractors, property managers, and serious homeowners. Get detailed load calculations, equipment sizing guides, and more."
      />
      
      <main>
        {/* Hero Section */}
        <section className="bg-dark-charcoal py-24">
          <div className="container mx-auto px-4">
            <nav className="py-4">
              <ol className="flex flex-wrap text-sm">
                <li className="flex items-center">
                  <Link href="/" className="text-muted-text hover:text-white transition-colors">Home</Link>
                  <ChevronRight className="h-4 w-4 mx-2 text-gray-500" />
                </li>
                <li className="flex items-center">
                  <Link href="/calculators" className="text-muted-text hover:text-white transition-colors">Calculators</Link>
                  <ChevronRight className="h-4 w-4 mx-2 text-gray-500" />
                </li>
                <li className="text-white">Pro Calculator</li>
              </ol>
            </nav>
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Pro Calculator</h1>
              <p className="text-lg text-muted-text">
                Unlock our comprehensive HVAC calculation system designed for contractors, 
                property managers, and serious homeowners.
              </p>
            </div>
          </div>
        </section>

        {/* Pro Calculator Features */}
        <section className="py-16 bg-charcoal">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
                <div>
                  <h2 className="text-3xl font-heading font-bold mb-6">
                    <span className="relative">
                      Professional-Grade <span className="highlight-fire">HVAC Calculations</span>
                    </span>
                  </h2>
                  <p className="text-muted-text mb-6">
                    Our Pro Calculator provides comprehensive tools that go far beyond basic estimators. 
                    With Alberta-specific data and detailed analysis capabilities, it's an essential tool 
                    for HVAC professionals and serious property owners.
                  </p>
                  
                  <div className="space-y-5">
                    <div className="flex">
                      <CheckCircle className="h-6 w-6 text-electric mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-heading font-semibold text-lg">Detailed Load Calculations</h3>
                        <p className="text-muted-text text-sm">
                          Calculate precise heating and cooling loads based on building specs, 
                          construction type, insulation values, and Alberta's climate data.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <CheckCircle className="h-6 w-6 text-electric mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-heading font-semibold text-lg">Equipment Sizing Guide</h3>
                        <p className="text-muted-text text-sm">
                          Get accurate equipment size recommendations that account for your 
                          specific needs, avoiding costly oversizing or underpowered systems.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <CheckCircle className="h-6 w-6 text-electric mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-heading font-semibold text-lg">Custom PDF Reports</h3>
                        <p className="text-muted-text text-sm">
                          Generate professional reports for clients, permit applications, or 
                          recordkeeping, with your business information and branding.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <CheckCircle className="h-6 w-6 text-electric mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-heading font-semibold text-lg">Ductwork Design</h3>
                        <p className="text-muted-text text-sm">
                          Calculate appropriate ductwork sizes, register sizes, and system CFM 
                          for optimal airflow distribution throughout the property.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <CheckCircle className="h-6 w-6 text-electric mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-heading font-semibold text-lg">Energy Cost Projections</h3>
                        <p className="text-muted-text text-sm">
                          Model long-term operational costs and savings from efficiency investments, 
                          using actual Alberta utility rate data.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <div className="relative">
                    <div className="bg-darkgray border border-gray-700 rounded-xl p-6 mb-6">
                      <div className="absolute -top-3 -right-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-fire text-white">
                          PRO PREVIEW
                        </span>
                      </div>
                      <h3 className="text-lg font-heading font-bold mb-4">Load Calculator</h3>
                      <div className="space-y-4 mb-4">
                        <div>
                          <label className="block text-xs font-medium text-muted-text mb-1">Building Type</label>
                          <div className="h-9 bg-charcoal rounded border border-gray-600 flex items-center px-3">
                            <span className="text-muted-text text-sm">Residential Single-Family</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-muted-text mb-1">Square Footage</label>
                            <div className="h-9 bg-charcoal rounded border border-gray-600 flex items-center px-3">
                              <span className="text-muted-text text-sm">2,400</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-muted-text mb-1">Ceiling Height</label>
                            <div className="h-9 bg-charcoal rounded border border-gray-600 flex items-center px-3">
                              <span className="text-muted-text text-sm">9 ft</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="pt-2 flex justify-center">
                        <div className="inline-flex items-center">
                          <Lock className="h-4 w-4 text-electric mr-1.5" />
                          <span className="text-electric text-sm">Unlock Pro Features</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-darkgray border border-gray-700 rounded-xl p-6">
                      <h3 className="text-lg font-heading font-bold mb-4">System Sizing Results</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                          <span className="text-muted-text">Heating Load:</span>
                          <div className="flex items-center">
                            <Lock className="h-4 w-4 text-electric mr-1.5" />
                            <span className="text-electric font-medium">Pro Feature</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                          <span className="text-muted-text">Cooling Load:</span>
                          <div className="flex items-center">
                            <Lock className="h-4 w-4 text-electric mr-1.5" />
                            <span className="text-electric font-medium">Pro Feature</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                          <span className="text-muted-text">Recommended Furnace:</span>
                          <div className="flex items-center">
                            <Lock className="h-4 w-4 text-electric mr-1.5" />
                            <span className="text-electric font-medium">Pro Feature</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-text">Recommended AC:</span>
                          <div className="flex items-center">
                            <Lock className="h-4 w-4 text-electric mr-1.5" />
                            <span className="text-electric font-medium">Pro Feature</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-grow flex items-end mt-8">
                    <div className="bg-dark-card border border-gray-700 rounded-xl p-6 w-full">
                      <div className="text-center">
                        <span className="text-3xl font-heading font-bold">$500</span>
                        <span className="text-muted-text ml-2">one-time purchase</span>
                        <p className="text-sm text-muted-text mt-1">Lifetime access, no subscription</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Purchase Form */}
              <div className="bg-dark-card border border-gray-700 rounded-xl overflow-hidden">
                <div className="p-6 md:p-8 bg-gradient-to-r from-fire/10 to-electric/10 border-b border-gray-700">
                  <h2 className="text-2xl font-heading font-bold mb-2">Get Pro Calculator Access</h2>
                  <p className="text-muted-text">
                    Complete the form below to proceed to secure payment and unlock your Pro Calculator access.
                  </p>
                </div>
                
                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    <div className="md:col-span-3">
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-muted-text">Full Name</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                      <User className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <Input 
                                      className="pl-10 bg-charcoal border-gray-700 text-white" 
                                      placeholder="Enter your full name" 
                                      {...field} 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-muted-text">Email Address</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                      <Mail className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <Input 
                                      type="email"
                                      className="pl-10 bg-charcoal border-gray-700 text-white" 
                                      placeholder="Enter your email address" 
                                      {...field} 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="pt-4">
                            <Button 
                              type="submit" 
                              className="w-full bg-fire hover:bg-fire/90 text-white"
                              disabled={isLoading}
                            >
                              <CreditCard className="mr-2 h-5 w-5" />
                              {isLoading ? "Processing..." : "Proceed to Payment"}
                            </Button>
                          </div>
                        </form>
                      </Form>
                      
                      <div className="mt-6 text-sm text-muted-text">
                        <p>
                          By proceeding with the purchase, you agree to our Terms of Service and Privacy Policy. 
                          After payment, you'll receive immediate access to the Pro Calculator.
                        </p>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <div className="bg-darkgray rounded-xl p-6 border border-gray-700">
                        <h3 className="text-lg font-heading font-bold mb-4">What You'll Get</h3>
                        <ul className="space-y-3 mb-6">
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-electric mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-muted-text">Lifetime access to Pro Calculator</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-electric mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-muted-text">Free updates and improvements</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-electric mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-muted-text">Alberta-specific calculation data</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-electric mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-muted-text">PDF export functionality</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-electric mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-muted-text">Save multiple calculation projects</span>
                          </li>
                        </ul>
                        
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 text-electric mr-2" />
                          <span className="text-sm text-electric">Secure Payment Processing</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16 bg-dark-charcoal">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-heading font-bold text-center mb-12">What Users Are Saying</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-darkgray rounded-xl p-6 border border-gray-700">
                <div className="flex text-electric mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <p className="text-muted-text mb-4">
                  "As a property manager overseeing 12 commercial buildings, this calculator has saved me countless 
                  hours of work and helped me budget HVAC replacements more accurately. Worth every penny."
                </p>
                <div className="flex items-center">
                  <div className="mr-3 font-medium">David R.</div>
                  <div className="text-sm text-muted-text">Commercial Property Manager</div>
                </div>
              </div>
              
              <div className="bg-darkgray rounded-xl p-6 border border-gray-700">
                <div className="flex text-electric mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <p className="text-muted-text mb-4">
                  "The Pro Calculator's ductwork design features have completely changed how I spec out jobs. 
                  I'm getting more accurate quotes and my customers are seeing better results."
                </p>
                <div className="flex items-center">
                  <div className="mr-3 font-medium">Sarah K.</div>
                  <div className="text-sm text-muted-text">HVAC Contractor</div>
                </div>
              </div>
              
              <div className="bg-darkgray rounded-xl p-6 border border-gray-700">
                <div className="flex text-electric mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <p className="text-muted-text mb-4">
                  "I used the calculator to compare different HVAC systems when renovating my century home. 
                  The energy cost projections saved me from making an expensive mistake and paid for itself immediately."
                </p>
                <div className="flex items-center">
                  <div className="mr-3 font-medium">Michael T.</div>
                  <div className="text-sm text-muted-text">Homeowner</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ProCalculatorPage;
