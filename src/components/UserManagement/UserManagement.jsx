import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Users, Shield, UserCheck, Key, Settings } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      role: 'Admin', 
      status: 'Active', 
      createdAt: '2024-01-15',
      permissions: ['user_management', 'system_settings', 'reports', 'billing', 'data_export', 'user_roles']
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      role: 'Manager', 
      status: 'Active', 
      createdAt: '2024-01-18',
      permissions: ['user_management', 'reports', 'data_export']
    },
    { 
      id: 3, 
      name: 'Bob Wilson', 
      email: 'bob@example.com', 
      role: 'User', 
      status: 'Inactive', 
      createdAt: '2024-01-20',
      permissions: ['reports']
    },
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'User',
    status: 'Active',
    password: '',
    permissions: []
  });

  const roles = ['Admin', 'Manager', 'Editor', 'User'];
  const statuses = ['Active', 'Inactive'];
  
  const availablePermissions = [
    { id: 'user_management', name: 'User Management', description: 'Create, edit, and delete users' },
    { id: 'system_settings', name: 'System Settings', description: 'Access and modify system configurations' },
    { id: 'reports', name: 'Reports', description: 'View and generate reports' },
    { id: 'billing', name: 'Billing', description: 'Access billing and payment information' },
    { id: 'data_export', name: 'Data Export', description: 'Export data and reports' },
    { id: 'user_roles', name: 'Role Management', description: 'Manage user roles and permissions' },
    { id: 'content_management', name: 'Content Management', description: 'Create and edit content' },
    { id: 'analytics', name: 'Analytics', description: 'Access analytics and insights' }
  ];

  const defaultPermissionsByRole = {
    'Admin': ['user_management', 'system_settings', 'reports', 'billing', 'data_export', 'user_roles', 'content_management', 'analytics'],
    'Manager': ['user_management', 'reports', 'data_export', 'content_management', 'analytics'],
    'Editor': ['reports', 'content_management'],
    'User': ['reports']
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.name || !formData.email || (!editingUser && !formData.password)) {
      alert('Please fill in all required fields');
      return;
    }

    // Set default permissions based on role if none selected
    const permissions = formData.permissions.length > 0 
      ? formData.permissions 
      : defaultPermissionsByRole[formData.role] || [];

    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData, permissions, id: editingUser.id, createdAt: user.createdAt }
          : user
      ));
      setEditingUser(null);
    } else {
      const newUser = {
        id: Date.now(),
        ...formData,
        permissions,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'User',
      status: 'Active',
      password: '',
      permissions: []
    });
    setShowCreateForm(false);
    setEditingUser(null);
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      password: '',
      permissions: user.permissions || []
    });
    setEditingUser(user);
    setShowCreateForm(true);
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role) => {
    const colors = {
      'Admin': { bg: '#014376', text: 'white' },
      'Manager': { bg: '#31918D', text: 'white' },
      'Editor': { bg: '#10b981', text: 'white' },
      'User': { bg: '#6b7280', text: 'white' }
    };
    return colors[role] || { bg: '#6b7280', text: 'white' };
  };

  const getStatusColor = (status) => {
    return status === 'Active' 
      ? { bg: '#31918D', text: 'white' }
      : { bg: '#ef4444', text: 'white' };
  };

  return (
    <div className="w-11/12 min-h-screen p-6 mx-auto bg-gray-50" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'}}>
      {/* Header */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg" style={{backgroundColor: '#014376'}}>
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
             
            </div>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center px-4 py-2 space-x-2 text-white transition-all rounded-lg hover:opacity-90"
            style={{backgroundColor: '#31918D'}}
          >
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-4">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <Users className="w-8 h-8" style={{color: '#014376'}} />
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold" style={{color: '#31918D'}}>{users.filter(u => u.status === 'Active').length}</p>
            </div>
            <UserCheck className="w-8 h-8" style={{color: '#31918D'}} />
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Admins</p>
              <p className="text-2xl font-bold" style={{color: '#014376'}}>{users.filter(u => u.role === 'Admin').length}</p>
            </div>
            <Shield className="w-8 h-8" style={{color: '#014376'}} />
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Managers</p>
              <p className="text-2xl font-bold" style={{color: '#31918D'}}>{users.filter(u => u.role === 'Manager').length}</p>
            </div>
            <Shield className="w-8 h-8" style={{color: '#31918D'}} />
          </div>
        </div>
      </div>

      {/* Create/Edit User Form */}
      {showCreateForm && (
        <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            {editingUser ? 'Edit User' : 'Create New User'}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 transition-all border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{'--tw-ring-color': '#31918D'}}
                onFocus={(e) => e.target.style.borderColor = '#31918D'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 transition-all border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{'--tw-ring-color': '#31918D'}}
                onFocus={(e) => e.target.style.borderColor = '#31918D'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-3 py-2 transition-all border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{'--tw-ring-color': '#31918D'}}
                onFocus={(e) => e.target.style.borderColor = '#31918D'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 transition-all border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{'--tw-ring-color': '#31918D'}}
                onFocus={(e) => e.target.style.borderColor = '#31918D'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Password {editingUser && '(leave blank to keep current)'}
              </label>
              <input
                type="password"
                required={!editingUser}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-3 py-2 transition-all border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{'--tw-ring-color': '#31918D'}}
                onFocus={(e) => e.target.style.borderColor = '#31918D'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                placeholder="Enter password"
              />
            </div>
            <div className="flex space-x-3 md:col-span-2">
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2 text-white transition-all rounded-lg hover:opacity-90"
                style={{backgroundColor: '#31918D'}}
              >
                {editingUser ? 'Update User' : 'Create User'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 text-white transition-all rounded-lg hover:opacity-90"
                style={{backgroundColor: '#014376'}}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2" style={{color: '#014376'}} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2 pl-10 pr-4 transition-all border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{'--tw-ring-color': '#31918D'}}
                onFocus={(e) => e.target.style.borderColor = '#31918D'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 transition-all border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
              style={{'--tw-ring-color': '#31918D'}}
              onFocus={(e) => e.target.style.borderColor = '#31918D'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            >
              <option value="All">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{backgroundColor: '#f8fafc'}}>
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase" style={{color: '#014376'}}>User</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase" style={{color: '#014376'}}>Role</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase" style={{color: '#014376'}}>Status</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase" style={{color: '#014376'}}>Created</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase" style={{color: '#014376'}}>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: getRoleColor(user.role).bg,
                        color: getRoleColor(user.role).text
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: getStatusColor(user.status).bg,
                        color: getStatusColor(user.status).text
                      }}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {user.createdAt}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="transition-all hover:opacity-70"
                        style={{color: '#31918D'}}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="transition-all hover:opacity-70"
                        style={{color: '#014376'}}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-4" style={{color: '#014376'}} />
            <h3 className="mb-2 text-lg font-medium text-gray-900">No users found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;