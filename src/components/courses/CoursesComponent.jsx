import { BookOpen, GraduationCap, Clock, MapPin, Calendar, User } from 'lucide-react';
import { useSelector } from 'react-redux';

const CoursesComponent = () => {
  const user = useSelector((state) => state.auth.user);
  const classes = user?.classes || [];

  if (!classes.length) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-[#014376] mb-6">My Class</h1>
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Courses Enrolled</h3>
            <p className="text-gray-500">You are not enrolled in any courses yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-6">
      <div className="w-11/12 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#014376] mb-2">My Class</h1>
          <p className="text-gray-600">View your enrolled courses and class details</p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <div
              key={classItem.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Course Header with Gradient */}
              <div className="h-32 custom-Background relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    {classItem.is_active && (
                      <div className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Active
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#014376] mb-3 line-clamp-2">
                  {classItem.course_name}
                </h3>

                <div className="space-y-3 mb-4">
                  {classItem.teacher_name && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="bg-blue-50 rounded-full p-2">
                        <GraduationCap className="w-4 h-4 text-[#014376]" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Instructor</p>
                        <p className="font-medium text-gray-800">{classItem.teacher_name}</p>
                      </div>
                    </div>
                  )}

                  {classItem.name && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="bg-purple-50 rounded-full p-2">
                        <MapPin className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Class Name</p>
                        <p className="font-medium text-gray-800 text-xs line-clamp-1">{classItem.name}</p>
                      </div>
                    </div>
                  )}

                  {classItem.time_slot && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="bg-orange-50 rounded-full p-2">
                        <Clock className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Time Slot</p>
                        <p className="font-medium text-gray-800 capitalize">{classItem.time_slot}</p>
                      </div>
                    </div>
                  )}

                  {classItem.starting_date && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="bg-green-50 rounded-full p-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Start Date</p>
                        <p className="font-medium text-gray-800">
                          {new Date(classItem.starting_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

          
              </div>
            </div>
          ))}
        </div>

        {/* Course Summary */}
        {user?.course_name && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-[#014376] mb-4">Course Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Primary Course</p>
                <p className="font-semibold text-[#014376]">{user.course_name}</p>
              </div>
              {user?.teacher_name && (
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Main Instructor</p>
                  <p className="font-semibold text-green-700">{user.teacher_name}</p>
                </div>
              )}
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Total Classes</p>
                <p className="font-semibold text-purple-700">{classes.length}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesComponent;