import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Flame, Calendar, CreditCard, MapPin, Phone, Mail, User } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface BookingData {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  furnaceType: string;
  homeSize: string;
  urgency: string;
  preferredDate: string;
  timeSlot: string;
  specialRequirements: string;
  price: number;
}

const FurnaceInstall = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [booking, setBooking] = useState<BookingData>({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    furnaceType: '',
    homeSize: '',
    urgency: 'standard',
    preferredDate: '',
    timeSlot: '',
    specialRequirements: '',
    price: 150
  });

  const furnaceTypes = [
    { value: 'gas', label: 'Natural Gas Furnace', price: 150 },
    { value: 'electric', label: 'Electric Furnace', price: 150 },
    { value: 'oil', label: 'Oil Furnace', price: 180 },
    { value: 'high-efficiency', label: 'High-Efficiency Gas', price: 200 },
    { value: 'heat-pump', label: 'Heat Pump System', price: 220 }
  ];

  const homeSizes = [
    { value: 'small', label: 'Small (< 1,500 sq ft)', multiplier: 0.8 },
    { value: 'medium', label: 'Medium (1,500 - 2,500 sq ft)', multiplier: 1.0 },
    { value: 'large', label: 'Large (2,500 - 4,000 sq ft)', multiplier: 1.3 },
    { value: 'xlarge', label: 'Extra Large (> 4,000 sq ft)', multiplier: 1.6 }
  ];

  const timeSlots = [
    '8:00 AM - 12:00 PM',
    '12:00 PM - 4:00 PM', 
    '4:00 PM - 8:00 PM',
    'Flexible (Best Available)'
  ];

  const submitBooking = useMutation({
    mutationFn: async (bookingData: BookingData) => {
      const response = await apiRequest('POST', '/api/service-booking', {
        ...bookingData,
        serviceType: 'Furnace Installation'
      });
      return response.json();
    }
  });

  const updatePrice = (furnaceType: string, homeSize: string, urgency: string) => {
    const basePrice = furnaceTypes.find(f => f.value === furnaceType)?.price || 150;
    const sizeMultiplier = homeSizes.find(s => s.value === homeSize)?.multiplier || 1.0;
    const urgencyMultiplier = urgency === 'emergency' ? 1.5 : urgency === 'priority' ? 1.2 : 1.0;
    
    const finalPrice = Math.round(basePrice * sizeMultiplier * urgencyMultiplier);
    setBooking(prev => ({ ...prev, price: finalPrice }));
  };

  const handleInputChange = (field: keyof BookingData, value: string) => {
    setBooking(prev => {
      const updated = { ...prev, [field]: value };
      
      if (field === 'furnaceType' || field === 'homeSize' || field === 'urgency') {
        updatePrice(
          field === 'furnaceType' ? value : updated.furnaceType,
          field === 'homeSize' ? value : updated.homeSize,
          field === 'urgency' ? value : updated.urgency
        );
      }
      
      return updated;
    });
  };

  const handleContinueToPayment = () => {
    if (!booking.customerName || !booking.email || !booking.phone || !booking.address || !booking.furnaceType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    setStep('payment');
  };

  const handlePayment = async () => {
    try {
      await submitBooking.mutateAsync(booking);
      
      const calendarUrl = `https://calendar.app.google/NXZB4v1PP57HhARL7?text=Furnace Installation - ${booking.customerName}&details=Service: Furnace Installation%0ACustomer: ${booking.customerName}%0APhone: ${booking.phone}%0AAddress: ${booking.address}%0AType: ${booking.furnaceType}%0ASpecial Requirements: ${booking.specialRequirements}`;
      window.open(calendarUrl, '_blank');
      
      setStep('confirmation');
      
      toast({
        title: "Booking Confirmed!",
        description: "Calendar invitation opened and email notification sent"
      });
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Please try again or contact us directly",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Furnace Installation Service | AfterHours HVAC</title>
        <meta name="description" content="Professional furnace installation service. Book online for expert HVAC installation." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Flame className="h-10 w-10 text-orange-400" />
              Furnace Installation Service
            </h1>
            <p className="text-xl text-slate-300">Professional furnace installation with warranty</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {step === 'details' && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Service Details</CardTitle>
                  <CardDescription>Tell us about your furnace installation needs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName">Full Name *</Label>
                      <Input
                        id="customerName"
                        value={booking.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                        className="bg-slate-900 border-slate-600"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={booking.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="bg-slate-900 border-slate-600"
                        placeholder="(403) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={booking.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="bg-slate-900 border-slate-600"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Service Address *</Label>
                      <Input
                        id="address"
                        value={booking.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="bg-slate-900 border-slate-600"
                        placeholder="Full address including postal code"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="furnaceType">Furnace Type *</Label>
                      <Select value={booking.furnaceType} onValueChange={(value) => handleInputChange('furnaceType', value)}>
                        <SelectTrigger className="bg-slate-900 border-slate-600">
                          <SelectValue placeholder="Select furnace type" />
                        </SelectTrigger>
                        <SelectContent>
                          {furnaceTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label} - ${type.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="homeSize">Home Size</Label>
                      <Select value={booking.homeSize} onValueChange={(value) => handleInputChange('homeSize', value)}>
                        <SelectTrigger className="bg-slate-900 border-slate-600">
                          <SelectValue placeholder="Select home size" />
                        </SelectTrigger>
                        <SelectContent>
                          {homeSizes.map(size => (
                            <SelectItem key={size.value} value={size.value}>
                              {size.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="urgency">Service Priority</Label>
                      <Select value={booking.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                        <SelectTrigger className="bg-slate-900 border-slate-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard (5-7 days)</SelectItem>
                          <SelectItem value="priority">Priority (2-3 days) +20%</SelectItem>
                          <SelectItem value="emergency">Emergency (24 hrs) +50%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="preferredDate">Preferred Date</Label>
                      <Input
                        id="preferredDate"
                        type="date"
                        value={booking.preferredDate}
                        onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                        className="bg-slate-900 border-slate-600"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label htmlFor="timeSlot">Preferred Time</Label>
                      <Select value={booking.timeSlot} onValueChange={(value) => handleInputChange('timeSlot', value)}>
                        <SelectTrigger className="bg-slate-900 border-slate-600">
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map(slot => (
                            <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="specialRequirements">Special Requirements</Label>
                    <Textarea
                      id="specialRequirements"
                      value={booking.specialRequirements}
                      onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                      className="bg-slate-900 border-slate-600"
                      placeholder="Any special requirements, access instructions, or notes..."
                      rows={3}
                    />
                  </div>

                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-white">Service Fee:</span>
                      <span className="text-2xl font-bold text-green-400">${booking.price}</span>
                    </div>
                    <p className="text-sm text-slate-400 mt-2">
                      Covers assessment, diagnosis, and service call. Additional parts and labor quoted separately.
                    </p>
                  </div>

                  <Button 
                    onClick={handleContinueToPayment}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    size="lg"
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Continue to Payment - ${booking.price}
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 'payment' && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Confirm & Schedule</CardTitle>
                  <CardDescription>Review details and complete booking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                    <h3 className="font-semibold text-white mb-4">Service Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Customer:</span>
                        <span className="text-white">{booking.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Service:</span>
                        <span className="text-white">Furnace Installation</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Type:</span>
                        <span className="text-white">{furnaceTypes.find(f => f.value === booking.furnaceType)?.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Address:</span>
                        <span className="text-white">{booking.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Preferred Date:</span>
                        <span className="text-white">{booking.preferredDate || 'Flexible'}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg border-t border-slate-600 pt-2 mt-2">
                        <span className="text-white">Total:</span>
                        <span className="text-green-400">${booking.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-700">
                    <h4 className="font-semibold text-blue-400 mb-2">What happens next?</h4>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>• Google Calendar appointment will open for scheduling</li>
                      <li>• You'll receive email confirmation with details</li>
                      <li>• Our technician will contact you 24hrs before service</li>
                      <li>• Payment will be collected at time of service</li>
                    </ul>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      onClick={() => setStep('details')}
                      variant="outline"
                      className="flex-1"
                    >
                      Back to Details
                    </Button>
                    <Button 
                      onClick={handlePayment}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={submitBooking.isPending}
                    >
                      {submitBooking.isPending ? (
                        <>Booking...</>
                      ) : (
                        <>
                          <Calendar className="h-5 w-5 mr-2" />
                          Book Service
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 'confirmation' && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-center">Booking Confirmed!</CardTitle>
                  <CardDescription className="text-center">Your furnace installation has been scheduled</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-center">
                  <div className="bg-green-900/20 p-6 rounded-lg border border-green-700">
                    <div className="text-green-400 text-6xl mb-4">✓</div>
                    <h3 className="text-2xl font-semibold text-white mb-2">Service Booked Successfully</h3>
                    <p className="text-slate-300">
                      Calendar appointment created and email confirmation sent.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    <div className="bg-slate-900/50 p-4 rounded-lg">
                      <User className="h-8 w-8 text-blue-400 mb-2" />
                      <h4 className="font-semibold text-white">Contact</h4>
                      <p className="text-sm text-slate-300">{booking.customerName}</p>
                      <p className="text-sm text-slate-300">{booking.phone}</p>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-lg">
                      <MapPin className="h-8 w-8 text-blue-400 mb-2" />
                      <h4 className="font-semibold text-white">Location</h4>
                      <p className="text-sm text-slate-300">{booking.address}</p>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-lg">
                      <Flame className="h-8 w-8 text-blue-400 mb-2" />
                      <h4 className="font-semibold text-white">Service</h4>
                      <p className="text-sm text-slate-300">Furnace Installation</p>
                      <p className="text-sm text-green-400">${booking.price} Service Fee</p>
                    </div>
                  </div>

                  <div className="text-slate-400 text-sm">
                    <p>A technician will contact you 24 hours before the scheduled appointment.</p>
                    <p>For questions, call us at <a href="tel:4036136014" className="text-blue-400">(403) 613-6014</a></p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FurnaceInstall;