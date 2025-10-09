// CourseInquiryDetails.jsx - Table page showing inquiries for a specific course
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowLeftCircle, HelpCircle, XCircle } from "lucide-react";
import { useGetQuery } from "../../../api/apiSlice";
import Table from "../../ui/Table";
import { formatDate } from "../../ui/common/FormatDate";
import Header from "../../ui/Header";
import Loader from "../../ui/common/LoaderComponent";
import { toast } from "react-toastify";

export default function InquiryDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { courseName, courseType } = location.state || {};

  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedID, setSelectedID] = useState(null);

  const { data: inquiryData, isLoading, isError } = useGetQuery({
    path: "/admin/training-enrollments",
  });

  useEffect(() => {
    if (inquiryData?.success && inquiryData?.data && courseName && courseType) {
      const filtered = inquiryData.data
        .filter((enrollment) => {
          const courses = [
            {
              name: enrollment.primary_course,
              status: enrollment.primary_status,
            },
            {
              name: enrollment.secondary_course,
              status: enrollment.secondary_status,
            },
            {
              name: enrollment.tertiary_course,
              status: enrollment.tertiary_status,
            },
          ];

          return courses.some(
            (course) =>
              course.name === courseName &&
              course.status?.toLowerCase() === courseType
          );
        })
        .map((enrollment) => ({
          id: enrollment.id,
          uuid: enrollment.id,
          name: `${enrollment.first_name} ${enrollment.last_name}`,
          email: enrollment.email,
          phone: enrollment.phone_number,
          city: enrollment.city,
          status: enrollment.status,
          date: formatDate(enrollment.submitted_at),
          // Store full enrollment for details view
          ...enrollment,
        }));

      setFilteredInquiries(filtered);
    }
  }, [inquiryData, courseName, courseType]);

  const handleViewDetails = (inquiry) => {
    navigate("/dashboard/training-inquiries/details", {
      state: { inquiry },
    });
  };

  if (!courseName || !courseType) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Invalid course selection</p>
          <button
            onClick={() => navigate("/dashboard/training-inquiry")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }


  if (isError) {
   toast.error("Error loading inquiries");
  }

  const columns = ["Name", "Email", "Phone", "City", "Status", "Date"];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {isLoading && <Loader />}
      <div className="w-11/12 mx-auto">
        {/* Header with back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard/training-inquiry")}
            className="flex items-center gap-2 text-brown"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Inquiries
          </button>
        </div>

       <Header
       icon={<HelpCircle className="w-8 h-8 text-white" />}
       title={`${courseName}  Course Inquiries`}
       showActionButton={false}
       />
        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <Table
            data={filteredInquiries}
            columns={columns}
            setIsEditModalOpen={setIsEditModalOpen}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
            setSelectedID={setSelectedID}
            handleEditClick={() => {}}
            TableHeadingAction={true}
            batchEditButton={false}
            sourceComponent="TrainingInquiries"
            onViewDetails={handleViewDetails}
            
          />
        </div>
      </div>
    </div>
  );
}