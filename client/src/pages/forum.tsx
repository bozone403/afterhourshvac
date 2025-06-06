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

  // Show login required if not authenticated
  if (!user) {
    return (
      <>
        <Helmet>
          <title>HVAC Community Forum - AfterHours HVAC</title>
          <meta name="description" content="Join the AfterHours HVAC community forum to discuss heating, cooling, and ventilation topics with professionals and homeowners. Get expert advice and share experiences." />
          <meta property="og:title" content="HVAC Community Forum - AfterHours HVAC" />
          <meta property="og:description" content="Join the AfterHours HVAC community forum to discuss heating, cooling, and ventilation topics with professionals and homeowners." />
        </Helmet>
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
      </>
    );
  }
  
  // Show loading state
  if (categoriesLoading) {
    return (
      <>
        <Helmet>
          <title>HVAC Community Forum - AfterHours HVAC</title>
          <meta name="description" content="Join the AfterHours HVAC community forum to discuss heating, cooling, and ventilation topics with professionals and homeowners. Get expert advice and share experiences." />
          <meta property="og:title" content="HVAC Community Forum - AfterHours HVAC" />
          <meta property="og:description" content="Join the AfterHours HVAC community forum to discuss heating, cooling, and ventilation topics with professionals and homeowners." />
        </Helmet>
        <div className="container mx-auto py-24 px-4 min-h-screen">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </>
    );
  }
  
  // Show error state
  if (categoriesError) {
    return (
      <>
        <Helmet>
          <title>HVAC Community Forum - AfterHours HVAC</title>
          <meta name="description" content="Join the AfterHours HVAC community forum to discuss heating, cooling, and ventilation topics with professionals and homeowners. Get expert advice and share experiences." />
        </Helmet>
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
      </>
    );
  }
  
  // Forum categories view (default view)
  return (
    <>
      <Helmet>
        <title>HVAC Community Forum - AfterHours HVAC</title>
        <meta name="description" content="Join the AfterHours HVAC community forum to discuss heating, cooling, and ventilation topics with professionals and homeowners. Get expert advice and share experiences." />
        <meta property="og:title" content="HVAC Community Forum - AfterHours HVAC" />
        <meta property="og:description" content="Join the AfterHours HVAC community forum to discuss heating, cooling, and ventilation topics with professionals and homeowners." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="HVAC forum, heating cooling discussion, HVAC community, HVAC questions, HVAC advice" />
      </Helmet>
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
                          toast({
                            title: "Post Created!",
                            description: "Your discussion has been posted to the community.",
                          });
                          setNewTopicTitle("");
                          setNewTopicContent("");
                          setShowNewTopicForm(false);
                        }
                      }}
                      className="bg-primary hover:bg-primary/80"
                    >
                      Post Discussion
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

            {/* Sample User Posts */}
            <div className="space-y-4">
              <Card className="hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-1 mr-2">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-green-500/20">
                        <ThumbsUp className="h-3 w-3 text-green-500" />
                      </Button>
                      <span className="text-sm font-medium">23</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-red-500/20">
                        <ThumbsDown className="h-3 w-3 text-gray-400" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="border-blue-500 text-blue-500">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          HOT
                        </Badge>
                        <span className="text-sm text-muted-foreground">Posted by TechnicianMike • 3 hours ago</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Furnace making weird noise - normal or concern?</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        My 5-year-old gas furnace started making a low humming sound when it cycles on. It's not super loud but definitely noticeable. Should I be worried or is this normal wear?
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>8 replies</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                          <Reply className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-1 mr-2">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-green-500/20">
                        <ThumbsUp className="h-3 w-3 text-gray-400" />
                      </Button>
                      <span className="text-sm font-medium">15</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-red-500/20">
                        <ThumbsDown className="h-3 w-3 text-gray-400" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-muted-foreground">Posted by HomeownerSarah • 1 day ago</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Best practices for changing HVAC filters?</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        New homeowner here! How often should I change my HVAC filters? What type should I buy? Any recommendations for someone with allergies?
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>12 replies</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                          <Reply className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-1 mr-2">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-green-500/20">
                        <ThumbsUp className="h-3 w-3 text-gray-400" />
                      </Button>
                      <span className="text-sm font-medium">7</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-red-500/20">
                        <ThumbsDown className="h-3 w-3 text-gray-400" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-muted-foreground">Posted by ContractorJoe • 2 days ago</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Energy efficiency tips for older HVAC systems</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Working with a 15-year-old system that's still running strong. What are some cost-effective ways to improve efficiency without full replacement?
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>5 replies</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                          <Reply className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
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
            <h2 className="text-xl font-semibold mb-4">Browse by Category</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Organized discussions by topic area
            </p>
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
    </>
  );
}