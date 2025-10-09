import { useEffect, useState } from "react";
import { useGetQuery, usePostMutation } from "../../api/apiSlice";
import { showToast } from "../ui/common/ShowToast";
import Header from "../ui/Header";
import Table from "../ui/Table";
const AttendanceMarkSection = () => {
  const [options, setOptions] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedAttendanceDate, setSelectedAttendanceDate] = useState("");
  const [batchStudents, setBatchStudents] = useState([]);
  const [markedAttendanceArray, setMarkedAttendanceArray] = useState([]); // State for marked attendance
  const [postAttendance] = usePostMutation();
  const {
    data: BatchesData,
    error: BatchesError,
    isLoading: BatchesLoading,
    refetch: refetchBatches,
  } = useGetQuery({
    path: "/admin/batches",
    params: {
      per_page: 1000,
    },
  });
  const {
    data: batchData,
    error: batchError,
    isLoading: batchLoading,
  } = useGetQuery(
    selectedBatch
      ? {
          path: `/admin/batch/${selectedBatch.value}`,
        }
      : null,
    {
      skip: !selectedBatch,
    }
  );

  const {
    data: attendance,
    error,
    isLoading,
  } = useGetQuery({
    path: "/admin/attendences",
  });
  console.log(attendance, "attendance");

  const formattedAttendance = attendance?.data?.map((atten) => ({
    id: atten.id,
    name: atten.student_name,
    date: atten.date,
    attendance: atten.present_status,
  }));
  console.log("formatted", formattedAttendance);

  useEffect(() => {
    if (batchData?.data?.students) {
      const transformedStudents = batchData.data.students.map((user) => ({
        id: user.id,
        name: user.name,
        date: selectedAttendanceDate,
      }));
      setBatchStudents(transformedStudents);
    }
  }, [batchData, selectedAttendanceDate]);

  useEffect(() => {
    if (BatchesData) {
      const transformedOptions = BatchesData.data.map((item) => ({
        id: item.class_id,
        value: item.batch_uuid,
        label: item.name,
      }));
      setOptions(transformedOptions);
    }
  }, [BatchesData]);
  const handleBatchChange = (selectedOption) => {
    console.log("selectedOption =>", selectedOption);
    setSelectedBatch(selectedOption);
  };
  const handleDateChange = (e) => {
    setSelectedAttendanceDate(e.target.value);
  };

  // Function to update the markedAttendanceArray from AttendanceStatus component
  const updateMarkedAttendance = (newAttendanceRecord) => {
    setMarkedAttendanceArray((prevArray) => [
      ...prevArray,
      newAttendanceRecord,
    ]);
  };
  const handleSubmitAttendance = async () => {
    console.log("markedAttendanceArray", markedAttendanceArray);
    if (!selectedBatch || !selectedAttendanceDate) {
      showToast("Batch and date are required", "error");
      return;
    }

    const attendancePayload = {
      students: markedAttendanceArray,
      date: selectedAttendanceDate,
      class_id: selectedBatch.id,
    };

    console.log("attendancePayload", attendancePayload);

    try {
      const response = await postAttendance({
        path: "/admin/attendence/create",
        body: attendancePayload, // Submit the accumulated attendance array
      }).unwrap();
      if (response.message === "Success." && response.status === 1) {
        showToast("Attendance marked successfully", "success");
      }
      console.log("response", response);
    } catch (err) {
      console.error("Failed to mark attendance", err);
      showToast("Failed to mark attendance", "error");
    }
  };

  return (
    <div className="w-11/12 mx-auto">
      <Header
        title="Attendance"
        showActionButton={true}
        buttontitle="Submit"
        batchesOptions={options}
        handleBatchChange={handleBatchChange}
        markAttendanceDate={selectedAttendanceDate}
        handleMarkAttendanceDateChange={handleDateChange}
        handleSubmitAttendance={handleSubmitAttendance} // Pass the submission handler
      />
      {batchLoading && <div>Loading Batch Data...</div>}
      {batchError && <div>Error loading Batch Data</div>}
      {!batchLoading && !batchError && (
        <Table
          columns={["Name", "Date", "Attendance"]}
          // data={batchStudents}
          data={formattedAttendance}
          TableHeadingAction={false}
          sourceComponent="AttendanceMarkSection"
          markAttendanceDate={selectedAttendanceDate}
          updateMarkedAttendance={updateMarkedAttendance} // Pass the state update function
        />
      )}
    </div>
  );
};
export default AttendanceMarkSection;

