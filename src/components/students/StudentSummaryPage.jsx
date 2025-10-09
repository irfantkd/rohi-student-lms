import { Shield, User, UserCheck, Users, Users2, TrendingUp, Activity } from 'lucide-react';
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

const studentsData = {
  totalEnrolled: 1250,
  military: 320,
  civil: 930,
  male: 780,
  female: 470
};

// Sample enrollment trend data
const enrollmentTrend = [
  { month: 'Jan', enrolled: 1180 },
  { month: 'Feb', enrolled: 1195 },
  { month: 'Mar', enrolled: 1210 },
  { month: 'Apr', enrolled: 1225 },
  { month: 'May', enrolled: 1235 },
  { month: 'Jun', enrolled: 1250 }
];

// Course enrollment data
const courseEnrollment = [
  { course: 'Web Dev', students: 245 },
  { course: 'Data Science', students: 198 },
  { course: 'Mobile Dev', students: 156 },
  { course: 'AI/ML', students: 134 },
  { course: 'Cybersecurity', students: 112 }
];

const StudentSummaryPage = () => {
  const pieData = [
    { name: 'Military Students', value: studentsData.military, color: '#31918D' },
    { name: 'Civil Students', value: studentsData.civil, color: '#014376' }
  ];

  const genderData = [
    { name: 'Male', value: studentsData.male, color: '#31918D' },
    { name: 'Female', value: studentsData.female, color: '#014376' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-800 font-semibold">{`${label}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="w-11/12 mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Student Summary</h2>
              <p className="text-gray-600">Comprehensive overview of student enrollment and demographics</p>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <Activity className="w-5 h-5" style={{color: '#31918D'}} />
              <span className="text-sm text-gray-600">Live Data</span>
            </div>
          </div>
        </div>
        
        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          
          {/* Total Enrolled Students Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 md:col-span-2 lg:col-span-1 hover:shadow-xl transition-shadow duration-300" style={{borderTopColor: '#014376'}}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-4 rounded-xl shadow-md" style={{backgroundColor: '#014376'}}>
                  <Users className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex items-center text-green-500">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm font-semibold">+12%</span>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Enrolled</h3>
              <span className="text-4xl font-bold" style={{color: '#014376'}}>{studentsData.totalEnrolled.toLocaleString()}</span>
              <p className="text-sm text-gray-500 mt-2">Active Students</p>
            </div>
          </div>

          {/* Military Students Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 hover:shadow-xl transition-shadow duration-300" style={{borderTopColor: '#31918D'}}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-4 rounded-xl shadow-md" style={{backgroundColor: '#31918D'}}>
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Military Students</h3>
              <span className="text-3xl font-bold" style={{color: '#31918D'}}>{studentsData.military}</span>
              <p className="text-sm text-gray-500 mt-2">
                {Math.round((studentsData.military / studentsData.totalEnrolled) * 100)}% of total
              </p>
            </div>
          </div>

          {/* Civil Students Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 hover:shadow-xl transition-shadow duration-300" style={{borderTopColor: '#014376'}}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-4 rounded-xl shadow-md" style={{backgroundColor: '#014376'}}>
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Civil Students</h3>
              <span className="text-3xl font-bold" style={{color: '#014376'}}>{studentsData.civil}</span>
              <p className="text-sm text-gray-500 mt-2">
                {Math.round((studentsData.civil / studentsData.totalEnrolled) * 100)}% of total
              </p>
            </div>
          </div>

          {/* Male Students Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 hover:shadow-xl transition-shadow duration-300" style={{borderTopColor: '#31918D'}}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-4 rounded-xl shadow-md" style={{backgroundColor: '#31918D'}}>
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Male Students</h3>
              <span className="text-3xl font-bold" style={{color: '#31918D'}}>{studentsData.male}</span>
              <p className="text-sm text-gray-500 mt-2">
                {Math.round((studentsData.male / studentsData.totalEnrolled) * 100)}% of total
              </p>
            </div>
          </div>

          {/* Female Students Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 hover:shadow-xl transition-shadow duration-300" style={{borderTopColor: '#014376'}}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-4 rounded-xl shadow-md" style={{backgroundColor: '#014376'}}>
                  <Users2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Female Students</h3>
              <span className="text-3xl font-bold" style={{color: '#014376'}}>{studentsData.female}</span>
              <p className="text-sm text-gray-500 mt-2">
                {Math.round((studentsData.female / studentsData.totalEnrolled) * 100)}% of total
              </p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Category Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Student Categories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: '#31918D'}}></div>
                <span className="text-sm text-gray-600">Military ({Math.round((studentsData.military / studentsData.totalEnrolled) * 100)}%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: '#014376'}}></div>
                <span className="text-sm text-gray-600">Civil ({Math.round((studentsData.civil / studentsData.totalEnrolled) * 100)}%)</span>
              </div>
            </div>
          </div>

          {/* Course Enrollment */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Course Wise Enrollments</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={courseEnrollment} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#666" />
                <YAxis dataKey="course" type="category" stroke="#666" width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="students" fill="#31918D" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Enrollment Trend Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Enrollment Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={enrollmentTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="enrolled" 
                  stroke="#31918D" 
                  strokeWidth={3}
                  dot={{ fill: '#31918D', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: '#014376' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gender Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Gender Distribution</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 font-medium">Male Students</span>
                  <span className="font-semibold" style={{color: '#31918D'}}>
                    {studentsData.male} ({Math.round((studentsData.male / studentsData.totalEnrolled) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full transition-all duration-500" 
                    style={{
                      backgroundColor: '#31918D',
                      width: `${(studentsData.male / studentsData.totalEnrolled) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 font-medium">Female Students</span>
                  <span className="font-semibold" style={{color: '#014376'}}>
                    {studentsData.female} ({Math.round((studentsData.female / studentsData.totalEnrolled) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full transition-all duration-500" 
                    style={{
                      backgroundColor: '#014376',
                      width: `${(studentsData.female / studentsData.totalEnrolled) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold" style={{color: '#31918D'}}>{Math.round((studentsData.male / studentsData.totalEnrolled) * 100)}%</div>
                  <div className="text-sm text-gray-500">Male Ratio</div>
                </div>
                <div>
                  <div className="text-2xl font-bold" style={{color: '#014376'}}>{Math.round((studentsData.female / studentsData.totalEnrolled) * 100)}%</div>
                  <div className="text-sm text-gray-500">Female Ratio</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSummaryPage;
