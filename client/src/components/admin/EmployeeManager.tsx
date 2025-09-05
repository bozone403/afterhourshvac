import React, { useState } from 'react';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from '@/lib/static-database';
import { Plus, Edit2, Trash2, Save, X, Upload } from 'lucide-react';

export const EmployeeManager: React.FC = () => {
  const [employees, setEmployees] = useState(() => getEmployees());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    bio: '',
    avatar: '',
    specialties: [] as string[],
    yearsExperience: 0,
    certifications: [] as string[],
    phone: '',
    email: '',
    isActive: true,
    displayOrder: employees.length + 1
  });

  const handleSave = async () => {
    if (editingId) {
      // Update existing employee
      const updated = updateEmployee(editingId, formData);
      if (updated) {
        setEmployees(getEmployees());
        setEditingId(null);
      }
    } else {
      // Add new employee
      const newEmployee = addEmployee(formData);
      setEmployees(getEmployees());
      setShowAddForm(false);
    }
    resetForm();
  };

  const handleEdit = (employee: any) => {
    setFormData({
      name: employee.name,
      position: employee.position,
      bio: employee.bio,
      avatar: employee.avatar,
      specialties: employee.specialties,
      yearsExperience: employee.yearsExperience,
      certifications: employee.certifications,
      phone: employee.phone || '',
      email: employee.email || '',
      isActive: employee.isActive,
      displayOrder: employee.displayOrder
    });
    setEditingId(employee.id);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee(id);
      setEmployees(getEmployees());
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      bio: '',
      avatar: '',
      specialties: [],
      yearsExperience: 0,
      certifications: [],
      phone: '',
      email: '',
      isActive: true,
      displayOrder: employees.length + 1
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    resetForm();
  };

  const handleSpecialtyAdd = (specialty: string) => {
    if (specialty && !formData.specialties.includes(specialty)) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialty]
      }));
    }
  };

  const handleSpecialtyRemove = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const handleCertificationAdd = (cert: string) => {
    if (cert && !formData.certifications.includes(cert)) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, cert]
      }));
    }
  };

  const handleCertificationRemove = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== cert)
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="hvac-heading-xl text-gray-900">Employee Management</h1>
          <p className="text-gray-600">Manage team members displayed on the About page</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="hvac-button-primary inline-flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Employee
        </button>
      </div>

      {/* Employee Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {employees
          .filter(emp => emp.isActive)
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((employee) => (
            <div key={employee.id} className="service-card p-6">
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">
                  {employee.avatar ? (
                    <img 
                      src={employee.avatar} 
                      alt={employee.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    employee.name.charAt(0)
                  )}
                </div>
                <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                <p className="text-sm text-blue-600">{employee.position}</p>
                <p className="text-xs text-gray-500">{employee.yearsExperience} years experience</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-3">{employee.bio}</p>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-900 mb-1">Specialties:</h4>
                  <div className="flex flex-wrap gap-1">
                    {employee.specialties.slice(0, 3).map((specialty) => (
                      <span
                        key={specialty}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-gray-900 mb-1">Certifications:</h4>
                  <div className="text-xs text-gray-600">
                    {employee.certifications.slice(0, 2).join(', ')}
                    {employee.certifications.length > 2 && '...'}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t">
                <button
                  onClick={() => handleEdit(employee)}
                  className="flex-1 hvac-button-secondary text-sm py-2"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(employee.id)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Add/Edit Form Modal */}
      {(showAddForm || editingId) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="hvac-modal max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="hvac-heading-lg text-gray-900">
                {editingId ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="hvac-input"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    className="hvac-input"
                    placeholder="Senior HVAC Technician"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="hvac-input resize-none"
                  placeholder="Brief description of experience and expertise..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.yearsExperience}
                    onChange={(e) => setFormData(prev => ({ ...prev, yearsExperience: parseInt(e.target.value) || 0 }))}
                    className="hvac-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 1 }))}
                    className="hvac-input"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="hvac-input"
                    placeholder="(403) 555-0123"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="hvac-input"
                    placeholder="john@afterhourshvac.ca"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avatar URL
                </label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                  className="hvac-input"
                  placeholder="https://example.com/photo.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to use initials as avatar
                </p>
              </div>

              {/* Specialties */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialties
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {specialty}
                      <button
                        type="button"
                        onClick={() => handleSpecialtyRemove(specialty)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="hvac-input flex-1"
                    placeholder="Add specialty..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSpecialtyAdd((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      handleSpecialtyAdd(input.value);
                      input.value = '';
                    }}
                    className="hvac-button-secondary"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Certifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certifications
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                    >
                      {cert}
                      <button
                        type="button"
                        onClick={() => handleCertificationRemove(cert)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="hvac-input flex-1"
                    placeholder="Add certification..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCertificationAdd((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      handleCertificationAdd(input.value);
                      input.value = '';
                    }}
                    className="hvac-button-secondary"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Display on About page
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="submit"
                  className="hvac-button-primary flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? 'Update Employee' : 'Add Employee'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="hvac-button-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
