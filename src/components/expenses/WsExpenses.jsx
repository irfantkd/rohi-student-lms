// WsExpenses.jsx
import Header from "../ui/Header";
import Table from "../ui/Table";
import CompanySpaceIcon from "../../assets/icons/navbar/CompanySpaceIcon";
import { useState } from "react";
import AddExpense from "./components/AddExpenses";
import {
  useDeleteMutation,
  useGetQuery,
  usePatchMutation,
  usePostMutation,
} from "../../api/apiSlice";
import ExpenseModal from "./components/ExpenseModal";
import DeleteModal from "../ui/DeleteModal";

const columns = ["Title", "Amount", "Category"];

const WsExpenses = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editExpenseData, setEditExpenseData] = useState(null);
  const [selectedID, setSelectedID] = useState(null);

  const {
    data: expenses,
    isLoading,
    isError,
  } = useGetQuery({
    path: "/admin/workspace-expenses",
  });

  const formattedData = expenses?.data?.map((expense) => ({
    uuid: expense.uuid,
    title: expense.title,
    amount: expense.amount,
    category: expense.category,
    receipt_image: expense.receipt_image,
    note: expense.note,
  }));

  const [createExpense, { isLoading: isCreating }] = usePostMutation();
  const [deleteExpense] = useDeleteMutation();
  const [editExpense] = usePatchMutation();

  const handleAddExpense = async (formData) => {
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("amount", formData.amount);
      payload.append("category", formData.category);
      payload.append("note", formData.detail || "");
      if (formData.receiptImage) {
        payload.append("receipt_image", formData.receiptImage);
      }

      await createExpense({
        path: "/admin/workspace-expenses/create",
        body: payload,
      }).unwrap();

      // ✅ Refresh list after adding
      refetch();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error creating expense:", error);
    }
  };

  const handleDeleteExpense = async () => {
    try {
      await deleteExpense({
        path: `/admin/workspace-expenses/${selectedID}`,
        body: {}, // sometimes backend requires empty body
      }).unwrap();

      // ✅ Refresh list
      refetch();
      setIsDeleteModalOpen(false);
      setSelectedID(null);
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleEditClick = (item) => {
    setEditExpenseData(item);
    setIsEditModalOpen(true);
  };
const handleEditExpense = async (formData, uuid) => {
  try {
    const payload = {
      title: formData.title,
      amount: formData.amount,
      category: formData.category,
      note: formData.note,
    };

    await editExpense({
      path: `/admin/workspace-expenses/${uuid}`,
      body: payload,
    }).unwrap();

    refetch();
    setIsEditModalOpen(false);
    setEditExpenseData(null);
  } catch (err) {
    console.error("Error updating expense:", err);
  }
};



  return (
    <div className="w-11/12 mx-auto cursor">
      <Header
        title="Working Space"
        d
        icon={<CompanySpaceIcon className="w-6 h-6 text-white" />}
        setIsCreateModalOpen={setIsAddModalOpen}
      />

      {isLoading && <div>Loading...</div>}
      {isError && <div>Error loading categories</div>}
      {!isLoading && !isError && (
        <Table
          columns={columns}
          data={formattedData}
          sourceComponent="WsExpenses"
          onViewDetails={(item) => {
            setSelectedExpense(item);
            setIsDetailModalOpen(true);
          }}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          setSelectedID={setSelectedID}
          setIsEditModalOpen={setIsEditModalOpen} 
          handleEditClick={handleEditClick}
        />
      )}

      <AddExpense
        title="Add Expense"
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddExpense}
      />

  <ExpenseModal
  isOpen={!!selectedExpense}
  onClose={() => setSelectedExpense(null)}
  expense={selectedExpense}
/>

{/* Edit Modal */}
<ExpenseModal
  isOpen={isEditModalOpen}
  onClose={() => setIsEditModalOpen(false)}
  expense={editExpenseData}
  isEdit={true}
  onSubmit={handleEditExpense}
/>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        title="Delete Expense"
        message="Are you sure you want to delete this expense?"
        confirmText="Yes"
        cancelText="No"
        onConfirm={handleDeleteExpense}
        onClose={() => setSelectedID(null)}
        successMessage="Expense deleted successfully!"
      />
    </div>
  );
};

export default WsExpenses;
