import { useEffect, useMemo, useState } from "react";
import Header from "../ui/Header";
import InstructorsIcon from "../../assets/icons/navbar/Instructors";
import Table from "../ui/Table";
import EditModal from "../ui/EditModal";
import DeleteModal from "../ui/DeleteModal";
import BulkDeleteModal from "../ui/BulkDeleteModal";
import {
  useGetQuery,
  useDeleteMutation,
  usePatchMutation,
} from "../../api/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import { getInstructors } from "../../features/instructors/instructorsSlice";
import InstructorModal from "../ui/instructorModal/InstructorModal";
import { showToast } from "../ui/common/ShowToast";
import { useLocation } from "react-router-dom";
import { IdCard } from "lucide-react";

const columns = ["Name", "Phone No", "Project", "Salary"];
const columnsFilters = [
  {
    field: "number",
    key: "serialNumber",
    placeholder: "Search SR #",
    isDisabled: true,
  },
  {
    field: "text",
    key: "name",
    placeholder: "Search Name",
    isDisabled: false,
  },
  {
    field: "number",
    key: "phoneNO",
    placeholder: "Search Phone No",
    isDisabled: false,
  },
  {
    field: "number",
    key: "project",
    placeholder: "Search Project",
    isDisabled: false,
  },
  {
    field: "number",
    key: "salary",
    placeholder: "Search Salary",
    isDisabled: false,
  },

  {
    field: "Dropdown",
    key: "status",
    placeholder: "Search Status",
    isDisabled: false,
  },
  {
    field: "button",
    key: "action",
    placeholder: "Reset",
    isDisabled: false,
  },
];

