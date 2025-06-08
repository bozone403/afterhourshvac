import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Phone, MapPin, Wrench, Shield, Users, Star } from "lucide-react";

const emergencySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter a complete address"),
  emergencyType: z.string().min(1, "Please select an emergency type"),
  description: z.string().min(10, "Please provide a detailed description"),
  severity: z.string().min(1, "Please select severity level"),
});

type EmergencyFormData = z.infer<typeof emergencySchema>;

export default function EmergencyService() {
  const { toast } = useToast();
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  
  const form = useForm<EmergencyFormData>({
    resolver: zodResolver(emergencySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      emergencyType: "",
      description: "",
      severity: "",
    },
  });

  const submitEmergency = useMutation({
    mutationFn: async (data: EmergencyFormData) => {
      const response = await apiRequest("POST", "/api/emergency-requests", data);
      return response.json();
    },
    onSuccess: (result) => {
      setSubmissionId(result.id || "Emergency-" + Date.now());
      toast({
        title: "Emergency Request Submitted",
        description: "We've received your emergency request. A technician will contact you shortly.",
      });
      form.reset();
    },
    onError: (error) => {
      console.error("Emergency submission error:", error);
      toast({
        title: "Submission Failed",
        description: "Unable to submit emergency request. Please call us directly at (403) 613-6014.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EmergencyFormData) => {
    submitEmergency.mutate(data);
  };

  if (submissionId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-green-700">Emergency Request Submitted</CardTitle>
              <CardDescription className="text-lg">
                Your request ID: <Badge variant="outline" className="ml-2">{submissionId}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">What happens next:</h3>
                <ul className="space-y-2 text-green-700">
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>A technician will contact you within 15 minutes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>We'll dispatch the nearest available technician</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Wrench className="w-4 h-4" />
                    <span>Emergency repairs available 24/7</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => setSubmissionId(null)} 
                  variant="outline" 
                  className="flex-1"
                >
                  Submit Another Request
                </Button>
                <Button 
                  onClick={() => window.location.href = "/emergency-tracker"} 
                  className="flex-1"
                >
                  Track This Request
                </Button>
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                <p>Emergency Line: <strong>(403) 613-6014</strong></p>
                <p>Available 24/7 • Licensed & Insured</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">24/7 Emergency HVAC Service</h1>
          <p className="text-xl text-gray-600 mb-4">Calgary's Fastest Response Time</p>
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-600" />
              <span>15-Minute Response</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-600" />
              <span>24/7 Availability</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-600" />
              <span>Licensed & Insured</span>
            </div>
          </div>
        </div>

        {/* Emergency Contact Banner */}
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-semibold text-red-800 mb-1">Immediate Emergency?</h3>
                <p className="text-red-700">Call us now for instant assistance</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">(403) 613-6014</div>
                  <div className="text-sm text-red-600">Available 24/7</div>
                </div>
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Emergency Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Submit Emergency Request</CardTitle>
                <CardDescription>
                  Complete this form for non-immediate emergencies. For life-threatening situations, call 911 first.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="John Smith" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input placeholder="(403) 555-0123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Address *</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St, Calgary, AB T2P 1K2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="emergencyType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Emergency Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select emergency type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="no-heat">No Heat</SelectItem>
                                <SelectItem value="no-cooling">No Air Conditioning</SelectItem>
                                <SelectItem value="gas-leak">Gas Leak</SelectItem>
                                <SelectItem value="carbon-monoxide">Carbon Monoxide Alarm</SelectItem>
                                <SelectItem value="water-leak">Water Leak from HVAC</SelectItem>
                                <SelectItem value="electrical">Electrical Issues</SelectItem>
                                <SelectItem value="strange-noises">Strange Noises/Smells</SelectItem>
                                <SelectItem value="thermostat">Thermostat Malfunction</SelectItem>
                                <SelectItem value="frozen-pipes">Frozen Pipes</SelectItem>
                                <SelectItem value="other">Other Emergency</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="severity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Severity Level *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select severity" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="critical">Critical - Safety Risk</SelectItem>
                                <SelectItem value="urgent">Urgent - No Heat/Cooling</SelectItem>
                                <SelectItem value="high">High Priority</SelectItem>
                                <SelectItem value="moderate">Moderate</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Detailed Description *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Please describe the emergency in detail. Include any error codes, unusual sounds, smells, or symptoms you've noticed..."
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-red-600 hover:bg-red-700"
                      disabled={submitEmergency.isPending}
                    >
                      {submitEmergency.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Submitting Emergency Request...
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Submit Emergency Request
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* Service Guarantees */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Service Guarantees
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">15-Minute Response</h4>
                    <p className="text-sm text-muted-foreground">We guarantee contact within 15 minutes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Licensed Technicians</h4>
                    <p className="text-sm text-muted-foreground">All technicians are fully certified</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Satisfaction Guaranteed</h4>
                    <p className="text-sm text-muted-foreground">100% satisfaction or we make it right</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Service Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Emergency Service Call</span>
                  <span className="font-semibold">$199</span>
                </div>
                <div className="flex justify-between">
                  <span>After Hours (6pm-8am)</span>
                  <span className="font-semibold">$299</span>
                </div>
                <div className="flex justify-between">
                  <span>Weekends & Holidays</span>
                  <span className="font-semibold">$349</span>
                </div>
                <hr className="my-3" />
                <p className="text-sm text-muted-foreground">
                  Service call fee applies to diagnostic time and is deducted from repair costs.
                </p>
              </CardContent>
            </Card>

            {/* Service Areas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Service Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Calgary</div>
                  <div>Airdrie</div>
                  <div>Cochrane</div>
                  <div>Okotoks</div>
                  <div>Chestermere</div>
                  <div>Strathmore</div>
                  <div>Canmore</div>
                  <div>High River</div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Additional travel charges may apply for locations outside Calgary city limits.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}