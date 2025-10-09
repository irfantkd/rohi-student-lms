import React, { useEffect, useState } from "react";
import Table from "../../ui/Table";
import { useParams } from "react-router-dom";
import { useGetQuery } from "../../../api/apiSlice";
import { formatDate } from "../../ui/common/FormatDate";
import { convertTo12HourFormat } from "../../ui/common/ConvertTo12HourFormat";
const columns = ["Batch Name", "Starting Date", "Time Slot", "Status"];

const InstructorBatchesTab = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isMultipleSelected, setIsMultipleSelected] = useState(false);
  const [selectedID, setSelectedID] = useState(null);
  const { id } = useParams();
  console.log("id", id);

  // get instructor data single
  const {
    data: SingleInstructorData,
    error: emplpoyeeError,
    isLoading: employeeIsLoading,
    refetch: refetchInstructor,
  } = useGetQuery({
    path: `/admin/teacher/${id}`,
  });

  useEffect(() => {
    refetchInstructor();
  }, []);

  console.log("SingleInstructorData", SingleInstructorData);

  console.log("SingleInstructorData", SingleInstructorData?.data?.batches);

  const mappedStudentsData = SingleInstructorData?.data?.batches.map(
    (batch) => {
      const timeSlot = batch.time_slot ? batch.time_slot.split(" to ") : [];
      const formattedTimeSlot =
        timeSlot.length === 2
          ? `${convertTo12HourFormat(timeSlot[0])} to ${convertTo12HourFormat(
              timeSlot[1]
            )}`
          : "";

      return {
        id: batch.id,
        "batch name": batch.name,
        "starting date": batch.starting_date
          ? formatDate(batch.starting_date)
          : "",
        "time slot": formattedTimeSlot,
        status: batch.is_active === true ? "Active" : "In-Active",
      };
    }
  );

  return (
    <div className="pt-6">
      {mappedStudentsData?.length === 0 ? (
        <div className="text-4xl text-center tracking-tight font-bold font-Montserrat flex items-center justify-center h-96 w-full bg-white  border-2 border-grayBordered  ">
          Batch is not assign yet .
        </div>
      ) : (
        <Table
          data={mappedStudentsData}
          columns={columns}
          setIsEditModalOpen={setIsEditModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          setIsMultipleSelected={setIsMultipleSelected}
          setSelectedID={setSelectedID}
          TableHeadingAction={false}
          BatchActiveColor={true}
        />
      )}
    </div>
  );
};

export default InstructorBatchesTab;
