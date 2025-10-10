import { BookOpen, GraduationCap, User, Clock, Calendar } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const DashboardComponent = () => {
  // Get actual student data from Redux store
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-11/12 mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-[#014376] to-[#0267b1] rounded-2xl p-8 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Welcome back, {user?.first_name || 'Student'}! 👋
                </h1>
                <p className="text-blue-100 text-lg">
                  Ready to continue your learning journey?
                </p>
                <div className="mt-4 flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{currentDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{currentTime}</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12" />
                  )}
                </div>
              </div>
            </div>
            
            {/* Current Course Info - Only if enrolled */}
            {user?.course_name && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5" />
                    <div>
                      <p className="text-xs text-blue-100">Current Course</p>
                      <p className="font-semibold">{user.course_name}</p>
                    </div>
                  </div>
                </div>
                {user?.teacher_name && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5" />
                      <div>
                        <p className="text-xs text-blue-100">Instructor</p>
                        <p className="font-semibold">{user.teacher_name}</p>
                      </div>
                    </div>
                  </div>
                )}
                {user?.batch_name && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5" />
                      <div>
                        <p className="text-xs text-blue-100">Batch</p>
                        <p className="font-semibold text-sm">{user.batch_name.split('-')[0]}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 rounded-full p-3">
                <User className="w-6 h-6 text-[#014376]" />
              </div>
              <h3 className="text-lg font-bold text-[#014376]">Your Profile</h3>
            </div>
            <div className="space-y-3 text-sm">
              {user?.email && (
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{user.email}</p>
                </div>
              )}
              {user?.contact && (
                <div>
                  <p className="text-gray-500">Contact</p>
                  <p className="font-medium text-gray-800">{user.contact}</p>
                </div>
              )}
              {user?.city && (
                <div>
                  <p className="text-gray-500">City</p>
                  <p className="font-medium text-gray-800">{user.city}</p>
                </div>
              )}
            </div>
          </div>

          {/* Academic Info */}
          {user?.course_name && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-[#014376]">Academic Info</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Course</p>
                  <p className="font-medium text-gray-800">{user.course_name}</p>
                </div>
                {user?.qualification && (
                  <div>
                    <p className="text-gray-500">Qualification</p>
                    <p className="font-medium text-gray-800">{user.qualification}</p>
                  </div>
                )}
                {user?.classes && user.classes.length > 0 && (
                  <div>
                    <p className="text-gray-500">Enrolled Classes</p>
                    <p className="font-medium text-gray-800">{user.classes.length}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-100 rounded-full p-3">
                <GraduationCap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-[#014376]">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <button 
               onClick={() => navigate('/dashboard/courses')}
              className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <p className="font-medium text-[#014376]">View My Classes</p>
                <p className="text-xs text-gray-600">See schedule & details</p>
              </button>
              {/* <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <p className="font-medium text-[#014376]">Check Attendance</p>
                <p className="text-xs text-gray-600">View attendance record</p>
              </button> */}
            </div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white text-center shadow-lg">
            <p className="text-2xl font-bold mb-2">
              "Education is the most powerful weapon which you can use to change the world."
            </p>
            <p className="text-sm opacity-90">- Nelson Mandela</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardComponent;