import { useState } from "react";
import {
    useDeleteMutation,
  useGetQuery,
  usePatchMutation,
  usePostMutation,
} from "../../../api/apiSlice";
import Header from "../../ui/Header";
import Table from "../../ui/Table";
import AddForm from "./components/AddForm";
import DeleteModal from "../../ui/DeleteModal";

const columns = [
  "Title",
  "Total Seats",
  "Available Seats",
  "Seat Price",
  "Total Rooms",
  "Available Rooms",
  "Room Price",
  "Description",
];

const ManageSpaces = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [deleteId, setDeleteId] = useState(null);
const [selectedID, setSelectedID] = useState(null);

  
  const {
    data: workspaces,
    isLoading,
    isError,
    refetch,
  } = useGetQuery({
    path: "/admin/workspaces",
  });

  const [createWorkspace, { isLoading: isCreating }] = usePostMutation();
  const [editWorkspace, { isLoading: isUpdating }] = usePatchMutation();
  const [deleteWorkspace] = useDeleteMutation()

const formattedData = workspaces?.data?.map((item) => ({
  uuid: item.workspace_uuid,
  workspace_uuid: item.workspace_uuid, // ✅ for edit form
  title: item.title,
  description: item.description,
  location: item.location,
  "total seats": item.total_seats,
  total_seats: item.total_seats,       // ✅ for form
  "available seats": item.available_seats,
  available_seats: item.available_seats,
  "seat price": item.seat_price,
  seat_price: item.seat_price,
  "total rooms": item.total_rooms,
  total_rooms: item.total_rooms,
  "available rooms": item.available_rooms,
  available_rooms: item.available_rooms,
  "room price": item.room_price,
  room_price: item.room_price,
  status: item.status || "inactive",
}));


  // 🔹 Create Workspace
  const handleCreate = async (formData) => {
    try {
      await createWorkspace({
        path: "/admin/workspaces/create",
        body: formData,
      }).unwrap();
      refetch();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error creating workspace:", error);
    }
  };

  // 🔹 Update Workspace
  const handleEdit = async (formData) => {
    try {
      await editWorkspace({
        path: `/admin/workspaces/${formData.workspace_uuid}`,
        body: formData,
      }).unwrap();
      refetch();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating workspace:", error);
    }
  };
const handleEditClick = (item) => {
  setEditData({
    workspace_uuid: item.uuid,
    title: item.title,
    description: item.description,
    location: item.location,
    total_seats: item["total seats"],
    available_seats: item["available seats"],
    seat_price: item["seat price"],
    total_rooms: item["total rooms"],
    available_rooms: item["available rooms"],
    room_price: item["room price"],
    status: item.status || "inactive",
  });
  setIsEditModalOpen(true);
};


const confirmDelete = async () => {
  try {
    await deleteWorkspace({
      path: `/admin/workspaces/${selectedID}`,
    }).unwrap();
    refetch();
    setIsDeleteModalOpen(false);
  } catch (error) {
    console.error("Error deleting workspace:", error);
  }
};


  return (
    <div className="w-11/12 mx-auto">
      <Header title="Manage Workspace" setIsCreateModalOpen={setIsAddModalOpen} />

      {isLoading && <div>Loading...</div>}
      {isError && <div>Error loading workspaces</div>}
      {!isLoading && !isError && (
       <Table
  columns={columns}
  data={formattedData}
  setIsEditModalOpen={setIsEditModalOpen}
  handleEditClick={handleEditClick}
   setIsDeleteModalOpen={setIsDeleteModalOpen}   // ✅ Add this
  setSelectedID={setSelectedID}
/>
      )}

      {/* Add Modal */}
      <AddForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreate}
        mode="create"
      />

      {/* Edit Modal */}
      <AddForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEdit}
        initialValues={editData}
        mode="edit"
      />
      <DeleteModal
  isOpen={isDeleteModalOpen}
  setIsOpen={setIsDeleteModalOpen}
  title="Delete Workspace"
  message="Are you sure you want to delete this workspace?"
  confirmText="Delete"
  cancelText="Cancel"
  onConfirm={confirmDelete}
  onClose={() => setDeleteId(null)}
  successMessage="Workspace deleted successfully!"
/>

    </div>
  );
};

export default ManageSpaces;
