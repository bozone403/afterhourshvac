import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from 'react-helmet-async';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  MessageSquare, 
  AlertTriangle, 
  FileText, 
  TrendingUp, 
  DollarSign,
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import type { 
  ContactSubmission, 
  EmergencyRequest, 
  QuoteRequest, 
  User,
  Customer,
  PageView,
  CalculatorUsage,
  SystemMetric
} from "@shared/schema";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("7d");

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <>
        <Helmet>
          <title>Access Denied - AfterHours HVAC</title>
        </Helmet>
        <div className="container mx-auto py-24 px-4 min-h-screen">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6">Access Denied</h1>
            <Card>
              <CardHeader>
                <CardTitle>Admin Access Required</CardTitle>
                <CardDescription>
                  You need administrator privileges to access this dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This area is restricted to authorized administrators only.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  // Fetch dashboard data
  const { data: dashboardStats } = useQuery({
    queryKey: ["/api/admin/dashboard-stats", dateRange],
    queryFn: async () => {
      const res = await fetch(`/api/admin/dashboard-stats?range=${dateRange}`);
      return res.json();
    },
  });

  const { data: contactSubmissions } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/admin/contact-submissions", statusFilter],
    queryFn: async () => {
      const res = await fetch(`/api/admin/contact-submissions?status=${statusFilter}`);
      return res.json();
    },
  });

  const { data: emergencyRequests } = useQuery<EmergencyRequest[]>({
    queryKey: ["/api/admin/emergency-requests"],
    queryFn: async () => {
      const res = await fetch("/api/admin/emergency-requests");
      return res.json();
    },
  });

  const { data: quoteRequests } = useQuery<QuoteRequest[]>({
    queryKey: ["/api/admin/quote-requests", statusFilter],
    queryFn: async () => {
      const res = await fetch(`/api/admin/quote-requests?status=${statusFilter}`);
      return res.json();
    },
  });

  const { data: analyticsData } = useQuery({
    queryKey: ["/api/admin/analytics", dateRange],
    queryFn: async () => {
      const res = await fetch(`/api/admin/analytics?range=${dateRange}`);
      return res.json();
    },
  });

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - AfterHours HVAC</title>
        <meta name="description" content="Administrative dashboard for managing customer inquiries, analytics, and business operations." />
      </Helmet>
      
      <div className="container mx-auto py-24 px-4 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage customer inquiries and view business analytics</p>
            </div>
            <div className="flex gap-2">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last Day</SelectItem>
                  <SelectItem value="7d">Last Week</SelectItem>
                  <SelectItem value="30d">Last Month</SelectItem>
                  <SelectItem value="90d">Last Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dashboard Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats?.totalInquiries || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +{dashboardStats?.inquiriesGrowth || 0}% from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Emergency Requests</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats?.emergencyRequests || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardStats?.pendingEmergencies || 0} pending
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quote Requests</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats?.quoteRequests || 0}</div>
                <p className="text-xs text-muted-foreground">
                  ${dashboardStats?.totalQuoteValue || 0} in pending quotes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pro Calculator Usage</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats?.calculatorUsage || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardStats?.calculatorConversion || 0}% conversion rate
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="blog">Blog</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="emergency">Emergency</TabsTrigger>
              <TabsTrigger value="quotes">Quotes</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest customer interactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardStats?.recentActivity?.map((activity: any, index: number) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="p-2 bg-primary/10 rounded-full">
                            {activity.type === 'contact' && <MessageSquare className="h-4 w-4" />}
                            {activity.type === 'emergency' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                            {activity.type === 'quote' && <FileText className="h-4 w-4" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">{activity.description}</p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>Key business indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average Response Time</span>
                        <span className="font-medium">{dashboardStats?.avgResponseTime || '0h'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Customer Satisfaction</span>
                        <span className="font-medium">{dashboardStats?.satisfactionRate || '0%'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Quote Conversion Rate</span>
                        <span className="font-medium">{dashboardStats?.quoteConversion || '0%'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Revenue This Month</span>
                        <span className="font-medium">${dashboardStats?.monthlyRevenue || '0'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="content" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Google Reviews Carousel</CardTitle>
                    <CardDescription>Manage customer reviews displayed on homepage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full mb-4">Add New Review</Button>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <strong>Jordan M.</strong>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">Edit</Button>
                            <Button size="sm" variant="destructive">Delete</Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">⭐⭐⭐⭐⭐</p>
                        <p className="text-sm">Excellent service and professional installation...</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Service Area Banner</CardTitle>
                    <CardDescription>Manage rotating cities in service area</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full mb-4">Add New City</Button>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 bg-muted rounded">Calgary</div>
                      <div className="p-2 bg-muted rounded">Edmonton</div>
                      <div className="p-2 bg-muted rounded">Red Deer</div>
                      <div className="p-2 bg-muted rounded">Lethbridge</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Project Gallery Management</CardTitle>
                      <CardDescription>Manage before/after project photos in carousel</CardDescription>
                    </div>
                    <Button>Add New Project</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="border rounded-lg p-4">
                        <img src="https://via.placeholder.com/300x200" alt="Project" className="w-full h-32 object-cover rounded mb-2" />
                        <h4 className="font-semibold">High-Efficiency Furnace Upgrade</h4>
                        <p className="text-sm text-muted-foreground">Coaldale, AB • Residential</p>
                        <div className="flex space-x-2 mt-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="destructive">Delete</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="blog" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Blog Post Management</CardTitle>
                      <CardDescription>Create and manage blog articles</CardDescription>
                    </div>
                    <Button>Create New Post</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">Winter HVAC Maintenance Tips</h4>
                          <p className="text-sm text-muted-foreground">Published • December 15, 2024</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="destructive">Delete</Button>
                        </div>
                      </div>
                      <p className="text-sm">Essential maintenance tips to keep your HVAC system running efficiently during Alberta winters...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Contact Form Submissions</CardTitle>
                      <CardDescription>Manage customer inquiries</CardDescription>
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contactSubmissions?.map((submission) => (
                      <Card key={submission.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">{submission.name}</h4>
                              <p className="text-sm text-muted-foreground">{submission.subject}</p>
                            </div>
                            <Badge variant={
                              submission.status === 'new' ? 'default' :
                              submission.status === 'in_progress' ? 'secondary' :
                              submission.status === 'completed' ? 'outline' : 'destructive'
                            }>
                              {submission.status}
                            </Badge>
                          </div>
                          <p className="text-sm mb-3">{submission.message}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {submission.email}
                            </div>
                            {submission.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {submission.phone}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {submission.createdAt ? formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true }) : 'Unknown time'}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="emergency" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Service Requests</CardTitle>
                  <CardDescription>Urgent HVAC service calls</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {emergencyRequests?.map((request) => (
                      <Card key={request.id} className="border-l-4 border-l-red-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">{request.name}</h4>
                              <p className="text-sm font-medium text-red-600">{request.emergencyType}</p>
                            </div>
                            <Badge variant={
                              request.status === 'received' ? 'destructive' :
                              request.status === 'dispatched' ? 'secondary' :
                              request.status === 'in_progress' ? 'default' :
                              'outline'
                            }>
                              {request.status}
                            </Badge>
                          </div>
                          <p className="text-sm mb-3">{request.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {request.phone}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {request.address}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {request.createdAt ? formatDistanceToNow(new Date(request.createdAt), { addSuffix: true }) : 'Unknown time'}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quotes" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quote Requests</CardTitle>
                  <CardDescription>Customer quote requests and proposals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {quoteRequests?.map((quote) => (
                      <Card key={quote.id} className="border-l-4 border-l-green-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">{quote.name}</h4>
                              <p className="text-sm text-muted-foreground">{quote.serviceType} - {quote.systemType}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant={
                                quote.status === 'pending' ? 'default' :
                                quote.status === 'quoted' ? 'secondary' :
                                quote.status === 'approved' ? 'outline' :
                                'destructive'
                              }>
                                {quote.status}
                              </Badge>
                              {quote.quoteAmount && (
                                <p className="text-sm font-semibold mt-1">${quote.quoteAmount}</p>
                              )}
                            </div>
                          </div>
                          {quote.description && (
                            <p className="text-sm mb-3">{quote.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {quote.email}
                            </div>
                            {quote.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {quote.phone}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {quote.createdAt ? formatDistanceToNow(new Date(quote.createdAt), { addSuffix: true }) : 'Unknown time'}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Website Traffic</CardTitle>
                    <CardDescription>Page views and user engagement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Page Views</span>
                        <span className="font-medium">{analyticsData?.pageViews || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Unique Visitors</span>
                        <span className="font-medium">{analyticsData?.uniqueVisitors || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average Session Duration</span>
                        <span className="font-medium">{analyticsData?.avgSessionDuration || '0m'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Bounce Rate</span>
                        <span className="font-medium">{analyticsData?.bounceRate || '0%'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Calculator Analytics</CardTitle>
                    <CardDescription>Pro Calculator usage statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Calculations</span>
                        <span className="font-medium">{analyticsData?.totalCalculations || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Completed Calculations</span>
                        <span className="font-medium">{analyticsData?.completedCalculations || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Most Popular Calculator</span>
                        <span className="font-medium">{analyticsData?.popularCalculator || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Conversion to Quote</span>
                        <span className="font-medium">{analyticsData?.calculatorToQuote || '0%'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}