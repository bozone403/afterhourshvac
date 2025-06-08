import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Helmet } from "react-helmet-async";
import { 
  MessageSquare, 
  ThumbsUp, 
  Plus, 
  User, 
  Calendar, 
  Eye,
  Pin,
  Lock,
  Reply,
  Heart,
  Edit,
  Trash2,
  MoreVertical
} from "lucide-react";
import type { ForumTopic, ForumPost, ForumCategory, ForumLike, User as UserType } from "@shared/schema";

interface ExtendedForumTopic extends ForumTopic {
  likeCount?: number;
  hasLiked?: boolean;
  postCount?: number;
  lastActivity?: string;
  username?: string;
}

interface ExtendedForumPost extends ForumPost {
  likeCount?: number;
  hasLiked?: boolean;
  userName?: string;
}

export default function ForumInteractive() {
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicContent, setNewTopicContent] = useState("");
  const [newTopicUsername, setNewTopicUsername] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostUsername, setNewPostUsername] = useState("");
  const [showNewTopicDialog, setShowNewTopicDialog] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check authentication
  const { data: user } = useQuery<UserType>({
    queryKey: ["/api/user"]
  });

  // Auto-populate username fields when user data loads
  useEffect(() => {
    if (user?.username) {
      setNewTopicUsername(user.username);
      setNewPostUsername(user.username);
    }
  }, [user]);

  // Get forum categories
  const { data: categories = [] } = useQuery<ForumCategory[]>({
    queryKey: ["/api/forum/categories"]
  });

  // Get forum topics for selected category
  const { data: topics = [], isLoading: topicsLoading } = useQuery<ExtendedForumTopic[]>({
    queryKey: ["/api/forum/topics", selectedCategory],
    queryFn: async () => {
      const response = await fetch(`/api/forum/categories/${selectedCategory}/topics`);
      if (!response.ok) throw new Error("Failed to fetch topics");
      const topics = await response.json();
      
      // Enhance topics with like counts and user like status
      const enhancedTopics = await Promise.all(topics.map(async (topic: any) => {
        try {
          // Get like count
          const likeResponse = await fetch(`/api/forum/likes/count?topicId=${topic.id}`);
          const { count } = likeResponse.ok ? await likeResponse.json() : { count: 0 };
          
          // Check if user has liked (only if authenticated)
          let hasLiked = false;
          if (user) {
            const userLikeResponse = await fetch(`/api/forum/likes/check?topicId=${topic.id}`);
            if (userLikeResponse.ok) {
              const { hasLiked: liked } = await userLikeResponse.json();
              hasLiked = liked;
            }
          }
          
          return {
            ...topic,
            likeCount: count,
            hasLiked,
            postCount: 0, // TODO: Get actual post count
            lastActivity: topic.updatedAt,
            username: topic.username || 'Unknown User'
          };
        } catch {
          return {
            ...topic,
            likeCount: 0,
            hasLiked: false,
            postCount: 0,
            lastActivity: topic.updatedAt
          };
        }
      }));
      
      return enhancedTopics;
    },
    enabled: !!selectedCategory
  });

  // Get forum posts for selected topic
  const { data: posts = [], isLoading: postsLoading } = useQuery<ExtendedForumPost[]>({
    queryKey: ["/api/forum/posts", selectedTopic],
    queryFn: async () => {
      if (!selectedTopic) return [];
      
      const response = await fetch(`/api/forum/topics/${selectedTopic}/posts`);
      if (!response.ok) throw new Error("Failed to fetch posts");
      const posts = await response.json();
      
      // Enhance posts with like counts and user like status
      const enhancedPosts = await Promise.all(posts.map(async (post: any) => {
        try {
          // Get like count
          const likeResponse = await fetch(`/api/forum/likes/count?postId=${post.id}`);
          const { count } = likeResponse.ok ? await likeResponse.json() : { count: 0 };
          
          // Check if user has liked (only if authenticated)
          let hasLiked = false;
          if (user) {
            const userLikeResponse = await fetch(`/api/forum/likes/check?postId=${post.id}`);
            if (userLikeResponse.ok) {
              const { hasLiked: liked } = await userLikeResponse.json();
              hasLiked = liked;
            }
          }
          
          return {
            ...post,
            likeCount: count,
            hasLiked,
            userName: post.username || `User ${post.userId}`
          };
        } catch {
          return {
            ...post,
            likeCount: 0,
            hasLiked: false,
            userName: post.username || `User ${post.userId}`
          };
        }
      }));
      
      return enhancedPosts;
    },
    enabled: !!selectedTopic
  });

  // Create new topic mutation
  const createTopicMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; categoryId: number; username?: string }) => {
      const response = await apiRequest("POST", "/api/forum/topics", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/topics"] });
      setNewTopicTitle("");
      setNewTopicContent("");
      setNewTopicUsername("");
      setShowNewTopicDialog(false);
      toast({
        title: "Success",
        description: "Topic created successfully!"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Create new post mutation
  const createPostMutation = useMutation({
    mutationFn: async (data: { content: string; topicId: number; username?: string }) => {
      const response = await apiRequest("POST", "/api/forum/posts", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      setNewPostContent("");
      setNewPostUsername("");
      toast({
        title: "Success",
        description: "Post created successfully!"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Like/unlike topic mutation
  const likeTopicMutation = useMutation({
    mutationFn: async ({ topicId, isLiking }: { topicId: number; isLiking: boolean }) => {
      if (isLiking) {
        const response = await apiRequest("POST", "/api/forum/likes", { topicId });
        return response.json();
      } else {
        const response = await apiRequest("DELETE", `/api/forum/likes?topicId=${topicId}`);
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/topics"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Like/unlike post mutation
  const likePostMutation = useMutation({
    mutationFn: async ({ postId, isLiking }: { postId: number; isLiking: boolean }) => {
      if (isLiking) {
        const response = await apiRequest("POST", "/api/forum/likes", { postId });
        return response.json();
      } else {
        const response = await apiRequest("DELETE", `/api/forum/likes?postId=${postId}`);
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Edit post mutation
  const editPostMutation = useMutation({
    mutationFn: async ({ postId, content }: { postId: number; content: string }) => {
      const response = await apiRequest("PUT", `/api/forum/posts/${postId}`, { content });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      setEditingPostId(null);
      setEditingContent("");
      toast({
        title: "Success",
        description: "Post updated successfully!"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await apiRequest("DELETE", `/api/forum/posts/${postId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      toast({
        title: "Success",
        description: "Post deleted successfully!"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleCreateTopic = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create topics",
        variant: "destructive"
      });
      return;
    }

    if (!newTopicTitle.trim() || !newTopicContent.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both title and content",
        variant: "destructive"
      });
      return;
    }

    createTopicMutation.mutate({
      title: newTopicTitle,
      content: newTopicContent,
      categoryId: selectedCategory,
      username: newTopicUsername.trim() || `User ${user.id}`
    });
  };

  const handleCreatePost = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create posts",
        variant: "destructive"
      });
      return;
    }

    if (!newPostContent.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter post content",
        variant: "destructive"
      });
      return;
    }

    if (!selectedTopic) {
      toast({
        title: "Error",
        description: "No topic selected",
        variant: "destructive"
      });
      return;
    }

    createPostMutation.mutate({
      content: newPostContent,
      topicId: selectedTopic,
      username: newPostUsername.trim() || `User ${user.id}`
    });
  };

  const handleLikeTopic = (topicId: number, currentlyLiked: boolean) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like topics",
        variant: "destructive"
      });
      return;
    }

    likeTopicMutation.mutate({
      topicId,
      isLiking: !currentlyLiked
    });
  };

  const handleLikePost = (postId: number, currentlyLiked: boolean) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like posts",
        variant: "destructive"
      });
      return;
    }

    likePostMutation.mutate({
      postId,
      isLiking: !currentlyLiked
    });
  };

  const handleEditPost = (postId: number, currentContent: string) => {
    setEditingPostId(postId);
    setEditingContent(currentContent);
  };

  const handleSaveEdit = (postId: number) => {
    if (!editingContent.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter post content",
        variant: "destructive"
      });
      return;
    }

    editPostMutation.mutate({
      postId,
      content: editingContent
    });
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditingContent("");
  };

  const handleDeletePost = (postId: number) => {
    if (confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      deletePostMutation.mutate(postId);
    }
  };

  const canEditPost = (post: ExtendedForumPost) => {
    if (!user) return false;
    return user.isAdmin || user.username === 'JordanBoz' || post.userId === user.id;
  };

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return 'Unknown';
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Interactive Forum - AfterHours HVAC</title>
        <meta name="description" content="Join our interactive HVAC professional forum. Share knowledge, ask questions, and connect with industry experts." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">HVAC Professional Forum</h1>
          <p className="text-lg text-gray-700">Connect with industry professionals, share knowledge, and get expert advice</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setSelectedTopic(null);
                    }}
                  >
                    {category.name}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {!selectedTopic ? (
              /* Topics List */
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {categories.find(c => c.id === selectedCategory)?.name || "Topics"}
                  </h2>
                  <Dialog open={showNewTopicDialog} onOpenChange={setShowNewTopicDialog}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                        <Plus className="h-4 w-4" />
                        New Topic
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-white border-2 border-blue-200 shadow-xl">
                      <DialogHeader className="bg-blue-50 -m-6 mb-6 p-6 rounded-t-lg">
                        <DialogTitle className="text-xl font-bold text-blue-900">Create New Topic</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                          <Input
                            value={newTopicUsername}
                            onChange={(e) => setNewTopicUsername(e.target.value)}
                            placeholder="Enter your display name for this post..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                          <Input
                            value={newTopicTitle}
                            onChange={(e) => setNewTopicTitle(e.target.value)}
                            placeholder="Enter topic title..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                          <Textarea
                            value={newTopicContent}
                            onChange={(e) => setNewTopicContent(e.target.value)}
                            placeholder="Enter topic content..."
                            rows={6}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowNewTopicDialog(false)}>
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleCreateTopic}
                            disabled={createTopicMutation.isPending}
                          >
                            {createTopicMutation.isPending ? "Creating..." : "Create Topic"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {topicsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topics.map((topic) => (
                      <Card key={topic.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1" onClick={() => setSelectedTopic(topic.id)}>
                              <div className="flex items-center gap-2 mb-2">
                                {topic.isPinned && <Pin className="h-4 w-4 text-blue-600" />}
                                {topic.isLocked && <Lock className="h-4 w-4 text-red-600" />}
                                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                                  {topic.title}
                                </h3>
                              </div>
                              <p className="text-gray-700 mb-4 line-clamp-2">{topic.content}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  User {topic.userId}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {formatDate(topic.createdAt)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="h-4 w-4" />
                                  {topic.views} views
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="h-4 w-4" />
                                  {topic.postCount || 0} replies
                                </div>
                              </div>
                            </div>
                            <div className="ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`flex items-center gap-1 ${topic.hasLiked ? 'text-red-600' : 'text-gray-600'}`}
                                onClick={() => handleLikeTopic(topic.id, topic.hasLiked || false)}
                              >
                                <Heart className={`h-4 w-4 ${topic.hasLiked ? 'fill-current' : ''}`} />
                                {topic.likeCount || 0}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Posts View */
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Button variant="outline" onClick={() => setSelectedTopic(null)}>
                    ← Back to Topics
                  </Button>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {topics.find(t => t.id === selectedTopic)?.title}
                  </h2>
                </div>

                {postsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post, index) => (
                      <Card key={post.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                                {post.userName ? post.userName.charAt(0).toUpperCase() : 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-900">{post.userName}</span>
                                  <span className="text-sm text-gray-600">
                                    {formatDate(post.createdAt)}
                                  </span>
                                  {post.isEdited && (
                                    <Badge variant="secondary" className="text-xs">
                                      Edited
                                    </Badge>
                                  )}
                                  {index === 0 && (
                                    <Badge variant="outline" className="text-xs">
                                      Original Post
                                    </Badge>
                                  )}
                                </div>
                                {canEditPost(post) && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => handleEditPost(post.id, post.content)}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Post
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        onClick={() => handleDeletePost(post.id)}
                                        className="text-red-600"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Post
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
                              </div>
                              
                              {editingPostId === post.id ? (
                                <div className="space-y-3 mb-4">
                                  <Textarea
                                    value={editingContent}
                                    onChange={(e) => setEditingContent(e.target.value)}
                                    rows={4}
                                  />
                                  <div className="flex gap-2">
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleSaveEdit(post.id)}
                                      disabled={editPostMutation.isPending}
                                    >
                                      {editPostMutation.isPending ? "Saving..." : "Save"}
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      onClick={handleCancelEdit}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-gray-800 whitespace-pre-wrap mb-4">{post.content}</p>
                              )}
                              
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`flex items-center gap-1 ${post.hasLiked ? 'text-red-600' : 'text-gray-600'}`}
                                  onClick={() => handleLikePost(post.id, post.hasLiked || false)}
                                >
                                  <Heart className={`h-4 w-4 ${post.hasLiked ? 'fill-current' : ''}`} />
                                  {post.likeCount || 0}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {/* New Post Form */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Reply className="h-5 w-5" />
                          Reply to Topic
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                            <Input
                              value={newPostUsername}
                              onChange={(e) => setNewPostUsername(e.target.value)}
                              placeholder="Enter your display name for this reply..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Reply</label>
                            <Textarea
                              value={newPostContent}
                              onChange={(e) => setNewPostContent(e.target.value)}
                              placeholder="Enter your reply..."
                              rows={4}
                            />
                          </div>
                          <div className="flex justify-end">
                            <Button 
                              onClick={handleCreatePost}
                              disabled={createPostMutation.isPending}
                            >
                              {createPostMutation.isPending ? "Posting..." : "Post Reply"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}