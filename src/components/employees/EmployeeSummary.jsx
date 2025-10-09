import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, CartesianGrid, Legend } from 'recharts';
import { 
  Users, Award, Shield, Briefcase, UserCog, Calendar, Clock, 
  TrendingUp, UserPlus, UserMinus, DollarSign, MapPin, 
  CheckCircle, AlertCircle, Phone, Mail, Building, Target,
  BookOpen, Coffee, Car, Wifi, Monitor
} from 'lucide-react';

const EmployeeSummary = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Employee Data
  const employeeData = {
    roles: [
      { name: 'SMEs', count: 12, active: 11, inactive: 1, icon: Award, color: '#8B5CF6', avgSalary: 85000 },
      { name: 'STP', count: 8, active: 8, inactive: 0, icon: UserCog, color: '#3B82F6', avgSalary: 65000 },
      { name: 'Admin', count: 9, active: 8, inactive: 1, icon: Shield, color: '#10B981', avgSalary: 55000 },
      { name: 'Management', count: 5, active: 5, inactive: 0, icon: Briefcase, color: '#F59E0B', avgSalary: 120000 }
    ],
    totalEmployees: 34,
    activeEmployees: 32,
    newHires: 3,
    departures: 1
  };

  // Individual Employee Records
  const employees = [
    {
      id: 1, name: 'John Smith', role: 'SMEs', department: 'Engineering', status: 'Active', 
      joinDate: '2023-01-15', salary: 88000, location: 'Floor 2', phone: '+1-234-567-8901',
      email: 'john.smith@company.com', performance: 'Excellent', attendance: 95,
      workspace: 'Private Office 201', equipment: ['Laptop', 'Monitor', 'Phone']
    },
    {
      id: 2, name: 'Sarah Johnson', role: 'STP', department: 'Development', status: 'Active',
      joinDate: '2023-03-20', salary: 67000, location: 'Floor 1', phone: '+1-234-567-8902',
      email: 'sarah.j@company.com', performance: 'Good', attendance: 92,
      workspace: 'Hot Desk B3', equipment: ['Laptop', 'Monitor']
    },
    {
      id: 3, name: 'Mike Chen', role: 'Admin', department: 'Operations', status: 'Active',
      joinDate: '2022-11-10', salary: 58000, location: 'Floor 3', phone: '+1-234-567-8903',
      email: 'mike.chen@company.com', performance: 'Good', attendance: 88,
      workspace: 'Focus Pod 3', equipment: ['Laptop']
    },
    {
      id: 4, name: 'Emma Wilson', role: 'Management', department: 'Strategy', status: 'Active',
      joinDate: '2022-05-08', salary: 125000, location: 'Floor 3', phone: '+1-234-567-8904',
      email: 'emma.w@company.com', performance: 'Excellent', attendance: 97,
      workspace: 'Executive Suite', equipment: ['Laptop', 'Monitor', 'Phone', 'Tablet']
    },
    {
      id: 5, name: 'Alex Rodriguez', role: 'SMEs', department: 'Quality', status: 'Inactive',
      joinDate: '2023-02-12', salary: 82000, location: 'N/A', phone: '+1-234-567-8905',
      email: 'alex.r@company.com', performance: 'Good', attendance: 0,
      workspace: 'None', equipment: []
    }
  ];

  // Attendance Data (Last 7 days)
  const attendanceData = [
    { date: 'Mon', present: 30, absent: 4, late: 2 },
    { date: 'Tue', present: 32, absent: 2, late: 1 },
    { date: 'Wed', present: 31, absent: 3, late: 3 },
    { date: 'Thu', present: 29, absent: 5, late: 1 },
    { date: 'Fri', present: 33, absent: 1, late: 2 },
    { date: 'Sat', present: 15, absent: 19, late: 0 },
    { date: 'Sun', present: 8, absent: 26, late: 0 }
  ];

  // Department Distribution
  const departmentData = [
    { name: 'Engineering', value: 12, color: '#3B82F6' },
    { name: 'Development', value: 8, color: '#10B981' },
    { name: 'Operations', value: 9, color: '#F59E0B' },
    { name: 'Strategy', value: 5, color: '#8B5CF6' }
  ];

  // Salary Distribution
  const salaryRanges = [
    { range: '40k-60k', count: 9, color: '#EF4444' },
    { range: '60k-80k', count: 8, color: '#F59E0B' },
    { range: '80k-100k', count: 12, color: '#10B981' },
    { range: '100k+', count: 5, color: '#8B5CF6' }
  ];

  // Performance Distribution
  const performanceData = [
    { level: 'Excellent', count: 15, percentage: 44 },
    { level: 'Good', count: 14, percentage: 41 },
    { level: 'Average', count: 4, percentage: 12 },
    { level: 'Needs Improvement', count: 1, percentage: 3 }
  ];

  // Monthly Hiring Trend
  const hiringTrend = [
    { month: 'Jan', hires: 2, departures: 0 },
    { month: 'Feb', hires: 3, departures: 1 },
    { month: 'Mar', hires: 4, departures: 0 },
    { month: 'Apr', hires: 1, departures: 2 },
    { month: 'May', hires: 3, departures: 1 },
    { month: 'Jun', hires: 2, departures: 0 },
    { month: 'Jul', hires: 1, departures: 1 },
    { month: 'Aug', hires: 5, departures: 0 },
    { month: 'Sep', hires: 3, departures: 1 }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      case 'On Leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Average': return 'bg-yellow-100 text-yellow-800';
      case 'Needs Improvement': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeRate = Math.round((employeeData.activeEmployees / employeeData.totalEmployees) * 100);
  const totalSalaryBudget = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const avgSalary = Math.round(totalSalaryBudget / employees.length);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="w-11/12 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">HR Managements</h1>
             
            </div>
         
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-semibold text-gray-900">{employeeData.totalEmployees}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Rate</p>
                <p className="text-2xl font-semibold text-gray-900">{activeRate}%</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New Hires</p>
                <p className="text-2xl font-semibold text-gray-900">{employeeData.newHires}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Salary</p>
                <p className="text-2xl font-semibold text-gray-900">${avgSalary.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Retention Rate</p>
                <p className="text-2xl font-semibold text-gray-900">97%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Role Overview Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {employeeData.roles.map((role, index) => {
            const IconComponent = role.icon;
            return (
              <div key={index} className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${role.color}20` }}>
                    <IconComponent className="w-6 h-6" style={{ color: role.color }} />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: role.color }}>
                      {role.active}/{role.count}
                    </div>
                    <div className="text-xs text-gray-500">Active/Total</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{role.name}</h3>
                  <p className="text-sm text-gray-600">Avg: ${role.avgSalary.toLocaleString()}</p>
                  <div className="w-full h-2 mt-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 transition-all duration-300 rounded-full" 
                      style={{ 
                        width: `${(role.active / role.count) * 100}%`,
                        backgroundColor: role.color
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Salary Ranges</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salaryRanges}>
                <XAxis dataKey="range" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Department Distribution */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Department Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, value}) => `${name}: ${value}`}
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Employee Directory */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Employee Directory</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Employee</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Role & Department</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Salary</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-10 h-10 text-sm font-semibold text-white rounded-full bg-gradient-to-br from-blue-400 to-purple-600">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">Joined: {employee.joinDate}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.role}</div>
                      <div className="text-sm text-gray-500">{employee.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                        {employee.status}
                      </span>
                      <div className="mt-1 text-xs text-gray-500">
                        Attendance: {employee.attendance}%
                      </div>
                    </td>
                 
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Mail size={12} />
                          {employee.email}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Phone size={12} />
                          {employee.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      ${employee.salary.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSummary;