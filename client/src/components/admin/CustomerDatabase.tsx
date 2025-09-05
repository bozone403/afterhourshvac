import React, { useState } from 'react';
import { getCustomers, getServiceRequests, addCustomer, updateCustomer } from '@/lib/static-database';
import { Search, Phone, Mail, MapPin, DollarSign, Calendar, Plus, Edit2 } from 'lucide-react';

export const CustomerDatabase: React.FC = () => {
  const [customers] = useState(() => getCustomers());
  const [serviceRequests] = useState(() => getServiceRequests());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const getCustomerServices = (customerId: string) => {
    return serviceRequests.filter(req => req.customerId === customerId);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="hvac-heading-xl text-gray-900">Customer Database</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="hvac-button-primary inline-flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Customer
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="hvac-input pl-10"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-2">
          <div className="service-card p-6">
            <h2 className="hvac-heading-lg text-gray-900 mb-4">
              Customers ({filteredCustomers.length})
            </h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredCustomers.map((customer) => {
                const customerServices = getCustomerServices(customer.id);
                const isSelected = selectedCustomer === customer.id;
                
                return (
                  <div
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {customer.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {customer.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {customer.city}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {formatCurrency(customer.totalSpent)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          customer.customerType === 'commercial' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {customer.customerType}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {customerServices.length} service{customerServices.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div>
          {selectedCustomer ? (
            <CustomerDetails 
              customerId={selectedCustomer} 
              onClose={() => setSelectedCustomer(null)}
            />
          ) : (
            <div className="service-card p-6 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-gray-600">Select a customer to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CustomerDetails: React.FC<{ customerId: string; onClose: () => void }> = ({ 
  customerId, 
  onClose 
}) => {
  const [customers] = useState(() => getCustomers());
  const [serviceRequests] = useState(() => getServiceRequests());
  
  const customer = customers.find(c => c.id === customerId);
  const customerServices = serviceRequests.filter(req => req.customerId === customerId);

  if (!customer) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="service-card p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="hvac-heading-lg text-gray-900">Customer Details</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">{customer.name}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <a href={`tel:${customer.phone}`} className="text-blue-600 hover:underline">
                {customer.phone}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <a href={`mailto:${customer.email}`} className="text-blue-600 hover:underline">
                {customer.email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{customer.address}, {customer.city} {customer.postalCode}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="stat-card p-4">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(customer.totalSpent)}
            </div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>
          <div className="stat-card p-4">
            <div className="text-2xl font-bold text-green-600">
              {customerServices.length}
            </div>
            <div className="text-sm text-gray-600">Services</div>
          </div>
        </div>

        {/* Notes */}
        {customer.notes && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {customer.notes}
            </p>
          </div>
        )}

        {/* Service History */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Service History</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {customerServices.length > 0 ? (
              customerServices.map((service) => (
                <div key={service.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="font-medium text-gray-900">{service.serviceType}</h5>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(service.status)}`}>
                      {service.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Tech: {service.assignedTech}</span>
                    <span>{formatCurrency(service.estimatedCost)}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No service history</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`tel:${customer.phone}`}
              className="hvac-button-secondary text-center"
            >
              Call Customer
            </a>
            <a
              href={`mailto:${customer.email}`}
              className="hvac-button-secondary text-center"
            >
              Send Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