// import React, { useEffect, useState } from "react";
// import Table from "../ui/Table";
// import Header from "../ui/Header";
// import { useGetQuery, usePostMutation } from "../../api/apiSlice";
// const [postAttendance] = usePostMutation();

// const columns = ["Name", "Date", "Attendance"];

// const data = [
//   {
//     id: 1,
//     name: "Tulaib",
//     date: new Date().toISOString().split("T")[0],
//   },
//   {
//     id: 2,
//     name: "Ahtasham",
//     date: new Date().toISOString().split("T")[0],
//   },
//   {
//     id: 3,
//     name: "Abdul Wahab",
//     date: new Date().toISOString().split("T")[0],
//   },
//   {
//     id: 4,
//     name: "Rizwan",
//     date: new Date().toISOString().split("T")[0],
//   },
// ];

// const AttendanceMarkSection = () => {
//   const [options, setOptions] = useState([]);
//   const [selectedBatch, setSelectedBatch] = useState(null);
//   const [selectedAttendanceDate, setSelectedAttendanceDate] = useState("");
//   const [batchStudents, setBatchStudents] = useState([]);

//   console.log("selectedAttendanceDate", selectedAttendanceDate);

//   const {
//     data: BatchesData,
//     error: BatchesError,
//     isLoading: BatchesLoading,
//     refetch: refetchBatches,
//   } = useGetQuery({
//     path: "/admin/batches",
//     params: {
//       per_page: 1000,
//     },
//   });

//   const {
//     data: batchData,
//     error: batchError,
//     isLoading: batchLoading,
//   } = useGetQuery(
//     selectedBatch
//       ? {
//           path: `/admin/batch/${selectedBatch.value}`,
//         }
//       : null,
//     {
//       skip: !selectedBatch,
//     }
//   );

//   console.log(batchData?.data?.students);

//   useEffect(() => {
//     if (batchData?.data?.students) {
//       const transformedStudents = batchData.data.students.map((user) => ({
//         id: user.id,
//         name: user.name,
//         date: selectedAttendanceDate,
//       }));
//       setBatchStudents(transformedStudents);
//       console.log(batchStudents);
//     }
//   }, [batchData, selectedAttendanceDate]);

//   useEffect(() => {
//     if (BatchesData) {
//       const transformedOptions = BatchesData.data.map((item) => ({
//         value: item.batch_uuid,
//         label: item.name,
//       }));
//       setOptions(transformedOptions);
//     }
//   }, [BatchesData]);

//   const handleBatchChange = (selectedOption) => {
//     setSelectedBatch(selectedOption);
//   };

//   const handleDateChange = (e) => {
//     setSelectedAttendanceDate(e.target.value);
//   };

//   console.log("done", options);

//   const handleSubmitAttendance = async (attendanceArray) => {
//     try {
//       const response = await postAttendance({
//         path: "/admin/attends/create",
//         body: attendanceArray,
//       }).unwrap();
//       if (response.message === "Success." && response.status === 1) {
//         showToast("Attendance marked successfully", "success");
//       }
//       console.log("response", response);
//     } catch (err) {
//       console.error("Failed to mark attendance", err);
//       showToast("Failed to mark attendance", "error");
//     }
//   };

//   return (
//     <div className="w-11/12 mx-auto">
//       <Header
//         title="Attendance"
//         showActionButton={true}
//         buttontitle="Submit"
//         batchesOptions={options}
//         handleBatchChange={handleBatchChange}
//         markAttendanceDate={selectedAttendanceDate}
//         handleMarkAttendanceDateChange={handleDateChange}
//         handleSubmitAttendance={handleSubmitAttendance}
//       />
//       {batchLoading && <div>Loading Batch Data...</div>}
//       {batchError && <div>Error loading Batch Data</div>}
//       {!batchLoading && !batchError && (
//         <Table
//           columns={columns}
//           data={batchStudents}
//           TableHeadingAction={false}
//           sourceComponent="AttendanceMarkSection"
//           markAttendanceDate={selectedAttendanceDate}
//           handleSubmitAttendance={handleSubmitAttendance}
//         />
//       )}
//     </div>
//   );
// };
// export default AttendanceMarkSection;
