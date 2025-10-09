import React from 'react';
import { Users, BookOpen, Building, DollarSign, Users2, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TotalStats = () => {
  const navigate = useNavigate()
  // Sample data - replace with your actual data
  const studentsData = {
    enrolled: 1250,
    military: 320,
    civil: 930
  };

  const coursesData = {
    totalCourses: 45,
    runningCourses: 28,
    scheduledCourses: 17
  };

  const workspaceData = {
    individualOccupied: 125,
    companyOccupied: 8
  };
  const financeData = {
    totalEarning: 2850000,
    spendOnStartups: 850000,
    spendOnCourses: 420000,
    earnedFromStartups: 1200000,
    earnedFromCourses: 1650000,
    profit: 1580000
  };

  const employeeData = {
    totalEmployees: 145,
    stp: 28, // Subject Matter Professionals
    smes: 12, // Subject Matter Experts
    adminStaff: 35,
    supportStaff: 45,
    management: 25
  };

  const inventoryData = {
    totalSpaces: 200,
    occupied: 145,
    available: 55
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className=" bg-gray-50">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ">
      
        {/* Students Summary Card */}
        <div 
         onClick={() => navigate('/dashboard/student-summary')}
        className="p-6 bg-white border-t-4 rounded-lg shadow-md" style={{borderTopColor: '#014376'}}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-3 rounded-lg" style={{backgroundColor: '#014376'}}>
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-800">Students </h3>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Enrolled</span>
              <span className="text-2xl font-bold" style={{color: '#014376'}}>{studentsData.enrolled.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Military Students</span>
              <span className="text-lg font-semibold" style={{color: '#31918D'}}>{studentsData.military}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Civil Students</span>
              <span className="text-lg font-semibold" style={{color: '#31918D'}}>{studentsData.civil}</span>
            </div>
          </div>
        </div>

        {/* Courses Summary Card */}
        <div 
         onClick={() => navigate('/dashboard/course-summary')}
        className="p-6 bg-white border-t-4 rounded-lg shadow-md" style={{borderTopColor: '#31918D'}}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-3 rounded-lg" style={{backgroundColor: '#31918D'}}>
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-800">Courses </h3>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Courses</span>
              <span className="text-2xl font-bold" style={{color: '#31918D'}}>{coursesData.totalCourses}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 text-center rounded-lg bg-gray-50">
                <div className="mb-1 text-sm text-gray-500">Running Courses</div>
                <div className="text-xl font-bold" style={{color: '#31918D'}}>{coursesData.runningCourses}</div>
              </div>
              <div className="p-3 text-center rounded-lg bg-gray-50">
                <div className="mb-1 text-sm text-gray-500">Scheduled Courses</div>
                <div className="text-xl font-bold" style={{color: '#014376'}}>{coursesData.scheduledCourses}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Summary Card */}
        <div 
         onClick={() => navigate('/dashboard/startup-summary')}
        className="p-6 bg-white border-t-4 rounded-lg shadow-md" style={{borderTopColor: '#014376'}}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-3 rounded-lg" style={{backgroundColor: '#31918D'}}>
                <Building className="w-6 h-6 text-white" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-800">Workspace </h3>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Startups</span>
              <span className="text-2xl font-bold" style={{color: '#014376'}}>{coursesData.totalCourses}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 text-center rounded-lg bg-gray-50">
                <div className="mb-1 text-sm text-gray-500">Individual</div>
                <div className="text-xl font-bold" style={{color: '#31918D'}}>{coursesData.runningCourses}</div>
              </div>
              <div className="p-3 text-center rounded-lg bg-gray-50">
                <div className="mb-1 text-sm text-gray-500">Company </div>
                <div className="text-xl font-bold" style={{color: '#014376'}}>{coursesData.scheduledCourses}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Finance Summary Card */}
        <div 
         onClick={() => navigate('/dashboard/finance-summary')}
        className="p-6 bg-white border-t-4 rounded-lg shadow-md" style={{borderTopColor: '#014376'}}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-3 rounded-lg" style={{backgroundColor: '#014376'}}>
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-800">Finance </h3>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <span className="text-gray-600">Total Earning</span>
              <span className="text-xl font-bold" style={{color: '#014376'}}>
                {formatCurrency(financeData.totalEarning)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">From Startups</span>
                <span className="font-semibold" style={{color: '#31918D'}}>
                  {formatCurrency(financeData.earnedFromStartups)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">From Courses</span>
                <span className="font-semibold" style={{color: '#31918D'}}>
                  {formatCurrency(financeData.earnedFromCourses)}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-red-600">Spend on Startups</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(financeData.spendOnStartups)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600">Spend on Courses</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(financeData.spendOnCourses)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="font-medium text-gray-700">Net Profit</span>
              <span className="text-xl font-bold text-green-600">
                {formatCurrency(financeData.profit)}
              </span>
            </div>
          </div>
        </div>

        {/* Employee/HR Summary Card */}
        <div 
         onClick={() => navigate('/dashboard/employee-summary')}
        className="p-6 bg-white border-t-4 rounded-lg shadow-md" style={{borderTopColor: '#31918D'}}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-3 rounded-lg" style={{backgroundColor: '#31918D'}}>
                <Users2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-800">Employee </h3>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Employees</span>
              <span className="text-2xl font-bold" style={{color: '#31918D'}}>{employeeData.totalEmployees}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-2 text-center rounded-lg bg-gray-50">
                <div className="mb-1 text-xs text-gray-500">STP</div>
                <div className="text-lg font-bold" style={{color: '#31918D'}}>{employeeData.stp}</div>
              </div>
              <div className="p-2 text-center rounded-lg bg-gray-50">
                <div className="mb-1 text-xs text-gray-500">SMEs</div>
                <div className="text-lg font-bold" style={{color: '#014376'}}>{employeeData.smes}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 text-center rounded bg-blue-50">
                <div className="mb-1 text-gray-500">Admin</div>
                <div className="font-bold" style={{color: '#014376'}}>{employeeData.adminStaff}</div>
              </div>
              <div className="p-2 text-center rounded bg-blue-50">
                <div className="mb-1 text-gray-500">Support</div>
                <div className="font-bold" style={{color: '#014376'}}>{employeeData.supportStaff}</div>
              </div>
              <div className="p-2 text-center rounded bg-blue-50">
                <div className="mb-1 text-gray-500">Management</div>
                <div className="font-bold" style={{color: '#014376'}}>{employeeData.management}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Summary Card */}
        <div 
         onClick={() => navigate('/dashboard/inventory-summary')}
        className="p-6 bg-white border-t-4 rounded-lg shadow-md" style={{borderTopColor: '#014376'}}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-3 rounded-lg" style={{backgroundColor: '#31918D'}}>
                <Package className="w-6 h-6 text-white" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-800">Inventory </h3>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Spaces</span>
              <span className="text-2xl font-bold" style={{color: '#014376'}}>{inventoryData.totalSpaces}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 text-center rounded-lg bg-red-50">
                <div className="mb-1 text-sm text-gray-500">Occupied</div>
                <div className="text-2xl font-bold text-red-600">{inventoryData.occupied}</div>
                <div className="mt-1 text-xs text-gray-500">
                  {((inventoryData.occupied / inventoryData.totalSpaces) * 100).toFixed(1)}%
                </div>
              </div>
              <div className="p-4 text-center rounded-lg bg-green-50">
                <div className="mb-1 text-sm text-gray-500">Available</div>
                <div className="text-2xl font-bold text-green-600">{inventoryData.available}</div>
                <div className="mt-1 text-xs text-gray-500">
                  {((inventoryData.available / inventoryData.totalSpaces) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="pt-3">
              <div className="flex justify-between mb-1 text-xs text-gray-500">
                <span>Occupancy Rate</span>
                <span>{((inventoryData.occupied / inventoryData.totalSpaces) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 rounded-full"
                  style={{
                    width: `${(inventoryData.occupied / inventoryData.totalSpaces) * 100}%`,
                    backgroundColor: inventoryData.occupied / inventoryData.totalSpaces > 0.8 ? '#EF4444' : '#31918D'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TotalStats;