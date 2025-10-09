import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  useDeleteMutation,
  useGetQuery,
  usePatchMutation,
} from "../../api/apiSlice";
import Students from "../../assets/icons/navbar/students";
import StatsCards from "../finance/workingspace/components/StatsCards";
import BulkDeleteModal from "../ui/BulkDeleteModal";
import { showToast } from "../ui/common/ShowToast";
import DeleteModal from "../ui/DeleteModal";
import Header from "../ui/Header";
import Table from "../ui/Table";
import EditStudentModal from "./editStudentModal/EditStudentModal";
import StudentDetailsModal from "./StudentDetailsModal";
import Loader from "../ui/common/LoaderComponent";

const columns = ["Name", "Instructor", "Course", "Fee", "Due Date"];
const columnsFilters = [
  {
    field: "number",
    key: "serialNumber",
    placeholder: "Search SR #",
    isDisabled: true,
  },
  { field: "text", key: "name", placeholder: "Search Name", isDisabled: false },
  {
    field: "text",
    key: "instructor",
    placeholder: "Search Instructor",
    isDisabled: false,
  },
  {
    field: "text",
    key: "course",
    placeholder: "Search Course",
    isDisabled: false,
  },
  { field: "number", key: "fee", placeholder: "Search Fee", isDisabled: false },
  {
    field: "date",
    key: "dueDate",
    placeholder: "Search Due Date",
    isDisabled: false,
  },
  {
    field: "Dropdown",
    key: "status",
    placeholder: "Search Status",
    isDisabled: false,
  },
  { field: "button", key: "action", placeholder: "Reset", isDisabled: false },
];

