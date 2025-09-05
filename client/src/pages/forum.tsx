import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageSquare, 
  Plus, 
  ThumbsUp, 
  Pin, 
  Shield, 
  Clock,
  Eye,
  Reply,
  Trash2,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useStaticAuth } from '@/hooks/use-static-auth';
import { Link } from 'wouter';

type ForumTopic = {
  id: number;
  title: string;
  content: string;
  author: string;
  authorEmail: string;
  createdAt: string;
  replies: number;
  views: number;
  likes: number;
  isSticky: boolean;
  category: string;
};

// Forum categories for HVAC professionals
const FORUM_CATEGORIES = [
  { id: 'hvac-general', name: 'HVAC General', description: 'General HVAC discussions and questions', icon: '🏠' },
  { id: 'heating-systems', name: 'Heating Systems', description: 'Furnaces, boilers, heat pumps, and heating equipment', icon: '🔥' },
  { id: 'cooling-systems', name: 'Cooling & AC', description: 'Air conditioning, refrigeration, and cooling systems', icon: '❄️' },
  { id: 'ventilation', name: 'Ventilation & Ductwork', description: 'Ventilation systems, ductwork, and air quality', icon: '💨' },
  { id: 'plumbing', name: 'Plumbing Systems', description: 'Water heating, piping, and plumbing integration', icon: '🚿' },
  { id: 'electrical', name: 'Electrical & Controls', description: 'Electrical systems, controls, and automation', icon: '⚡' },
  { id: 'troubleshooting', name: 'Troubleshooting', description: 'Diagnostic help and problem solving', icon: '🔧' },
  { id: 'tools-equipment', name: 'Tools & Equipment', description: 'HVAC tools, equipment reviews, and recommendations', icon: '🛠️' },
  { id: 'business', name: 'Business & Pricing', description: 'Business operations, pricing, and industry discussions', icon: '💼' },
  { id: 'codes-standards', name: 'Codes & Standards', description: 'Building codes, standards, and regulations', icon: '📋' }
];

