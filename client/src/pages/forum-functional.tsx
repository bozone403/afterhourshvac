import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  Plus, 
  ThumbsUp, 
  ThumbsDown, 
  Pin, 
  Shield, 
  TrendingUp, 
  Clock,
  Eye,
  Reply,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { Link } from 'wouter';

type ForumTopic = {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  replies: number;
  views: number;
  likes: number;
  isSticky: boolean;
  category: string;
};

export default function ForumPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showNewTopicForm, setShowNewTopicForm] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicContent, setNewTopicContent] = useState("");

  // Get forum topics
  const { data: topics, isLoading, error } = useQuery({
    queryKey: ["/api/forum/topics"],
    enabled: !!user,
  });

  // Create topic mutation
  const createTopicMutation = useMutation({
    mutationFn: async (topicData: { title: string; content: string; category: string }) => {
      const response = await apiRequest("POST", "/api/forum/topics", topicData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/topics"] });
      setShowNewTopicForm(false);
      setNewTopicTitle("");
      setNewTopicContent("");
      toast({
        title: "Topic Created",
        description: "Your discussion topic has been posted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error Creating Topic",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update topic mutation (for admin actions)
  const updateTopicMutation = useMutation({
    mutationFn: async ({ topicId, updates }: { topicId: number; updates: Partial<ForumTopic> }) => {
      const response = await apiRequest("PATCH", `/api/forum/topics/${topicId}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/topics"] });
      toast({
        title: "Topic Updated",
        description: "Your changes have been saved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error Updating Topic",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete topic mutation
  const deleteTopicMutation = useMutation({
    mutationFn: async (topicId: number) => {
      const response = await apiRequest("DELETE", `/api/forum/topics/${topicId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/topics"] });
      toast({
        title: "Topic Deleted",
        description: "The discussion has been removed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error Deleting Topic",
        description: error.message,
        variant: "destructive",
      });
    },
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
            <h1 className="text-3xl font-bold mb-6 text-gray-900">HVAC Forum</h1>
            <Card>
              <CardHeader>
                <CardTitle>Login Required</CardTitle>
                <CardDescription>
                  Access to our community forum is restricted to registered users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  Our forum is available to registered users only. Please log in or create an account
                  to join discussions about HVAC topics, ask questions, and share your experiences.
                </p>
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
        <title>HVAC Community Forum - AfterHours HVAC</title>
        <meta name="description" content="Join the AfterHours HVAC community forum to discuss heating, cooling, and ventilation topics with professionals and homeowners." />
        <meta property="og:title" content="HVAC Community Forum - AfterHours HVAC" />
        <meta property="og:description" content="Join the AfterHours HVAC community forum to discuss heating, cooling, and ventilation topics with professionals and homeowners." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="HVAC forum, heating cooling discussion, HVAC community, HVAC questions, HVAC advice" />
      </Helmet>
      
      <div className="hvac-container hvac-section">
        <div className="max-w-6xl mx-auto">
          <div className="hvac-card mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="hvac-heading-lg mb-4 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                  HVAC Discussion Forum
                </h1>
                <p className="hvac-text-base text-gray-600">Professional community for HVAC technicians and industry experts</p>
              </div>
              <Button className="hvac-button-secondary">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        
          <p className="text-gray-600 mb-8">
            Welcome to the AfterHours HVAC forum! This is where community members can discuss HVAC topics,
            ask questions, share experiences, and get advice from professionals. Please be respectful and
            follow our community guidelines.
          </p>
          
          {/* Pinned Admin Posts Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Pin className="h-5 w-5 text-orange-600" />
              <h2 className="text-xl font-semibold text-gray-900">Pinned by Admin</h2>
              <Shield className="h-4 w-4 text-yellow-500" />
            </div>
            
            <Card className="bg-gradient-to-r from-orange-50 to-blue-50 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Pin className="h-4 w-4 text-orange-600" />
                      <h3 className="font-semibold text-gray-900">Welcome to the AfterHours HVAC Forum</h3>
                      <Badge className="bg-orange-100 text-orange-800">Pinned</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Welcome to our community! Please read our guidelines before posting. Be respectful, stay on topic, 
                      and help create a positive environment for everyone to learn and share knowledge.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        By Admin
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Posted today
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* New Topic Button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Community Discussions</h2>
            <Button 
              onClick={() => setShowNewTopicForm(!showNewTopicForm)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Start New Discussion
            </Button>
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
                  <Input
                    placeholder="Discussion title..."
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="Share your thoughts, ask questions, or provide helpful information..."
                    value={newTopicContent}
                    onChange={(e) => setNewTopicContent(e.target.value)}
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        if (newTopicTitle.trim() && newTopicContent.trim()) {
                          createTopicMutation.mutate({
                            title: newTopicTitle,
                            content: newTopicContent,
                            category: "general"
                          });
                        }
                      }}
                      disabled={createTopicMutation.isPending || !newTopicTitle.trim() || !newTopicContent.trim()}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      {createTopicMutation.isPending ? "Posting..." : "Post Discussion"}
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
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading discussions...</p>
              </div>
            ) : error ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-red-600">Error loading forum topics. Please try again.</p>
                </CardContent>
              </Card>
            ) : Array.isArray(topics) && topics.length > 0 ? (
              topics.map((topic: ForumTopic) => (
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
                            {topic.category}
                          </Badge>
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
                      {user && (user as any).isAdmin && (
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateTopicMutation.mutate({
                              topicId: topic.id,
                              updates: { isSticky: !topic.isSticky }
                            })}
                          >
                            <Pin className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteTopicMutation.mutate(topic.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No discussions yet. Be the first to start a conversation!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}