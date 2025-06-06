import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from 'react-helmet-async';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Loader2, MessageSquare, Clock, Users, Pin, Shield, ThumbsUp, ThumbsDown, Reply, Plus, TrendingUp } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from 'date-fns';

// Type definitions for our forum data
type ForumCategory = {
  id: number;
  name: string;
  description: string;
  slug: string;
  isActive: boolean;
};

type ForumTopic = {
  id: number;
  categoryId: number;
  userId: number;
  title: string;
  content: string;
  slug: string;
  views: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
};

type ForumPost = {
  id: number;
  topicId: number;
  userId: number;
  content: string;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function ForumPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [showNewTopicForm, setShowNewTopicForm] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicContent, setNewTopicContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  
  // Get forum categories
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery<ForumCategory[]>({
    queryKey: ["/api/forum/categories"],
    enabled: !!user,
  });
  
  // Get topics for selected category
  const {
    data: topics,
    isLoading: topicsLoading,
    error: topicsError,
  } = useQuery<ForumTopic[]>({
    queryKey: ["/api/forum/categories", selectedCategory, "topics"],
    queryFn: async () => {
      const res = await fetch(`/api/forum/categories/${selectedCategory}/topics`);
      if (!res.ok) {
        throw new Error("Failed to fetch topics");
      }
      return res.json();
    },
    enabled: !!selectedCategory && !!user,
  });
  
  // Get posts for selected topic
  const {
    data: posts,
    isLoading: postsLoading,
    error: postsError,
  } = useQuery<ForumPost[]>({
    queryKey: ["/api/forum/topics", selectedTopic, "posts"],
    queryFn: async () => {
      const res = await fetch(`/api/forum/topics/${selectedTopic}/posts`);
      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }
      return res.json();
    },
    enabled: !!selectedTopic && !!user,
  });
  
  // Reset topic selection when category changes
  useEffect(() => {
    setSelectedTopic(null);
  }, [selectedCategory]);
  
  // If not logged in, show message to login
  if (!user) {
    return (
      <div className="container mx-auto py-24 px-4 min-h-screen">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">HVAC Forum</h1>
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
            <CardFooter className="flex justify-center">
              <Link href="/auth">
                <Button>Login or Register</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  
  // Show loading state
  if (categoriesLoading) {
    return (
      <div className="container mx-auto py-24 px-4 min-h-screen">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  // Show error state
  if (categoriesError) {
    return (
      <div className="container mx-auto py-24 px-4 min-h-screen">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">HVAC Forum</h1>
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>There was an error loading the forum. Please try again later.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // Forum categories view (default view)
  if (!selectedCategory) {
    return (
      <div className="container mx-auto py-24 px-4 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">HVAC Discussion Forum</h1>
            <Button>
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
            
            <div className="space-y-3">
              <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30">
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
                          <span>42</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>12 replies</span>
                        </div>
                        <span>by JordanBoz • 2 days ago</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500/10 to-primary/10 border-blue-500/30">
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
                      <h3 className="font-semibold text-lg mb-2">Winter HVAC Maintenance Tips</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Essential maintenance checklist for winter season. Keep your system running efficiently when you need it most.
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          <span>67</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>23 replies</span>
                        </div>
                        <span>by JordanBoz • 1 week ago</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Forum Categories */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Discussion Categories</h2>
          </div>
          
          <div className="grid gap-6">
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <Card key={category.id} className="hover:border-primary transition-colors cursor-pointer"
                  onClick={() => setSelectedCategory(category.id)}>
                  <CardHeader>
                    <CardTitle className="text-xl">{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      <span>0 topics</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Last updated: N/A</span>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>No forum categories have been created yet.</p>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="mt-12 text-center">
            <h2 className="text-xl font-semibold mb-2">Need Immediate Help?</h2>
            <p className="text-muted-foreground mb-4">
              Contact us directly for urgent assistance or immediate service
            </p>
            <div className="flex justify-center space-x-4">
              <a href="tel:4036136014" className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md">
                <i className="fas fa-phone-alt mr-2"></i>(403) 613-6014
              </a>
              <a href="mailto:Jordan@Afterhourshvac.ca" className="inline-flex items-center justify-center px-4 py-2 bg-secondary text-white rounded-md">
                <i className="fas fa-envelope mr-2"></i>Jordan@Afterhourshvac.ca
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Topic listing for a category
  if (selectedCategory && !selectedTopic) {
    const category = categories?.find(c => c.id === selectedCategory);
    
    return (
      <div className="container mx-auto py-24 px-4 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-8">
            <Button variant="outline" onClick={() => setSelectedCategory(null)} className="mr-4">
              Back to Categories
            </Button>
            <h1 className="text-2xl font-bold">{category?.name}</h1>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">{category?.description}</p>
            <Button>
              <MessageSquare className="h-4 w-4 mr-2" />
              New Topic
            </Button>
          </div>
          
          {topicsLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-4">
              {topics && topics.length > 0 ? (
                topics.map((topic) => (
                  <Card key={topic.id} className="hover:border-primary transition-colors cursor-pointer"
                    onClick={() => setSelectedTopic(topic.id)}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">{topic.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="line-clamp-2">{topic.content}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>By: User {topic.userId}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{new Date(topic.createdAt).toLocaleDateString()}</span>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>No Topics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>No topics have been created in this category yet. Be the first to start a discussion!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Topic view with posts
  if (selectedCategory && selectedTopic) {
    const category = categories?.find(c => c.id === selectedCategory);
    const topic = topics?.find(t => t.id === selectedTopic);
    
    return (
      <div className="container mx-auto py-24 px-4 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-2">
            <Button variant="outline" onClick={() => setSelectedTopic(null)} className="mr-4">
              Back to Topics
            </Button>
          </div>
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">{topic?.title}</h1>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              <span className="mr-4">By: User {topic?.userId}</span>
              <Clock className="h-4 w-4 mr-1" />
              <span>{topic ? new Date(topic.createdAt).toLocaleDateString() : ''}</span>
            </div>
          </div>
          
          {postsLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Original post */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">User {topic?.userId}</CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {topic ? new Date(topic.createdAt).toLocaleString() : ''}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <p>{topic?.content}</p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Replies */}
              {posts && posts.length > 0 ? (
                posts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">User {post.userId}</CardTitle>
                        <span className="text-sm text-muted-foreground">
                          {new Date(post.createdAt).toLocaleString()}
                          {post.isEdited && ' (edited)'}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-invert max-w-none">
                        <p>{post.content}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-6">
                    <p className="text-center text-muted-foreground">No replies yet. Be the first to reply!</p>
                  </CardContent>
                </Card>
              )}
              
              {/* Reply form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Post a Reply</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea 
                    className="w-full min-h-[150px] bg-background border rounded-md p-2 resize-y"
                    placeholder="Write your reply here..."
                  />
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button>Post Reply</Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  return null;
}