const StudentsComponent = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStudentDetailsModalOpen, setIsStudentDetailsModalOpen] =
    useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isMultipleSelected, setIsMultipleSelected] = useState(false);
  const [selectedID, setSelectedID] = useState(null);
  const [selectedUuid, setSelectedUuid] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [initialValues, setInitialValues] = useState({});
  const [batchOptions, setBatchOptions] = useState([]);
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [filters, setFilters] = useState({
    name: "",
    instructor: "",
    course: "",
    fee: "",
    dueDate: "",
    status: "",
  });

  const [deleteStudent] = useDeleteMutation();
  const [patch] = usePatchMutation();

  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const activeStatus = queryParams.get("active_status");
  const gender = queryParams.get("gender");
  const dailyPaidFee = queryParams.get("daily_paid_fee");
  const weeklyPaidFee = queryParams.get("weekly_paid_fee");
  const monthlyPaidFee = queryParams.get("monthly_paid_fee");
  const dailyPendingFee = queryParams.get("daily_pending_fee");
  const weeklyPendingFee = queryParams.get("weekly_pending_fee");
  const monthlyPendingFee = queryParams.get("monthly_pending_fee");
  const isHostalize = queryParams.get("isHostalize");
  const dailyFee = queryParams.get("daily_fee");
  const weeklyFee = queryParams.get("weekly_fee");
  const monthlyFee = queryParams.get("monthly_fee");

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const {
    data: studentsData,
    error: studentError,
    isLoading: studentIsLoading,
    refetch: refetchStudents,
  } = useGetQuery({
    path: "/admin/students",
    params: {
      ...(activeStatus && { active_status: activeStatus }),
      ...(gender && { gender: gender }),
      ...(dailyPaidFee && { daily_paid_fee: dailyPaidFee }),
      ...(weeklyPaidFee && { weekly_paid_fee: weeklyPaidFee }),
      ...(monthlyPaidFee && { monthly_paid_fee: monthlyPaidFee }),
      ...(dailyPendingFee && { daily_pending_fee: dailyPendingFee }),
      ...(weeklyPendingFee && { weekly_pending_fee: weeklyPendingFee }),
      ...(monthlyPendingFee && { monthly_pending_fee: monthlyPendingFee }),
      ...(dailyFee && { daily_fee: dailyFee }),
      ...(weeklyFee && { weekly_fee: weeklyFee }),
      ...(monthlyFee && { monthly_fee: monthlyFee }),
      ...(isHostalize && { is_hostalize: isHostalize }),
      per_page: itemsPerPage,
    },
  });

  useEffect(() => {
    refetchStudents();
  }, []);

  const students = studentsData?.data;

  const handleEditClick = (item) => {
    setCurrentItem(item);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    if (currentItem) {
      const student = students?.find(
        (student) => student.uuid === currentItem.uuid
      );
      if (student) {
        const newInitialValues = {
          firstName: student.first_name || "",
          lastName: student.last_name || "",
          email: student.email || "",
          fixed_fee: student.fixed_fee || "",
          cnic: student.cnic || "",
          phoneNo: student.contact || "",
          qualification: student.qualification || "",
          guardianName: student.father_name || "",
          guardianPhoneNo: student.father_contact || "",
          address: student.address || "",
          gender: student.gender || "",
          city: student.city || "",
          class_id: student.class_id || "",
          fixed_fee_date: student.fixed_fee_date || "",
          dateOfBirth: student.dob || "",
          bio: student.bio || "",
          is_hostalize: student.is_hostalize === 1 || false,
          marital_status: student.marital_status || "",
          batchOptions: batchOptions,
          teacherOptions: teacherOptions,
          instructor: student.teacher_id ? String(student.teacher_id) : "", // Ensure string
          user_image: student.user_image || null,
        };
        setInitialValues(newInitialValues);
        setSelectedID(student.id);
        setSelectedUuid(student.uuid);
        console.log("Set selectedUuid:", student.uuid);
        console.log(
          "Initial Values set in StudentsComponent:",
          JSON.stringify(newInitialValues, null, 2)
        );
      } else {
        console.log("Student not found for uuid:", currentItem.uuid);
      }
    }
  }, [currentItem, students, batchOptions, teacherOptions]);

  const mappedStudentsData = useMemo(() => {
    return students?.map((student) => ({
      id: student.id,
      uuid: student.uuid,
      name: student.first_name + " " + student.last_name,
      instructor: student?.teacher_name,
      course: student?.course_name,
      fee: student.fixed_fee,
      "due date": student.fixed_fee_date,
      is_active: student.active_status,
      role: student.role,
    }));
  }, [students]);

  console.log("Mapped Students Data:", mappedStudentsData);

  const filteredStudentsData = useMemo(() => {
    return mappedStudentsData?.filter((student) => {
      return (
        (filters.name === "" ||
          student.name.toLowerCase().includes(filters.name.toLowerCase())) &&
        (filters.instructor === "" ||
          (student.instructor || "")
            .toLowerCase()
            .includes(filters.instructor.toLowerCase())) &&
        (filters.course === "" ||
          student.course
            .toLowerCase()
            .includes(filters.course.toLowerCase())) &&
        (filters.fee === "" ||
          student.fee.toString().includes(filters.fee.toString())) &&
        (filters.dueDate === "" ||
          student["due date"].includes(filters.dueDate)) &&
        (filters.status === "" ||
          student.is_active.toString() === filters.status.toString())
      );
    });
  }, [mappedStudentsData, filters]);

  const { data: batchData, refetch: refetchBatch } = useGetQuery({
    path: "/admin/batches",
    params: { active_status: 1 },
  });

  useEffect(() => {
    if (batchData) {
      const transformedBatchOptions = batchData.data.map((item) => ({
        value: item.class_id,
        label: item.name,
      }));
      setBatchOptions(transformedBatchOptions);
    }
  }, [batchData]);

  const { data: teacherData, refetch: refetchTeacher } = useGetQuery({
    path: "/admin/get/teacher",
  });

  useEffect(() => {
    if (teacherData) {
      const transformedTeacherOptions = teacherData.data.map((item) => ({
        value: String(item.id), // Ensure string
        label: `${item.first_name} ${item.last_name}`,
      }));
      setTeacherOptions(transformedTeacherOptions);
    }
  }, [teacherData]);

  const handleDeleteConfirm = async () => {
    try {
      console.log(selectedUuid, "uuiddd");
      await deleteStudent({ path: `/admin/student/${selectedUuid}` }).unwrap();
      setIsDeleteModalOpen(false);
      refetchStudents();
      showToast("Student deleted successfully", "success");
    } catch (err) {
      console.error("Failed to delete student:", err);
      showToast(
        "Failed to delete student: " + (err.data?.message || err.message),
        "error"
      );
    }
  };

  const handleBulkDeleteConfirm = () => {
    console.log("All selected items deleted successfully");
  };

  const handleEditSubmit = async (formState) => {
    console.log("Form State:", JSON.stringify(formState, null, 2));
    console.log("Selected UUID:", selectedUuid);
    const formData = new FormData();
    formData.append("first_name", formState.firstName || "");
    formData.append("last_name", formState.lastName || "");
    formData.append("email", formState.email || "");
    formData.append("fixed_fee", formState.fixed_fee || "");
    formData.append("cnic", formState.cnic || "");
    formData.append("contact", formState.phoneNo || "");
    formData.append("qualification", formState.qualification || "");
    formData.append("father_name", formState.guardianName || "");
    formData.append("father_contact", formState.guardianPhoneNo || "");
    formData.append("address", formState.address || "");
    formData.append("gender", formState.gender || "");
    formData.append("city", formState.city || "");
    formData.append("class_id", formState.class_id || "");
    formData.append("fixed_fee_date", formState.fixed_fee_date || "");
    formData.append("dob", formState.dateOfBirth || "");
    formData.append("bio", formState.bio || "");
    formData.append("is_hostalize", formState.is_hostalize ? "1" : "0");
    formData.append("marital_status", formState.marital_status || "");
    formData.append("teacher_id", formState.instructor || "");
    if (formState.user_image) {
      formData.append("user_image", formState.user_image);
    }
    formData.append("password", formState.cnic || "");
    formData.append("active_status", formState.active_status || "0");

    // Log FormData entries for debugging
    for (let [key, value] of formData.entries()) {
      console.log(`FormData ${key}:`, value);
    }

    try {
      const response = await patch({
        path: `/admin/student/${selectedUuid}`,
        body: formData,
      }).unwrap();
      if (response.message === "Success." && response.status === 1) {
        showToast("Student updated successfully", "success");
        setIsEditModalOpen(false);
        refetchStudents();
      } else {
        throw new Error("Unexpected response from server");
      }
      console.log("Response:", response);
    } catch (err) {
      console.error("Failed to update student:", err, err.data, err.status);
      showToast(
        "Failed to update student: " + (err.data?.message || err.message),
        "error"
      );
      setIsEditModalOpen(true);
    }
  };

  const handleSwitchToggle = async (modifiedItemId, newActiveStatus) => {
    const student = students.find((student) => student.id === modifiedItemId);
    const values = {
      first_name: student.first_name,
      active_status: newActiveStatus ? "1" : "0",
    };
    const modifiedItemUuid = student.uuid;
    try {
      await patch({
        path: `/admin/student/${modifiedItemUuid}`,
        // body: values,
      }).unwrap();
      refetchStudents();
      showToast("Student status updated successfully", "success");
    } catch (err) {
      console.error("Failed to update student:", err);
      showToast(
        "Failed to update status: " + (err.data?.message || err.message),
        "error"
      );
    }
  };

  const isFilterApplied = Object.values(filters).some((value) => value !== "");

  const handleResetChange = () => {
    setFilters({
      name: "",
      instructor: "",
      course: "",
      fee: "",
      dueDate: "",
      status: "",
    });
  };

  const fields = [
    {
      name: "batch",
      options: batchOptions,
    },
    {
      name: "instructor",
      options: teacherOptions,
    },
  ];
  const statsData = [
    { label: "Total Students", value: 56 },
    { label: "Active", value: 67 },
    { label: "Military/Civil", value: "57/20" },
  ];

  return (
    <div className="w-11/12 mx-auto cursor">
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
        {statsData.map((data, index) => (
          <div key={index}>
            <StatsCards label={data.label} value={data.value} />
          </div>
        ))}
      </div>

      <Header
        title="Students"
        isMultipleSelected={isMultipleSelected}
        setIsBulkDeleteModalOpen={setIsBulkDeleteModalOpen}
        icon={<Students />}
        batchButton="student"
        TotalCategories={
          studentIsLoading || studentError ? null : mappedStudentsData?.length
        }
        sourceComponent="StudentsComponent"
      />

      {studentIsLoading && <Loader/>}
      {studentError && <div>Error loading students</div>}
      {!studentIsLoading && !studentError && (
        <Table
          data={isFilterApplied ? filteredStudentsData : mappedStudentsData}
          columns={columns}
          columnsFilters={columnsFilters}
          handleFilterChange={handleFilterChange}
          handleResetChange={handleResetChange}
          setIsEditModalOpen={setIsEditModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          setIsMultipleSelected={setIsMultipleSelected}
          setIsStudentDetailsModalOpen={setIsStudentDetailsModalOpen}
          setSelectedID={setSelectedID}
          handleSwitchToggle={handleSwitchToggle}
          handleEditClick={handleEditClick}
          ColumnUnderline={true}
          sourceComponent="StudentsComponent"
          borderNone={false}
        />
      )}

      <EditStudentModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        refetchStudents={refetchStudents}
        initialValues={initialValues}
        studentId={selectedID}
        onSubmit={handleEditSubmit}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        title="Delete Student"
        message="Are you sure you want to delete this Student?"
        confirmText="Yes"
        cancelText="No"
        onConfirm={handleDeleteConfirm}
        onClose={() => console.log("Delete modal closed")}
        successMessage="Deleted Successfully!"
      />
      <BulkDeleteModal
        isOpen={isBulkDeleteModalOpen}
        setIsOpen={setIsBulkDeleteModalOpen}
        message="Are you sure you want to delete all the selected batches?"
        confirmText="Yes"
        cancelText="No"
        onConfirm={handleBulkDeleteConfirm}
        onClose={() => console.log("Bulk delete modal closed")}
        successMessage="Deleted Successfully!"
      />
      <StudentDetailsModal
        isOpen={isStudentDetailsModalOpen}
        setIsOpen={setIsStudentDetailsModalOpen}
        selectedID={selectedID}
      />
    </div>
  );
};

export default StudentsComponent;
