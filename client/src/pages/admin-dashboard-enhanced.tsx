import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  ImageIcon,
  Camera,
  Upload,
  Save,
  Eye,
  Briefcase
} from "lucide-react";

type DashboardStats = {
  totalInquiries: number;
  emergencyRequests: number;
  pendingQuotes: number;
  completedJobs: number;
  revenue: number;
  activeUsers: number;
};

type ContactSubmission = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  createdAt: string;
};

type GalleryImage = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  isActive: boolean;
  createdAt: string;
};

type ForumTopic = {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  replies: number;
  category: string;
};

export default function AdminDashboardEnhanced() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState("overview");


  // Check admin access
  if (!user || user.role !== 'admin' || user.username !== 'JordanBoz') {
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
  const { data: dashboardStats } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/dashboard-stats"],
  });

  const { data: contactSubmissions = [] } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/admin/contact-submissions"],
  });



  const { data: forumTopics = [] } = useQuery<ForumTopic[]>({
    queryKey: ["/api/forum/topics"],
  });

  const { data: schedules = [] } = useQuery({
    queryKey: ['/api/schedules'],
  });

  const { data: allQuotes = [] } = useQuery({
    queryKey: ['/api/admin/quotes'],
  });

  const jobApplicationsQuery = useQuery({
    queryKey: ['/api/admin/job-applications'],
  });

  // Delete forum topic mutation
  const deleteTopicMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/forum/topics/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forum/topics'] });
      toast({ title: "Success", description: "Forum topic deleted" });
    },
  });

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - AfterHours HVAC</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">Admin Dashboard</h1>
            <p className="text-xl text-gray-600">
              Manage your HVAC business website content and customer interactions
            </p>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-7 bg-white border border-gray-200">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Overview</TabsTrigger>
              <TabsTrigger value="quotes" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Quotes</TabsTrigger>
              <TabsTrigger value="calendar" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Calendar</TabsTrigger>
              <TabsTrigger value="jobs" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Job Applications</TabsTrigger>
              <TabsTrigger value="forum" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Forum</TabsTrigger>
              <TabsTrigger value="customers" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Customers</TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Analytics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-900">Total Inquiries</CardTitle>
                    <Mail className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{dashboardStats?.totalInquiries || 0}</div>
                    <p className="text-xs text-gray-600">Customer contacts</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-900">Emergency Requests</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{dashboardStats?.emergencyRequests || 0}</div>
                    <p className="text-xs text-gray-600">Urgent service calls</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-900">Pending Quotes</CardTitle>
                    <FileText className="h-4 w-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{dashboardStats?.pendingQuotes || 0}</div>
                    <p className="text-xs text-gray-600">Awaiting response</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-900">Active Users</CardTitle>
                    <Users className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{dashboardStats?.activeUsers || 0}</div>
                    <p className="text-xs text-gray-600">Registered users</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Recent Customer Inquiries</CardTitle>
                  <CardDescription className="text-gray-600">Latest contact form submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  {contactSubmissions.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No recent inquiries</p>
                  ) : (
                    <div className="space-y-4">
                      {contactSubmissions.slice(0, 5).map((submission) => (
                        <div key={submission.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                          <div>
                            <div className="font-medium text-gray-900">{submission.name}</div>
                            <div className="text-sm text-gray-600">{submission.email}</div>
                            <div className="text-sm text-gray-500">{submission.message.substring(0, 100)}...</div>
                          </div>
                          <div className="text-right">
                            <Badge variant={submission.status === 'pending' ? 'destructive' : 'default'}>
                              {submission.status}
                            </Badge>
                            <div className="text-xs text-slate-400 mt-1">
                              {new Date(submission.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Quotes Tab */}
            <TabsContent value="quotes" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Business Quotes Management</h2>
                <Badge className="bg-blue-100 text-blue-800">
                  {Array.isArray(allQuotes) ? allQuotes.length : 0} Total Quotes
                </Badge>
              </div>

              <div className="grid gap-6">
                {Array.isArray(allQuotes) && allQuotes.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Quotes Yet</h3>
                      <p className="text-gray-600">Customer quotes will appear here when created through the enhanced quote builder.</p>
                    </CardContent>
                  </Card>
                ) : Array.isArray(allQuotes) ? (
                  allQuotes.map((quote: any) => (
                    <Card key={quote.id} className="border border-gray-200">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg text-gray-900">
                              Quote #{quote.quoteNumber}
                            </CardTitle>
                            <CardDescription className="text-gray-600">
                              {quote.customerName} • {quote.customerEmail}
                            </CardDescription>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              className={
                                quote.status === 'completed' ? 'bg-green-100 text-green-800' :
                                quote.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                                quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }
                            >
                              {quote.status}
                            </Badge>
                            <span className="text-xl font-bold text-orange-600">
                              ${quote.totalCost?.toLocaleString() || '0'}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Address</p>
                            <p className="font-medium text-gray-900">{quote.serviceAddress}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="font-medium text-gray-900">{quote.customerPhone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Created</p>
                            <p className="font-medium text-gray-900">
                              {new Date(quote.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        {quote.equipmentDetails && (
                          <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Equipment Details</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {Object.entries(quote.equipmentDetails).map(([key, value]) => (
                                <div key={key}>
                                  <span className="text-gray-600">{key}:</span>
                                  <span className="ml-2 text-gray-900">{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                          <div className="text-sm text-gray-600">
                            Labor: ${quote.laborCost?.toLocaleString() || '0'} • 
                            Materials: ${quote.materialCost?.toLocaleString() || '0'}
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                            <Button variant="outline" size="sm">
                              <Phone className="h-4 w-4 mr-1" />
                              Contact Customer
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : null}
              </div>
            </TabsContent>

            {/* Calendar Tab */}
            <TabsContent value="calendar" className="space-y-6">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Scheduled Jobs Calendar
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    All upcoming installations and maintenance appointments from completed payments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {Array.isArray(schedules) && schedules.length > 0 ? (
                    <div className="space-y-4">
                      {schedules.map((schedule: any) => {
                        const scheduleDate = new Date(schedule.scheduledDate);
                        const borderColor = schedule.jobType === 'installation' ? 'border-l-orange-500' : 
                                          schedule.jobType === 'maintenance' ? 'border-l-blue-500' : 'border-l-green-500';
                        
                        return (
                          <div key={schedule.id} className={`border-l-4 ${borderColor} pl-4 p-4 bg-gray-50 rounded-lg`}>
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-gray-900 capitalize">
                                  {schedule.serviceType} {schedule.jobType}
                                </h4>
                                <p className="text-sm text-gray-600">{schedule.customerName}</p>
                                <p className="text-xs text-gray-500">{schedule.customerEmail}</p>
                              </div>
                              <div className="text-right">
                                <Badge variant={schedule.status === 'completed' ? 'default' : 'secondary'}>
                                  {schedule.status}
                                </Badge>
                                <p className="text-sm font-medium text-gray-900 mt-1">
                                  {scheduleDate.toLocaleDateString('en-US', { 
                                    weekday: 'long',
                                    month: 'short', 
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {schedule.startTime} - {schedule.endTime}
                                </p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                              <div>
                                <p className="text-sm text-gray-600">
                                  <strong>Address:</strong> {schedule.address}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <strong>Phone:</strong> {schedule.customerPhone}
                                </p>
                                {schedule.quoteId && (
                                  <p className="text-sm text-gray-600">
                                    <strong>Quote:</strong> AH-{schedule.quoteId}
                                  </p>
                                )}
                              </div>
                              <div>
                                {schedule.notes && (
                                  <p className="text-sm text-gray-600">
                                    <strong>Notes:</strong> {schedule.notes}
                                  </p>
                                )}
                                {schedule.estimatedDuration && (
                                  <p className="text-sm text-gray-600">
                                    <strong>Duration:</strong> {schedule.estimatedDuration} hours
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Scheduled Jobs</h3>
                      <p className="text-gray-600">
                        Jobs will appear here automatically when customers complete payments for quotes
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Job Applications Management Tab */}
            <TabsContent value="jobs" className="space-y-6">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    Job Applications Management
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Review and manage job applications submitted through the careers page
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {jobApplicationsQuery.isLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading job applications...</p>
                    </div>
                  ) : Array.isArray(jobApplicationsQuery.data) && jobApplicationsQuery.data.length > 0 ? (
                    <div className="space-y-4">
                      {jobApplicationsQuery.data.map((application: any) => (
                        <div key={application.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{application.fullName}</h3>
                              <p className="text-sm text-gray-600">{application.email}</p>
                              <p className="text-sm text-gray-600">{application.phone}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant={application.status === 'pending' ? 'secondary' : 'default'}>
                                {application.status || 'pending'}
                              </Badge>
                              <p className="text-xs text-gray-500 mt-1">
                                Applied: {new Date(application.createdAt || Date.now()).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">
                                <strong>Position:</strong> {application.position}
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>Experience:</strong> {application.yearsExperience} years
                              </p>
                              {application.currentEmployer && (
                                <p className="text-sm text-gray-600">
                                  <strong>Current Employer:</strong> {application.currentEmployer}
                                </p>
                              )}
                            </div>
                            <div>
                              {application.expectedSalary && (
                                <p className="text-sm text-gray-600">
                                  <strong>Expected Salary:</strong> ${application.expectedSalary}
                                </p>
                              )}
                              {application.availability && (
                                <p className="text-sm text-gray-600">
                                  <strong>Availability:</strong> {application.availability}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {application.coverLetter && (
                            <div className="mb-4">
                              <p className="text-sm font-medium text-gray-900 mb-2">Cover Letter:</p>
                              <p className="text-sm text-gray-700 bg-white p-3 rounded border">
                                {application.coverLetter}
                              </p>
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-2">
                            {application.resumeUrl && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer">
                                  <FileText className="h-4 w-4 mr-1" />
                                  View Resume
                                </a>
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              <Mail className="h-4 w-4 mr-1" />
                              Contact Applicant
                            </Button>
                            <Button variant="outline" size="sm">
                              <Phone className="h-4 w-4 mr-1" />
                              Schedule Interview
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Job Applications</h3>
                      <p className="text-gray-600">
                        Job applications will appear here when candidates apply through the careers page
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Forum Management Tab */}
            <TabsContent value="forum" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Forum Topic Management</CardTitle>
                  <CardDescription>Moderate forum discussions and posts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {forumTopics.map((topic) => (
                      <div key={topic.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-white">{topic.title}</h4>
                          <p className="text-sm text-slate-300">{topic.content.substring(0, 150)}...</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-slate-400">By {topic.author}</span>
                            <span className="text-xs text-slate-400">{topic.replies} replies</span>
                            <Badge variant="outline">{topic.category}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => deleteTopicMutation.mutate(topic.id)}
                            disabled={deleteTopicMutation.isPending}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Customers Tab */}
            <TabsContent value="customers" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Customer Inquiries</CardTitle>
                  <CardDescription>Manage customer contact form submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contactSubmissions.map((submission) => (
                      <div key={submission.id} className="p-4 bg-slate-900/50 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-white">{submission.name}</h4>
                            <div className="flex items-center gap-4 text-sm text-slate-300">
                              <span><Mail className="h-3 w-3 inline mr-1" />{submission.email}</span>
                              <span><Phone className="h-3 w-3 inline mr-1" />{submission.phone}</span>
                            </div>
                          </div>
                          <Badge variant={submission.status === 'pending' ? 'destructive' : 'default'}>
                            {submission.status}
                          </Badge>
                        </div>
                        <p className="text-slate-300 mb-3">{submission.message}</p>
                        <div className="text-xs text-slate-400">
                          Submitted {new Date(submission.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Business Analytics</CardTitle>
                  <CardDescription>Track website performance and business metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center p-6 bg-slate-900/50 rounded-lg">
                      <Briefcase className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">
                        {Array.isArray(jobApplicationsQuery.data) ? jobApplicationsQuery.data.length : 0}
                      </div>
                      <p className="text-slate-400">Job Applications</p>
                    </div>
                    <div className="text-center p-6 bg-slate-900/50 rounded-lg">
                      <MessageSquare className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">
                        {Array.isArray(forumTopics) ? forumTopics.length : 0}
                      </div>
                      <p className="text-slate-400">Forum Topics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}