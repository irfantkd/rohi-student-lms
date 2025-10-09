import React, { useState } from 'react';
import { Users, User, MapPin, Clock, Wifi, Coffee, Car, Calendar, CheckCircle, XCircle, AlertCircle, TrendingUp, DollarSign, Package, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer, Area, AreaChart } from 'recharts';

const StartupSummary = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Individual Workspaces Data
  const individualWorkspaces = [
    { 
      id: 1, 
      name: 'Hot Desk A1', 
      type: 'Hot Desk', 
      status: 'Available', 
      price: 25, 
      location: 'Floor 1',
      inventory: { desk: 1, chair: 1, locker: 1, monitor: 0 }
    },
    { 
      id: 2, 
      name: 'Private Office 201', 
      type: 'Private Office', 
      status: 'Occupied', 
      price: 80, 
      location: 'Floor 2', 
      occupant: 'John Smith',
      inventory: { desk: 1, chair: 2, locker: 1, monitor: 2, phone: 1 }
    },
    { 
      id: 3, 
      name: 'Hot Desk B3', 
      type: 'Hot Desk', 
      status: 'Occupied', 
      price: 25, 
      location: 'Floor 1', 
      occupant: 'Sarah Johnson',
      inventory: { desk: 1, chair: 1, locker: 1, monitor: 1 }
    },
    { 
      id: 4, 
      name: 'Private Office 105', 
      type: 'Private Office', 
      status: 'Available', 
      price: 85, 
      location: 'Floor 1',
      inventory: { desk: 1, chair: 2, locker: 1, monitor: 2, phone: 1, whiteboard: 1 }
    },
    { 
      id: 5, 
      name: 'Focus Pod 3', 
      type: 'Focus Pod', 
      status: 'Occupied', 
      price: 40, 
      location: 'Floor 3', 
      occupant: 'Mike Chen',
      inventory: { desk: 1, chair: 1, monitor: 1 }
    },
    { 
      id: 6, 
      name: 'Hot Desk C2', 
      type: 'Hot Desk', 
      status: 'Available', 
      price: 25, 
      location: 'Floor 2',
      inventory: { desk: 1, chair: 1, locker: 1, monitor: 0 }
    }
  ];

  // Company/Startup Workspaces Data
  const companyWorkspaces = [
    { 
      id: 1, 
      name: 'Team Suite Alpha', 
      type: 'Team Suite', 
      status: 'Available', 
      capacity: 8, 
      price: 200, 
      location: 'Floor 2',
      inventory: { desks: 8, chairs: 10, lockers: 8, monitors: 6, whiteboards: 2, printer: 1 }
    },
    { 
      id: 2, 
      name: 'Startup Hub Beta', 
      type: 'Open Area', 
      status: 'Occupied', 
      capacity: 12, 
      price: 300, 
      location: 'Floor 1', 
      company: 'TechStart Inc.',
      inventory: { desks: 12, chairs: 15, lockers: 12, monitors: 10, whiteboards: 3, printer: 1, coffee_machine: 1 }
    },
    { 
      id: 3, 
      name: 'Executive Suite', 
      type: 'Executive Suite', 
      status: 'Occupied', 
      capacity: 6, 
      price: 400, 
      location: 'Floor 3', 
      company: 'Global Solutions',
      inventory: { desks: 6, chairs: 8, lockers: 6, monitors: 12, whiteboards: 2, phone: 2, projector: 1 }
    },
    { 
      id: 4, 
      name: 'Collaborative Hub', 
      type: 'Collaborative Space', 
      status: 'Available', 
      capacity: 15, 
      price: 350, 
      location: 'Floor 2',
      inventory: { desks: 15, chairs: 20, lockers: 15, monitors: 8, whiteboards: 4, printer: 2 }
    },
    { 
      id: 5, 
      name: 'Innovation Lab', 
      type: 'Tech Lab', 
      status: 'Occupied', 
      capacity: 10, 
      price: 450, 
      location: 'Floor 3', 
      company: 'AI Innovations',
      inventory: { desks: 10, chairs: 12, monitors: 20, servers: 2, whiteboards: 3, projector: 2 }
    }
  ];

  // Conference Room Data
  const conferenceRoom = {
    name: 'Main Conference Room',
    capacity: 20,
    pricePerHour: 50,
    location: 'Floor 2',
    inventory: { chairs: 20, table: 1, projector: 1, whiteboard: 2, tv_screen: 2, phone: 1, coffee_setup: 1 },
    todayBookings: [
      { time: '09:00 - 10:30', client: 'TechStart Inc.', purpose: 'Board Meeting', revenue: 75 },
      { time: '14:00 - 16:00', client: 'Global Solutions', purpose: 'Client Presentation', revenue: 100 },
      { time: '16:30 - 18:00', client: 'Individual - John Smith', purpose: 'Video Conference', revenue: 75 }
    ],
    weeklyRevenue: 1250,
    monthlyRevenue: 4800,
    utilizationRate: 65
  };

  // Calculate statistics
  const individualStats = {
    total: individualWorkspaces.length,
    occupied: individualWorkspaces.filter(w => w.status === 'Occupied').length,
    available: individualWorkspaces.filter(w => w.status === 'Available').length,
    dailyRevenue: individualWorkspaces.filter(w => w.status === 'Occupied').reduce((sum, w) => sum + w.price, 0)
  };

  const companyStats = {
    total: companyWorkspaces.length,
    occupied: companyWorkspaces.filter(w => w.status === 'Occupied').length,
    available: companyWorkspaces.filter(w => w.status === 'Available').length,
    dailyRevenue: companyWorkspaces.filter(w => w.status === 'Occupied').reduce((sum, w) => sum + w.price, 0)
  };

  // Chart data
  const occupancyData = [
    { name: 'Individual', occupied: individualStats.occupied, available: individualStats.available },
    { name: 'Company', occupied: companyStats.occupied, available: companyStats.available }
  ];

  const revenueData = [
    { name: 'Mon', individual: 320, company: 950, conference: 200 },
    { name: 'Tue', individual: 280, company: 1100, conference: 150 },
    { name: 'Wed', individual: 400, company: 900, conference: 300 },
    { name: 'Thu', individual: 350, company: 1200, conference: 250 },
    { name: 'Fri', individual: 380, company: 1050, conference: 350 },
    { name: 'Sat', individual: 200, company: 600, conference: 100 },
    { name: 'Sun', individual: 150, company: 400, conference: 50 }
  ];

  const utilizationData = [
    { name: 'Individual', value: (individualStats.occupied / individualStats.total) * 100 },
    { name: 'Company', value: (companyStats.occupied / companyStats.total) * 100 },
    { name: 'Conference', value: conferenceRoom.utilizationRate }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Occupied': return 'bg-blue-100 text-blue-800';
      case 'Reserved': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="w-11/12 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Workspace Analytics</h1>
            
            </div>
         
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Individual</p>
                <p className="text-2xl font-semibold text-gray-900">{individualStats.occupied}/{individualStats.total}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Company</p>
                <p className="text-2xl font-semibold text-gray-900">{companyStats.occupied}/{companyStats.total}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conference</p>
                <p className="text-2xl font-semibold text-gray-900">{conferenceRoom.utilizationRate}%</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Daily Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">${individualStats.dailyRevenue + companyStats.dailyRevenue + 250}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                <p className="text-2xl font-semibold text-gray-900">{Math.round(((individualStats.occupied + companyStats.occupied) / (individualStats.total + companyStats.total)) * 100)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
          {/* Occupancy Chart */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Workspace Occupancy</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="occupied" fill="#3B82F6" name="Occupied" />
                <Bar dataKey="available" fill="#10B981" name="Available" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Revenue Trend */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Weekly Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="individual" stroke="#3B82F6" name="Individual" />
                <Line type="monotone" dataKey="company" stroke="#10B981" name="Company" />
                <Line type="monotone" dataKey="conference" stroke="#F59E0B" name="Conference" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Utilization Pie Chart */}
        <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-3">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Utilization Rates</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={utilizationData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, value}) => `${name}: ${value.toFixed(1)}%`}
                >
                  {utilizationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Conference Room Status */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm lg:col-span-2">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Conference Room - Today's Schedule</h3>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Main Conference Room</span>
                <span className="text-sm text-gray-600">${conferenceRoom.pricePerHour}/hour • Capacity: {conferenceRoom.capacity}</span>
              </div>
              <div className="mb-4 text-sm text-gray-600">
                Today's Revenue: ${conferenceRoom.todayBookings.reduce((sum, booking) => sum + booking.revenue, 0)}
              </div>
            </div>
            <div className="space-y-3">
              {conferenceRoom.todayBookings.map((booking, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <div className="font-medium text-gray-900">{booking.time}</div>
                    <div className="text-sm text-gray-600">{booking.client} - {booking.purpose}</div>
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    ${booking.revenue}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Workspace Details */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Individual Workspaces */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Individual Workspaces</h2>
                <div className="text-sm text-gray-600">
                  Occupancy: {Math.round((individualStats.occupied / individualStats.total) * 100)}%
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4 overflow-y-auto max-h-96">
                {individualWorkspaces.map((workspace) => (
                  <div key={workspace.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-gray-900">{workspace.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workspace.status)}`}>
                          {workspace.status}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">${workspace.price}/day</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-600">Type: {workspace.type}</p>
                        <p className="text-xs text-gray-600">Location: {workspace.location}</p>
                        {workspace.occupant && <p className="text-xs text-gray-600">Occupant: {workspace.occupant}</p>}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600">Inventory:</p>
                        <div className="text-xs text-gray-600">
                          {Object.entries(workspace.inventory).map(([item, count]) => (
                            <span key={item} className="mr-2">{item}: {count}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Company Workspaces */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Company Workspaces</h2>
                <div className="text-sm text-gray-600">
                  Occupancy: {Math.round((companyStats.occupied / companyStats.total) * 100)}%
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4 overflow-y-auto max-h-96">
                {companyWorkspaces.map((workspace) => (
                  <div key={workspace.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-gray-900">{workspace.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workspace.status)}`}>
                          {workspace.status}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">${workspace.price}/day</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-600">Type: {workspace.type}</p>
                        <p className="text-xs text-gray-600">Capacity: {workspace.capacity} people</p>
                        <p className="text-xs text-gray-600">Location: {workspace.location}</p>
                        {workspace.company && <p className="text-xs text-gray-600">Company: {workspace.company}</p>}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600">Inventory:</p>
                        <div className="text-xs text-gray-600">
                          {Object.entries(workspace.inventory).map(([item, count]) => (
                            <span key={item} className="mr-2">{item}: {count}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupSummary;