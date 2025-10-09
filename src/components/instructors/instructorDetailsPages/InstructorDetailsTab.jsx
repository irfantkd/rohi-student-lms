import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../ui/Header";
import { useGetQuery } from "../../../api/apiSlice";
import { INSTRUCTORS } from "../../routes/RouteConstants";
import ArrowImage from "../../../assets/images/forget/arrow.png";
import InstructorBatchesTab from "../instructorDetailsPages/InstructorBatchesTab";
import { formatDate } from "../../ui/common/FormatDate";
import InstructorDocumentTab from "./InstructorDocumentTab";
const InstructorDetailsTab = () => {
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isMultipleSelected, setIsMultipleSelected] = useState(false);
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Instructor Details");
  console.log("studentId 2", id);
  const navigate = useNavigate();

  const {
    data,
    error: emplpoyeeError,
    isLoading: employeeIsLoading,
    refetch: refetchEmployee,
  } = useGetQuery({
    path: `/admin/teacher/${id}`,
  });

  useEffect(() => {
    refetchEmployee();
  }, []);

  const instructorData = data?.data;
  console.log("instructorData", instructorData);

  const instructorImage = instructorData?.avatar?.file_url;
  const instructorName =
    instructorData?.first_name + " " + instructorData?.last_name;
  const instructorDesignation = instructorData?.designation;
  console.log("instructorImage", instructorImage);

  const details = [
    // {
    //   label: "Name",
    //   value: instructorData?.first_name + " " + instructorData?.last_name,
    // },
    { label: "Email", value: instructorData?.email },
    { label: "CNIC", value: instructorData?.cnic },
    {
      label: "Date of Birth",
      // value: instructorData?.dob,
      value: instructorData?.dob ? formatDate(instructorData.dob) : "",
    },
    { label: "Phone #", value: instructorData?.contact },
    { label: "Guardian Name", value: instructorData?.father_name },
    { label: "Guardian Phone #", value: instructorData?.father_contact },
    { label: "Gender", value: instructorData?.gender },
    { label: "City", value: instructorData?.city },
    { label: "Marital Status", value: instructorData?.marital_status },
    { label: "Address", value: instructorData?.address },
  ];

  const detailsOfficial = [
    { label: "Qualification", value: instructorData?.qualification },

    { label: "Basic Salary", value: instructorData?.basic_salary },
    { label: "Experience", value: instructorData?.experience },

    {
      label: "Joinning Date",
      value: instructorData?.created_at
        ? formatDate(instructorData.created_at)
        : "",
    },
    {
      label: "Hostilize",
      value: instructorData?.is_hostalize === 1 ? "Yes" : "No",
    },
    { label: "Note", value: instructorData?.bio },
  ];

  const facilitiesDetails = instructorData?.facilities?.map((facility) => ({
    value: facility?.facility_name,
  }));

  // console.log("detailsFacility", detailsFacility);

  const handleTabClick = (buttonType) => {
    setActiveTab(buttonType);
  };

  return (
    <div className="w-11/12  mx-auto">
      <Header
        title="Tech Trainer"
        isMultipleSelected={isMultipleSelected}
        setIsBulkDeleteModalOpen={setIsBulkDeleteModalOpen}
        showActionButton={false}
      />

      <div className=" py-3 h-full  ">
        <button className="float-end px-5 py-5">
          <img
            src={ArrowImage}
            alt="back button"
            onClick={() => navigate(INSTRUCTORS)}
          />
        </button>
        <button
          className={`bg-[#F8F9F9] border border-slate-300 w-36 py-2  font-semibold rounded-l-lg ${
            activeTab === "Instructor Details"
              ? "custom-Background text-white"
              : ""
          }`}
          onClick={() => handleTabClick("Instructor Details")}
        >
          Trainer Details
        </button>
        <button
          className={`bg-[#F8F9F9] border w-40 py-2  font-semibold border-r border-l  border-slate-300 ${
            activeTab === "Document Details"
              ? "custom-Background text-white"
              : ""
          }`}
          onClick={() => handleTabClick("Document Details")}
        >
          Documents Details
        </button>
        <button
          className={`bg-[#F8F9F9] border border-slate-300 w-36 py-2 font-semibold rounded-r-lg ${
            activeTab === "Batch Details" ? "custom-Background text-white" : ""
          }`}
          onClick={() => handleTabClick("Batch Details")}
        >
          Batch Details
        </button>
      </div>
      {activeTab === "Instructor Details" && (
        <div>
          {employeeIsLoading && <div>Loading...</div>}
          {emplpoyeeError && <div>Error loading Employee</div>}
          {!employeeIsLoading && !emplpoyeeError && (
            <>
              <div className="flex  font-poppins border border-[#d5dada] bg-white h-full w-full">
                <div className="h-full w-[25%] mx-auto   pt-10 ">
                  <img
                    className="rounded-full h-56 w-56 object-cover mb-4 mx-auto "
                    src={instructorImage}
                    alt="Profile Image"
                  />
                  <div className=" font-Montserrat flex flex-col gap-y-3 items-center  justify-center">
                    <h1 className="text-xl tracking-wide font-medium ">
                      {instructorName}
                    </h1>
                    <h6 className="text-md tex-center">
                      {instructorDesignation}
                    </h6>
                  </div>
                </div>
                <div className="w-[75%] h-full border-l border-[#d5dada]  pt-6 ">
                  <div className="flex flex-col gap-4  font-Montserrat border-b border-[#d5dada] pb-3">
                    <h1 className=" pl-6 tracking-tight text-lg font-semibold ">
                      Personal Information
                    </h1>
                    <div className="grid lg:grid-cols-3 col-span-2 grid-cols-1 gap-5  pl-10 lg:place-content-start place-content-start  ">
                      {details.map((detail, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-start gap-y-1 "
                        >
                          <div className="font-medium text-black text-md">
                            {detail.label}
                          </div>
                          <div className="text-sm text-gray">
                            {detail.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 pt-6 font-Montserrat  border-b border-[#d5dada] pb-3 ">
                    <h1 className=" pl-6 tracking-tight text-lg font-semibold ">
                      Official Information
                    </h1>
                    <div className="grid lg:grid-cols-3 col-span-2 grid-cols-1 gap-5  pl-10 lg:place-content-start place-content-start  ">
                      {detailsOfficial.map((detail, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-start gap-y-1 pb-"
                        >
                          <div className="font-medium text-black text-md">
                            {detail.label}
                          </div>
                          <div className="text-sm text-gray">
                            {detail.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 pt-6 pb-6  font-Montserrat ">
                    <h1 className=" pl-6 tracking-wide text-lg font-semibold ">
                      Facilities
                    </h1>
                    <div className="pl-10 flex gap-2 ">
                      {facilitiesDetails?.map(
                        (detail, index) => (
                          console.log("detail22222", detail),
                          (
                            <div
                              key={index}
                              className="flex flex-col items-start  pb-2"
                            >
                              <div className="text-sm text-[#474747] bg-[#00000021] px-4 py-1 rounded-full ">
                                {detail.value}
                              </div>
                            </div>
                          )
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
      {activeTab === "Document Details" && <InstructorDocumentTab />}

      {activeTab === "Batch Details" && <InstructorBatchesTab />}
    </div>
  );
};

export default InstructorDetailsTab;
