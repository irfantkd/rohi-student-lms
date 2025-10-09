import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, CartesianGrid, Legend } from 'recharts';
import { 
  DollarSign, TrendingUp, TrendingDown, Users, Building, 
  BookOpen, Calendar, Target, AlertCircle, CheckCircle,
  Download, Filter, Eye
} from 'lucide-react';

const FinanceSummary = () => {
  const [activeView, setActiveView] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');
  const [loading, setLoading] = useState(false);

  const periodOptions = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

  // Sample Finance Data
  const financeData = {
    overview: {
      totalRevenue: 164000,
      totalExpenses: 89300,
      netProfit: 74700,
      profitMargin: 45.5,
      monthlyGrowth: 12.3
    },
    revenueStreams: [
      { name: 'Individual Workspace', value: 45600, percentage: 27.8, color: '#014376' },
      { name: 'Company Workspace', value: 67800, percentage: 41.3, color: '#31918D' },
      { name: 'Conference Room', value: 12400, percentage: 7.6, color: '#F59E0B' },
      { name: 'Course Fees', value: 21700, percentage: 13.2, color: '#8B5CF6' },
      { name: 'Processing Fees', value: 16500, percentage: 10.1, color: '#EC4899' }
    ],
    expenses: [
      { category: 'Employee Salaries', amount: 52800, percentage: 59.1, color: '#EF4444' },
      { category: 'Utilities & Maintenance', amount: 15600, percentage: 17.5, color: '#F97316' },
      { category: 'Equipment & Inventory', amount: 8900, percentage: 10.0, color: '#EAB308' },
      { category: 'Marketing & Operations', amount: 7200, percentage: 8.1, color: '#06B6D4' },
      { category: 'Other Expenses', amount: 4800, percentage: 5.4, color: '#84CC16' }
    ],
    monthlyTrend: [
      { month: 'Jan', revenue: 140000, expenses: 78000, profit: 62000, workspace: 38000, courses: 15000, fees: 12000 },
      { month: 'Feb', revenue: 147000, expenses: 81000, profit: 66000, workspace: 42000, courses: 18000, fees: 13500 },
      { month: 'Mar', revenue: 143000, expenses: 79000, profit: 64000, workspace: 40000, courses: 16500, fees: 12800 },
      { month: 'Apr', revenue: 150000, expenses: 83000, profit: 67000, workspace: 44000, courses: 19000, fees: 14200 },
      { month: 'May', revenue: 157000, expenses: 86000, profit: 71000, workspace: 47000, courses: 21000, fees: 15300 },
      { month: 'Jun', revenue: 163000, expenses: 89000, profit: 74000, workspace: 49500, courses: 22500, fees: 16200 },
      { month: 'Jul', revenue: 164000, expenses: 89300, profit: 74700, workspace: 48900, courses: 21700, fees: 16500 }
    ],
    weeklyWorkspace: [
      { day: 'Sun', date: '17 Sun', individual: 25000, company: 50000 },
      { day: 'Mon', date: '18 Mon', individual: 25000, company: 20000 },
      { day: 'Tue', date: '19 Tue', individual: 8000, company: 50000 },
      { day: 'Wed', date: '20 Wed', individual: 50000, company: 50000 },
      { day: 'Thu', date: '21 Thu', individual: 50000, company: 25000 },
      { day: 'Fri', date: '22 Fri', individual: 70000, company: 5000 },
      { day: 'Sat', date: '23 Sat', individual: 45000, company: 35000 }
    ],
    courseTrend: [
      { month: 'Apr', value: 19000 },
      { month: 'May', value: 21000 },
      { month: 'Jun', value: 22500 },
      { month: 'Jul', value: 21700 }
    ],
    kpis: {
      revenuePerEmployee: 4824,
      workspaceUtilization: 87,
      courseEnrollment: 156,
      avgRevenuePerWorkspace: 2890,
      cashFlow: 74700,
      costPerEmployee: 2627,
      processingFeeRate: 10.1,
      feeRevenue: 16500,
      avgFeePerTransaction: 125
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatYAxisTick = (value) => {
    if (value >= 1000) {
      return `$${value / 1000}k`;
    }
    return `$${value}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const StatsCard = ({ icon: Icon, label, value, subtitle, trend, isPositive = true }) => (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
            <Icon className={`h-6 w-6 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
    
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-[90%] mx-auto p-6 bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Finance Summary</h1>
           
          </div>
   
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-5">
        <StatsCard
          icon={DollarSign}
          label="Total Revenue"
          value={formatCurrency(financeData.overview.totalRevenue)}
          trend={financeData.overview.monthlyGrowth}
          isPositive={true}
        />
        <StatsCard
          icon={TrendingDown}
          label="Total Expenses"
          value={formatCurrency(financeData.overview.totalExpenses)}
          subtitle="60.5% of revenue"
          isPositive={false}
        />
        <StatsCard
          icon={Target}
          label="Net Profit"
          value={formatCurrency(financeData.overview.netProfit)}
          subtitle={`${financeData.overview.profitMargin}% margin`}
          trend={8.7}
          isPositive={true}
        />
        <StatsCard
          icon={Users}
          label="Revenue per Employee"
          value={formatCurrency(financeData.kpis.revenuePerEmployee)}
          subtitle="Monthly average"
          isPositive={true}
        />
        <StatsCard
          icon={Building}
          label="Workspace Utilization"
          value={`${financeData.kpis.workspaceUtilization}%`}
          subtitle="Above target"
          trend={5.2}
          isPositive={true}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-8">
            {['overview', 'revenue', 'expenses', 'trends'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveView(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeView === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content based on active view */}
      {activeView === 'overview' && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Revenue Breakdown */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Revenue Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={financeData.revenueStreams}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percentage}) => `${name}: ${percentage}%`}
                >
                  {financeData.revenueStreams.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Expense Breakdown */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Expense Categories</h3>
            <div className="space-y-4">
              {financeData.expenses.map((expense, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: expense.color }}></div>
                    <span className="text-sm font-medium text-gray-700">{expense.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{formatCurrency(expense.amount)}</div>
                    <div className="text-xs text-gray-500">{expense.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeView === 'revenue' && (
        <div className="space-y-8">
          {/* Weekly Workspace Revenue */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Weekly Workspace Revenue</h3>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-3 bg-blue-800"></div>
                  <span className="text-sm font-medium text-gray-700">Individual</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-3 bg-teal-600"></div>
                  <span className="text-sm font-medium text-gray-700">Company</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={financeData.weeklyWorkspace} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tickFormatter={formatYAxisTick}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="individual" fill="#014376" name="Individual" radius={[4, 4, 0, 0]} />
                <Bar dataKey="company" fill="#31918D" name="Company" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Course Revenue Trend */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Course Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={financeData.courseTrend} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="courseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#014376" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#31918D" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 14, fill: '#6b7280' }}
                />
                <YAxis hide />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar
                  dataKey="value"
                  fill="url(#courseGradient)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Fee Revenue Trend */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Processing Fees Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={financeData.monthlyTrend} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 14, fill: '#6b7280' }}
                />
                <YAxis tickFormatter={formatYAxisTick} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line 
                  type="monotone" 
                  dataKey="fees" 
                  stroke="#EC4899" 
                  strokeWidth={3}
                  name="Processing Fees"
                  dot={{ fill: '#EC4899', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4 text-center">
              <div className="p-3 rounded-lg bg-pink-50">
                <div className="text-lg font-semibold text-pink-600">{formatCurrency(financeData.kpis.feeRevenue)}</div>
                <div className="text-sm text-gray-600">Monthly Fees</div>
              </div>
              <div className="p-3 rounded-lg bg-pink-50">
                <div className="text-lg font-semibold text-pink-600">{formatCurrency(financeData.kpis.avgFeePerTransaction)}</div>
                <div className="text-sm text-gray-600">Avg per Transaction</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'trends' && (
        <div className="space-y-8">
          {/* Monthly Financial Trend */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Monthly Financial Performance</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={financeData.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatYAxisTick} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} name="Total Revenue" />
                <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={3} name="Total Expenses" />
                <Line type="monotone" dataKey="profit" stroke="#3B82F6" strokeWidth={3} name="Net Profit" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Stream Comparison */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Revenue Stream Trends</h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={financeData.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatYAxisTick} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="workspace" 
                  stackId="1" 
                  stroke="#014376" 
                  fill="#014376" 
                  fillOpacity={0.7}
                  name="Workspace Revenue"
                />
                <Area 
                  type="monotone" 
                  dataKey="courses" 
                  stackId="1" 
                  stroke="#8B5CF6" 
                  fill="#8B5CF6" 
                  fillOpacity={0.7}
                  name="Course Revenue"
                />
                <Area 
                  type="monotone" 
                  dataKey="fees" 
                  stackId="1" 
                  stroke="#EC4899" 
                  fill="#EC4899" 
                  fillOpacity={0.7}
                  name="Processing Fees"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeView === 'expenses' && (
        <div className="space-y-8">
          {/* Detailed Expense Breakdown */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm lg:col-span-2">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Expense Distribution</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={financeData.expenses} layout="horizontal">
                  <XAxis type="number" tickFormatter={formatYAxisTick} />
                  <YAxis type="category" dataKey="category" width={150} fontSize={12} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="amount" fill="#EF4444" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Cost Efficiency KPIs</h3>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{formatCurrency(financeData.kpis.costPerEmployee)}</div>
                  <div className="text-sm text-gray-600">Cost per Employee</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{formatCurrency(financeData.kpis.avgRevenuePerWorkspace)}</div>
                  <div className="text-sm text-gray-600">Avg Revenue per Workspace</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{formatCurrency(financeData.kpis.cashFlow)}</div>
                  <div className="text-sm text-gray-600">Monthly Cash Flow</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="flex justify-end gap-4 mt-8">
        <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50">
          <Filter size={16} />
          Filter
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-sm text-white transition-colors bg-teal-600 rounded-lg hover:bg-teal-700">
          <Eye size={16} />
          View Details
        </button>
      </div>
    </div>
  );
};

export default FinanceSummary;