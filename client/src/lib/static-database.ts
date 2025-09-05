// Static database layer for customer management, jobs, and employees
// This replaces server database for static deployment

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  customerType: 'residential' | 'commercial';
  totalSpent: number;
  lastContact: string;
  notes: string;
  services: ServiceRequest[];
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  serviceType: string;
  priority: 'low' | 'normal' | 'high' | 'emergency';
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  assignedTech: string;
  scheduledDate?: string;
  completedDate?: string;
  estimatedCost: number;
  actualCost?: number;
  description: string;
  internalNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  email: string;
  specialties: string[];
  currentLocation?: {
    lat: number;
    lng: number;
    lastUpdated: string;
  };
  currentJob?: string;
  status: 'available' | 'on_job' | 'traveling' | 'off_duty';
  avatar?: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  bio: string;
  avatar: string;
  specialties: string[];
  yearsExperience: number;
  certifications: string[];
  phone?: string;
  email?: string;
  isActive: boolean;
  displayOrder: number;
}

// Storage keys
const STORAGE_KEYS = {
  CUSTOMERS: 'hvac_customers',
  SERVICE_REQUESTS: 'hvac_service_requests',
  TECHNICIANS: 'hvac_technicians',
  EMPLOYEES: 'hvac_employees'
};

// Initialize with sample data if empty
const initializeData = () => {
  // Sample customers
  if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
    const sampleCustomers: Customer[] = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '(403) 555-0123',
        address: '123 Main St NW',
        city: 'Calgary',
        postalCode: 'T2N 1N4',
        customerType: 'residential',
        totalSpent: 2450.00,
        lastContact: '2024-01-15',
        notes: 'Preferred customer, always pays on time. Has 2-year-old furnace.',
        services: [],
        createdAt: '2023-11-01'
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '(403) 555-0456',
        address: '456 Oak Ave SW',
        city: 'Calgary',
        postalCode: 'T2S 2S4',
        customerType: 'residential',
        totalSpent: 850.00,
        lastContact: '2024-01-20',
        notes: 'New customer, interested in maintenance plan.',
        services: [],
        createdAt: '2024-01-10'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(sampleCustomers));
  }

  // Sample service requests
  if (!localStorage.getItem(STORAGE_KEYS.SERVICE_REQUESTS)) {
    const sampleRequests: ServiceRequest[] = [
      {
        id: 'SR-001',
        customerId: '1',
        customerName: 'John Smith',
        customerPhone: '(403) 555-0123',
        customerEmail: 'john.smith@email.com',
        address: '123 Main St NW, Calgary',
        serviceType: 'Furnace Repair',
        priority: 'high',
        status: 'in_progress',
        assignedTech: 'Derek',
        scheduledDate: '2024-01-25T10:00:00',
        estimatedCost: 350.00,
        description: 'Furnace not heating properly, making strange noises',
        internalNotes: 'Likely blower motor issue, parts ordered',
        createdAt: '2024-01-23T09:15:00',
        updatedAt: '2024-01-24T14:30:00'
      },
      {
        id: 'SR-002',
        customerId: '2',
        customerName: 'Sarah Johnson',
        customerPhone: '(403) 555-0456',
        customerEmail: 'sarah.j@email.com',
        address: '456 Oak Ave SW, Calgary',
        serviceType: 'AC Installation',
        priority: 'normal',
        status: 'scheduled',
        assignedTech: 'Jordan',
        scheduledDate: '2024-01-30T13:00:00',
        estimatedCost: 2800.00,
        description: 'New central air conditioning installation',
        internalNotes: 'Customer wants high-efficiency unit, quote approved',
        createdAt: '2024-01-20T11:00:00',
        updatedAt: '2024-01-22T16:45:00'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.SERVICE_REQUESTS, JSON.stringify(sampleRequests));
  }

  // Sample technicians
  if (!localStorage.getItem(STORAGE_KEYS.TECHNICIANS)) {
    const sampleTechs: Technician[] = [
      {
        id: 'tech-1',
        name: 'Derek',
        phone: '(403) 555-TECH',
        email: 'Derek@afterhourshvac.ca',
        specialties: ['Furnace Repair', 'Boiler Service', 'Emergency Repairs'],
        currentLocation: {
          lat: 51.0447,
          lng: -114.0719,
          lastUpdated: '2024-01-25T10:30:00'
        },
        currentJob: 'SR-001',
        status: 'on_job',
        avatar: '/assets/derek-avatar.jpg'
      },
      {
        id: 'tech-2',
        name: 'Jordan',
        phone: '(403) 555-HVAC',
        email: 'Jordan@Afterhourshvac.ca',
        specialties: ['AC Installation', 'Duct Work', 'Heat Pumps'],
        currentLocation: {
          lat: 51.0486,
          lng: -114.0708,
          lastUpdated: '2024-01-25T10:25:00'
        },
        status: 'traveling',
        avatar: '/assets/jordan-avatar.jpg'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.TECHNICIANS, JSON.stringify(sampleTechs));
  }

  // Sample employees
  if (!localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) {
    const sampleEmployees: Employee[] = [
      {
        id: 'emp-1',
        name: 'Jordan',
        position: 'Owner & Lead Technician',
        bio: 'With over 10 years of experience in HVAC systems, Jordan founded After Hours HVAC to provide reliable, professional service to Calgary homeowners.',
        avatar: '/assets/jordan-avatar.jpg',
        specialties: ['Furnace Installation', 'AC Repair', 'System Design'],
        yearsExperience: 10,
        certifications: ['Red Seal Gas Fitter', 'HVAC Excellence Certified'],
        phone: '(403) 123-4567',
        email: 'Jordan@Afterhourshvac.ca',
        isActive: true,
        displayOrder: 1
      },
      {
        id: 'emp-2',
        name: 'Derek',
        position: 'Senior HVAC Technician',
        bio: 'Derek brings 8 years of hands-on experience with residential and commercial HVAC systems. He specializes in emergency repairs and system diagnostics.',
        avatar: '/assets/derek-avatar.jpg',
        specialties: ['Emergency Repairs', 'Boiler Service', 'Diagnostics'],
        yearsExperience: 8,
        certifications: ['Journeyman Gas Fitter', 'Refrigeration Mechanic'],
        phone: '(403) 555-TECH',
        email: 'Derek@afterhourshvac.ca',
        isActive: true,
        displayOrder: 2
      }
    ];
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(sampleEmployees));
  }
};

