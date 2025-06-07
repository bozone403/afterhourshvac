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
  const {
    data: topics = [],
    isLoading: topicsLoading,
  } = useQuery<ForumTopic[]>({
    queryKey: ["/api/forum/topics"],
    enabled: !!user,
  });

  // Create new topic mutation
  const createTopicMutation = useMutation({
    mutationFn: async (data: { title: string; content: string }) => {
      const response = await apiRequest("POST", "/api/forum/topics", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/topics"] });
      setNewTopicTitle("");
      setNewTopicContent("");
      setShowNewTopicForm(false);
      toast({
        title: "Topic Created!",
        description: "Your discussion has been posted to the community.",
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

  // Edit topic mutation
  const editTopicMutation = useMutation({
    mutationFn: async (data: { id: number; title: string; content: string }) => {
      const response = await apiRequest("PUT", `/api/forum/topics/${data.id}`, {
        title: data.title,
        content: data.content
      });
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
      <>
        <Helmet>
          <title>HVAC Community Forum - AfterHours HVAC</title>
          <meta name="description" content="Join the AfterHours HVAC community forum to discuss heating, cooling, and ventilation topics with professionals and homeowners." />
        </Helmet>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
          <div className="container mx-auto py-24 px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl font-bold mb-6 text-gray-900">HVAC Forum</h1>
            <Card>
              <CardHeader>
                <CardTitle>Login Required</CardTitle>
                <CardDescription>
                  You need to login to access the forum
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
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
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <Helmet>
        <title>HVAC Community Forum - AfterHours HVAC</title>
        <meta name="description" content="Join the AfterHours HVAC community forum to discuss heating, cooling, and ventilation topics with professionals and homeowners." />
        <meta property="og:title" content="HVAC Community Forum - AfterHours HVAC" />
        <meta property="og:description" content="Join the AfterHours HVAC community forum to discuss heating, cooling, and ventilation topics with professionals and homeowners." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="HVAC forum, heating cooling discussion, HVAC community, HVAC questions, HVAC advice" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="container mx-auto py-24 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">HVAC Discussion Forum</h1>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
        
          <p className="text-muted-foreground mb-8">
            Welcome to the AfterHours HVAC forum! This is where community members can discuss HVAC topics,
            ask questions, share experiences, and get advice from professionals. Please be respectful and
            follow our community guidelines.
          </p>
          
          {/* Pinned Admin Posts Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Pin className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Pinned by Admin</h2>
              <Shield className="h-4 w-4 text-yellow-500" />
            </div>
            
            <Card className="bg-gradient-to-r from-orange-50 to-blue-50 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500">
                        <Pin className="h-3 w-3 mr-1" />
                        PINNED
                      </Badge>
                      <Badge variant="outline" className="border-green-500 text-green-500">
                        <Shield className="h-3 w-3 mr-1" />
                        ADMIN
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Welcome to AfterHours HVAC Forum!</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Please read our community guidelines before posting. We're here to help with all your HVAC questions and share professional insights.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        <span>45</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>12 replies</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>234 views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Posted 1 week ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-8" />

          {/* User Discussion Area */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Community Discussions</h2>
              <Button 
                onClick={() => setShowNewTopicForm(!showNewTopicForm)}
                className="bg-primary hover:bg-primary/80"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </div>

            {/* New Post Form */}
            {showNewTopicForm && (
              <Card className="mb-6 border-primary/30">
                <CardHeader>
                  <CardTitle>Create New Discussion</CardTitle>
                  <CardDescription>
                    Share your HVAC questions, experiences, or insights with the community
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <Input
                      placeholder="What's your HVAC question or topic?"
                      value={newTopicTitle}
                      onChange={(e) => setNewTopicTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Content</label>
                    <Textarea
                      placeholder="Describe your question, issue, or share your experience..."
                      value={newTopicContent}
                      onChange={(e) => setNewTopicContent(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        if (newTopicTitle && newTopicContent) {
                          createTopicMutation.mutate({
                            title: newTopicTitle,
                            content: newTopicContent
                          });
                        }
                      }}
                      disabled={!newTopicTitle || !newTopicContent || createTopicMutation.isPending}
                      className="bg-primary hover:bg-primary/80"
                    >
                      {createTopicMutation.isPending ? "Posting..." : "Post Discussion"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowNewTopicForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Forum Topics */}
            <div className="space-y-4">
              {topicsLoading ? (
                <div className="text-center py-8">Loading discussions...</div>
              ) : topics.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No discussions yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Be the first to start a discussion in our HVAC community!
                    </p>
                    <Button onClick={() => setShowNewTopicForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Start Discussion
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                topics.map((topic) => (
                  <Card key={topic.id} className="hover:border-primary/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center gap-1 mr-2">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-green-500/20">
                            <ThumbsUp className="h-3 w-3 text-green-500" />
                          </Button>
                          <span className="text-sm font-medium">{topic.likes}</span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-red-500/20">
                            <ThumbsDown className="h-3 w-3 text-gray-400" />
                          </Button>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {topic.isSticky && (
                              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500">
                                <Pin className="h-3 w-3 mr-1" />
                                PINNED
                              </Badge>
                            )}
                            <Badge variant="outline" className="border-blue-500 text-blue-500">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {topic.category}
                            </Badge>
                            <span className="text-sm text-muted-foreground">Posted by {topic.author} • {topic.createdAt}</span>
                          </div>
                          <h3 className="font-semibold text-lg mb-2">{topic.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {topic.content.substring(0, 200)}...
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              <span>{topic.replies} replies</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{topic.views} views</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{topic.createdAt}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Button variant="outline" size="sm">
                            <Reply className="h-3 w-3 mr-1" />
                            Reply
                          </Button>
                          {(user && (user.isAdmin || topic.author === user.username)) && (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => deleteTopicMutation.mutate(topic.id)}
                              disabled={deleteTopicMutation.isPending}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              {deleteTopicMutation.isPending ? "Deleting..." : "Delete"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
}