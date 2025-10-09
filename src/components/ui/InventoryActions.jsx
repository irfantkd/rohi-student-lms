import React, { useState } from "react";
import { Plus, Edit, Trash, X } from "lucide-react";
import { useGetQuery, usePostMutation, useDeleteMutation, usePutMutation } from "../../api/apiSlice";
import FormInput from "./FormInput";
import DeleteModal from "./DeleteModal";

const InventoryActions = ({ title, onCreate, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", category_id: "" });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  
  const toggleModal = () => {
    setIsOpen(!isOpen);
    setShowAddForm(false);
    setFormData({ name: "", description: "", category_id: "" });
    setEditingItem(null);
  };

  const { data: categories, refetch: refetchCategories } = useGetQuery({
    path: "/admin/inventory/categories/all",
  });

  const { data: types, refetch: refetchTypes } = useGetQuery({
    path: "/admin/inventory/types/all",
    skip: title !== "Types",
  });

  const [createCategory] = usePostMutation();
  const [createType] = usePostMutation();
  const [deleteItem] = useDeleteMutation();
  const [updateItem] = usePutMutation();

  const items = title === "Categories" ? categories?.data : types?.data;

  const handleAddNew = () => {
    setShowAddForm(true);
    setEditingItem(null);
    setFormData({ name: "", description: "", category_id: "" });
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setShowAddForm(true);
    setFormData({
      name: item.name || "",
      description: item.description || "",
      category_id: item.category?.id || "",
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;
    if (title === "Types" && !formData.category_id) return;
    
    try {
      if (editingItem) {
        // Update existing item
        const path = title === "Categories" 
          ? `/admin/inventory/categories/${editingItem.uuid}`
          : `/admin/inventory/types/${editingItem.uuid}`;
        
        const body = title === "Categories"
          ? { name: formData.name, description: formData.description }
          : { name: formData.name, category_id: parseInt(formData.category_id) };
        
        await updateItem({ path, body });
        
        if (title === "Categories") {
          refetchCategories();
        } else {
          refetchTypes();
        }
      } else {
        // Create new item
        if (title === "Categories") {
          await createCategory({
            path: "/admin/inventory/categories",
            body: { name: formData.name, description: formData.description },
          });
          refetchCategories();
        } else if (title === "Types") {
          await createType({
            path: "/admin/inventory/types",
            body: { name: formData.name, category_id: parseInt(formData.category_id) },
          });
          refetchTypes();
        }
      }
      
      setFormData({ name: "", description: "", category_id: "" });
      setShowAddForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setFormData({ name: "", description: "", category_id: "" });
    setEditingItem(null);
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const path = title === "Categories" 
        ? `/admin/inventory/categories/${itemToDelete.uuid}`
        : `/admin/inventory/types/${itemToDelete.uuid}`;
      
      await deleteItem({ path });
      
      if (title === "Categories") {
        refetchCategories();
      } else {
        refetchTypes();
      }
      
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div>
      <button
        onClick={toggleModal}
        className="px-5 py-2.5 bg-white text-brown font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
      >
        {title}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl relative max-h-[85vh] flex flex-col">
            
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">{title}</h3>
              <div className="flex items-center gap-3">
                {!showAddForm && (
                  <button
                    onClick={handleAddNew}
                    className="flex items-center gap-1.5 px-3 py-1.5 custom-ActionBtn text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                  >
                    <Plus size={16} />
                    Add New
                  </button>
                )}
                <button
                  onClick={toggleModal}
                  className="p-1 hover:bg-gray-100 rounded-lg transition"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-6">
              {showAddForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-lg font-semibold mb-4 text-gray-800">
                    {editingItem ? "Edit" : "Add New"} {title === "Categories" ? "Category" : "Type"}
                  </h4>
                  <FormInput
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={`Enter ${title === "Categories" ? "category" : "type"} name`}
                    required
                  />
                  {title === "Categories" && (
                    <FormInput
                      type="textarea"
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter category description"
                      rows={3}
                    />
                  )}
                  {title === "Types" && (
                    <FormInput
                      type="select"
                      label="Category"
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleInputChange}
                      placeholder="Select a category"
                      options={categories?.data?.map(cat => ({
                        value: cat.id,
                        label: cat.name
                      })) || []}
                      required
                    />
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={handleSubmit}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                    >
                      {editingItem ? "Update" : "Add"}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {!items?.length ? (
                <p className="text-center text-gray-500 py-8">No items found</p>
              ) : (
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.uuid}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all group"
                    >
                      <div className="flex-1">
                        <span className="font-semibold text-gray-800">{item.name}</span>
                        {title === "Categories" && item.description && (
                          <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                        )}
                        {title === "Types" && (
                          <span className="text-gray-500 text-sm ml-2">
                            • {item.category?.name || "Uncategorized"}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="p-2 text-brown hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={deleteModalOpen}
        setIsOpen={setDeleteModalOpen}
        title="Delete Confirmation"
        message={`Are you sure you want to delete this ${title === "Categories" ? "category" : "type"}?`}
        confirmText="Yes"
        cancelText="No"
        onConfirm={handleConfirmDelete}
        successMessage={`${title === "Categories" ? "Category" : "Type"} deleted successfully!`}
      />
    </div>
  );
};

export default InventoryActions;