import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  Settings,
  UserPlus,
  Wrench,
  Database,
  Activity
} from 'lucide-react';
import { getCustomers, getServiceRequests, getTechnicians, getEmployees } from '@/lib/static-database';
import type { Customer, ServiceRequest, Technician, Employee } from '@/lib/static-database';
import { CustomerDatabase } from './CustomerDatabase';
import { TechPortal } from './TechPortal';
import { EmployeeManager } from './EmployeeManager';

const AdminDashboard = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setCustomers(getCustomers());
    setServiceRequests(getServiceRequests());
    setTechnicians(getTechnicians());
    setEmployees(getEmployees());
  }, []);

  // Calculate dashboard metrics
  const totalRevenue = serviceRequests
    .filter(req => req.status === 'completed')
    .reduce((sum, req) => sum + (req.actualCost || req.estimatedCost), 0);

  const pendingJobs = serviceRequests.filter(req => req.status === 'pending').length;
  const activeJobs = serviceRequests.filter(req => req.status === 'in_progress').length;
  const completedJobs = serviceRequests.filter(req => req.status === 'completed').length;

  const activeTechs = technicians.filter(tech => tech.status !== 'off_duty').length;
  const availableTechs = technicians.filter(tech => tech.status === 'available').length;

  const recentCustomers = customers
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const urgentJobs = serviceRequests
    .filter(req => req.priority === 'emergency' && req.status !== 'completed')
    .slice(0, 3);

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Customers",
      value: customers.length.toString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Jobs",
      value: activeJobs.toString(),
      icon: Wrench,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Available Techs",
      value: `${availableTechs}/${technicians.length}`,
      icon: UserPlus,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your HVAC business operations</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800">
              <Activity className="w-4 h-4 mr-1" />
              System Online
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="customers">Customer Database</TabsTrigger>
            <TabsTrigger value="technicians">Tech Portal</TabsTrigger>
            <TabsTrigger value="employees">Employee Manager</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Job Status Overview */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Job Status Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                      <span className="font-medium">Pending Jobs</span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">{pendingJobs}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <Activity className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="font-medium">In Progress</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">{activeJobs}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span className="font-medium">Completed</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">{completedJobs}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Urgent Jobs */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                    Urgent Jobs
                  </CardTitle>
                  <CardDescription>Emergency and high-priority service requests</CardDescription>
                </CardHeader>
                <CardContent>
                  {urgentJobs.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No urgent jobs at the moment</p>
                  ) : (
                    <div className="space-y-3">
                      {urgentJobs.map((job) => (
                        <div key={job.id} className="p-3 border border-red-200 rounded-lg bg-red-50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{job.customerName}</span>
                            <Badge className="bg-red-100 text-red-800">{job.priority}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{job.serviceType}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="w-4 h-4 mr-1" />
                            {job.customerPhone}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Customers */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Recent Customers
                  </CardTitle>
                  <CardDescription>Latest customer registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentCustomers.map((customer) => (
                      <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{customer.name}</p>
                          <p className="text-sm text-gray-600">{customer.customerType}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">${customer.totalSpent}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(customer.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Technician Status */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Technician Status
                  </CardTitle>
                  <CardDescription>Current technician availability and locations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {technicians.map((tech) => (
                      <div key={tech.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{tech.name}</p>
                          <p className="text-sm text-gray-600">{tech.specialties.join(', ')}</p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            className={
                              tech.status === 'available' ? 'bg-green-100 text-green-800' :
                              tech.status === 'on_job' ? 'bg-blue-100 text-blue-800' :
                              tech.status === 'traveling' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }
                          >
                            {tech.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    onClick={() => setActiveTab('customers')}
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <Database className="w-6 h-6" />
                    <span>View Customers</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('technicians')}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <MapPin className="w-6 h-6" />
                    <span>Track Techs</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('employees')}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <UserPlus className="w-6 h-6" />
                    <span>Manage Staff</span>
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => window.open('/contact', '_blank')}
                  >
                    <Mail className="w-6 h-6" />
                    <span>New Quote</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers">
            <CustomerDatabase />
          </TabsContent>

          <TabsContent value="technicians">
            <TechPortal />
          </TabsContent>

          <TabsContent value="employees">
            <EmployeeManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
