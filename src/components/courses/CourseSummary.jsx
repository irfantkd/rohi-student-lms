import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { BookOpen, Users, Clock, UserCheck, Armchair, FolderOpen } from 'lucide-react';
const CourseSummary = () => {
  const [selectedBatch, setSelectedBatch] = useState('all');
  // Sample data - replace with your actual API data
  const courseData = {
    totalCourses: 45,
    runningCourses: 28,
    scheduledCourses: 12,
    completedCourses: 5,
    totalSeatsOccupied: 1250,
    totalAvailableSeats: 1800,
    categories: [
      { name: 'Engineering', count: 15 },
      { name: 'Business', count: 12 },
      { name: 'IT & Technology', count: 10 },
      { name: 'Medical', count: 5 },
      { name: 'Arts & Design', count: 3 }
    ]
  };
  const batches = [
    { id: 'all', name: 'All Batches' },
    { id: 'batch-2024-spring', name: 'Spring 2024', occupiedSeats: 120, availableSeats: 30 },
    { id: 'batch-2024-summer', name: 'Summer 2024', occupiedSeats: 95, availableSeats: 55 },
    { id: 'batch-2024-fall', name: 'Fall 2024', occupiedSeats: 140, availableSeats: 10 },
    { id: 'batch-2025-spring', name: 'Spring 2025', occupiedSeats: 80, availableSeats: 70 }
  ];
  // Chart data
  const courseStatusData = [
    { name: 'Running', value: courseData.runningCourses, color: '#014376' },
    { name: 'Scheduled', value: courseData.scheduledCourses, color: '#31918D' },
    { name: 'Completed', value: courseData.completedCourses, color: '#66B3B0' }
  ];
  const categoryData = courseData.categories.map((cat, index) => ({
    ...cat,
    color: index % 2 === 0 ? '#014376' : '#31918D'
  }));
  const monthlyEnrollmentData = [
    { month: 'Jan', enrolled: 45 },
    { month: 'Feb', enrolled: 52 },
    { month: 'Mar', enrolled: 48 },
    { month: 'Apr', enrolled: 61 },
    { month: 'May', enrolled: 55 },
    { month: 'Jun', enrolled: 67 }
  ];
  const selectedBatchData = batches.find(batch => batch.id === selectedBatch);
  const StatCard = ({ title, value, subtitle, IconComponent, color = "#014376" }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold" style={{ color: color }}>{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="p-3 rounded-full bg-gradient-to-br from-blue-50 to-teal-50">
          <IconComponent size={32} style={{ color: color }} />
        </div>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-11/12 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Summary</h1>
          <p className="text-gray-600">Overview of all courses, batches, and enrollment data</p>
        </div>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <StatCard
            title="Total Courses"
            value={courseData.totalCourses}
            IconComponent={BookOpen}
            color="#014376"
          />
          <StatCard
            title="Running Courses"
            value={courseData.runningCourses}
            subtitle="Currently active"
            IconComponent={Users}
            color="#31918D"
          />
          <StatCard
            title="Scheduled Courses"
            value={courseData.scheduledCourses}
            subtitle="Upcoming"
            IconComponent={Clock}
            color="#014376"
          />
          <StatCard
            title="Seats Occupied"
            value={courseData.totalSeatsOccupied.toLocaleString()}
            subtitle={`${Math.round((courseData.totalSeatsOccupied / courseData.totalAvailableSeats) * 100)}% occupied`}
            IconComponent={UserCheck}
            color="#31918D"
          />
          <StatCard
            title="Available Seats"
            value={(courseData.totalAvailableSeats - courseData.totalSeatsOccupied).toLocaleString()}
            subtitle="Ready for enrollment"
            IconComponent={Armchair}
            color="#014376"
          />
          <StatCard
            title="Course Categories"
            value={courseData.categories.length}
            subtitle="Different fields"
            IconComponent={FolderOpen}
            color="#31918D"
          />
        </div>
        {/* Batch Selection and Specific Data */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 md:mb-0">Batch Details</h2>
            <div className="flex items-center space-x-3">
              <label htmlFor="batch-select" className="text-sm font-medium text-gray-700">
                Select Batch:
              </label>
              <select
                id="batch-select"
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {batches.map(batch => (
                  <option key={batch.id} value={batch.id}>{batch.name}</option>
                ))}
              </select>
            </div>
          </div>
          {selectedBatch !== 'all' && selectedBatchData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard
                title="Occupied Seats"
                value={selectedBatchData.occupiedSeats}
                subtitle={`${selectedBatchData.name}`}
                IconComponent={UserCheck}
                color="#014376"
              />
              <StatCard
                title="Available Seats"
                value={selectedBatchData.availableSeats}
                subtitle={`${Math.round((selectedBatchData.occupiedSeats / (selectedBatchData.occupiedSeats + selectedBatchData.availableSeats)) * 100)}% filled`}
                IconComponent={Armchair}
                color="#31918D"
              />
            </div>
          )}
          {selectedBatch === 'all' && (
            <div className="text-center py-8 text-gray-500">
              <p>Select a specific batch to view detailed seat allocation</p>
            </div>
          )}
        </div>
        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Course Status Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Course Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={courseStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884D8"
                  dataKey="value"
                >
                  {courseStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Course Categories */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Courses by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#014376" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
    
      </div>
    </div>
  );
};
export default CourseSummary;