export default function ForumPage() {
  const { user } = useStaticAuth();
  const { toast } = useToast();
  const [showNewTopicForm, setShowNewTopicForm] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicContent, setNewTopicContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('hvac-general');
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Load topics from localStorage on mount
  useEffect(() => {
    const savedTopics = localStorage.getItem('hvac_forum_topics');
    if (savedTopics) {
      try {
        const parsedTopics = JSON.parse(savedTopics);
        setTopics(parsedTopics);
      } catch (error) {
        console.error('Error loading forum topics:', error);
      }
    } else {
      // Initialize with sample topics
      const sampleTopics: ForumTopic[] = [
        {
          id: 1,
          title: "Best practices for furnace maintenance in Calgary winters",
          content: "Looking for advice on maintaining furnaces during extreme cold weather. What are your go-to preventive maintenance steps?",
          author: "TechPro_Calgary",
          authorEmail: "tech@example.com",
          createdAt: new Date().toISOString(),
          replies: 5,
          views: 23,
          likes: 8,
          isSticky: false,
          category: 'heating-systems'
        },
        {
          id: 2,
          title: "Heat pump efficiency in -30°C weather",
          content: "Has anyone had experience with heat pumps operating in extreme Alberta cold? What models perform best?",
          author: "HVACExpert",
          authorEmail: "expert@example.com",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          replies: 12,
          views: 45,
          likes: 15,
          isSticky: false,
          category: 'heating-systems'
        }
      ];
      setTopics(sampleTopics);
      localStorage.setItem('hvac_forum_topics', JSON.stringify(sampleTopics));
    }
  }, []);

  // Save topics to localStorage whenever topics change
  const saveTopics = (updatedTopics: ForumTopic[]) => {
    setTopics(updatedTopics);
    localStorage.setItem('hvac_forum_topics', JSON.stringify(updatedTopics));
  };

  // Create new topic
  const handleCreateTopic = () => {
    if (!newTopicTitle.trim() || !newTopicContent.trim() || !user) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const newTopic: ForumTopic = {
      id: Date.now(),
      title: newTopicTitle,
      content: newTopicContent,
      author: user.firstName ? `${user.firstName} ${user.lastName}` : user.username,
      authorEmail: user.email,
      createdAt: new Date().toISOString(),
      replies: 0,
      views: 0,
      likes: 0,
      isSticky: false,
      category: selectedCategory
    };

    const updatedTopics = [newTopic, ...topics];
    saveTopics(updatedTopics);

    setShowNewTopicForm(false);
    setNewTopicTitle("");
    setNewTopicContent("");
    setSelectedCategory('hvac-general');

    toast({
      title: "Topic Created",
      description: "Your discussion topic has been posted successfully.",
    });
  };

  // Toggle sticky (admin only)
  const toggleSticky = (topicId: number) => {
    if (!user?.isAdmin) return;
    
    const updatedTopics = topics.map(topic =>
      topic.id === topicId ? { ...topic, isSticky: !topic.isSticky } : topic
    );
    saveTopics(updatedTopics);

    toast({
      title: "Topic Updated",
      description: "Topic sticky status changed.",
    });
  };

  // Delete topic (admin only)
  const deleteTopic = (topicId: number) => {
    if (!user?.isAdmin) return;
    
    const updatedTopics = topics.filter(topic => topic.id !== topicId);
    saveTopics(updatedTopics);

    toast({
      title: "Topic Deleted",
      description: "The discussion has been removed.",
    });
  };

  // Filter topics by category
  const filteredTopics = selectedCategoryFilter === 'all' 
    ? topics 
    : topics.filter(topic => topic.category === selectedCategoryFilter);

  // Sort topics (sticky first, then by creation date)
  const sortedTopics = filteredTopics.sort((a, b) => {
    if (a.isSticky && !b.isSticky) return -1;
    if (!a.isSticky && b.isSticky) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <Helmet>
          <title>HVAC Community Forum - AfterHours HVAC</title>
          <meta name="description" content="Join the AfterHours HVAC community forum to discuss heating, cooling, and ventilation topics with professionals and homeowners." />
        </Helmet>
        <div className="container mx-auto py-24 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">HVAC Professional Forum</h1>
            <Card>
              <CardHeader>
                <CardTitle>Login Required</CardTitle>
                <CardDescription>
                  Access to our professional forum is restricted to registered users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground mb-6">
                  Our forum is available to registered professionals and customers. Join discussions about HVAC, plumbing, electrical systems, and share your expertise with the community.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {FORUM_CATEGORIES.slice(0, 6).map(category => (
                    <div key={category.id} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl mb-1">{category.icon}</div>
                      <div className="text-sm font-medium text-gray-700">{category.name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <div className="flex justify-center p-6">
                <Link href="/auth">
                  <Button className="bg-orange-600 hover:bg-orange-700">Login or Register</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50">
      <Helmet>
        <title>HVAC Professional Forum - AfterHours HVAC</title>
        <meta name="description" content="Join the AfterHours HVAC community forum to discuss heating, cooling, and ventilation topics with professionals and homeowners." />
        <meta property="og:title" content="HVAC Professional Forum - AfterHours HVAC" />
        <meta property="og:description" content="Professional community for HVAC, plumbing, and electrical discussions." />
        <meta name="keywords" content="HVAC forum, heating cooling discussion, HVAC community, plumbing forum, electrical forum" />
      </Helmet>
      
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                  HVAC Professional Forum
                </h1>
                <p className="text-gray-600">Community discussions for HVAC, plumbing, and electrical professionals</p>
              </div>
              <Button 
                onClick={() => setShowNewTopicForm(!showNewTopicForm)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Discussion
              </Button>
            </div>
          </div>

          {/* Categories Overview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {FORUM_CATEGORIES.map(category => {
              const categoryTopics = topics.filter(t => t.category === category.id);
              return (
                <Card 
                  key={category.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedCategoryFilter === category.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedCategoryFilter(selectedCategoryFilter === category.id ? 'all' : category.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="font-medium text-sm text-gray-900 mb-1">{category.name}</div>
                    <div className="text-xs text-gray-500">{categoryTopics.length} topics</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Filter Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {FORUM_CATEGORIES.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-gray-500">
              {filteredTopics.length} discussion{filteredTopics.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* New Topic Form */}
          {showNewTopicForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Start a New Discussion</CardTitle>
                <CardDescription>Share your HVAC questions, experiences, or insights with the community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Discussion title..."
                      value={newTopicTitle}
                      onChange={(e) => setNewTopicTitle(e.target.value)}
                    />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {FORUM_CATEGORIES.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    placeholder="Share your thoughts, ask questions, or provide helpful information..."
                    value={newTopicContent}
                    onChange={(e) => setNewTopicContent(e.target.value)}
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleCreateTopic}
                      disabled={!newTopicTitle.trim() || !newTopicContent.trim()}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Post Discussion
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowNewTopicForm(false);
                        setNewTopicTitle("");
                        setNewTopicContent("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Topics List */}
          <div className="space-y-4">
            {sortedTopics.length > 0 ? (
              sortedTopics.map((topic) => {
                const category = FORUM_CATEGORIES.find(c => c.id === topic.category);
                return (
                  <Card key={topic.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {topic.isSticky && <Pin className="h-4 w-4 text-orange-600" />}
                            <h3 className="font-semibold text-gray-900 hover:text-orange-600 cursor-pointer">
                              {topic.title}
                            </h3>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              {category?.icon} {category?.name}
                            </Badge>
                            {topic.isSticky && <Badge className="bg-orange-100 text-orange-800">Pinned</Badge>}
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {topic.content}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>By {topic.author}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(topic.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Reply className="h-3 w-3" />
                              {topic.replies} replies
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {topic.views} views
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              {topic.likes}
                            </span>
                          </div>
                        </div>
                        
                        {/* Admin Controls */}
                        {user?.isAdmin && (
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleSticky(topic.id)}
                              className={topic.isSticky ? 'bg-orange-50' : ''}
                            >
                              <Pin className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteTopic(topic.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {selectedCategoryFilter === 'all' 
                      ? "No discussions yet. Be the first to start a conversation!" 
                      : `No discussions in this category yet. Start the first one!`
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
