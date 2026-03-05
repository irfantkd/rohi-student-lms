import { useState } from "react";
import {
  BookOpen,
  GraduationCap,
  Clock,
  MapPin,
  Calendar,
  ChevronRight,
  Mail,
  Phone,
  Info,
  Lock,
  AlertCircle,
  Download,
  Upload,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ClassModal from "./components/ClassModal";

const CoursesComponent = () => {
  const user = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const classes = user?.classes || [];
  const [selectedClass, setSelectedClass] = useState(null);

  // Check if all fees are paid - updated to check fees within classes
  const hasAllFeesPaid = () => {
    if (!classes || classes.length === 0) return false;

    // Get all installments from all classes
    const allInstallments = classes.flatMap(
      (classItem) => classItem.fees?.installments || []
    );

    if (allInstallments.length === 0) return false;

    // Check if at least one installment is paid
    return allInstallments.some((inst) => inst.status === "paid");
  };

  const hasPendingFees = !hasAllFeesPaid();

  // If fees are pending, show payment required screen
  if (hasPendingFees) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50 p-6">
        <div className="mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#014376] to-[#31918D] p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full transform translate-y-24 -translate-x-24"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white bg-opacity-20 backdrop-blur-sm mb-4">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Payment Required</h1>
                <p className="text-blue-100">
                  Complete your fee payment to access class details
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="flex items-start gap-4 mb-6 p-5 bg-blue-50 rounded-xl border border-blue-200">
                <AlertCircle className="w-6 h-6 text-[#014376] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-[#014376] mb-2">
                    Access Restricted
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    To view your class schedules, instructor details, and other
                    course information, please complete your pending fee
                    payments. Once your payment is confirmed, you'll have full
                    access to all class details.
                  </p>
                </div>
              </div>

              {/* Payment Steps */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Complete Payment in 3 Easy Steps:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-200">
                    <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-r from-[#014376] to-[#31918D] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      1
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center gap-3 mb-2">
                        <Download className="w-5 h-5 text-[#014376]" />
                        <h4 className="font-semibold text-[#014376]">
                          Download Challan
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        Go to the fee section and download your payment challan
                        form
                      </p>
                    </div>
                  </div>

                  <div className="relative bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-200">
                    <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      2
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="w-5 h-5 flex items-center justify-center rounded-full text-emerald-600 text-lg font-semibold">
                          Rs
                        </h1>
                        <h4 className="font-semibold text-emerald-700">
                          Pay Fee
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        Visit your bank and complete the payment using the
                        challan
                      </p>
                    </div>
                  </div>

                  <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
                    <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      3
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center gap-3 mb-2">
                        <Upload className="w-5 h-5 text-purple-600" />
                        <h4 className="font-semibold text-purple-700">
                          Upload Receipt
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        Return to fee section and upload your paid challan
                        receipt
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature List */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">
                  What you'll get access to after payment:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                    <div className="bg-gradient-to-br from-[#014376] to-[#31918D] rounded-lg p-2">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        Course Details
                      </p>
                      <p className="text-xs text-gray-600">
                        View complete course information
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border border-emerald-100">
                    <div className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg p-2">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        Instructor Info
                      </p>
                      <p className="text-xs text-gray-600">
                        Contact and profile details
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-100">
                    <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg p-2">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        Class Schedule
                      </p>
                      <p className="text-xs text-gray-600">
                        Timings and class days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-2">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        Location Details
                      </p>
                      <p className="text-xs text-gray-600">
                        Campus and room information
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/dashboard/fees")}
                  className="w-full group"
                >
                  <div className="flex items-center justify-between p-5 bg-gradient-to-r from-[#014376] to-[#31918D] hover:from-[#013057] hover:to-[#267b78] rounded-xl transition-all shadow-lg hover:shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3">
                        <h1 className="w-6 h-6 flex items-center justify-center rounded-full text-white text-lg font-semibold">
                          Rs
                        </h1>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-white text-lg">
                          Go to Fee Section
                        </p>
                        <p className="text-sm text-blue-100">
                          Download challan, pay fee & upload receipt
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full p-4 bg-white hover:bg-gray-50 rounded-xl transition-all border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-medium"
                >
                  Go to Dashboard
                </button>
              </div>

              {/* Help Section */}
              <div className="mt-8 p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-[#014376] mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-[#014376]" />
                  Need Help?
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  If you've already made a payment and still see this message,
                  please contact the administration office or wait for payment
                  verification. It may take a few hours to process your payment.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-blue-200">
                  <a
                    href="mailto:info@rohieskillslearninghub.com"
                    className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors group"
                  >
                    <div className="bg-gradient-to-br from-[#014376] to-[#31918D] rounded-lg p-2">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Email Support</p>
                      <p className="font-medium text-[#014376] text-sm truncate group-hover:text-[#31918D] transition-colors">
                        info@rohieskillslearninghub.com
                      </p>
                    </div>
                  </a>
                  <a
                    href="tel:03039602207"
                    className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors group"
                  >
                    <div className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg p-2">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone Support</p>
                      <p className="font-medium text-emerald-700 text-sm group-hover:text-emerald-800 transition-colors">
                        0303-9602207
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If no classes enrolled
  if (!classes.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-[#014376] mb-6">My Classes</h1>
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Courses Enrolled
            </h3>
            <p className="text-gray-500">
              You are not enrolled in any courses yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleClassClick = (classItem) => {
    setSelectedClass(classItem);
  };

  const handleBackToList = () => {
    setSelectedClass(null);
  };

  // If a class is selected, show detail view
  if (selectedClass) {
    return (
      <ClassModal
        selectedClass={selectedClass}
        handleBackToList={handleBackToList}
      />
    );
  }

  // Default view - show all classes in grid
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50 p-6">
      <div className="w-11/12 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#014376] mb-2">My Classes</h1>
          <p className="text-gray-600">
            View your enrolled courses and class details
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes?.map((classItem) => (
            <div
              key={classItem.id}
              onClick={() => handleClassClick(classItem)}
              className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-1"
            >
              {/* Course Header with Gradient */}
              <div className="h-32 bg-gradient-to-br from-[#014376] to-[#31918D] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white opacity-10 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between">
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-2">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    {classItem.is_active && (
                      <div className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                        Active
                      </div>
                    )}
                  </div>
                </div>

                {/* Click indicator */}
                <div className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2 group-hover:bg-opacity-30 transition-all">
                  <ChevronRight className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#014376] mb-3 line-clamp-2 group-hover:text-[#31918D] transition-colors">
                  {classItem.course_name}
                </h3>

                <div className="space-y-3 mb-4">
                  {classItem.teacher_name && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="bg-gradient-to-br from-[#014376] to-[#31918D] rounded-full p-2">
                        <GraduationCap className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Instructor</p>
                        <p className="font-medium text-gray-800">
                          {classItem.teacher_name}
                        </p>
                      </div>
                    </div>
                  )}

                  {classItem.time_slot && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-full p-2">
                        <Clock className="w-4 h-4 text-zinc-500" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Time Slot</p>
                        <p className="font-medium text-gray-800 capitalize">
                          {classItem.time_slot}
                          {classItem.timing && (
                            <span className="text-gray-600 font-normal ml-1">
                              ({classItem.timing})
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {classItem.starting_date && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-full p-2">
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Start Date</p>
                        <p className="font-medium text-gray-800">
                          {new Date(classItem.starting_date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <button className="text-sm text-[#31918D] font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Course Summary */}
        {user?.course_name && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-[#014376] mb-4">
              Course Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
                <p className="text-sm text-gray-600 mb-1">Primary Course</p>
                <p className="font-semibold text-[#014376]">
                  {user.course_name}
                </p>
              </div>
              {user?.teacher_name && (
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-100">
                  <p className="text-sm text-gray-600 mb-1">Main Instructor</p>
                  <p className="font-semibold text-emerald-700">
                    {user.teacher_name}
                  </p>
                </div>
              )}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                <p className="text-sm text-gray-600 mb-1">Total Classes</p>
                <p className="font-semibold text-purple-700">
                  {classes.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesComponent;
