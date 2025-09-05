import React, { useState, useEffect } from 'react';
import { getTechnicians, getServiceRequests, updateTechnicianStatus, updateTechnicianLocation, updateServiceRequest } from '@/lib/static-database';
import { MapPin, Clock, Phone, Navigation, CheckCircle, AlertCircle, Truck } from 'lucide-react';

export const TechPortal: React.FC = () => {
  const [technicians, setTechnicians] = useState(() => getTechnicians());
  const [serviceRequests, setServiceRequests] = useState(() => getServiceRequests());
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  // Simulate location updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate slight location changes for active techs
      technicians.forEach(tech => {
        if (tech.status === 'on_job' || tech.status === 'traveling') {
          const latOffset = (Math.random() - 0.5) * 0.001; // Small random movement
          const lngOffset = (Math.random() - 0.5) * 0.001;
          
          if (tech.currentLocation) {
            updateTechnicianLocation(
              tech.id,
              tech.currentLocation.lat + latOffset,
              tech.currentLocation.lng + lngOffset
            );
          }
        }
      });
      
      // Refresh data
      setTechnicians(getTechnicians());
    }, 30000);

    return () => clearInterval(interval);
  }, [technicians]);

  const handleStatusChange = (techId: string, newStatus: any, jobId?: string) => {
    updateTechnicianStatus(techId, newStatus, jobId);
    setTechnicians(getTechnicians());
    
    // Update job status if needed
    if (jobId && newStatus === 'completed') {
      updateServiceRequest(jobId, { status: 'completed', completedDate: new Date().toISOString() });
      setServiceRequests(getServiceRequests());
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'on_job': return 'bg-blue-100 text-blue-800';
      case 'traveling': return 'bg-yellow-100 text-yellow-800';
      case 'off_duty': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4" />;
      case 'on_job': return <AlertCircle className="w-4 h-4" />;
      case 'traveling': return <Truck className="w-4 h-4" />;
      case 'off_duty': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getCurrentJob = (techId: string) => {
    const tech = technicians.find(t => t.id === techId);
    if (!tech?.currentJob) return null;
    return serviceRequests.find(req => req.id === tech.currentJob);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="hvac-heading-xl text-gray-900 mb-2">Tech Portal</h1>
        <p className="text-gray-600">Live technician tracking and job management</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Technician List */}
        <div className="lg:col-span-2">
          <div className="service-card p-6">
            <h2 className="hvac-heading-lg text-gray-900 mb-6">Active Technicians</h2>
            
            <div className="space-y-4">
              {technicians.map((tech) => {
                const currentJob = getCurrentJob(tech.id);
                const isSelected = selectedTech === tech.id;
                
                return (
                  <div
                    key={tech.id}
                    onClick={() => setSelectedTech(tech.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {tech.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{tech.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            {tech.phone}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getStatusColor(tech.status)}`}>
                          {getStatusIcon(tech.status)}
                          {tech.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Current Location */}
                    {tech.currentLocation && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {tech.currentLocation.lat.toFixed(4)}, {tech.currentLocation.lng.toFixed(4)}
                        </span>
                        <span className="text-xs text-gray-400">
                          (Updated: {new Date(tech.currentLocation.lastUpdated).toLocaleTimeString()})
                        </span>
                      </div>
                    )}

                    {/* Current Job */}
                    {currentJob && (
                      <div className="bg-gray-50 rounded-lg p-3 mt-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{currentJob.serviceType}</h4>
                            <p className="text-sm text-gray-600">{currentJob.customerName}</p>
                            <p className="text-xs text-gray-500">{currentJob.address}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            currentJob.priority === 'emergency' ? 'bg-red-100 text-red-800' :
                            currentJob.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {currentJob.priority}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {tech.specialties.slice(0, 3).map((specialty) => (
                        <span
                          key={specialty}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tech Details & Controls */}
        <div>
          {selectedTech ? (
            <TechDetails 
              techId={selectedTech} 
              onStatusChange={handleStatusChange}
              onClose={() => setSelectedTech(null)}
            />
          ) : (
            <div className="service-card p-6 text-center">
              <div className="text-gray-400 mb-4">
                <Navigation className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-gray-600">Select a technician to view details and controls</p>
            </div>
          )}
        </div>
      </div>

      {/* Live Map Placeholder */}
      <div className="mt-8">
        <div className="service-card p-6">
          <h2 className="hvac-heading-lg text-gray-900 mb-4">Live Technician Map</h2>
          <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Interactive map showing real-time technician locations</p>
              <p className="text-sm text-gray-500 mt-1">
                Integration with Google Maps or similar service would go here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TechDetails: React.FC<{ 
  techId: string; 
  onStatusChange: (techId: string, status: any, jobId?: string) => void;
  onClose: () => void;
}> = ({ techId, onStatusChange, onClose }) => {
  const [technicians] = useState(() => getTechnicians());
  const [serviceRequests] = useState(() => getServiceRequests());
  
  const tech = technicians.find(t => t.id === techId);
  const currentJob = tech?.currentJob ? serviceRequests.find(req => req.id === tech.currentJob) : null;

  if (!tech) return null;

  const handleStatusUpdate = (newStatus: any) => {
    onStatusChange(techId, newStatus, tech.currentJob);
  };

  const handleJobComplete = () => {
    if (tech.currentJob) {
      onStatusChange(techId, 'available', tech.currentJob);
    }
  };

  return (
    <div className="service-card p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="hvac-heading-lg text-gray-900">Tech Control Panel</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="space-y-6">
        {/* Tech Info */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
            {tech.name.charAt(0)}
          </div>
          <h3 className="font-semibold text-gray-900">{tech.name}</h3>
          <p className="text-sm text-gray-600">{tech.email}</p>
          <a href={`tel:${tech.phone}`} className="text-sm text-blue-600 hover:underline">
            {tech.phone}
          </a>
        </div>

        {/* Current Status */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Current Status</h4>
          <div className="grid grid-cols-2 gap-2">
            {['available', 'on_job', 'traveling', 'off_duty'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusUpdate(status)}
                className={`p-2 text-sm rounded-lg border transition-colors ${
                  tech.status === status
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Current Job */}
        {currentJob && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Current Job</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h5 className="font-medium text-gray-900">{currentJob.serviceType}</h5>
                  <p className="text-sm text-gray-600">{currentJob.description}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  currentJob.priority === 'emergency' ? 'bg-red-100 text-red-800' :
                  currentJob.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {currentJob.priority}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div><strong>Customer:</strong> {currentJob.customerName}</div>
                <div><strong>Phone:</strong> 
                  <a href={`tel:${currentJob.customerPhone}`} className="text-blue-600 hover:underline ml-1">
                    {currentJob.customerPhone}
                  </a>
                </div>
                <div><strong>Address:</strong> {currentJob.address}</div>
                <div><strong>Estimated Cost:</strong> ${currentJob.estimatedCost}</div>
              </div>

              <button
                onClick={handleJobComplete}
                className="hvac-button-primary w-full mt-4"
              >
                Mark Job Complete
              </button>
            </div>
          </div>
        )}

        {/* Location Info */}
        {tech.currentLocation && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Current Location</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{tech.currentLocation.lat.toFixed(6)}, {tech.currentLocation.lng.toFixed(6)}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Last updated: {new Date(tech.currentLocation.lastUpdated).toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* Specialties */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Specialties</h4>
          <div className="flex flex-wrap gap-2">
            {tech.specialties.map((specialty) => (
              <span
                key={specialty}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`tel:${tech.phone}`}
              className="hvac-button-secondary text-center"
            >
              Call Tech
            </a>
            <a
              href={`sms:${tech.phone}`}
              className="hvac-button-secondary text-center"
            >
              Send SMS
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