const EmployeesComponent = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isMultipleSelected, setIsMultipleSelected] = useState(false);
  const [currentItem, setCurrentItem] = useState([]);
  const [selectedID, setSelectedID] = useState(null);
  const [patch] = usePatchMutation();
  const [filters, setFilters] = useState({
    name: "",
    phoneNO: "",
    project: "",
    salary: "",
    status: "",
  });
  const location = useLocation();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);

  const activeStatus = queryParams.get("active_status");

  // const [courseOptions, setCourseOptions] = useState([]);
  console.log("currentItem222", currentItem);

  const [deleteInstructor] = useDeleteMutation();

  const instructors = useSelector((state) => state.instructors.instructors);
  console.log("instructors list", instructors);

  // Callback to update filters from TableFilters component
  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const mappedInstructorData = useMemo(() => {
    const formattedData = instructors?.map((instructor) => ({
      id: instructor.id,
      uuid: instructor.uuid,
      name: instructor.first_name,
      "father name": instructor.father_name,
      "phone no": instructor.contact,
      project: "0",
      salary: instructor.basic_salary,
      "total instructors": 0,
      is_active: instructor.active_status,
      role: instructor.role,
    }));
    console.log("formattedData", formattedData);
    return formattedData;
  }, [instructors]);
  console.log(
    "mappedInstructorData",
    mappedInstructorData?.map((name) => name.name)
  );
  console.log("random", mappedInstructorData);

  const filteredStudentsData = useMemo(() => {
    return mappedInstructorData?.filter((student) => {
      return (
        (filters?.name === "" ||
          student?.name
            ?.toLowerCase()
            ?.includes(filters?.name?.toLowerCase())) &&
        (filters?.phoneNO === "" ||
          student["phone no"]
            ?.toString()
            ?.includes(filters?.phoneNO?.toString())) &&
        (filters?.project === "" ||
          student?.project?.toString()?.includes(filters?.project)) &&
        (filters?.salary === "" ||
          student?.salary?.toString()?.includes(filters?.salary)) &&
        (filters?.status === "" ||
          student?.is_active?.toString() === filters?.status?.toString()) // Ensure status is compared as strings
      );
    });
  }, [mappedInstructorData, filters]);

  console.log("filteredStudentsData here", filteredStudentsData);

  // Get all instructors api
  const {
    data: instructorData,
    error: instructorError,
    isLoading: instructorIsLoading,
    refetch: refetchInstructor,
  } = useGetQuery({
    path: "/admin/users/employee",
    params: {
      ...(activeStatus && { active_status: activeStatus }),
    },
  });

  useEffect(() => {
    refetchInstructor();
  }, []);

  useEffect(() => {
    dispatch(
      getInstructors({
        instructors: instructorData?.data,
      })
    );
    console.log("instructorData", instructorData);
  }, [instructorData, dispatch]);

  const handleBulkDeleteConfirm = () => {
    console.log("All selected items deleted successfully");
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteInstructor({
        path: `/admin/employee/${selectedID}`,
      }).unwrap();
      setIsDeleteModalOpen(false);
      console.log(" selected item deleted successfully");
      refetchInstructor();
    } catch (err) {
      console.error("Failed to delete Instructor", err);
    }
  };

  const handleEditSubmit = async (formState) => {
    console.log("formstate443", formState);
    const values = {
      firstName: formState.instructor,
      fatherName: formState.fatherName, // Correctly map father name
      contact: formState.phoneNo,
    };

    console.log("values before update", values);
    console.log("selectedID before update", selectedID);

    try {
      const response = await patch({
        path: `/admin/employee/${selectedID}`,
        body: values,
      }).unwrap();
      if (response.message === "Success." && response.status === 1) {
        showToast("Edit Successfully", "success");
      }
      setIsEditModalOpen(false);
      console.log("response", response);
      refetchInstructor(); // Refetch data after successful update
    } catch (err) {
      setIsEditModalOpen(true);
      console.error("Failed to update batch", err);
    }
  };

  // Update Switch Api Call:
  const handleSwitchToggle = async (modifiedItemId, newActiveStatus) => {
    console.log("modifiedItemId", modifiedItemId);
    console.log("newActiveStatus", newActiveStatus);
    console.log("instructors", instructors);
    const instructor = instructors.find(
      (instructors) => instructors.id === modifiedItemId
    );
    console.log("student in toggle function", instructor);
    const values = {
      firstName: instructor.first_name,
      active_status: newActiveStatus === true ? "1" : "0",
    };
    console.log("values before update", values);
    const modifiedItemUuid = instructor.uuid;
    console.log("modifiedItemUuid", modifiedItemUuid);
    try {
      const response = await patch({
        path: `/admin/teacher/${modifiedItemUuid}`,
        body: values,
      }).unwrap();
      console.log("response", response);
    } catch (err) {
      console.error("Failed to update student", err);
    }
  };

  const handleEditClick = (item) => {
    setCurrentItem({
      name: item.name,
      fatherName: item["father name"], // Ensure the key matches the data
      phoneNo: item["phone no"], // Ensure the key matches the data
      // name: item.name,
      // fatherName: item.father_name,
      // phoneNO: item.contact,
    });
    // setSelectedID(item.id);
    setIsEditModalOpen(true);
  };

  const Editfields = [
    {
      name: "instructor",
      label: "Employee",
      placeholder: "Edit Instructor",
    },
    {
      name: "fatherName",
      label: "Father Name",
      // type: "text",
      placeholder: "Father Name",
    },

    {
      name: "phoneNo",
      label: "Phone No",
      type: "text",
      placeholder: "Phone Number",
    },
  ];

  const initialValues = {
    instructor: currentItem.name || "",
    fatherName: currentItem.fatherName || "",
    phoneNo: currentItem.phoneNo || "",
  };

  // const handleSubmit = (formState) => {
  //   console.log("Form submitted with:", formState);
  // };

  const fields = [
    {
      name: "instructor",
      label: "Instructor",
      placeholder: "Add new Instructor",
    },
  ];

  const isFilterApplied = Object.values(filters).some((value) => value !== "");
  console.log("isFilterApplied", isFilterApplied);

  const handleResetChange = () => {
    setFilters({ name: "", phoneNO: "", project: "", salary: "", status: "" });
  };

  return (
    <div className="w-11/12 mx-auto">
      <Header
        title="Employees"
        icon={<IdCard/>}
        isMultipleSelected={isMultipleSelected}
        setIsBulkDeleteModalOpen={setIsBulkDeleteModalOpen}
        TotalCategories={mappedInstructorData?.length}
        batchButton={instructorError || instructorIsLoading ? null : "employee"}
        sourceComponent="EmployeesComponent"
      />
      {instructorIsLoading && <div>Loading...</div>}
      {instructorError && <div>Error loading Instructors</div>}
      {!instructorIsLoading && !instructorError && (
        <Table
          // data={mappedInstructorData}
          data={isFilterApplied ? filteredStudentsData : mappedInstructorData}
          columns={columns}
          columnsFilters={columnsFilters}
          handleFilterChange={handleFilterChange}
          setCurrentItem={setCurrentItem}
          setIsEditModalOpen={setIsEditModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          setIsMultipleSelected={setIsMultipleSelected}
          tableTitle="instructors"
          setSelectedID={setSelectedID}
          handleEditClick={handleEditClick}
          handleSwitchToggle={handleSwitchToggle}
          sourceComponent={"EmployeesComponent"}
          handleResetChange={handleResetChange}
        />
      )}
      {/* <EditModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        title="Edit Tech Team"
        fields={Editfields}
        initialValues={initialValues}
        handleSubmit={handleEditSubmit}
        submitButtonText="Save"
      /> */}
      {/* <InstructorModal
        isOpen={isCreateModalOpen}
        setIsOpen={setIsCreateModalOpen}
        submitButtonText="Add"
        fields={fields}
        refetchInstructor={refetchInstructor}
        ModalTitle="Tech Team"
      /> */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        title="Delete Instructor"
        message="Are you sure you want to delete this instructor?"
        confirmText="Yes"
        cancelText="No"
        onConfirm={handleDeleteConfirm}
        onClose={() => console.log("Delete modal closed")}
        successMessage="Deleted Successfully!"
      />
      <BulkDeleteModal
        isOpen={isBulkDeleteModalOpen}
        setIsOpen={setIsBulkDeleteModalOpen}
        message="Are you sure you want to delete all the selected instructors?"
        confirmText="Yes"
        cancelText="No"
        onConfirm={handleBulkDeleteConfirm}
        onClose={() => console.log("Bulk delete modal closed")}
        successMessage="Deleted Successfully!"
      />
    </div>
  );
};

export default EmployeesComponent;
