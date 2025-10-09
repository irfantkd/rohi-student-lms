import React, { useState, useEffect, useMemo } from "react";
import Table from "../../ui/Table";
import EditModal from "../../ui/EditModal";
import DeleteModal from "../../ui/DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import { useGetQuery } from "../../../api/apiSlice";
import { getStudents } from "../../../features/students/studentsSlice";
import { useParams } from "react-router-dom";

const columns = ["Fee", "Batch", "Submission Date", "Note"];
const data2 = [
  {
    id: 2,
    uuid: "asjoa88asahjsjas",
    fee: 20000,
    batch: "2024",
    "submission date": "20-09-2024",
  },
];
const StudentFeeTab = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isMultipleSelected, setIsMultipleSelected] = useState(false);
  const [selectedID, setSelectedID] = useState(null);

  const { id } = useParams();
  console.log("id", id);

  const {
    data: studentData,
    error: studentError,
    isLoading: studentIsLoading,
    refetch: refetchStudents,
  } = useGetQuery({
    path: `/admin/student/${id}`,
  });
  useEffect(() => {
    refetchStudents();
  }, []);
  const mappedStudentsData = useMemo(() => {
    const batchName = studentData?.data?.batch?.name;
    const formattedData = studentData?.data?.fees?.map(
      (fees) => (
        console.log("student andar wala", fees),
        {
          id: fees.id,
          fee: fees.total_fee,
          batch: fees?.batch_name?.name,
          "submission date": fees?.submit_date,
          note: fees?.note,
        }
      )
    );
    console.log("formattedDatasss", formattedData);
    return formattedData;
  }, [studentData]);

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
          TableHeadingAction={false}
        />
      )}
      {/* <EditModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        title="Edit Student"
        fields={Editfields}
        handleSubmit={handleEditSubmit}
        submitButtonText="Save"
        // initialValues={initialValues}
      /> */}
      {/* <DeleteModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        title="Delete Student"
        message="Are you sure you want to delete this Student?"
        confirmText="Yes"
        cancelText="No"
        onConfirm={handleDeleteConfirm}
        onClose={() => console.log("Delete modal closed")}
        successMessage="Deleted Successfully!"
      /> */}
    </div>
  );
};

export default StudentFeeTab;
