import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Settings, 
  UserCheck,
  Briefcase,
  Download,
  Mail,
  Phone,
  Calendar,
  Search,
  Filter,
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JobApplication {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  coverLetter: string;
  resumeUrl?: string;
  status: 'pending' | 'reviewing' | 'interviewing' | 'hired' | 'rejected';
  appliedAt: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  userType: string;
  hasProAccess: boolean;
  createdAt: string;
  lastLogin: string;
}

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  submittedAt: string;
  status: 'new' | 'contacted' | 'resolved';
}

interface ServiceBooking {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceAddress: string;
  serviceType: string;
  bookingDate: string;
  bookingTime: string;
  status: string;
  notes?: string;
  amount: string;
  paymentStatus: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}

const AdminPanel = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("applications");
  const [applicationFilter, setApplicationFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch job applications
  const { data: applications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ["/api/admin/job-applications"],
  });

  // Fetch users for management
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  // Fetch consultation bookings
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["/api/admin/bookings"],
  });

  // Fetch contact submissions
  const { data: contacts = [], isLoading: contactsLoading } = useQuery({
    queryKey: ["/api/admin/contact-submissions"],
  });

  // Update application status
  const updateApplicationStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await apiRequest("PATCH", `/api/admin/job-applications/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/job-applications"] });
      toast({
        title: "Application Updated",
        description: "Application status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update application status.",
        variant: "destructive",
      });
    },
  });

  // Update user role/access
  const updateUserAccess = useMutation({
    mutationFn: async ({ userId, updates }: { userId: number; updates: any }) => {
      return await apiRequest("PATCH", `/api/admin/users/${userId}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "User Updated",
        description: "User access has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user access.",
        variant: "destructive",
      });
    },
  });

  const filteredApplications = applications.filter((app: JobApplication) => {
    const matchesFilter = applicationFilter === "all" || app.status === applicationFilter;
    const matchesSearch = 
      app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewing': return 'bg-blue-100 text-blue-800';
      case 'interviewing': return 'bg-purple-100 text-purple-800';
      case 'hired': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'reviewing': return <Eye className="h-4 w-4" />;
      case 'interviewing': return <MessageSquare className="h-4 w-4" />;
      case 'hired': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-red-100 border border-red-200 rounded-full px-6 py-3 mb-6">
            <Settings className="h-5 w-5 text-red-700 mr-3" />
            <span className="text-red-800 text-lg font-bold">Admin Panel</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">System Administration</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Manage job applications, user accounts, and system settings for AfterHours HVAC.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Job Applications
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Consultations
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Contact Forms
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              System Settings
            </TabsTrigger>
          </TabsList>

          {/* Job Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Job Applications Management
                </CardTitle>
                <CardDescription>
                  Review and manage job applications from the careers page
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters and Search */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search applications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={applicationFilter} onValueChange={setApplicationFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Applications</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewing">Under Review</SelectItem>
                      <SelectItem value="interviewing">Interviewing</SelectItem>
                      <SelectItem value="hired">Hired</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Applications List */}
                <div className="space-y-4">
                  {applicationsLoading ? (
                    <div className="text-center py-8">Loading applications...</div>
                  ) : filteredApplications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No applications found</div>
                  ) : (
                    filteredApplications.map((application: JobApplication) => (
                      <Card key={application.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold">
                                  {application.firstName} {application.lastName}
                                </h3>
                                <Badge className={`flex items-center gap-1 ${getStatusColor(application.status)}`}>
                                  {getStatusIcon(application.status)}
                                  {application.status}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Mail className="h-4 w-4" />
                                  {application.email}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Phone className="h-4 w-4" />
                                  {application.phone}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Briefcase className="h-4 w-4" />
                                  {application.position}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar className="h-4 w-4" />
                                  Applied: {new Date(application.appliedAt).toLocaleDateString()}
                                </div>
                              </div>

                              <div className="mb-4">
                                <h4 className="font-medium mb-2">Experience:</h4>
                                <p className="text-sm text-gray-600">{application.experience}</p>
                              </div>

                              {application.coverLetter && (
                                <div className="mb-4">
                                  <h4 className="font-medium mb-2">Cover Letter:</h4>
                                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                    {application.coverLetter}
                                  </p>
                                </div>
                              )}

                              <div className="flex gap-2">
                                {application.resumeUrl && (
                                  <Button variant="outline" size="sm">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Resume
                                  </Button>
                                )}
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => window.open(`mailto:${application.email}`, '_blank')}
                                >
                                  <Mail className="h-4 w-4 mr-2" />
                                  Email Candidate
                                </Button>
                              </div>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => updateApplicationStatus.mutate({ 
                                    id: application.id, 
                                    status: 'reviewing' 
                                  })}
                                >
                                  Mark as Reviewing
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => updateApplicationStatus.mutate({ 
                                    id: application.id, 
                                    status: 'interviewing' 
                                  })}
                                >
                                  Schedule Interview
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => updateApplicationStatus.mutate({ 
                                    id: application.id, 
                                    status: 'hired' 
                                  })}
                                >
                                  Mark as Hired
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => updateApplicationStatus.mutate({ 
                                    id: application.id, 
                                    status: 'rejected' 
                                  })}
                                >
                                  Reject Application
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Consultation Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Consultation Bookings
                </CardTitle>
                <CardDescription>
                  Manage commercial and residential consultation requests from customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookingsLoading ? (
                    <div className="text-center py-8">Loading consultation bookings...</div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No consultation bookings found</div>
                  ) : (
                    bookings.map((booking: ServiceBooking) => (
                      <Card key={booking.id} className="border-l-4 border-l-green-500">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold">
                                  {booking.customerName}
                                </h3>
                                <Badge className={`flex items-center gap-1 ${
                                  booking.serviceType === 'commercial_consultation' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {booking.serviceType === 'commercial_consultation' ? 'Commercial' : 'Residential'}
                                </Badge>
                                <Badge className={`${getStatusColor(booking.status)}`}>
                                  {booking.status}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Phone className="h-4 w-4" />
                                  {booking.customerPhone}
                                </div>
                                {booking.customerEmail && (
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Mail className="h-4 w-4" />
                                    {booking.customerEmail}
                                  </div>
                                )}
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(booking.bookingDate).toLocaleDateString()} at {booking.bookingTime}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <DollarSign className="h-4 w-4" />
                                  ${booking.amount}
                                </div>
                              </div>

                              <div className="mb-4">
                                <h4 className="font-medium mb-2">Service Address:</h4>
                                <p className="text-sm text-gray-600">{booking.serviceAddress}</p>
                              </div>

                              {booking.notes && (
                                <div className="mb-4">
                                  <h4 className="font-medium mb-2">Notes:</h4>
                                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                    {booking.notes}
                                  </p>
                                </div>
                              )}

                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => window.open(`tel:${booking.customerPhone}`, '_self')}
                                >
                                  <Phone className="h-4 w-4 mr-2" />
                                  Call Customer
                                </Button>
                                {booking.customerEmail && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => window.open(`mailto:${booking.customerEmail}`, '_blank')}
                                  >
                                    <Mail className="h-4 w-4 mr-2" />
                                    Email Customer
                                  </Button>
                                )}
                              </div>
                            </div>

                            <div className="ml-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      // Update booking status functionality
                                      console.log('Mark as confirmed:', booking.id);
                                    }}
                                  >
                                    Mark as Confirmed
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      // Update booking status functionality
                                      console.log('Mark as completed:', booking.id);
                                    }}
                                  >
                                    Mark as Completed
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      // Update booking status functionality
                                      console.log('Cancel booking:', booking.id);
                                    }}
                                  >
                                    Cancel Booking
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Account Management
                </CardTitle>
                <CardDescription>
                  Manage user accounts, roles, and Pro access permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {usersLoading ? (
                    <div className="text-center py-8">Loading users...</div>
                  ) : (
                    users.map((user: User) => (
                      <Card key={user.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold">{user.username}</h3>
                              <p className="text-sm text-gray-600">{user.email}</p>
                              <div className="flex gap-2 mt-2">
                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                  {user.role}
                                </Badge>
                                {user.hasProAccess && (
                                  <Badge variant="outline" className="bg-yellow-50">
                                    Pro Access
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateUserAccess.mutate({
                                  userId: user.id,
                                  updates: { hasProAccess: !user.hasProAccess }
                                })}
                              >
                                {user.hasProAccess ? 'Remove Pro' : 'Grant Pro'}
                              </Button>
                              {user.role !== 'admin' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateUserAccess.mutate({
                                    userId: user.id,
                                    updates: { role: 'admin' }
                                  })}
                                >
                                  Make Admin
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Forms Tab */}
          <TabsContent value="contacts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Contact Form Submissions
                </CardTitle>
                <CardDescription>
                  View and respond to customer inquiries from contact forms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contactsLoading ? (
                    <div className="text-center py-8">Loading contact submissions...</div>
                  ) : contacts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No contact submissions found</div>
                  ) : (
                    contacts.map((contact: ContactSubmission) => (
                      <Card key={contact.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold">{contact.name}</h3>
                              <div className="flex gap-4 text-sm text-gray-600 mb-3">
                                <span>{contact.email}</span>
                                <span>{contact.phone}</span>
                              </div>
                              <p className="text-sm">{contact.message}</p>
                              <p className="text-xs text-gray-500 mt-2">
                                Submitted: {new Date(contact.submittedAt).toLocaleString()}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`mailto:${contact.email}`, '_blank')}
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              Reply
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Configuration
                </CardTitle>
                <CardDescription>
                  Manage system-wide settings and configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Pro Access Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Monthly Pro Price</label>
                          <Input value="$49" readOnly />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Annual Pro Price</label>
                          <Input value="$499" readOnly />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Lifetime Pro Price</label>
                          <Input value="$1500" readOnly />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Primary Phone</label>
                          <Input value="(403) 613-6014" readOnly />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Primary Email</label>
                          <Input value="Jordan@Afterhourshvac.ca" readOnly />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Service Area</label>
                          <Input value="Calgary & surrounding areas" readOnly />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;