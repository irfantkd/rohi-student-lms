import {
  BookOpen,
  GraduationCap,
  User,
  Clock,
  Calendar,
  Award,
  TrendingUp,
  CheckCircle,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  BookMarked,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DashboardComponent = () => {
  const user = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  console.log("user7890", user);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Calculate fee statistics
  const installments =
    user?.classes?.flatMap((classItem) => classItem.fees?.installments || []) ||
    [];
  const totalInstallments = installments.length;
  const paidInstallments = installments.filter(
    (inst) => inst.status === "paid"
  ).length;
  const pendingInstallments = totalInstallments - paidInstallments;
  const progressPercentage =
    totalInstallments > 0 ? (paidInstallments / totalInstallments) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-6 md:mb-8">
          <div className="bg-gradient-to-r from-[#014376] via-[#0267b1] to-[#31918D] rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full transform translate-y-24 -translate-x-24"></div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                      Welcome back, {user?.first_name || "Student"}!
                    </h1>
                    <span className="text-2xl md:text-3xl">👋</span>
                  </div>
                  <p className="text-blue-100 text-base md:text-lg mb-4">
                    Ready to continue your learning journey?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-6 text-xs md:text-sm">
                    <div className="flex items-center gap-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg px-3 py-2">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{currentDate}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg px-3 py-2">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{currentTime}</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center backdrop-blur-sm border-2 border-white border-opacity-30 shadow-lg">
                    {user?.avatar ? (
                      <img
                        src={user?.avatar?.file_url}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 lg:w-12 lg:h-12" />
                    )}
                  </div>
                </div>
              </div>

              {user?.course_name && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20 hover:bg-opacity-15 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="bg-white bg-opacity-20 rounded-lg p-2">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-blue-100 mb-0.5">
                          Current Course
                        </p>
                        <p className="font-semibold text-sm truncate">
                          {user.course_name}
                        </p>
                      </div>
                    </div>
                  </div>
                  {user?.teacher_name && (
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20 hover:bg-opacity-15 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="bg-white bg-opacity-20 rounded-lg p-2">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-blue-100 mb-0.5">
                            Instructor
                          </p>
                          <p className="font-semibold text-sm truncate">
                            {user.teacher_name}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {user?.batch_name && (
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20 hover:bg-opacity-15 transition-all sm:col-span-2 lg:col-span-1">
                      <div className="flex items-center gap-3">
                        <div className="bg-white bg-opacity-20 rounded-lg p-2">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-blue-100 mb-0.5">Batch</p>
                          <p className="font-semibold text-sm truncate">
                            {user.batch_name.split("-")[0]}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {user?.classes && (
            <div className="bg-white rounded-xl shadow-lg p-5 md:p-6 border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-gradient-to-br from-[#014376] to-[#31918D] rounded-lg p-3">
                  <BookMarked className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Classes
                </span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {user.classes.length}
              </p>
              <p className="text-xs text-gray-500">Enrolled courses</p>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg p-5 md:p-6 border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg p-3">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Paid
              </span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              {paidInstallments}/{totalInstallments}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-5 md:p-6 border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg p-3">
                <h1 className="w-6 h-6 flex items-center justify-center rounded-full text-white text-lg font-semibold">
                  Rs
                </h1>
              </div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Pending
              </span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              {pendingInstallments}
            </p>
            <p className="text-xs text-gray-500">Installments remaining</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-5 md:p-6 border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Progress
              </span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              {progressPercentage.toFixed(0)}%
            </p>
            <p className="text-xs text-gray-500">Fee completion</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-xl shadow-lg p-5 md:p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
              <div className="bg-gradient-to-br from-[#014376] to-[#31918D] rounded-lg p-3">
                <User className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#014376]">
                Personal Info
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-[#31918D] mt-1 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 mb-1">Full Name</p>
                  <p className="font-semibold text-gray-900 truncate">
                    {user?.first_name} {user?.last_name}
                  </p>
                </div>
              </div>
              {user?.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#31918D] mt-1 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="font-medium text-gray-900 text-sm break-all">
                      {user.email}
                    </p>
                  </div>
                </div>
              )}
              {user?.contact && (
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#31918D] mt-1 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 mb-1">Contact</p>
                    <p className="font-medium text-gray-900">{user.contact}</p>
                  </div>
                </div>
              )}
              {user?.city && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#31918D] mt-1 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 mb-1">City</p>
                    <p className="font-medium text-gray-900">{user.city}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-5 md:p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
              <div className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg p-3">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#014376]">
                Academic Info
              </h3>
            </div>
            <div className="space-y-4">
              {user?.course_name && (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
                  <p className="text-xs text-gray-500 mb-1">Current Course</p>
                  <p className="font-semibold text-[#014376]">
                    {user.course_name}
                  </p>
                </div>
              )}
              {user?.qualification && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                  <p className="text-xs text-gray-500 mb-1">Qualification</p>
                  <p className="font-semibold text-purple-700">
                    {user.qualification}
                  </p>
                </div>
              )}
              {user?.classes && user.classes.length > 0 && (
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-100">
                  <p className="text-xs text-gray-500 mb-1">Enrolled Classes</p>
                  <p className="font-semibold text-emerald-700">
                    {user.classes.length} Classes
                  </p>
                </div>
              )}
              {user?.status && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100">
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <p className="font-semibold text-amber-700 capitalize">
                    {user.status}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-5 md:p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-3">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#014376]">
                Quick Actions
              </h3>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/dashboard/courses")}
                className="w-full group"
              >
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-xl transition-all border border-blue-100 hover:border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-[#014376] to-[#31918D] rounded-lg p-2">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-[#014376] text-sm">
                        View My Classes
                      </p>
                      <p className="text-xs text-gray-600">
                        See schedule & details
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#31918D] group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button
                onClick={() => navigate("/dashboard/fees")}
                className="w-full group"
              >
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 rounded-xl transition-all border border-emerald-100 hover:border-emerald-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg p-2">
                      <h1 className="w-4 h-4 flex items-center justify-center rounded-full text-white text-md font-semibold">
                        Rs
                      </h1>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-emerald-700 text-sm">
                        Manage Fees
                      </p>
                      <p className="text-xs text-gray-600">
                        View payment status
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button
                onClick={() => navigate("/dashboard/profile")}
                className="w-full group"
              >
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl transition-all border border-purple-100 hover:border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-2">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-purple-700 text-sm">
                        Edit Profile
                      </p>
                      <p className="text-xs text-gray-600">
                        Update your information
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="bg-gradient-to-r from-[#014376] via-purple-600 to-pink-500 rounded-2xl p-6 md:p-8 text-white text-center shadow-xl relative overflow-hidden mb-6 md:mb-8">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full transform -translate-y-24 translate-x-24"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full transform translate-y-20 -translate-x-20"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white bg-opacity-20 backdrop-blur-sm mb-4">
              <Award className="w-6 h-6" />
            </div>
            <p className="text-lg md:text-2xl font-bold mb-3 max-w-3xl mx-auto leading-relaxed">
              "Education is the most powerful weapon which you can use to change
              the world."
            </p>
            <p className="text-sm md:text-base opacity-90">- Nelson Mandela</p>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <div className="bg-gradient-to-br from-[#014376] to-[#31918D] rounded-lg p-3">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#014376]">Need Help?</h3>
              <p className="text-sm text-gray-600">We're here to support you</p>
            </div>
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed">
            Have questions about your courses, fees, or need assistance? Our
            support team is ready to help you with any inquiries.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="mailto:info@rohieskillslearninghub.com" className="group">
              <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-xl transition-all border border-blue-100 hover:border-blue-200 hover:shadow-md">
                <div className="bg-gradient-to-br from-[#014376] to-[#31918D] rounded-lg p-3 flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">
                    Email Support
                  </p>
                  <p className="font-semibold text-[#014376] group-hover:text-[#31918D] transition-colors truncate">
                    info@rohieskillslearninghub.com
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Get response within 24 hours
                  </p>
                </div>
              </div>
            </a>

            <a href="tel:03039602207" className="group">
              <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 rounded-xl transition-all border border-emerald-100 hover:border-emerald-200 hover:shadow-md">
                <div className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg p-3 flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">
                    Phone Support
                  </p>
                  <p className="font-semibold text-emerald-700 group-hover:text-emerald-800 transition-colors">
                    0303-9602207
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Available during office hours
                  </p>
                </div>
              </div>
            </a>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900 text-sm mb-1">
                  Office Hours
                </p>
                <p className="text-sm text-gray-700">
                  Monday - Saturday: 9:00 AM - 6:00 PM
                </p>
                <p className="text-sm text-gray-700">Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardComponent;
