import Header from "../components/ui/Header";
import Table from "../components/ui/Table";
import { Box } from "lucide-react";
import { useState } from "react";
import InventoryForm from "./components/AddInventory";
import { useDeleteMutation, useGetQuery,  usePostMutation, usePutMutation } from "../api/apiSlice";
import DeleteModal from "../components/ui/DeleteModal";

const columns = ["Name", "Category", "Type", "Quantity"];

const Inventory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedID, setSelectedID] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: inventory } = useGetQuery({
    path: "/admin/inventory/items/all",
  });
  const [createInventory, { isLoading: isCreating }] = usePostMutation();
  const [updateInventory] = usePutMutation();
  const [deleteInventory] = useDeleteMutation()

const formattedData = inventory?.data?.map((item) => ({
  uuid: item.uuid,               
  name: item.name,
  category_id: item.category.uuid,   
  category: item.category.name, 
  type_id: item.type.uuid,
  type: item.type.name,
  quantity: item.quantity,
  image: item.image,
}));




const handleEditClick = (item) => {
  setEditingItem(item);a
  setIsModalOpen(true);  
};

 const handleSubmit = async (formData) => {
  try {
    const payload = {
      category_id: formData.category,   
      type_id: formData.type,           
      name: formData.name,
      quantity: parseInt(formData.quantity, 10),
      image: typeof formData.image === "string" ? formData.image : formData.image?.name || "",
    };

    if (editingItem) {
      await updateInventory({
        path: `/admin/inventory/items/${editingItem.uuid}`,
        body: payload,
        method: "PUT",
      }).unwrap();
    } else {
      await createInventory({
        path: "/admin/inventory/items",
        body: payload,
      }).unwrap();
    }

    setIsModalOpen(false);
    setEditingItem(null);
    refetch?.(); 
  } catch (error) {
    console.error("Error saving inventory:", error);
  }
};

const handleDelete = async () => {
  try {
    await deleteInventory({ path: `/admin/inventory/items/${selectedID}` }).unwrap();
    refetch();
  } catch (error) {
    console.error("Failed to delete:", error);
  }
};

  return (
    <div className="w-11/12 mx-auto">
      <Header
        title="Inventory"
        icon={<Box />}
        setIsCreateModalOpen={setIsModalOpen}
        sourceComponent="Inventory"
      />
      <Table
        columns={columns}
        sourceComponent="Inventory"
        data={formattedData}
        setIsEditModalOpen={setIsEditModalOpen}
        setSelectedID={setSelectedID}
         handleEditClick={handleEditClick}
         setIsDeleteModalOpen={setIsDeleteModalOpen}
      />
      <InventoryForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmit}
        initialValues={editingItem}
        mode={editingItem ? "edit" : "create"}
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

export default Inventory;
