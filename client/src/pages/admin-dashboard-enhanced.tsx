import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Users, UserPlus, Settings, Shield, AlertTriangle, Eye, Edit, Trash2, RefreshCw, Lock, Unlock, FileText, Calendar, DollarSign, Activity } from "lucide-react";

interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: string;
  userType: string;
  hasProAccess: boolean;
  isAdmin: boolean;
  accountLocked?: boolean;
  createdAt: string;
  lastLogin?: string;
  lockedAt?: string;
  lockReason?: string;
}

interface JobApplication {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  coverLetter?: string;
  status: string;
  appliedAt: string;
  yearsExperience?: string;
  education?: string;
  certifications?: string;
  availability?: string;
  salaryExpectation?: string;
  references?: string;
}

interface CreateUserForm {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  userType: string;
  hasProAccess: boolean;
  isAdmin: boolean;
}

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  proUsers: number;
  adminUsers: number;
  pendingApplications: number;
  totalRevenue: number;
}

export default function AdminDashboardEnhanced() {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [createUserForm, setCreateUserForm] = useState<CreateUserForm>({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "customer",
    userType: "customer",
    hasProAccess: false,
    isAdmin: false
  });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [newPassword, setNewPassword] = useState("");

  // Fetch users
  const { data: users = [], isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: true
  });

  // Fetch job applications
  const { data: applications = [], isLoading: applicationsLoading, refetch: refetchApplications } = useQuery({
    queryKey: ["/api/admin/job-applications"],
    enabled: true
  });

  // Fetch service bookings
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["/api/admin/bookings"],
    enabled: true
  });

  // Fetch contact messages
  const { data: contacts = [], isLoading: contactsLoading } = useQuery({
    queryKey: ["/api/admin/contacts"],
    enabled: true
  });

  // Fetch emergency requests
  const { data: emergencyRequests = [], isLoading: emergencyLoading } = useQuery({
    queryKey: ["/api/admin/emergency-requests"],
    enabled: true
  });

  // Fetch forum posts
  const { data: forumPosts = [], isLoading: forumLoading } = useQuery({
    queryKey: ["/api/admin/forum-posts"],
    enabled: true
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: CreateUserForm) => {
      const res = await apiRequest("POST", "/api/admin/users", userData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User created successfully"
      });
      setShowCreateDialog(false);
      setCreateUserForm({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        role: "customer",
        userType: "customer",
        hasProAccess: false,
        isAdmin: false
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive"
      });
    }
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, ...userData }: Partial<User> & { id: number }) => {
      const res = await apiRequest("PUT", `/api/admin/users/${id}`, userData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User updated successfully"
      });
      setShowEditDialog(false);
      setEditingUser(null);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive"
      });
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await apiRequest("DELETE", `/api/admin/users/${userId}`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User deleted successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive"
      });
    }
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ userId, newPassword }: { userId: number; newPassword: string }) => {
      const res = await apiRequest("POST", `/api/admin/users/${userId}/reset-password`, { newPassword });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password reset successfully"
      });
      setNewPassword("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reset password",
        variant: "destructive"
      });
    }
  });

  // Update application status mutation
  const updateApplicationMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number; status: string; notes?: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/job-applications/${id}`, { status, notes });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Application status updated successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/job-applications"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update application",
        variant: "destructive"
      });
    }
  });

  const handleCreateUser = () => {
    if (!createUserForm.username || !createUserForm.email || !createUserForm.password) {
      toast({
        title: "Error",
        description: "Username, email, and password are required",
        variant: "destructive"
      });
      return;
    }
    createUserMutation.mutate(createUserForm);
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;
    updateUserMutation.mutate(editingUser);
  };

  const handleDeleteUser = (userId: number) => {
    deleteUserMutation.mutate(userId);
  };

  const handleResetPassword = (userId: number) => {
    if (!newPassword || newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }
    resetPasswordMutation.mutate({ userId, newPassword });
  };

  const handleToggleUserLock = (user: User) => {
    updateUserMutation.mutate({
      id: user.id,
      accountLocked: !user.accountLocked
    });
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'pro': return 'bg-purple-100 text-purple-800';
      case 'corporate': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewing': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate system statistics
  const systemStats: SystemStats = {
    totalUsers: users.length,
    activeUsers: users.filter((u: User) => !u.accountLocked).length,
    proUsers: users.filter((u: User) => u.hasProAccess).length,
    adminUsers: users.filter((u: User) => u.isAdmin).length,
    pendingApplications: applications.filter((a: JobApplication) => a.status === 'pending').length,
    totalRevenue: users.filter((u: User) => u.hasProAccess).length * 49 // Estimate based on pro users
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive user and system management</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => refetchUsers()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.activeUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pro Users</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.proUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.adminUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Apps</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.pendingApplications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Est. Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${systemStats.totalRevenue}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="applications">Job Applications</TabsTrigger>
          <TabsTrigger value="bookings">Service Bookings</TabsTrigger>
          <TabsTrigger value="contacts">Contact Messages</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Requests</TabsTrigger>
          <TabsTrigger value="forum">Forum Management</TabsTrigger>
        </TabsList>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Create, edit, and manage user accounts</CardDescription>
                </div>
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New User</DialogTitle>
                      <DialogDescription>
                        Create a new user account with specified permissions
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            value={createUserForm.username}
                            onChange={(e) => setCreateUserForm({ ...createUserForm, username: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={createUserForm.email}
                            onChange={(e) => setCreateUserForm({ ...createUserForm, email: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={createUserForm.password}
                          onChange={(e) => setCreateUserForm({ ...createUserForm, password: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={createUserForm.firstName}
                            onChange={(e) => setCreateUserForm({ ...createUserForm, firstName: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={createUserForm.lastName}
                            onChange={(e) => setCreateUserForm({ ...createUserForm, lastName: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={createUserForm.phone}
                          onChange={(e) => setCreateUserForm({ ...createUserForm, phone: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="role">Role</Label>
                          <Select value={createUserForm.role} onValueChange={(value) => setCreateUserForm({ ...createUserForm, role: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="customer">Customer</SelectItem>
                              <SelectItem value="technician">Technician</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="userType">User Type</Label>
                          <Select value={createUserForm.userType} onValueChange={(value) => setCreateUserForm({ ...createUserForm, userType: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="customer">Customer</SelectItem>
                              <SelectItem value="pro">Pro</SelectItem>
                              <SelectItem value="corporate">Corporate</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="hasProAccess"
                            checked={createUserForm.hasProAccess}
                            onCheckedChange={(checked) => setCreateUserForm({ ...createUserForm, hasProAccess: checked })}
                          />
                          <Label htmlFor="hasProAccess">Pro Access</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="isAdmin"
                            checked={createUserForm.isAdmin}
                            onCheckedChange={(checked) => setCreateUserForm({ ...createUserForm, isAdmin: checked })}
                          />
                          <Label htmlFor="isAdmin">Admin Privileges</Label>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleCreateUser}
                        disabled={createUserMutation.isPending}
                      >
                        {createUserMutation.isPending ? "Creating..." : "Create User"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map((user: User) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{user.username}</h4>
                            <Badge className={getUserTypeColor(user.userType)}>
                              {user.userType}
                            </Badge>
                            {user.isAdmin && <Badge variant="destructive">Admin</Badge>}
                            {user.hasProAccess && <Badge variant="secondary">Pro</Badge>}
                            {user.accountLocked && <Badge variant="outline"><Lock className="h-3 w-3 mr-1" />Locked</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : "No name set"}
                            {user.phone && ` • ${user.phone}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>User Details</DialogTitle>
                            </DialogHeader>
                            {selectedUser && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Username</Label>
                                    <p className="font-mono text-sm">{selectedUser.username}</p>
                                  </div>
                                  <div>
                                    <Label>Email</Label>
                                    <p className="font-mono text-sm">{selectedUser.email}</p>
                                  </div>
                                  <div>
                                    <Label>Role</Label>
                                    <p className="font-mono text-sm">{selectedUser.role}</p>
                                  </div>
                                  <div>
                                    <Label>User Type</Label>
                                    <p className="font-mono text-sm">{selectedUser.userType}</p>
                                  </div>
                                  <div>
                                    <Label>Created</Label>
                                    <p className="font-mono text-sm">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <Label>Last Login</Label>
                                    <p className="font-mono text-sm">{selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : 'Never'}</p>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label>Password Reset</Label>
                                  <div className="flex gap-2">
                                    <Input
                                      type="password"
                                      placeholder="New password (min 6 characters)"
                                      value={newPassword}
                                      onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <Button 
                                      onClick={() => handleResetPassword(selectedUser.id)}
                                      disabled={resetPasswordMutation.isPending}
                                      size="sm"
                                    >
                                      Reset
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            setEditingUser(user);
                            setShowEditDialog(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleToggleUserLock(user)}
                        >
                          {user.accountLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete User</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {user.username}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Job Applications Tab */}
        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Applications</CardTitle>
              <CardDescription>Review and manage job applications</CardDescription>
            </CardHeader>
            <CardContent>
              {applicationsLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((application: JobApplication) => (
                    <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{application.firstName} {application.lastName}</h4>
                            <Badge className={getStatusColor(application.status)}>
                              {application.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{application.email} • {application.phone}</p>
                          <p className="text-sm text-muted-foreground">
                            Position: {application.position} • Applied: {new Date(application.appliedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedApplication(application)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Application Details</DialogTitle>
                            </DialogHeader>
                            {selectedApplication && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Name</Label>
                                    <p>{selectedApplication.firstName} {selectedApplication.lastName}</p>
                                  </div>
                                  <div>
                                    <Label>Email</Label>
                                    <p>{selectedApplication.email}</p>
                                  </div>
                                  <div>
                                    <Label>Phone</Label>
                                    <p>{selectedApplication.phone}</p>
                                  </div>
                                  <div>
                                    <Label>Position</Label>
                                    <p>{selectedApplication.position}</p>
                                  </div>
                                </div>
                                <div>
                                  <Label>Experience</Label>
                                  <p className="text-sm">{selectedApplication.experience}</p>
                                </div>
                                {selectedApplication.coverLetter && (
                                  <div>
                                    <Label>Cover Letter</Label>
                                    <p className="text-sm">{selectedApplication.coverLetter}</p>
                                  </div>
                                )}
                                <div className="flex gap-2">
                                  <Select 
                                    value={selectedApplication.status} 
                                    onValueChange={(status) => 
                                      updateApplicationMutation.mutate({ 
                                        id: selectedApplication.id, 
                                        status 
                                      })
                                    }
                                  >
                                    <SelectTrigger className="w-40">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="reviewing">Reviewing</SelectItem>
                                      <SelectItem value="approved">Approved</SelectItem>
                                      <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Service Bookings Tab */}
        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Bookings</CardTitle>
              <CardDescription>Manage customer service appointments and bookings</CardDescription>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings && bookings.length > 0 ? (
                    bookings.map((booking: any) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{booking.customerName}</h4>
                          <p className="text-sm text-muted-foreground">{booking.service} • {booking.date}</p>
                          <p className="text-sm text-muted-foreground">{booking.address}</p>
                        </div>
                        <Badge>{booking.status}</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No service bookings found</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Messages Tab */}
        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Messages</CardTitle>
              <CardDescription>Review and respond to customer inquiries</CardDescription>
            </CardHeader>
            <CardContent>
              {contactsLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts && contacts.length > 0 ? (
                    contacts.map((contact: any) => (
                      <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{contact.name}</h4>
                          <p className="text-sm text-muted-foreground">{contact.email} • {contact.phone}</p>
                          <p className="text-sm">{contact.message}</p>
                        </div>
                        <Badge variant={contact.responded ? "default" : "secondary"}>
                          {contact.responded ? "Responded" : "Pending"}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No contact messages found</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergency Requests Tab */}
        <TabsContent value="emergency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Service Requests</CardTitle>
              <CardDescription>Monitor urgent HVAC service requests</CardDescription>
            </CardHeader>
            <CardContent>
              {emergencyLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {emergencyRequests && emergencyRequests.length > 0 ? (
                    emergencyRequests.map((request: any) => (
                      <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold">{request.name}</h4>
                          <p className="text-sm text-muted-foreground">{request.phone} • {request.address}</p>
                          <p className="text-sm">{request.issueDescription}</p>
                          <p className="text-sm text-muted-foreground">
                            Priority: {request.urgencyLevel} • Cost: ${request.totalCost}
                          </p>
                          {request.notes && (
                            <p className="text-sm text-blue-600 mt-1">Notes: {request.notes}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Select
                            value={request.status}
                            onValueChange={(newStatus) => updateEmergencyRequest(request.id, { status: newStatus })}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <span className="text-xs text-muted-foreground">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No emergency requests found</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Forum Management Tab */}
        <TabsContent value="forum" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Forum Management</CardTitle>
              <CardDescription>Moderate forum posts and discussions</CardDescription>
            </CardHeader>
            <CardContent>
              {forumLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {forumPosts && forumPosts.length > 0 ? (
                    forumPosts.map((post: any) => (
                      <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{post.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            By: {post.author} • Category: {post.category}
                          </p>
                          <p className="text-sm">{post.content?.substring(0, 150)}...</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge variant={post.isPublished ? "default" : "secondary"}>
                            {post.isPublished ? "Published" : "Draft"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No forum posts found</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-username">Username</Label>
                  <Input
                    id="edit-username"
                    value={editingUser.username}
                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-firstName">First Name</Label>
                  <Input
                    id="edit-firstName"
                    value={editingUser.firstName || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-lastName">Last Name</Label>
                  <Input
                    id="edit-lastName"
                    value={editingUser.lastName || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editingUser.phone || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-role">Role</Label>
                  <Select value={editingUser.role} onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="technician">Technician</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-userType">User Type</Label>
                  <Select value={editingUser.userType} onValueChange={(value) => setEditingUser({ ...editingUser, userType: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-hasProAccess"
                    checked={editingUser.hasProAccess}
                    onCheckedChange={(checked) => setEditingUser({ ...editingUser, hasProAccess: checked })}
                  />
                  <Label htmlFor="edit-hasProAccess">Pro Access</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-isAdmin"
                    checked={editingUser.isAdmin}
                    onCheckedChange={(checked) => setEditingUser({ ...editingUser, isAdmin: checked })}
                  />
                  <Label htmlFor="edit-isAdmin">Admin Privileges</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-accountLocked"
                    checked={editingUser.accountLocked || false}
                    onCheckedChange={(checked) => setEditingUser({ ...editingUser, accountLocked: checked })}
                  />
                  <Label htmlFor="edit-accountLocked">Account Locked</Label>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateUser}
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? "Updating..." : "Update User"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}