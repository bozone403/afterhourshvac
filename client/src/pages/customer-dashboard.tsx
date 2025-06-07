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
  AlertCircle
} from 'lucide-react';
import { Link } from 'wouter';

const CustomerDashboard = () => {
  const { user } = useAuth();

  const { data: customerData, isLoading } = useQuery({
    queryKey: ['/api/customer/profile'],
    enabled: !!user,
  });

  const { data: quotes } = useQuery({
    queryKey: ['/api/customer/quotes'],
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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="quotes">Quotes</TabsTrigger>
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
                <Link href="/contact">
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    Request New Quote
                  </Button>
                </Link>
              </div>
              
              <div className="grid gap-6">
                {Array.isArray(quotes) && quotes.length > 0 ? quotes.map((quote: any, index: number) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-gray-900">
                          Quote #{quote.id}
                        </CardTitle>
                        <Badge variant={quote.status === 'approved' ? 'default' : 'secondary'}>
                          {quote.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        {quote.description} • Created {new Date(quote.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold text-gray-900">
                          ${quote.amount?.toLocaleString()}
                        </div>
                        {quote.status === 'pending' && (
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            Accept Quote
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No quotes yet</p>
                      <Link href="/contact">
                        <Button className="mt-4 bg-orange-600 hover:bg-orange-700">
                          Request Your First Quote
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
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