import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { 
  Upload, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  Image as ImageIcon, 
  Plus,
  Eye,
  Settings
} from 'lucide-react';

interface GalleryImage {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface ServiceImage {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  serviceType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdminPhotos = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Check if user is admin
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
                  You need administrator privileges to access the photo gallery editor
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
  
  const [activeTab, setActiveTab] = useState('gallery');
  const [editingImage, setEditingImage] = useState<GalleryImage | ServiceImage | null>(null);
  const [newImageForm, setNewImageForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: '',
    serviceType: '',
    isActive: true
  });

  // Gallery Images Query
  const { data: galleryImages, isLoading: galleryLoading } = useQuery<GalleryImage[]>({
    queryKey: ['/api/gallery'],
    enabled: !!user?.isAdmin
  });

  // Service Images Query
  const { data: serviceImages, isLoading: servicesLoading } = useQuery<ServiceImage[]>({
    queryKey: ['/api/gallery/services'],
    enabled: !!user?.isAdmin
  });

  // Add Gallery Image Mutation
  const addGalleryImageMutation = useMutation({
    mutationFn: async (imageData: any) => {
      const response = await apiRequest('POST', '/api/gallery', imageData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      setNewImageForm({ title: '', description: '', imageUrl: '', category: '', serviceType: '', isActive: true });
      toast({ title: "Success", description: "Gallery image added successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add gallery image", variant: "destructive" });
    }
  });

  // Add Service Image Mutation
  const addServiceImageMutation = useMutation({
    mutationFn: async (imageData: any) => {
      const response = await apiRequest('POST', '/api/gallery/services', imageData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery/services'] });
      setNewImageForm({ title: '', description: '', imageUrl: '', category: '', serviceType: '', isActive: true });
      toast({ title: "Success", description: "Service image added successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add service image", variant: "destructive" });
    }
  });

  // Update Image Mutation
  const updateImageMutation = useMutation({
    mutationFn: async ({ id, data, type }: { id: number; data: any; type: 'gallery' | 'service' }) => {
      const endpoint = type === 'gallery' ? `/api/gallery/${id}` : `/api/gallery/services/${id}`;
      const response = await apiRequest('PUT', endpoint, data);
      return response.json();
    },
    onSuccess: (_, variables) => {
      const queryKey = variables.type === 'gallery' ? ['/api/gallery'] : ['/api/gallery/services'];
      queryClient.invalidateQueries({ queryKey });
      setEditingImage(null);
      toast({ title: "Success", description: "Image updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update image", variant: "destructive" });
    }
  });

  // Delete Image Mutation
  const deleteImageMutation = useMutation({
    mutationFn: async ({ id, type }: { id: number; type: 'gallery' | 'service' }) => {
      const endpoint = type === 'gallery' ? `/api/gallery/${id}` : `/api/gallery/services/${id}`;
      await apiRequest('DELETE', endpoint);
    },
    onSuccess: (_, variables) => {
      const queryKey = variables.type === 'gallery' ? ['/api/gallery'] : ['/api/gallery/services'];
      queryClient.invalidateQueries({ queryKey });
      toast({ title: "Success", description: "Image deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete image", variant: "destructive" });
    }
  });

  const handleAddImage = (type: 'gallery' | 'service') => {
    if (!newImageForm.title || !newImageForm.imageUrl) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and image URL",
        variant: "destructive"
      });
      return;
    }

