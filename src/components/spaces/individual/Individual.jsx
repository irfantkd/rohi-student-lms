import Header from "../../ui/Header";
import Table from "../../ui/Table";
import IndividualSpaceIcon from "../../../assets/icons/navbar/IndividualSpace";
import { useState } from "react";
import AddForm from "../component/AddForm";
import { useDeleteMutation, useGetQuery } from "../../../api/apiSlice";
import DeleteModal from "../../ui/DeleteModal";

const columns = [
  "Name",
  "CNIC",
  "Contact",
  "No. of Seats",
  "Date of Registration",
];
const Individual = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedID, setSelectedID] = useState(null);
  const {
    data: individual,
    isLoading,
    isError,
  } = useGetQuery({
    path: "admin/individuals",
  });
  console.log("individuals", individual);
  const [deleteIndividual] = useDeleteMutation();

  const mappedData = individual?.data?.map((item) => ({
    uuid: item.individual_uuid,
    name: item.name,
    cnic: item.cnic,
    contact: item.contact_no,
    "date of registration": item.date_of_registration,
  }));

const handleDelete = async () => {
  try {
    await deleteIndividual({ path: `/admin/individuals/${selectedID}` }).unwrap();
    refetch();
  } catch (error) {
    console.error("Failed to delete:", error);
  }
};


  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="w-11/12 mx-auto">
      <Header
        title="Individual Working Space"
        TotalCategories={mappedData?.length}
        icon={<IndividualSpaceIcon />}
        setIsCreateModalOpen={setIsModalOpen}
      />

      {isLoading && <div>Loading...</div>}
      {isError && <div>Error loading categories</div>}
      {!isLoading && !isError && (
        <Table
          columns={columns}
          data={mappedData}
          sourceComponent="IndividualWorkingSpace"
          setSelectedID={setSelectedID}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
        />
      )}
      <AddForm
        title="Add Individual"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        title="Delete Record"
        message="Are you sure you want to delete this record?"
        confirmText="Yes"
        cancelText="No"
        onConfirm={handleDelete}
        successMessage="Record deleted successfully!"
      />
    </div>
  );
};

export default Individual;