// Customer management functions
export const getCustomers = (): Customer[] => {
  initializeData();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMERS) || '[]');
};

export const getCustomer = (id: string): Customer | null => {
  const customers = getCustomers();
  return customers.find(c => c.id === id) || null;
};

export const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt'>): Customer => {
  const customers = getCustomers();
  const newCustomer: Customer = {
    ...customer,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  customers.push(newCustomer);
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  return newCustomer;
};

export const updateCustomer = (id: string, updates: Partial<Customer>): Customer | null => {
  const customers = getCustomers();
  const index = customers.findIndex(c => c.id === id);
  if (index === -1) return null;
  
  customers[index] = { ...customers[index], ...updates };
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  return customers[index];
};

// Service request functions
export const getServiceRequests = (): ServiceRequest[] => {
  initializeData();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICE_REQUESTS) || '[]');
};

export const getServiceRequest = (id: string): ServiceRequest | null => {
  const requests = getServiceRequests();
  return requests.find(r => r.id === id) || null;
};

export const addServiceRequest = (request: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>): ServiceRequest => {
  const requests = getServiceRequests();
  const newRequest: ServiceRequest = {
    ...request,
    id: `SR-${String(requests.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  requests.push(newRequest);
  localStorage.setItem(STORAGE_KEYS.SERVICE_REQUESTS, JSON.stringify(requests));
  return newRequest;
};

export const updateServiceRequest = (id: string, updates: Partial<ServiceRequest>): ServiceRequest | null => {
  const requests = getServiceRequests();
  const index = requests.findIndex(r => r.id === id);
  if (index === -1) return null;
  
  requests[index] = { 
    ...requests[index], 
    ...updates, 
    updatedAt: new Date().toISOString() 
  };
  localStorage.setItem(STORAGE_KEYS.SERVICE_REQUESTS, JSON.stringify(requests));
  return requests[index];
};

// Technician functions
export const getTechnicians = (): Technician[] => {
  initializeData();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.TECHNICIANS) || '[]');
};

export const updateTechnicianLocation = (techId: string, lat: number, lng: number): void => {
  const techs = getTechnicians();
  const index = techs.findIndex(t => t.id === techId);
  if (index !== -1) {
    techs[index].currentLocation = {
      lat,
      lng,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.TECHNICIANS, JSON.stringify(techs));
  }
};

export const updateTechnicianStatus = (techId: string, status: Technician['status'], currentJob?: string): void => {
  const techs = getTechnicians();
  const index = techs.findIndex(t => t.id === techId);
  if (index !== -1) {
    techs[index].status = status;
    if (currentJob !== undefined) {
      techs[index].currentJob = currentJob;
    }
    localStorage.setItem(STORAGE_KEYS.TECHNICIANS, JSON.stringify(techs));
  }
};

// Employee management functions
export const getEmployees = (): Employee[] => {
  initializeData();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.EMPLOYEES) || '[]');
};

export const addEmployee = (employee: Omit<Employee, 'id'>): Employee => {
  const employees = getEmployees();
  const newEmployee: Employee = {
    ...employee,
    id: `emp-${Date.now()}`
  };
  employees.push(newEmployee);
  employees.sort((a, b) => a.displayOrder - b.displayOrder);
  localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  return newEmployee;
};

export const updateEmployee = (id: string, updates: Partial<Employee>): Employee | null => {
  const employees = getEmployees();
  const index = employees.findIndex(e => e.id === id);
  if (index === -1) return null;
  
  employees[index] = { ...employees[index], ...updates };
  employees.sort((a, b) => a.displayOrder - b.displayOrder);
  localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  return employees[index];
};

export const deleteEmployee = (id: string): boolean => {
  const employees = getEmployees();
  const filteredEmployees = employees.filter(e => e.id !== id);
  if (filteredEmployees.length === employees.length) return false;
  
  localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(filteredEmployees));
  return true;
};
