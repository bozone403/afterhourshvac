# AfterHours HVAC User Type System

## User Roles

### 1. **Customer** (`role: 'customer'`)
- **Purpose**: Homeowners and property managers who need HVAC services
- **Access Level**: Basic
- **Default Membership**: `free`
- **Can Access**:
  - Service booking and requests
  - Basic calculators (BTU, energy savings)
  - Contact forms and emergency requests
  - Customer dashboard
  - Blog (read-only)
  - Forum (read and post)
- **Cannot Access**:
  - Professional calculators
  - Admin functions
  - Pro-only content

### 2. **Professional** (`role: 'professional'`)
- **Purpose**: HVAC technicians, contractors, and industry professionals
- **Access Level**: Professional
- **Default Membership**: `free` (can upgrade to `pro` or `lifetime`)
- **Can Access**:
  - All customer features
  - Professional calculators (commercial estimator, duct sizing, quote builder)
  - Pro forum categories
  - Advanced tools and resources
  - Professional networking features
  - Pro dashboard
- **Cannot Access**:
  - Admin functions
  - Blog creation (read-only)

### 3. **Admin** (`role: 'admin'`)
- **Purpose**: Site administrators (JordanBoz and authorized staff)
- **Access Level**: Full administrative access
- **Membership**: `lifetime` (all features unlocked)
- **Can Access**:
  - All customer and professional features
  - Blog post creation and management
  - Forum moderation (pin/unpin, delete posts)
  - User management
  - Admin dashboard
  - Site configuration

## Membership Types

### 1. **Free** (`membershipType: 'free'`)
- Basic access to core features
- Limited calculator usage
- Standard forum access

### 2. **Basic** (`membershipType: 'basic'`)
- Enhanced features for customers
- Priority support
- Additional calculator access

### 3. **Pro** (`membershipType: 'pro'`)
- Full professional feature access
- Advanced calculators and tools
- Professional forum categories
- Business resources

### 4. **Lifetime** (`membershipType: 'lifetime'`)
- All features unlocked permanently
- Admin-level access to tools
- Priority everything

## User Properties

```typescript
type StaticUser = {
  id: number;
  username: string;
  email: string;
  role: 'customer' | 'professional' | 'admin';
  isAdmin: boolean;           // true only for admin role
  isCustomer: boolean;        // true for customer role
  isProfessional: boolean;    // true for professional role
  hasProAccess: boolean;      // true for pro/lifetime memberships
  membershipType: 'free' | 'basic' | 'pro' | 'lifetime';
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt?: string;
}
```

## Access Control Examples

### Forum Access
- **Customers**: Can read and post in general categories
- **Professionals**: Access to all categories including trade-specific ones
- **Admins**: Full moderation capabilities

### Blog Access
- **Customers & Professionals**: Read-only access
- **Admins**: Full CRUD operations

### Calculator Access
- **Customers**: Basic calculators (BTU, energy savings)
- **Professionals**: All calculators including commercial estimator
- **Admins**: All features unlocked

### Dashboard Access
- **Customers**: Customer dashboard with service history
- **Professionals**: Pro dashboard with business tools
- **Admins**: Admin dashboard with site management

## Registration Flow

1. **Welcome Modal**: Emergency service → User type selection
2. **User Type Selection**: Customer vs Professional
3. **Registration Form**: Collects user info + selected type
4. **Auto-Login**: User logged in with appropriate role
5. **Membership Upgrade**: Users can upgrade membership later via Stripe

## Authentication States

- **Not Logged In**: Welcome modal shown, limited access
- **Customer Logged In**: Customer features unlocked
- **Professional Logged In**: Professional features unlocked  
- **Admin Logged In**: All features unlocked

This system ensures proper access control while maintaining the business model of converting free users to paid memberships.
