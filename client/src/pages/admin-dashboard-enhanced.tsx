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
  Eye
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
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [newImageForm, setNewImageForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: 'Residential'
  });

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

  const { data: galleryImages = [] } = useQuery<GalleryImage[]>({
    queryKey: ["/api/gallery"],
  });

  const { data: forumTopics = [] } = useQuery<ForumTopic[]>({
    queryKey: ["/api/forum/topics"],
  });

  // Add gallery image mutation
  const addImageMutation = useMutation({
    mutationFn: async (data: Omit<GalleryImage, 'id' | 'createdAt'>) => {
      const response = await apiRequest('POST', '/api/gallery', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      setNewImageForm({ title: '', description: '', imageUrl: '', category: 'Residential' });
      toast({ title: "Success", description: "Image added to gallery" });
    },
  });

  // Delete image mutation
  const deleteImageMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/gallery/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      toast({ title: "Success", description: "Image deleted from gallery" });
    },
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewImageForm(prev => ({ 
          ...prev, 
          imageUrl: e.target?.result as string 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImage = () => {
    if (!newImageForm.title || !newImageForm.description || !newImageForm.imageUrl) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and upload an image",
        variant: "destructive"
      });
      return;
    }

    addImageMutation.mutate({
      title: newImageForm.title,
      description: newImageForm.description,
      imageUrl: newImageForm.imageUrl,
      category: newImageForm.category,
      isActive: true
    });
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - AfterHours HVAC</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
            <p className="text-xl text-slate-300">
              Manage your HVAC business website content and customer interactions
            </p>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-slate-800">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="forum">Forum</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Total Inquiries</CardTitle>
                    <Mail className="h-4 w-4 text-blue-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{dashboardStats?.totalInquiries || 0}</div>
                    <p className="text-xs text-slate-400">Customer contacts</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Emergency Requests</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{dashboardStats?.emergencyRequests || 0}</div>
                    <p className="text-xs text-slate-400">Urgent service calls</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Pending Quotes</CardTitle>
                    <FileText className="h-4 w-4 text-yellow-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{dashboardStats?.pendingQuotes || 0}</div>
                    <p className="text-xs text-slate-400">Awaiting response</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Active Users</CardTitle>
                    <Users className="h-4 w-4 text-green-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{dashboardStats?.activeUsers || 0}</div>
                    <p className="text-xs text-slate-400">Registered users</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Customer Inquiries</CardTitle>
                  <CardDescription>Latest contact form submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  {contactSubmissions.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">No recent inquiries</p>
                  ) : (
                    <div className="space-y-4">
                      {contactSubmissions.slice(0, 5).map((submission) => (
                        <div key={submission.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                          <div>
                            <div className="font-medium text-white">{submission.name}</div>
                            <div className="text-sm text-slate-300">{submission.email}</div>
                            <div className="text-sm text-slate-400">{submission.message.substring(0, 100)}...</div>
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

            {/* Gallery Management Tab */}
            <TabsContent value="gallery" className="space-y-6">
              {/* Add New Image */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add New Gallery Image
                  </CardTitle>
                  <CardDescription>Upload project photos to showcase your work</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Project Title</Label>
                      <Input
                        id="title"
                        value={newImageForm.title}
                        onChange={(e) => setNewImageForm(prev => ({ ...prev, title: e.target.value }))}
                        className="bg-slate-900 border-slate-600"
                        placeholder="Enter project title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <select
                        value={newImageForm.category}
                        onChange={(e) => setNewImageForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full p-2 bg-slate-900 border border-slate-600 rounded-md"
                      >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Emergency Repairs">Emergency Repairs</option>
                        <option value="Installations">Installations</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Before/After">Before/After</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newImageForm.description}
                      onChange={(e) => setNewImageForm(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-slate-900 border-slate-600"
                      placeholder="Describe the project..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="image">Upload Image</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="bg-slate-900 border-slate-600"
                    />
                    {newImageForm.imageUrl && (
                      <div className="mt-4">
                        <img 
                          src={newImageForm.imageUrl} 
                          alt="Preview" 
                          className="max-w-xs h-32 object-cover rounded-lg border border-slate-600"
                        />
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={handleAddImage}
                    disabled={addImageMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {addImageMutation.isPending ? 'Adding...' : 'Add to Gallery'}
                  </Button>
                </CardContent>
              </Card>

              {/* Gallery Images List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryImages.map((image) => (
                  <Card key={image.id} className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                      <img 
                        src={image.imageUrl} 
                        alt={image.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h3 className="font-semibold text-white mb-2">{image.title}</h3>
                      <p className="text-sm text-slate-300 mb-2">{image.description}</p>
                      <Badge variant="outline" className="mb-4">{image.category}</Badge>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => deleteImageMutation.mutate(image.id)}
                          disabled={deleteImageMutation.isPending}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
                      <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">
                        {galleryImages.length}
                      </div>
                      <p className="text-slate-400">Gallery Images</p>
                    </div>
                    <div className="text-center p-6 bg-slate-900/50 rounded-lg">
                      <MessageSquare className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">
                        {forumTopics.length}
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