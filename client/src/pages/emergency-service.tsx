import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Phone, 
  Clock, 
  AlertTriangle, 
  DollarSign, 
  MapPin,
  User,
  MessageSquare,
  CreditCard,
  CheckCircle
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface EmergencyPricing {
  baseRate: number;
  minimumHours: number;
  totalCost: number;
  timeSlot: string;
  description: string;
}

const EmergencyServicePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPricing, setCurrentPricing] = useState<EmergencyPricing | null>(null);
  const [formData, setFormData] = useState({
    name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    emergencyType: '',
    description: '',
    urgencyLevel: 'high'
  });

  // Calculate pricing based on current time
  const calculateEmergencyPricing = (): EmergencyPricing => {
    const now = new Date();
    const hour = now.getHours();
    const baseRate = 175; // $175/hour
    
    if (hour >= 17 || hour < 0) { // 5 PM to midnight
      return {
        baseRate,
        minimumHours: 2,
        totalCost: baseRate * 2,
        timeSlot: "5:00 PM - 12:00 AM",
        description: "Evening Emergency Rate (2 hour minimum)"
      };
    } else if (hour >= 0 && hour < 8) { // Midnight to 8 AM
      return {
        baseRate,
        minimumHours: 3,
        totalCost: baseRate * 3,
        timeSlot: "12:00 AM - 8:00 AM",
        description: "Overnight Emergency Rate (3 hour minimum)"
      };
    } else { // Regular hours
      return {
        baseRate,
        minimumHours: 1,
        totalCost: baseRate * 1,
        timeSlot: "8:00 AM - 5:00 PM",
        description: "Regular Emergency Rate (1 hour minimum)"
      };
    }
  };

  // Update pricing when component mounts
  useEffect(() => {
    setCurrentPricing(calculateEmergencyPricing());
    
    // Update pricing every minute
    const interval = setInterval(() => {
      setCurrentPricing(calculateEmergencyPricing());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const emergencyMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/emergency-service", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Emergency Service Requested",
        description: "Your emergency service request has been submitted. Jordan will be notified immediately and contact you shortly.",
      });
      
      // Reset form
      setFormData({
        ...formData,
        address: '',
        emergencyType: '',
        description: ''
      });
    },
    onError: (error: any) => {
      toast({
        title: "Request Failed",
        description: error.message || "Failed to submit emergency service request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address || !formData.emergencyType || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!currentPricing) {
      toast({
        title: "Pricing Error",
        description: "Unable to calculate pricing. Please refresh and try again.",
        variant: "destructive",
      });
      return;
    }

    const emergencyData = {
      ...formData,
      pricing: currentPricing,
      requestedAt: new Date().toISOString(),
      userId: user?.id
    };

    emergencyMutation.mutate(emergencyData);
  };

  const emergencyTypes = [
    "No Heat",
    "No Air Conditioning", 
    "Gas Leak",
    "Water Leak from HVAC",
    "Furnace Not Working",
    "AC Unit Down",
    "Strange Smells/Burning",
    "System Making Loud Noises",
    "Thermostat Issues",
    "Other Emergency"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">24/7 Emergency HVAC Service</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Immediate response for urgent heating, cooling, and ventilation emergencies in Calgary
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pricing Card */}
          <div className="lg:col-span-1">
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Current Emergency Pricing
                </CardTitle>
                <CardDescription className="text-red-600">
                  Pricing automatically calculated based on current time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentPricing && (
                  <>
                    <div className="bg-white rounded-lg p-4 border border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-red-600" />
                        <span className="font-medium text-red-800">Time Slot</span>
                      </div>
                      <p className="text-sm text-gray-700">{currentPricing.timeSlot}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Base Rate:</span>
                        <span className="font-medium">${currentPricing.baseRate}/hour</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Minimum Hours:</span>
                        <span className="font-medium">{currentPricing.minimumHours} hours</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold text-red-600">
                        <span>Total Minimum:</span>
                        <span>${currentPricing.totalCost}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-600 bg-white p-2 rounded border border-red-200">
                      {currentPricing.description}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">24/7 Emergency Hotline</p>
                    <p className="text-2xl font-bold text-blue-600">(403) 613-6014</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Service Area</p>
                    <p className="font-medium">Calgary & Surrounding Areas</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Response Time</p>
                    <p className="font-medium text-green-600">Within 2 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Service Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Service Request</CardTitle>
                <CardDescription>
                  Fill out this form for immediate emergency service. Jordan will receive an instant notification.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="(403) 555-0123"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Service Address *
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="123 Main Street, Calgary, AB"
                      required
                    />
                  </div>

                  {/* Emergency Details */}
                  <div>
                    <Label htmlFor="emergencyType">Type of Emergency *</Label>
                    <select
                      id="emergencyType"
                      value={formData.emergencyType}
                      onChange={(e) => setFormData({...formData, emergencyType: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select emergency type</option>
                      {emergencyTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="description" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Detailed Description *
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Please describe the emergency situation in detail. Include any symptoms, when it started, and any safety concerns..."
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="urgencyLevel">Urgency Level</Label>
                    <select
                      id="urgencyLevel"
                      value={formData.urgencyLevel}
                      onChange={(e) => setFormData({...formData, urgencyLevel: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="high">High - Immediate attention needed</option>
                      <option value="critical">Critical - Safety hazard</option>
                      <option value="moderate">Moderate - Can wait a few hours</option>
                    </select>
                  </div>

                  {/* Pricing Summary */}
                  {currentPricing && (
                    <Alert>
                      <CreditCard className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <p className="font-medium">Service Call Minimum: ${currentPricing.totalCost}</p>
                          <p className="text-sm text-gray-600">
                            This covers the {currentPricing.minimumHours} hour minimum at ${currentPricing.baseRate}/hour for {currentPricing.timeSlot} service calls. Additional time will be billed at the same hourly rate.
                          </p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <div className="space-y-4">
                    <Button 
                      type="submit" 
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg"
                      disabled={emergencyMutation.isPending}
                    >
                      {emergencyMutation.isPending ? (
                        <>
                          <Clock className="h-5 w-5 mr-2 animate-spin" />
                          Submitting Emergency Request...
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-5 w-5 mr-2" />
                          Submit Emergency Service Request
                        </>
                      )}
                    </Button>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        By submitting this request, you agree to the minimum service charge and authorize payment processing.
                      </p>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Info */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-800">Licensed & Insured</h3>
                <p className="text-sm text-blue-600">Fully licensed HVAC technicians</p>
              </div>
              <div className="text-center">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-800">Fast Response</h3>
                <p className="text-sm text-blue-600">Within 2 hours emergency response</p>
              </div>
              <div className="text-center">
                <Phone className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-800">24/7 Availability</h3>
                <p className="text-sm text-blue-600">Always available for emergencies</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmergencyServicePage;