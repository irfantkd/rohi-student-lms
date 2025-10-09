import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  LineChart, 
  Line, 
  Area, 
  AreaChart,
  PieChart,
  Pie,
  Cell 
} from 'recharts';
import { Package, TrendingUp } from 'lucide-react';

const InventorySummary = ({ data }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Default inventory data - replace with your backend data
  const defaultInventoryData = {
    currentStock: [
      { name: 'Computers', quantity: 85, available: 65, inUse: 20, color: '#3B82F6' },
      { name: 'Furniture', quantity: 45, available: 30, inUse: 15, color: '#10B981' },
      { name: 'Equipment', quantity: 26, available: 18, inUse: 8, color: '#8B5CF6' },
      { name: 'Consumables', quantity: 320, available: 280, inUse: 40, color: '#F59E0B' }
    ],
    monthlyTrend: [
      { month: 'Jan', computers: 80, furniture: 40, equipment: 25, consumables: 300 },
      { month: 'Feb', computers: 82, furniture: 42, equipment: 26, consumables: 285 },
      { month: 'Mar', computers: 85, furniture: 45, equipment: 26, consumables: 320 },
      { month: 'Apr', computers: 83, furniture: 44, equipment: 24, consumables: 295 },
      { month: 'May', computers: 87, furniture: 46, equipment: 27, consumables: 340 },
      { month: 'Jun', computers: 85, furniture: 45, equipment: 26, consumables: 320 }
    ]
  };

  const inventoryData = data || defaultInventoryData;

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
          <p className="mb-2 text-sm font-semibold text-gray-700">{label}</p>
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

  // Status Distribution Pie Chart
  const StatusDistribution = () => {
    const statusData = inventoryData.currentStock.reduce((acc, item) => {
      acc.available += item.available;
      acc.inUse += item.inUse;
      return acc;
    }, { available: 0, inUse: 0 });

    const pieData = [
      { name: 'Available', value: statusData.available, color: '#10B981' },
      { name: 'In Use', value: statusData.inUse, color: '#3B82F6' }
    ];

    return (
      <div className="p-4 bg-white rounded-lg">
        <h4 className="mb-4 text-lg font-medium text-center text-gray-700">
          Overall Status Distribution
        </h4>
        <div className="relative">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-800">
                {statusData.available + statusData.inUse}
              </div>
              <div className="text-sm text-gray-500">Total Items</div>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-4 space-x-4">
          {pieData.map((entry, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 mr-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-sm text-gray-600">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const tabButtons = [
    { id: 'overview', label: 'Overview', icon: Package },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
  ];

  return (
    <div className="w-11/12 p-6 mx-auto bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Inventory Management
        </h3>
        <div className="flex p-1 space-x-1 bg-gray-100 rounded-lg">
          {tabButtons.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeTab === id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Current Stock Levels */}
          <div className="lg:col-span-2">
            <h4 className="mb-4 text-lg font-medium text-gray-700">Current Stock Levels</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventoryData.currentStock}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="available" stackId="stock" fill="#10B981" name="Available" />
                <Bar dataKey="inUse" stackId="stock" fill="#3B82F6" name="In Use" />
              </BarChart>
            </ResponsiveContainer>
            
            {/* Legend */}
            <div className="flex justify-center mt-4 space-x-6">
              <div className="flex items-center">
                <div className="w-3 h-3 mr-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 mr-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">In Use</span>
              </div>
            </div>
          </div>

          {/* Status Distribution */}
          <div>
            <StatusDistribution />
          </div>
        </div>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && (
        <div>
          <h4 className="mb-4 text-lg font-medium text-gray-700">6-Month Inventory Trends</h4>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={inventoryData.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="computers"
                stackId="1"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.6}
                name="Computers"
              />
              <Area
                type="monotone"
                dataKey="furniture"
                stackId="1"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.6}
                name="Furniture"
              />
              <Area
                type="monotone"
                dataKey="equipment"
                stackId="1"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.6}
                name="Equipment"
              />
              <Area
                type="monotone"
                dataKey="consumables"
                stackId="1"
                stroke="#F59E0B"
                fill="#F59E0B"
                fillOpacity={0.6}
                name="Consumables"
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Trend Legend */}
          <div className="flex justify-center mt-4 space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 mr-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Computers</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 mr-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Furniture</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 mr-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Equipment</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 mr-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Consumables</span>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats Row */}
      <div className="grid grid-cols-2 gap-4 pt-6 mt-8 border-t border-gray-200 md:grid-cols-4">
        <div className="p-3 text-center rounded-lg bg-gray-50">
          <div className="text-sm text-gray-500">Total Assets</div>
          <div className="text-xl font-bold" style={{ color: '#014376' }}>
            {inventoryData.currentStock.reduce((sum, item) => sum + item.quantity, 0)}
          </div>
        </div>
        <div className="p-3 text-center rounded-lg bg-green-50">
          <div className="text-sm text-gray-500">Available</div>
          <div className="text-xl font-bold text-green-600">
            {inventoryData.currentStock.reduce((sum, item) => sum + item.available, 0)}
          </div>
        </div>
        <div className="p-3 text-center rounded-lg bg-blue-50">
          <div className="text-sm text-gray-500">In Use</div>
          <div className="text-xl font-bold text-blue-600">
            {inventoryData.currentStock.reduce((sum, item) => sum + item.inUse, 0)}
          </div>
        </div>
        <div className="p-3 text-center rounded-lg bg-orange-50">
          <div className="text-sm text-gray-500">Utilization Rate</div>
          <div className="text-xl font-bold text-orange-600">
            {Math.round((inventoryData.currentStock.reduce((sum, item) => sum + item.inUse, 0) / 
              inventoryData.currentStock.reduce((sum, item) => sum + item.quantity, 0)) * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventorySummary;