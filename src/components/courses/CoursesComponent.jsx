import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetQuery } from "../../api/apiSlice";
import {
  BookOpen,
  Laptop,
  Users,
  ChevronRight,
  XCircle,
  GraduationCap,
  Briefcase,
  ChevronLeft,
} from "lucide-react";
import Loader from "../ui/common/LoaderComponent";

const ITEMS_PER_PAGE = 8;

const CoursesComponent = () => {
  const [activeTab, setActiveTab] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Fetch courses
  const {
    data: coursesData,
    error: coursesError,
    isLoading: coursesIsLoading,
  } = useGetQuery({
    path: "/admin/courses",
    params: { per_page: 100 },
  });

  // Fetch categories
  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: categoriesIsLoading,
  } = useGetQuery({
    path: "/admin/categories",
    params: { per_page: 15 },
  });

  // Set initial active tab when categories are loaded
  useEffect(() => {
    if (categoriesData?.data?.length > 0 && !activeTab) {
      setActiveTab(categoriesData.data[0].slug);
    }
  }, [categoriesData, activeTab]);

  // Reset to page 1 when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  if (coursesIsLoading || categoriesIsLoading) {
    return (
   <Loader/>
    );
  }

  if (coursesError || categoriesError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Error loading data</p>
        </div>
      </div>
    );
  }

  // Filter courses by active category
  const currentCategory = categoriesData?.data?.find(cat => cat.slug === activeTab);
  const currentCourses = coursesData?.data?.filter(
    (course) => course.category === currentCategory?.name
  ) || [];

  // Pagination calculations
  const totalPages = Math.ceil(currentCourses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCourses = currentCourses.slice(startIndex, endIndex);

  const handleCourseClick = (course) => {
    navigate(`/dashboard/courses/${course.uuid}/students`, {
      state: { course },
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-teal-50/30 p-6">
      <div className="w-11/12 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 custom-Background rounded-xl shadow-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Courses</h1>
            </div>
          </div>
        </div>

        {/* Dynamic Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8 overflow-hidden">
          <div className="flex">
            {categoriesData?.data?.map((category) => (
              <button
                key={category.uuid}
                onClick={() => setActiveTab(category.slug)}
                className={`flex-1 px-8 py-6 text-center font-semibold transition-all relative ${
                  activeTab === category.slug
                    ? "text-white custom-Background"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  {category.slug === "technical" ? (
                    <Laptop className="w-6 h-6" />
                  ) : (
                    <Briefcase className="w-6 h-6" />
                  )}
                  <span className="text-lg">{category.name}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      activeTab === category.slug
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {category.course_count}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {paginatedCourses.length > 0 ? (
            paginatedCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => handleCourseClick(course)}
                className="group relative bg-white rounded-2xl shadow-md border border-gray-200 p-6 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#014376]/5 to-[#31918D]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 custom-Background rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="px-3 py-1 bg-gradient-to-r from-[#014376] to-[#31918D] text-white text-xs font-bold rounded-full">
                        {course.category}
                      </span>
                      {course.is_scheduled === 1 && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          Scheduled
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Course Name */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#014376] transition-colors line-clamp-2 min-h-[3.5rem]">
                    {course.name}
                  </h3>
                  {/* Stats */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Users className="w-4 h-4 text-[#31918D]" />
                        Batches
                      </span>
                      <span className="font-bold text-gray-900">{course.batches || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Fee</span>
                      <span className="font-bold text-[#014376]">Rs. {course.fee}</span>
                    </div>
                  </div>
                  {/* View Details Link */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-600 group-hover:text-[#014376] transition-colors font-medium">
                      View Students
                    </span>
                    <div className="w-8 h-8 bg-gradient-to-r from-[#014376] to-[#31918D] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-2xl shadow-lg border border-gray-200 p-16 text-center">
              <div className="inline-block p-6 bg-gradient-to-br from-[#014376]/10 to-[#31918D]/10 rounded-full mb-6">
                <BookOpen className="w-20 h-20 text-[#014376]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No {currentCategory?.name || activeTab} courses found
              </h3>
              <p className="text-gray-600">
                There are currently no {currentCategory?.name || activeTab} courses available.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{startIndex + 1}</span> to{" "}
                <span className="font-semibold text-gray-900">
                  {Math.min(endIndex, currentCourses.length)}
                </span>{" "}
                of <span className="font-semibold text-gray-900">{currentCourses.length}</span> courses
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-all ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#014376] to-[#31918D] text-white hover:shadow-lg"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        currentPage === page
                          ? "bg-gradient-to-r from-[#014376] to-[#31918D] text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-all ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#014376] to-[#31918D] text-white hover:shadow-lg"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesComponent;