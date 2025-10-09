/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import {
  useDeleteMutation,
  useGetQuery,
  usePatchMutation,
  usePostMutation,
} from "../../api/apiSlice";
import Batches from "../../assets/icons/navbar/Batches";
import { getBatches } from "../../features/batches/batchesSlice";
import BulkDeleteModal from "../ui/BulkDeleteModal";
import { convertTo12HourFormat } from "../ui/common/ConvertTo12HourFormat";
import { formatDate } from "../ui/common/FormatDate";
import showError from "../ui/common/ShowError";
import { showToast } from "../ui/common/ShowToast";
import DeleteModal from "../ui/DeleteModal";
import EditModal from "../ui/EditModal";
import Header from "../ui/Header";
import AddBatchModal from "./components/AddBatchModal";
import Loader from "../ui/common/LoaderComponent";
import { Edit, Trash } from "lucide-react";

const ClassesComponent = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isMultipleSelected, setIsMultipleSelected] = useState(false);
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [selectedID, setSelectedID] = useState(null);
  const [currentItem, setCurrentItem] = useState([]);
  const [initialValues, setInitialValues] = useState([]);
  const [isCreateBatchConfirmModalOpen, setIsCreateBatchConfirmModalOpen] = useState(false);
  const [activeTimeTab, setActiveTimeTab] = useState("all");
  const [activeHallTab, setActiveHallTab] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState(100);

  const [post, { isLoading }] = usePostMutation();
  const [deleteBatch] = useDeleteMutation();
  const [patch] = usePatchMutation();

  const dispatch = useDispatch();
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activeStatus = queryParams.get("active_status");

  const batches = useSelector((state) => state.batches.batches);

  // Fetch Teachers
  const { data: teacherData, refetch: refetchTeacher } = useGetQuery({
    path: "/admin/users/teacher",
    params: { active_status: 1 },
  });

  // Fetch Courses
  const { data: courseData, refetch: refetchcourse } = useGetQuery({
    path: "/admin/courses",
  });

  // Fetch Halls
  const { data: hallData } = useGetQuery({
    path: "/admin/halls",
  });

  // Fetch Classes
  const allBatchesofCoursesEndpoint = `/admin/batches?course_id=${id}`;
  const allBatchesEndpoint = "/admin/classes";

  const {
    data: batchData,
    error: batchError,
    isLoading: batchIsLoading,
    refetch: refetchBatches,
  } = useGetQuery({
    path: id ? allBatchesofCoursesEndpoint : allBatchesEndpoint,
    params: {
      ...(activeStatus && { active_status: activeStatus }),
      per_page: itemsPerPage,
    },
  });

  useEffect(() => {
    refetchcourse();
    refetchBatches();
    refetchTeacher();
  }, []);

  useEffect(() => {
    if (batchData) {
      dispatch(getBatches({ batches: batchData.data }));
    }
  }, [batchData, dispatch]);

  useEffect(() => {
    if (teacherData) {
      const transformedTeacherOptions = teacherData.data.map((item) => ({
        value: item.id,
        label: `${item.first_name} ${item.last_name}`,
      }));
      setTeacherOptions(transformedTeacherOptions);
    }
  }, [teacherData]);

  useEffect(() => {
    if (courseData) {
      const transformedCourseOptions = courseData.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setCourseOptions(transformedCourseOptions);
    }
  }, [courseData]);

  useEffect(() => {
    const batch = batches.find((batch) => batch.batch_uuid === currentItem.uuid);
    if (batch) {
      setInitialValues({
        batch: batch?.name,
        courseData: batch?.course?.id,
        instructorData: batch?.teacher?.id,
        time_slot: batch?.time_slot,
      });
    }
  }, [batches, currentItem]);

  const handleCreateBatchConfirm = async () => {
    try {
      const response = await post({ path: "/admin/batches/create" }).unwrap();
      if (response.message === "Success." && response.status === 1) {
        showToast("Batch Created Successfully", "success");
        refetchBatches();
      }
    } catch (err) {
      showError(err);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteBatch({ path: `/admin/class/${selectedID}` }).unwrap();
      setIsDeleteModalOpen(false);
      showToast("Deleted Successfully", "success");
      refetchBatches();
    } catch (err) {
      showError(err);
    }
  };

  const handleEditSubmit = async (formState) => {
    const values = {
      teacher_id: formState.instructorData,
      course_id: formState.courseData,
      is_active: currentItem.is_active,
      time_slot: `${formState.start_time} to ${formState.end_time}`,
      date: currentItem.date,
    };

    try {
      const response = await patch({
        path: `/admin/batch/${selectedID}`,
        body: values,
      }).unwrap();

      refetchBatches();
      if (response.message === "Success." && response.status === 1) {
        showToast("Edit Successfully", "success");
      }
      setIsEditModalOpen(false);
    } catch (err) {
      showError(err);
    }
  };

  const handleSwitchToggle = async (modifiedItemId, newActiveStatus) => {
    const batch = batches.find((batch) => batch.class_id === modifiedItemId);
    const values = {
      name: batch?.name,
      teacher_id: batch?.teacher?.id,
      course_id: batch?.course?.id,
      student_count: batch.student_count,
      time_slot: batch?.time_slot,
      is_active: newActiveStatus === true ? 1 : 0,
      date: batch?.date,
    };

    try {
      await patch({
        path: `/admin/batch/${batch.batch_uuid}`,
        body: values,
      }).unwrap();
      refetchBatches();
      showToast("Status Updated", "success");
    } catch (err) {
      showError(err);
    }
  };

  // Filter classes based on time and hall
  const filteredClasses = useMemo(() => {
    return batches.filter((cls) => {
      const timeMatch = activeTimeTab === "all" || cls.time_slot === activeTimeTab;
      const hallMatch = activeHallTab === "all" || cls.hall?.id?.toString() === activeHallTab;
      return timeMatch && hallMatch;
    });
  }, [batches, activeTimeTab, activeHallTab]);

  const Editfields = [
    { name: "courseData", label: "Course", type: "select", options: courseOptions },
    { name: "instructorData", label: "Instructor", type: "select", options: teacherOptions },
    { name: "time_slot", label: "Time Slot", type: "time" },
  ];

  const handleEditClick = (cls) => {
    setCurrentItem(cls);
    setSelectedID(cls.batch_uuid || cls.class_id);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (cls) => {
    setSelectedID(cls.batch_uuid || cls.class_id);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="w-11/12 mx-auto">
      <Header
        title="Classes"
        isMultipleSelected={isMultipleSelected}
        setIsBulkDeleteModalOpen={setIsBulkDeleteModalOpen}
        icon={<Batches />}
        TotalCategories={batches.length}
        batchButton={batchError || batchIsLoading ? null : "batch"}
        sourceComponent="BatchesComponent"
        setIsCreateBatchConfirmModalOpen={setIsCreateBatchConfirmModalOpen}
      />

      {batchIsLoading && <Loader />}
      {batchError && <div className="py-4 text-center text-red-500">Error loading Classes</div>}

      {!batchIsLoading && !batchError && (
        <>
          {/* Time Tabs */}
          <div className="flex gap-2 mb-6">
            {["all", "morning", "evening"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTimeTab(tab)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  activeTimeTab === tab
                    ? "bg-[#014376] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Hall Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveHallTab("all")}
              className={`px-6 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeHallTab === "all"
                  ? "bg-[#31918D] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Halls
            </button>
            {hallData?.data?.map((hall) => (
              <button
                key={hall.id}
                onClick={() => setActiveHallTab(hall.id.toString())}
                className={`px-6 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  activeHallTab === hall.id.toString()
                    ? "bg-[#31918D] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {hall.name}
              </button>
            ))}
          </div>

          {/* Classes Cards */}
          {filteredClasses.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              No classes found for the selected filters
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 pb-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredClasses.map((cls) => (
                <div
                  key={cls.class_id}
                  className="p-6 transition-shadow bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-[#014376]">{cls.course?.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(cls)}
                        className="text-brown"
                      >
                        <Edit/>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(cls)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash/>
                      </button>
                      {/* <label className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={cls.is_active}
                          onChange={(e) => handleSwitchToggle(cls.class_id, e.target.checked)}
                          className="sr-only peer"
                        />
                        <span className="absolute inset-0 transition-colors bg-gray-300 rounded-full cursor-pointer peer-checked:bg-[#31918D]"></span>
                        <span className="absolute w-4 h-4 transition-transform transform -translate-y-1/2 bg-white rounded-full left-1 top-1/2 peer-checked:translate-x-6"></span>
                      </label> */}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-700">
                    <p><span className="font-semibold">Instructor:</span> {cls.teacher?.name || "N/A"}</p>
                    <p><span className="font-semibold">Batch:</span> {cls.batch?.name || "N/A"}</p>
                    <p><span className="font-semibold">Hall:</span> {cls.hall?.name || "N/A"}</p>
                    <p><span className="font-semibold">Students:</span> {cls.student_count || 0}</p>
                    <p><span className="font-semibold">Time:</span> {cls.timing || "N/A"}</p>
                    <p><span className="font-semibold">Slot:</span> <span className="capitalize">{cls.time_slot}</span></p>
                    <p><span className="font-semibold">Military Quota:</span> {cls.military_quota || 0}</p>
                    <p><span className="font-semibold">Civilian Quota:</span> {cls.civilians_quota || 0}</p>
                    <p><span className="font-semibold">Created:</span> {formatDate(cls.class_created)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <AddBatchModal
        isOpen={isCreateBatchConfirmModalOpen}
        setIsOpen={setIsCreateBatchConfirmModalOpen}
        title="Confirm Batch Creation"
        message="Are you sure you want to create a new batch? This will automatically generate a new record."
        confirmText="Yes, Create"
        cancelText="Cancel"
        onConfirm={handleCreateBatchConfirm}
      />

      <EditModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        title="Edit Class"
        fields={Editfields}
        initialValues={initialValues}
        handleSubmit={handleEditSubmit}
        submitButtonText="Save"
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        title="Delete Class"
        message="Are you sure you want to delete this class?"
        confirmText="Yes"
        cancelText="No"
        onConfirm={handleDeleteConfirm}
        successMessage="Deleted Successfully!"
      />

      <BulkDeleteModal
        isOpen={isBulkDeleteModalOpen}
        setIsOpen={setIsBulkDeleteModalOpen}
        message="Are you sure you want to delete all the selected classes?"
        confirmText="Yes"
        cancelText="No"
        onConfirm={() => console.log("Bulk delete")}
        successMessage="Deleted Successfully!"
      />
    </div>
  );
};

export default ClassesComponent;