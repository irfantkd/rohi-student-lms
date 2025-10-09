import { useState, useEffect } from "react";
import FormInput from "../../../ui/FormInput";

const AddForm = ({ isOpen, onClose, onSubmit, initialValues, mode = "create" }) => {
  const [form, setForm] = useState({
    workspace_uuid: "",
    title: "",
    description: "",
    location: "",
    total_seats: "",
    available_seats: "",
    seat_price: "",
    total_rooms: "",
    available_rooms: "",
    room_price: "",
    status: "inactive",
  });

  // 🔹 Prefill form when editing
useEffect(() => {
  if (initialValues && mode === "edit") {
    setForm((prev) => ({
      ...prev,
      ...initialValues,
    }));
  }
}, [initialValues, mode]);


  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {mode === "edit" ? "Edit Workspace" : "Add Workspace"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Workspace UUID"
                name="workspace_uuid"
                value={form.workspace_uuid}
                onChange={handleChange}
                required
                disabled={mode === "edit"} // usually UUID should not change
              />
              <FormInput
                label="Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <FormInput
              label="Description"
              name="description"
              type="textarea"
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
            <FormInput
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Total Seats"
                name="total_seats"
                type="number"
                value={form.total_seats}
                onChange={handleChange}
              />
              <FormInput
                label="Available Seats"
                name="available_seats"
                type="number"
                value={form.available_seats}
                onChange={handleChange}
              />
            </div>

            <FormInput
              label="Seat Price"
              name="seat_price"
              type="number"
              step="0.01"
              value={form.seat_price}
              onChange={handleChange}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Total Rooms"
                name="total_rooms"
                type="number"
                value={form.total_rooms}
                onChange={handleChange}
              />
              <FormInput
                label="Available Rooms"
                name="available_rooms"
                type="number"
                value={form.available_rooms}
                onChange={handleChange}
              />
            </div>

            <FormInput
              label="Room Price"
              name="room_price"
              type="number"
              step="0.01"
              value={form.room_price}
              onChange={handleChange}
            />

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 py-3 text-white rounded-lg custom-ActionBtn"
              >
                {mode === "edit" ? "Update Workspace" : "Add Workspace"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddForm;
