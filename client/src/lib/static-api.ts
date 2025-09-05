// Static API layer for client-side functionality
// This replaces server API calls for static deployment

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
  service?: string;
}

interface ServiceRequest {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  serviceType: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  description: string;
  preferredDate?: string;
  preferredTime?: string;
}

// Local storage keys
const STORAGE_KEYS = {
  CONTACTS: 'hvac_contacts',
  SERVICES: 'hvac_services',
  QUOTES: 'hvac_quotes'
};

// Email service using EmailJS or similar
export const sendContactEmail = async (data: ContactForm): Promise<boolean> => {
  try {
    // For now, store locally and show success
    // In production, integrate with EmailJS or similar service
    const contacts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACTS) || '[]');
    contacts.push({
      ...data,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    });
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
    
    // TODO: Replace with actual email service
    console.log('Contact form submitted:', data);
    return true;
  } catch (error) {
    console.error('Error sending contact email:', error);
    return false;
  }
};

export const submitServiceRequest = async (data: ServiceRequest): Promise<boolean> => {
  try {
    const services = JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICES) || '[]');
    services.push({
      ...data,
      timestamp: new Date().toISOString(),
      id: Date.now().toString(),
      status: 'pending'
    });
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    
    // TODO: Replace with actual service integration
    console.log('Service request submitted:', data);
    return true;
  } catch (error) {
    console.error('Error submitting service request:', error);
    return false;
  }
};

// Built-in admin accounts - no subscription required
export const getAdminAccounts = () => [
  {
    email: 'Derek@afterhourshvac.ca',
    role: 'admin',
    isAdmin: true,
    hasProAccess: true,
    membershipType: 'lifetime'
  },
  {
    email: 'Jordan@Afterhourshvac.ca',
    role: 'admin',
    isAdmin: true,
    hasProAccess: true,
    membershipType: 'lifetime'
  },
  {
    email: 'Admin@afterhourshvac.ca',
    role: 'admin',
    isAdmin: true,
    hasProAccess: true,
    membershipType: 'lifetime'
  }
];

// Check if email is admin account
export const isAdminEmail = (email: string): boolean => {
  const adminEmails = ['Derek@afterhourshvac.ca', 'Jordan@Afterhourshvac.ca', 'Admin@afterhourshvac.ca'];
  return adminEmails.includes(email);
};

// Get emergency contact info
export const getEmergencyContact = () => ({
  phone: '(403) 123-4567', // Replace with your actual number
  email: 'Jordan@Afterhourshvac.ca',
  available24_7: true
});

// Service areas for Calgary
export const getServiceAreas = () => [
  'Calgary NW',
  'Calgary NE', 
  'Calgary SW',
  'Calgary SE',
  'Airdrie',
  'Cochrane',
  'Okotoks',
  'Chestermere'
];

// Common HVAC services
export const getServices = () => [
  {
    id: 'furnace-repair',
    name: 'Furnace Repair',
    description: 'Emergency and scheduled furnace repairs',
    basePrice: 150,
    emergency: true
  },
  {
    id: 'ac-installation',
    name: 'Air Conditioning Installation',
    description: 'Professional AC installation and setup',
    basePrice: 2500,
    emergency: false
  },
  {
    id: 'duct-cleaning',
    name: 'Duct Cleaning',
    description: 'Complete ductwork cleaning and sanitization',
    basePrice: 300,
    emergency: false
  },
  {
    id: 'maintenance',
    name: 'HVAC Maintenance',
    description: 'Regular maintenance and tune-ups',
    basePrice: 120,
    emergency: false
  },
  {
    id: 'emergency',
    name: 'Emergency Service',
    description: '24/7 emergency HVAC repairs',
    basePrice: 200,
    emergency: true
  }
];

// Blog posts for SEO (static data)
export const getBlogPosts = () => [
  {
    id: 'winter-furnace-tips',
    title: 'Winter Furnace Maintenance Tips for Calgary Homes',
    excerpt: 'Keep your furnace running efficiently through Calgary winters with these essential maintenance tips.',
    content: `Calgary winters can be brutal on your HVAC system. Here are essential tips to keep your furnace running efficiently:

1. **Change Your Filter Monthly** - During winter months, change your furnace filter every 30 days to maintain airflow and efficiency.

2. **Check Your Thermostat** - Ensure your thermostat is working properly and consider upgrading to a programmable model.

3. **Clear Vents and Registers** - Make sure all vents are unobstructed by furniture or curtains.

4. **Schedule Professional Maintenance** - Annual maintenance can prevent costly breakdowns and improve efficiency.

5. **Monitor Your Energy Bills** - Sudden increases in heating costs may indicate system problems.

For emergency furnace repairs in Calgary, contact After Hours HVAC at (403) 123-4567.`,
    author: 'Jordan - After Hours HVAC',
    date: '2024-01-15',
    tags: ['furnace', 'winter', 'maintenance', 'calgary'],
    slug: 'winter-furnace-tips'
  },
  {
    id: 'ac-preparation',
    title: 'Preparing Your AC for Calgary Summer',
    excerpt: 'Get your air conditioning ready for hot Calgary summers with this comprehensive preparation guide.',
    content: `Calgary summers can get surprisingly hot. Prepare your AC system with these steps:

1. **Clean or Replace Filters** - Start the season with clean filters for optimal airflow.

2. **Clear Outdoor Unit** - Remove debris, leaves, and vegetation around your outdoor unit.

3. **Check Refrigerant Lines** - Inspect for damage or leaks in refrigerant lines.

4. **Test Your System** - Run your AC before the hot weather hits to identify any issues.

5. **Schedule Professional Service** - Have a technician inspect and service your system.

After Hours HVAC provides professional AC installation and maintenance throughout Calgary and surrounding areas.`,
    author: 'Jordan - After Hours HVAC',
    date: '2024-03-20',
    tags: ['air-conditioning', 'summer', 'preparation', 'calgary'],
    slug: 'ac-preparation'
  }
];
