import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  CreditCard, 
  FileText, 
  Calendar, 
  Wrench, 
  Crown,
  Settings,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Home,
  Phone,
  MapPin,
  Star,
  TrendingUp,
  Shield,
  Thermometer
} from 'lucide-react';
import { Link } from 'wouter';

const CustomerDashboard = () => {
  const { user } = useAuth();

  const { data: customerData, isLoading } = useQuery({
    queryKey: ['/api/customer/profile'],
    enabled: !!user,
  });

  const { data: quotes } = useQuery({
    queryKey: ['/api/quotes'],
    enabled: !!user,
  });

  const { data: payments } = useQuery({
    queryKey: ['/api/customer/payments'],
    enabled: !!user,
  });

  const { data: maintenancePlans } = useQuery({
    queryKey: ['/api/customer/maintenance-plans'],
    enabled: !!user,
  });

  const { data: serviceHistory } = useQuery({
    queryKey: ['/api/customer/service-history'],
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900">Access Restricted</CardTitle>
            <CardDescription>Please log in to view your customer dashboard</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/auth">
              <Button className="bg-orange-600 hover:bg-orange-700">
                Log In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Customer Dashboard | AfterHours HVAC</title>
        <meta name="description" content="Manage your HVAC services, quotes, payments, and maintenance plans with AfterHours HVAC." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="container mx-auto px-4 py-8">
          
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.username}!
            </h1>
            <p className="text-gray-600">
              Manage your HVAC services, quotes, and account settings
            </p>
          </div>

          {/* Membership Status */}
          {user.hasPro && (
            <Card className="mb-8 border-orange-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Crown className="h-6 w-6 text-orange-600 mr-2" />
                    <CardTitle className="text-lg text-gray-900">Pro Membership Active</CardTitle>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">Pro</Badge>
                </div>
                <CardDescription>
                  You have access to all professional HVAC calculation tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/pro-calculator">
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    Access Pro Tools
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Dashboard Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="quotes">Quotes</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Active Quotes
                    </CardTitle>
                    <FileText className="h-4 w-4 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                      {Array.isArray(quotes) ? quotes.length : 0}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Total Spent
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                      ${Array.isArray(payments) ? payments.reduce((sum: number, p: any) => sum + p.amount, 0).toLocaleString() : '0'}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Service Calls
                    </CardTitle>
                    <Wrench className="h-4 w-4 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                      {Array.isArray(serviceHistory) ? serviceHistory.length : 0}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Maintenance Plans
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                      {Array.isArray(maintenancePlans) ? maintenancePlans.length : 0}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.isArray(serviceHistory) && serviceHistory.length > 0 ? (
                      serviceHistory.slice(0, 5).map((service: any, index: number) => (
                        <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-2">
                          <div className="flex items-center">
                            <Wrench className="h-4 w-4 text-orange-600 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{service.description}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(service.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant={service.status === 'completed' ? 'default' : 'secondary'}>
                            {service.status}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No recent activity</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Quotes Tab */}
            <TabsContent value="quotes" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Your Quotes</h2>
                <div className="flex gap-2">
                  <Link href="/calculators/enhanced-quote-builder">
                    <Button className="bg-orange-600 hover:bg-orange-700">
                      Create Quote
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline">
                      Request Quote
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="grid gap-6">
                {Array.isArray(quotes) && quotes.length > 0 ? quotes.map((quote: any) => (
                  <Card key={quote.id} className="border-l-4 border-l-orange-500">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-gray-900">
                          Quote {quote.quoteNumber}
                        </CardTitle>
                        <Badge variant={quote.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                          {quote.paymentStatus}
                        </Badge>
                      </div>
                      <CardDescription>
                        {quote.customerName} • {quote.jobDescription}
                      </CardDescription>
                      <div className="text-sm text-gray-500">
                        Created {new Date(quote.createdAt).toLocaleDateString()}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Customer</p>
                          <p className="font-medium">{quote.customerName}</p>
                          <p className="text-sm text-gray-500">{quote.customerEmail}</p>
                          {quote.customerPhone && (
                            <p className="text-sm text-gray-500">{quote.customerPhone}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Project Details</p>
                          <p className="font-medium">{quote.laborHours}h @ ${quote.laborRate}/hr</p>
                          <p className="text-sm text-gray-500">Markup: {quote.markupPercentage}%</p>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-2xl font-bold text-gray-900">
                              ${parseFloat(quote.total).toLocaleString('en-CA', { minimumFractionDigits: 2 })}
                            </div>
                            {quote.depositAmount && (
                              <div className="text-sm text-green-600">
                                Deposit: ${parseFloat(quote.depositAmount).toLocaleString('en-CA', { minimumFractionDigits: 2 })}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {quote.paymentStatus === 'pending' && (
                              <Button 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => {
                                  // Create payment intent for this quote
                                  const amount = quote.depositAmount || quote.total;
                                  const isDeposit = !!quote.depositAmount;
                                  
                                  fetch('/api/create-payment-intent', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      amount: parseFloat(amount),
                                      quoteNumber: quote.quoteNumber,
                                      customerInfo: {
                                        name: quote.customerName,
                                        email: quote.customerEmail
                                      },
                                      isDeposit
                                    })
                                  })
                                  .then(res => res.json())
                                  .then(data => {
                                    window.open(`/checkout?client_secret=${data.clientSecret}`, '_blank');
                                  });
                                }}
                              >
                                {quote.depositAmount ? 'Pay Deposit' : 'Pay Full Amount'}
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No quotes yet</p>
                      <div className="flex gap-2 justify-center mt-4">
                        <Link href="/calculators/enhanced-quote-builder">
                          <Button className="bg-orange-600 hover:bg-orange-700">
                            Create Your First Quote
                          </Button>
                        </Link>
                        <Link href="/contact">
                          <Button variant="outline">
                            Request Quote
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Calendar Tab */}
            <TabsContent value="calendar" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Job Schedule & Calendar</h2>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Service
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar View */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        January 2025
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-7 gap-1 mb-4">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                            {day}
                          </div>
                        ))}
                        {Array.from({ length: 31 }, (_, i) => {
                          const day = i + 1;
                          const hasAppointment = [8, 15, 22, 29].includes(day);
                          const isToday = day === 8;
                          
                          return (
                            <div
                              key={day}
                              className={`
                                p-2 text-center text-sm border border-gray-100 cursor-pointer hover:bg-gray-50
                                ${isToday ? 'bg-orange-100 border-orange-300 text-orange-700' : ''}
                                ${hasAppointment ? 'bg-blue-50 border-blue-200' : ''}
                              `}
                            >
                              <div className="font-medium">{day}</div>
                              {hasAppointment && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Upcoming Jobs */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Upcoming Jobs</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="border-l-4 border-l-orange-500 pl-4">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-900">Furnace Installation</p>
                          <Badge>Jan 15</Badge>
                        </div>
                        <p className="text-sm text-gray-600">Quote AH-653575</p>
                        <p className="text-xs text-gray-500">9:00 AM - 3:00 PM</p>
                      </div>
                      
                      <div className="border-l-4 border-l-blue-500 pl-4">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-900">Maintenance Check</p>
                          <Badge variant="secondary">Jan 22</Badge>
                        </div>
                        <p className="text-sm text-gray-600">Annual Service Plan</p>
                        <p className="text-xs text-gray-500">10:00 AM - 12:00 PM</p>
                      </div>
                      
                      <div className="border-l-4 border-l-green-500 pl-4">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-900">AC Installation</p>
                          <Badge variant="outline">Jan 29</Badge>
                        </div>
                        <p className="text-sm text-gray-600">Summer Prep</p>
                        <p className="text-xs text-gray-500">8:00 AM - 4:00 PM</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Quick Actions */}
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Thermometer className="h-4 w-4 mr-2" />
                        Schedule Furnace Service
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Wrench className="h-4 w-4 mr-2" />
                        Book AC Maintenance
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Emergency Service
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Phone className="h-4 w-4 mr-2" />
                        Call for Quote
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Job Details for Selected Date */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Details - January 15, 2025</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Installation Details</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Job Type:</span> Furnace Installation</p>
                        <p><span className="font-medium">Quote:</span> AH-653575</p>
                        <p><span className="font-medium">Duration:</span> 6 hours (9:00 AM - 3:00 PM)</p>
                        <p><span className="font-medium">Technician:</span> Jordan B. & Team</p>
                        <p><span className="font-medium">Equipment:</span> High-Efficiency Gas Furnace</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Address:</span> 123 Main St, Calgary AB</p>
                        <p><span className="font-medium">Contact:</span> (403) 555-0123</p>
                        <p><span className="font-medium">Special Notes:</span> Customer will be home all day</p>
                        <p><span className="font-medium">Access:</span> Key available from office</p>
                        <p><span className="font-medium">Payment:</span> Deposit paid, balance on completion</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex gap-2">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Complete
                    </Button>
                    <Button variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Reschedule
                    </Button>
                    <Button variant="outline">
                      <Phone className="h-4 w-4 mr-2" />
                      Contact Customer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
              
              <div className="grid gap-4">
                {Array.isArray(payments) && payments.length > 0 ? payments.map((payment: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 text-blue-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">{payment.description}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(payment.date).toLocaleDateString()} • 
                            {payment.method}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">${payment.amount.toLocaleString()}</p>
                        <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                          {payment.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No payment history</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Maintenance Tab */}
            <TabsContent value="maintenance" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Maintenance Plans</h2>
                <Link href="/pricing">
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    View Plans
                  </Button>
                </Link>
              </div>
              
              <div className="grid gap-6">
                {Array.isArray(maintenancePlans) && maintenancePlans.length > 0 ? maintenancePlans.map((plan: any, index: number) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-gray-900">
                          {plan.name}
                        </CardTitle>
                        <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                          {plan.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        Next service: {new Date(plan.nextService).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Annual Cost</p>
                          <p className="text-xl font-bold text-gray-900">${plan.cost}</p>
                        </div>
                        <Button variant="outline">
                          Schedule Service
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No maintenance plans</p>
                      <Link href="/pricing">
                        <Button className="mt-4 bg-orange-600 hover:bg-orange-700">
                          Browse Plans
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Profile Information</CardTitle>
                  <CardDescription>
                    Update your account details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <input 
                        type="text" 
                        value={user.username} 
                        className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-900" 
                        readOnly 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input 
                        type="email" 
                        value={user.email || ''} 
                        className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-900" 
                        readOnly 
                      />
                    </div>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Update Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Membership Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Membership</CardTitle>
                  <CardDescription>
                    Manage your Pro membership and billing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {user.hasPro ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Crown className="h-5 w-5 text-orange-600 mr-2" />
                        <span className="font-medium text-gray-900">Pro Membership</span>
                      </div>
                      <Button variant="outline">
                        Manage Billing
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-600 mb-4">
                        Upgrade to Pro for advanced HVAC calculation tools
                      </p>
                      <Link href="/membership">
                        <Button className="bg-orange-600 hover:bg-orange-700">
                          Upgrade to Pro
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default CustomerDashboard;