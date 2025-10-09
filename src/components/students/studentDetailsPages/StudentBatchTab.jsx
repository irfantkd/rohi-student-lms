import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useDeleteMutation,
  useGetQuery,
  usePatchMutation,
  usePostMutation,
} from "../../../api/apiSlice";
import CreateModal from "../../ui/CreateModal";
import DeleteModal from "../../ui/DeleteModal";
import Table from "../../ui/Table";
import { formatDate } from "../../ui/common/FormatDate";
import showError from "../../ui/common/ShowError";
import { showToast } from "../../ui/common/ShowToast";
const columns = ["Batch Name", "Instructor Name", "Starting Date", "Time Slot"];
const data2 = [
  {
    id: 2,
    "batch name": "2024",
    "teacher name ": "Tuakibsjjs",
    uuid: "asjoa88asahjsjas",
    fee: 20000,
    "submission date": "20-09-2024",
  },
];

const StudentBatchTab = ({ setIsCreateModalOpen, isCreateModalOpen }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMultipleSelected, setIsMultipleSelected] = useState(false);
  // const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedID, setSelectedID] = useState(null);
  const [options, setOptions] = useState({});
  const [post, { isLoading }] = usePostMutation();
  const [deleteBatch] = useDeleteMutation();
  const [patch] = usePatchMutation();

  console.log("selectedID", selectedID);

  const { id } = useParams();

  const {
    data: studentData,
    error: studentError,
    isLoading: studentIsLoading,
    refetch: refetchStudents,
  } = useGetQuery({
    path: `/admin/student/${id}`,
  });
  console.log("studentData", studentData);
  useEffect(() => {
    refetchStudents();
  }, []);

  const mappedStudentsData = studentData?.data?.batches?.map((batch) => ({
    id: batch.student_batch?.class_id, // Access class_id from student_batch
    "batch name": batch.name,
    uuid: batch?.student_batch?.student_batch_uuid,
    "instructor name": batch.teacher_name,
    "starting date": batch?.student_batch?.join_date
      ? formatDate(batch?.student_batch?.join_date)
      : "",
    "time slot": batch.time_slot,
    is_active: batch.student_batch?.is_active === 1 ? 1 : 0, // Access is_active from student_batch
    // id: batch.id,
    // "batch name": batch.name,
    // "instructor name": batch.teacher_name,
    // "starting date": batch.starting_date ? formatDate(batch.starting_date) : "",
    // "time slot": batch.time_slot,
    // is_active: batch.is_active === true ? 1 : 0,
  }));

  const {
    data: batchData,
    error: batchError,
    isLoading: batchIsLoading,
    refetch: refetchBatches,
  } = useGetQuery({
    path: "/admin/batches",
  });

  console.log("batchData", batchData);

  useEffect(() => {
    if (batchData) {
      const transformedOptions = batchData.data.map((item) => ({
        value: item.class_id,
        label: item.name,
      }));
      console.log("transformedOPtions", transformedOptions);
      setOptions(transformedOptions);
    }
  }, [batchData]);

  const handleDeleteConfirm = async () => {
    try {
      await deleteBatch({
        path: `/admin/student-batch/${selectedID}`,
      }).unwrap();
      setIsDeleteModalOpen(false);
      refetchStudents();
    } catch (err) {
      console.error("Failed to delete student", err);
    }
  };

  const handleSubmit = async (formState) => {
    console.log("formState222", formState);
    const values = {
      user_id: studentData?.data?.id,
      class_id: formState.Batch,
      join_date: "2024-06-02",
      is_active: 1,
    };

    refetchStudents();
    console.log("values44444", values);

    try {
      const response = await post({
        path: "/admin/student-batch/create",
        body: values,
      }).unwrap();
      refetchStudents();
      if (response.message === "Success." && response.status === 1) {
        showToast("Added Successfully", "success");
        setIsCreateModalOpen(false);
      }
    } catch (err) {
      showError(err);
      setIsCreateModalOpen(true);
    }
  };

  // Update Switch Api Call:
  const handleSwitchToggle = async (modifiedItemId, newActiveStatus) => {
    console.log("modifiedItemId", modifiedItemId);
    console.log("modifiedItemId", newActiveStatus);
    const updatedAssignedBatch = studentData?.data?.batches.find(
      (studentBatch) => studentBatch.id === modifiedItemId
    );

    console.log("modifiedItemId", updatedAssignedBatch);

    const values = {
      user_id: studentData?.data?.id,
      class_id: updatedAssignedBatch.id,
      join_date: formatDate(updatedAssignedBatch?.student_batch?.join_date),
      is_active: newActiveStatus === true ? "1" : "0",
    };

    console.log("values before update", values);
    const modifiedItemUuid =
      updatedAssignedBatch?.student_batch?.student_batch_uuid;
    console.log("modifiedItemUuid", modifiedItemUuid);

    try {
      const response = await patch({
        path: `/admin/student-batch/${modifiedItemUuid}`,
        body: values,
      }).unwrap();
      console.log("response", response);
      refetchStudents();
    } catch (err) {
      console.error("Failed to update student", err);
    }
  };

  const fields = [
    {
      name: "Batch",
      label: "Batch Name",
      type: "select",
      options: options,
      Placeholder: "Batch Name",
    },
  ];

  return (
    <div>
      {studentIsLoading && <div>Loading...</div>}
      {studentError && <div>Error loading studentes</div>}
      {!studentIsLoading && !studentError && (
        <Table
          data={mappedStudentsData}
          columns={columns}
          setIsEditModalOpen={setIsEditModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          setIsMultipleSelected={setIsMultipleSelected}
          setSelectedID={setSelectedID}
          handleSwitchToggle={handleSwitchToggle}
          // TableHeadingAction={false}
          batchEditButton={false}
        />
      )}
      <CreateModal
        isOpen={isCreateModalOpen}
        setIsOpen={setIsCreateModalOpen}
        title="Add Batch"
        fields={fields}
        handleSubmit={handleSubmit}
        submitButtonText="Add"
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        title="Delete Student"
        message="Are you sure you want to delete this Batch?"
        confirmText="Yes"
        cancelText="No"
        onConfirm={handleDeleteConfirm}
        onClose={() => console.log("Delete modal closed")}
        successMessage="Deleted Successfully!"
      />
    </div>
  );
};

export default StudentBatchTab;
