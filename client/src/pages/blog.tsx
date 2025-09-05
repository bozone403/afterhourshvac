import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  User, 
  Search, 
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useStaticAuth } from '@/hooks/use-static-auth';
import { Link } from 'wouter';
import BlogForm from '@/components/admin/BlogForm';

type BlogPost = {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  authorEmail: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  slug: string;
  featuredImageUrl?: string;
  metaDescription?: string;
  views: number;
};

const BLOG_CATEGORIES = [
  { id: 'maintenance', name: 'Maintenance', description: 'HVAC maintenance tips and guides' },
  { id: 'installation', name: 'Installation', description: 'Installation guides and best practices' },
  { id: 'repair', name: 'Repair', description: 'Repair tips and troubleshooting' },
  { id: 'energy-efficiency', name: 'Energy Efficiency', description: 'Energy saving tips and solutions' },
  { id: 'seasonal', name: 'Seasonal', description: 'Seasonal HVAC advice and preparation' },
  { id: 'news', name: 'Company News', description: 'Company updates and industry news' }
];

export default function BlogPage() {
  const { user } = useStaticAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Load blog posts from localStorage
  useEffect(() => {
    const savedPosts = localStorage.getItem('hvac_blog_posts');
    if (savedPosts) {
      try {
        const parsedPosts = JSON.parse(savedPosts);
        setPosts(parsedPosts);
      } catch (error) {
        console.error('Error loading blog posts:', error);
      }
    } else {
      // Initialize with sample posts
      const samplePosts: BlogPost[] = [
        {
          id: 1,
          title: "Winter HVAC Maintenance: Essential Tips for Calgary Homeowners",
          content: "As winter approaches in Calgary, it's crucial to prepare your HVAC system for the harsh conditions ahead. Here are the essential maintenance tasks every homeowner should complete before the cold sets in...",
          excerpt: "Prepare your HVAC system for Calgary's harsh winter with these essential maintenance tips.",
          category: 'maintenance',
          tags: ['winter', 'maintenance', 'calgary', 'preparation'],
          author: 'AfterHours HVAC Team',
          authorEmail: 'admin@afterhourshvac.ca',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isPublished: true,
          slug: 'winter-hvac-maintenance-calgary',
          views: 0,
          metaDescription: 'Essential winter HVAC maintenance tips for Calgary homeowners to keep their systems running efficiently.'
        },
        {
          id: 2,
          title: "Heat Pump vs. Furnace: Which is Right for Your Alberta Home?",
          content: "Choosing between a heat pump and a traditional furnace can be challenging for Alberta homeowners. This comprehensive guide breaks down the pros and cons of each system...",
          excerpt: "Compare heat pumps and furnaces to make the best choice for your Alberta home's heating needs.",
          category: 'installation',
          tags: ['heat pump', 'furnace', 'alberta', 'comparison'],
          author: 'AfterHours HVAC Team',
          authorEmail: 'admin@afterhourshvac.ca',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
          isPublished: true,
          slug: 'heat-pump-vs-furnace-alberta',
          views: 0,
          metaDescription: 'Compare heat pumps and furnaces for Alberta homes. Expert advice on choosing the right heating system.'
        }
      ];
      setPosts(samplePosts);
      localStorage.setItem('hvac_blog_posts', JSON.stringify(samplePosts));
    }
  }, []);

  // Filter posts based on category and search term
  useEffect(() => {
    let filtered = posts.filter(post => post.isPublished || user?.isAdmin);
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredPosts(filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, [posts, selectedCategory, searchTerm, user]);

  const handleDeletePost = (postId: number) => {
    if (!user?.isAdmin) return;
    
    const updatedPosts = posts.filter(post => post.id !== postId);
    setPosts(updatedPosts);
    localStorage.setItem('hvac_blog_posts', JSON.stringify(updatedPosts));
    
    toast({
      title: "Post Deleted",
      description: "Blog post has been removed successfully.",
    });
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setShowBlogForm(true);
  };

  const handleCloseBlogForm = () => {
    setShowBlogForm(false);
    setEditingPost(null);
    // Reload posts from localStorage
    const savedPosts = localStorage.getItem('hvac_blog_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50">
      <Helmet>
        <title>HVAC Blog - Expert Tips & Advice | AfterHours HVAC</title>
        <meta name="description" content="Expert HVAC tips, maintenance guides, and industry insights from Calgary's trusted heating and cooling professionals." />
        <meta property="og:title" content="HVAC Blog - Expert Tips & Advice | AfterHours HVAC" />
        <meta property="og:description" content="Expert HVAC tips, maintenance guides, and industry insights from Calgary's trusted heating and cooling professionals." />
        <meta name="keywords" content="HVAC blog, heating tips, cooling advice, maintenance guides, Calgary HVAC" />
      </Helmet>

      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                  HVAC Expert Blog
                </h1>
                <p className="text-gray-600">Professional tips, guides, and industry insights from Calgary's HVAC experts</p>
              </div>
              {user?.isAdmin && (
                <Button 
                  onClick={() => setShowBlogForm(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              )}
            </div>
          </div>

          {/* Blog Form Modal */}
          {showBlogForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <BlogForm 
                  onClose={handleCloseBlogForm}
                  post={editingPost}
                />
              </div>
            </div>
          )}

          {/* Search and Filter Controls */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search blog posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {BLOG_CATEGORIES.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Categories Overview */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {BLOG_CATEGORIES.map(category => {
              const categoryPosts = posts.filter(p => p.category === category.id && (p.isPublished || user?.isAdmin));
              return (
                <Card 
                  key={category.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedCategory === category.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? 'all' : category.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="font-medium text-sm text-gray-900 mb-1">{category.name}</div>
                    <div className="text-xs text-gray-500">{categoryPosts.length} posts</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => {
                const category = BLOG_CATEGORIES.find(c => c.id === post.category);
                return (
                  <Card key={post.id} className="hover:shadow-lg transition-shadow">
                    {post.featuredImageUrl && (
                      <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                        <img 
                          src={post.featuredImageUrl} 
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {category?.name}
                        </Badge>
                        {!post.isPublished && (
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            Draft
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg leading-tight hover:text-blue-600 cursor-pointer">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.views}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 bg-orange-600 hover:bg-orange-700">
                          Read More
                        </Button>
                        {user?.isAdmin && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditPost(post)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeletePost(post.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-full">
                <Card>
                  <CardContent className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Clock className="h-12 w-12 mx-auto" />
                    </div>
                    <p className="text-gray-500 text-lg">
                      {searchTerm || selectedCategory !== 'all' 
                        ? "No blog posts match your search criteria." 
                        : "No blog posts published yet."
                      }
                    </p>
                    {user?.isAdmin && (
                      <Button 
                        onClick={() => setShowBlogForm(true)}
                        className="mt-4 bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Post
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
