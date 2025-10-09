/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetQuery } from "../../../api/apiSlice";
import { formatDate } from "../../ui/common/FormatDate";

const StudentDetailsTab = () => {
  const { id } = useParams();
  const [userId, setUserId] = useState(id);
  console.log("userId", userId);
  console.log("studentId 2", id);

  // const {
  //   data,
  //   error: studentError,
  //   isLoading: studentIsLoading,
  //   refetch: refetchStudent,
  // } = useGetQuery({
  //   path: `/admin/student/${id}`,
  // });

  const {
    data,
    error: studentError,
    isLoading: studentIsLoading,
    refetch: refetchStudent,
  } = useGetQuery(
    id
      ? {
          path: `/admin/student/${id}`,
        }
      : null,
    {
      skip: !id,
    }
  );

  useEffect(() => {
    refetchStudent();
  }, []);

  const studentData = data?.data;

  console.log("studentData", studentData);
  const studentImage = studentData?.avatar?.file_url;
  const studentName = studentData?.first_name + " " + studentData?.last_name;
  // const instructorDesignation = studentData?.designation;
  console.log("studentImage", studentImage);

  const details = [
    // {
    //   label: "Name",
    //   value: studentData?.first_name + " " + studentData?.last_name,
    // },
    { label: "Email", value: studentData?.email },
    { label: "CNIC", value: studentData?.cnic },
    {
      label: "Date of Birth",
      value: studentData?.dob ? formatDate(studentData.dob) : "",
    },
    { label: "Phone #", value: studentData?.contact },
    { label: "Guardian Name", value: studentData?.father_name },
    { label: "Guardian Phone #", value: studentData?.father_contact },
    { label: "Gender", value: studentData?.gender },
    { label: "Address", value: studentData?.address },
    { label: "City", value: studentData?.city },
    { label: "Marital Status", value: studentData?.marital_status },
  ];

  const detailsOfficial = [
    { label: "Qualification", value: studentData?.qualification },
    {
      label: "Hostilize",
      value: studentData?.is_hostalize === 1 ? "Yes" : "No",
    },
    {
      label: "Admission Date",
      value: studentData?.created_at ? formatDate(studentData.created_at) : "",
    },
    { label: "Course Name", value: studentData?.course_name },
    { label: "Batch Name", value: studentData?.batch_name },
    { label: "Instructor Name", value: studentData?.teacher_name },

    { label: "Fee", value: studentData?.fixed_fee },
    {
      label: "Due Date",
      value: studentData?.fixed_fee_date
        ? formatDate(studentData.fixed_fee_date)
        : "",
    },

    { label: "Note", value: studentData?.bio },
  ];

  return (
    <>
      {studentIsLoading && <div>Loading...</div>}
      {studentError && <div>Error loading student</div>}
      {!studentIsLoading && !studentError && (
        <div className="flex  font-poppins border border-[#d5dada] bg-white h-full w-full">
          <div className="h-full w-[25%] mx-auto   pt-10 ">
            <img
              className="object-cover w-56 h-56 mx-auto mb-4 rounded-full "
              src={studentImage}
              alt="Profile Image"
            />
            <div className="flex flex-col items-center justify-center font-Montserrat gap-y-3">
              <h1 className="text-xl font-medium tracking-wide ">
                {studentName}
              </h1>
              {/* <h6 className="text-md tex-center">{instructorDesignation}</h6> */}
            </div>
          </div>
          <div className="w-[75%] h-full border-l border-[#d5dada]  pt-6 ">
            <div className="flex flex-col gap-4  font-Montserrat border-b border-[#d5dada] pb-3 ">
              <h1 className="pl-6 text-lg font-semibold tracking-tight ">
                Personal Information
              </h1>
              <div className="grid grid-cols-1 col-span-2 gap-5 pl-10 lg:grid-cols-3 lg:place-content-start place-content-start ">
                {details?.map((detail, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-start gap-y-1 "
                  >
                    <div className="font-medium text-black text-md">
                      {detail.label}
                    </div>
                    <div className="text-sm text-gray">{detail.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4 pt-6  font-Montserrat border-b border-[#d5dada] pb-3 ">
              <h1 className="pl-6 text-lg font-semibold tracking-tight ">
                Official Information
              </h1>
              <div className="grid grid-cols-1 col-span-2 gap-5 pl-10 lg:grid-cols-3 lg:place-content-start place-content-start ">
                {detailsOfficial?.map((detail, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-start gap-y-1 pb-"
                  >
                    <div className="font-medium text-black text-md">
                      {detail.label}
                    </div>
                    <div className="text-sm text-gray">{detail.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentDetailsTab;