    if (type === 'gallery') {
      if (!newImageForm.category) {
        toast({
          title: "Missing Category",
          description: "Please select a category for the gallery image",
          variant: "destructive"
        });
        return;
      }
      addGalleryImageMutation.mutate({
        title: newImageForm.title,
        description: newImageForm.description,
        imageUrl: newImageForm.imageUrl,
        category: newImageForm.category
      });
    } else {
      if (!newImageForm.serviceType) {
        toast({
          title: "Missing Service Type",
          description: "Please select a service type",
          variant: "destructive"
        });
        return;
      }
      addServiceImageMutation.mutate({
        title: newImageForm.title,
        description: newImageForm.description,
        imageUrl: newImageForm.imageUrl,
        serviceType: newImageForm.serviceType,
        isActive: newImageForm.isActive
      });
    }
  };

  const handleUpdateImage = (type: 'gallery' | 'service') => {
    if (!editingImage) return;

    updateImageMutation.mutate({
      id: editingImage.id,
      data: editingImage,
      type
    });
  };

  const handleDeleteImage = (id: number, type: 'gallery' | 'service') => {
    if (confirm('Are you sure you want to delete this image?')) {
      deleteImageMutation.mutate({ id, type });
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-slate-400">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const galleryCategories = ['Residential', 'Commercial', 'Emergency Repairs', 'Installations', 'Maintenance', 'Before/After'];
  const serviceTypes = ['Furnace', 'Air Conditioning', 'Maintenance', 'Ductwork', 'Commercial', 'Heat Pumps'];

  return (
    <>
      <Helmet>
        <title>Photo Management | Admin Dashboard</title>
        <meta name="description" content="Manage gallery and service photos for the AfterHours HVAC website" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <ImageIcon className="h-10 w-10 text-green-400" />
              Photo Management
            </h1>
            <p className="text-xl text-slate-300">
              Manage gallery and service images for the website
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800">
              <TabsTrigger value="gallery">Gallery Images</TabsTrigger>
              <TabsTrigger value="services">Service Images</TabsTrigger>
            </TabsList>

            <TabsContent value="gallery" className="space-y-6">
              {/* Add New Gallery Image */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Add New Gallery Image</CardTitle>
                  <CardDescription>Upload images to the main gallery</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="galleryTitle">Title</Label>
                      <Input
                        id="galleryTitle"
                        value={newImageForm.title}
                        onChange={(e) => setNewImageForm(prev => ({ ...prev, title: e.target.value }))}
                        className="bg-slate-900 border-slate-600"
                        placeholder="Image title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="galleryCategory">Category</Label>
                      <Select
                        value={newImageForm.category}
                        onValueChange={(value) => setNewImageForm(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger className="bg-slate-900 border-slate-600">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {galleryCategories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="galleryUrl">Image URL</Label>
                    <Input
                      id="galleryUrl"
                      value={newImageForm.imageUrl}
                      onChange={(e) => setNewImageForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                      className="bg-slate-900 border-slate-600"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="galleryDescription">Description (Optional)</Label>
                    <Textarea
                      id="galleryDescription"
                      value={newImageForm.description}
                      onChange={(e) => setNewImageForm(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-slate-900 border-slate-600"
                      placeholder="Image description"
                    />
                  </div>
                  
                  <Button 
                    onClick={() => handleAddImage('gallery')}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={addGalleryImageMutation.isPending}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Gallery Image
                  </Button>
                </CardContent>
              </Card>

              {/* Gallery Images List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryLoading ? (
                  <div className="col-span-full text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full mx-auto"></div>
                  </div>
                ) : galleryImages?.map((image) => (
                  <Card key={image.id} className="bg-slate-800/50 border-slate-700">
                    <div className="relative">
                      <img 
                        src={image.imageUrl} 
                        alt={image.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setEditingImage(image)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteImage(image.id, 'gallery')}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Badge className="absolute top-2 left-2 bg-slate-900/80">
                        {image.category}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-white mb-2">{image.title}</h3>
                      {image.description && (
                        <p className="text-slate-400 text-sm">{image.description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              {/* Add New Service Image */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Add New Service Image</CardTitle>
                  <CardDescription>Upload images for service carousel</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="serviceTitle">Title</Label>
                      <Input
                        id="serviceTitle"
                        value={newImageForm.title}
                        onChange={(e) => setNewImageForm(prev => ({ ...prev, title: e.target.value }))}
                        className="bg-slate-900 border-slate-600"
                        placeholder="Service image title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="serviceType">Service Type</Label>
                      <Select
                        value={newImageForm.serviceType}
                        onValueChange={(value) => setNewImageForm(prev => ({ ...prev, serviceType: value }))}
                      >
                        <SelectTrigger className="bg-slate-900 border-slate-600">
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceTypes.map(type => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="serviceUrl">Image URL</Label>
                    <Input
                      id="serviceUrl"
                      value={newImageForm.imageUrl}
                      onChange={(e) => setNewImageForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                      className="bg-slate-900 border-slate-600"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="serviceDescription">Description (Optional)</Label>
                    <Textarea
                      id="serviceDescription"
                      value={newImageForm.description}
                      onChange={(e) => setNewImageForm(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-slate-900 border-slate-600"
                      placeholder="Service image description"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="serviceActive"
                      checked={newImageForm.isActive}
                      onChange={(e) => setNewImageForm(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="serviceActive">Active (show in carousel)</Label>
                  </div>
                  
                  <Button 
                    onClick={() => handleAddImage('service')}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={addServiceImageMutation.isPending}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service Image
                  </Button>
                </CardContent>
              </Card>

              {/* Service Images List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {servicesLoading ? (
                  <div className="col-span-full text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full mx-auto"></div>
                  </div>
                ) : serviceImages?.map((image) => (
                  <Card key={image.id} className="bg-slate-800/50 border-slate-700">
                    <div className="relative">
                      <img 
                        src={image.imageUrl} 
                        alt={image.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setEditingImage(image)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteImage(image.id, 'service')}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute top-2 left-2 flex space-x-1">
                        <Badge className="bg-slate-900/80">
                          {image.serviceType}
                        </Badge>
                        {image.isActive && (
                          <Badge className="bg-green-600/80">
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-white mb-2">{image.title}</h3>
                      {image.description && (
                        <p className="text-slate-400 text-sm">{image.description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AdminPhotos;