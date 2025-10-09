// TrainingInquiry.jsx - Main page with tabs
import { useEffect, useState } from "react";
import { useGetQuery } from "../../../api/apiSlice";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  GraduationCap, 
  Code, 
  Palette, 
  ShoppingCart, 
  Gamepad2,
  Sparkles,
  XCircle,
  TrendingUp,
  Award
} from "lucide-react";
import Loader from "../../ui/common/LoaderComponent";

const courseIcons = {
  "Web Development": Code,
  "Graphic Designing": Palette,
  "eCommerce": ShoppingCart,
  "AI/Content Writing & Web Designing": Sparkles,
  "Game Development": Gamepad2,
  default: BookOpen,
};

const courseColors = {
  "Web Development": "from-blue-500 to-cyan-500",
  "Graphic Designing": "from-pink-500 to-rose-500",
  "eCommerce": "from-green-500 to-emerald-500",
  "AI/Content Writing & Web Designing": "from-purple-500 to-indigo-500",
  "Game Development": "from-orange-500 to-red-500",
  default: "from-gray-500 to-slate-500",
};

export default function TrainingInquiry() {
  const [activeTab, setActiveTab] = useState("basic");
  const [courseCounts, setCourseCounts] = useState({ basic: {}, advanced: {} });

  const { data: inquiryData, isLoading, isError } = useGetQuery({
    path: "/admin/training-enrollments",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (inquiryData?.success && inquiryData?.data) {
      const counts = { basic: {}, advanced: {} };

      inquiryData.data.forEach((enrollment) => {
        const courses = [
          { name: enrollment.primary_course, status: enrollment.primary_status },
          { name: enrollment.secondary_course, status: enrollment.secondary_status },
          { name: enrollment.tertiary_course, status: enrollment.tertiary_status },
        ];

        courses.forEach(({ name, status }) => {
          if (name && status) {
            const statusLower = status.toLowerCase();
            if (statusLower === "basic" || statusLower === "advanced") {
              counts[statusLower][name] = (counts[statusLower][name] || 0) + 1;
            }
          }
        });
      });

      setCourseCounts(counts);
    }
  }, [inquiryData]);

  const handleCourseClick = (courseName, courseType) => {
    navigate("/dashboard/training-inquiries/course", {
      state: { courseName, courseType },
    });
  };

  if (isLoading) {
    return (
  <Loader/>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Error loading enrollments</p>
        </div>
      </div>
    );
  }

  const currentCourses = courseCounts[activeTab];
  const totalCount = Object.values(currentCourses).reduce((sum, count) => sum + count, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-teal-50/30 p-6">
      <div className="w-11/12 mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 custom-Background rounded-xl shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Training Enrollments
              </h1>
            </div>
          </div>
        </div>

        {/* Tabs with Stats */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8 overflow-hidden">
          <div className="flex">
            <button
              onClick={() => setActiveTab("basic")}
              className={`flex-1 px-8 py-6 text-center font-semibold transition-all relative ${
                activeTab === "basic"
                  ? "text-white custom-Background"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                <BookOpen className="w-6 h-6" />
                <span className="text-lg">Basic Courses</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  activeTab === "basic" 
                    ? "bg-white/20 text-white" 
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {Object.values(courseCounts.basic).reduce((sum, count) => sum + count, 0)}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("advanced")}
              className={`flex-1 px-8 py-6 text-center font-semibold transition-all relative ${
                activeTab === "advanced"
                  ? "text-white custom-Background"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                <Award className="w-6 h-6" />
                <span className="text-lg">Advanced Courses</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  activeTab === "advanced" 
                    ? "bg-white/20 text-white" 
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {Object.values(courseCounts.advanced).reduce((sum, count) => sum + count, 0)}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(currentCourses).length > 0 ? (
            Object.entries(currentCourses).map(([courseName, count]) => {
              const IconComponent = courseIcons[courseName] || courseIcons.default;
              const gradientColor = courseColors[courseName] || courseColors.default;
              
              return (
                <div
                  key={courseName}
                  onClick={() => handleCourseClick(courseName, activeTab)}
                  className="group relative bg-white rounded-2xl shadow-md border border-gray-200 p-6 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  {/* Gradient Background Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradientColor} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-4 custom-Background rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="px-4 py-2 custom-Background text-white text-lg font-bold rounded-full shadow-md">
                          {count}
                        </span>
                        <span className="text-xs text-gray-500 mt-1 font-medium">
                          {count === 1 ? "inquiry" : "inquiries"}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#014376] transition-colors">
                      {courseName}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <TrendingUp className="w-4 h-4 text-[#31918D]" />
                      <span>View details</span>
                    </div>
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#014376] to-[#31918D] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full bg-white rounded-2xl shadow-lg border border-gray-200 p-16 text-center">
              <div className="inline-block p-6 bg-gradient-to-br from-[#014376]/10 to-[#31918D]/10 rounded-full mb-6">
                <BookOpen className="w-20 h-20 text-[#014376]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No {activeTab} courses found
              </h3>
              <p className="text-gray-600">
                There are currently no enrollment inquiries for {activeTab} courses.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}