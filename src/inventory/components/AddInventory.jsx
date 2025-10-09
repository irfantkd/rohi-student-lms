import { useEffect, useState } from "react";
import Select from "react-select";
import { useGetQuery } from "../../api/apiSlice";
import FormInput from "../../components/ui/FormInput";

const customStyles = {
  control: (provided) => ({
    ...provided,
    borderRadius: "8px",
    paddingTop: "4px",
    paddingBottom: "4px",
    borderColor: "#d1d5db",
    boxShadow: "none",
    minHeight: "48px",
    "&:hover": { borderColor: "#d1d5db" },
    "&:focus-within": {
      borderColor: "transparent",
      boxShadow: "0 0 0 2px #3b82f6",
    },
  }),
  container: (provided) => ({
    ...provided,
    width: "100%",
  }),
};

const initialFormState = {
  name: "",
  category: "",
  type: "",
  quantity: "",
  image: null,
};

export default function InventoryForm({
  isOpen,
  onClose,
  onSubmit,
  initialValues ,
  mode = "create",        // ✅ new
  handleCategoryChange = () => {},
  handleTypeChange = () => {},
}) {
  const [formData, setFormData] = useState(initialFormState);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [errors, setErrors] = useState({});

  const { data: categories, isLoading: isCategoriesLoading } = useGetQuery({
    path: "/admin/inventory/categories/all",
  });

  const { data: types, isLoading } = useGetQuery({
    path: "/admin/inventory/types/all",
  });

useEffect(() => {
  if (mode === "edit" && initialValues) {
    setFormData({
      name: initialValues.name || "",
      category: initialValues.category?.uuid || "",  // ✅ uuid not name
      type: initialValues.type?.uuid || "",          // ✅ uuid not name
      quantity: initialValues.quantity || "",
      image: initialValues.image || null,
    });

    setSelectedCategory(initialValues.category?.uuid || null);
  }
}, [initialValues, mode]);



  const categoryOptions =
    categories?.data?.map((cat) => ({
      value: cat.uuid,
      label: cat.name,
    })) || [];

  const handleCategorySelect = (selected) => {
    setSelectedCategory(selected?.value || null);
    setFormData({ ...formData, category: selected?.value || "", type: "" });
    handleCategoryChange(selected);
  };

  const filteredTypeOptions =
    types?.data
      ?.filter((t) => !selectedCategory || t.category?.uuid === selectedCategory)
      .map((t) => ({
        value: t.uuid,
        label: t.name,
      })) || [];

  const handleTypeSelect = (selected) => {
    setFormData({ ...formData, type: selected?.value || "" });
    handleTypeChange(selected);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);

    if (mode === "create") {
      // reset only for create mode
      setFormData(initialFormState);
      setSelectedCategory(null);
      setErrors({});
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="p-10 bg-white shadow-lg rounded-xl w-[70%] flex flex-col space-y-4">
        <h2 className="mb-4 text-lg font-semibold text-center">
          {mode === "edit" ? "Edit Inventory" : "Add Inventory"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <FormInput
            type="text"
            label="Inventory Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter inventory name"
            required={true}
            error={errors.name}
          />

          {/* Category Select */}
          <div className="mb-5">
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Category <span className="ml-1 text-red-500">*</span>
            </label>
            <Select
              onChange={handleCategorySelect}
              options={categoryOptions}
              styles={customStyles}
              placeholder={isCategoriesLoading ? "Loading..." : "Select Category"}
              isLoading={isCategoriesLoading}
              value={
                categoryOptions.find(
                  (option) => option.value === formData.category
                ) || null
              }
            />
          </div>

          {/* Type Select */}
          <div className="mb-5">
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Type <span className="ml-1 text-red-500">*</span>
            </label>
            <Select
              onChange={handleTypeSelect}
              options={filteredTypeOptions}
              styles={customStyles}
              placeholder="Select Type"
              isDisabled={!selectedCategory}
              value={
                filteredTypeOptions.find(
                  (option) => option.value === formData.type
                ) || null
              }
            />
          </div>

          {/* Quantity */}
          <FormInput
            type="number"
            label="Quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            placeholder="Enter quantity"
            required={true}
            error={errors.quantity}
          />

          {/* Image Upload */}
          <FormInput
            type="file"
            label="Image"
            name="image"
            onChange={handleInputChange}
            accept="image/*"
            error={errors.image}
          />

          {/* Image Preview */}
          {formData.image && (
            <div className="flex justify-center">
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Preview"
                className="object-contain h-32 border rounded-lg"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="submit"
              className="px-10 py-2 font-semibold custom-AddButton text-white rounded-md custom-ActionBtn"
            >
              {mode === "edit" ? "Update" : "Add"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-2 font-semibold bg-[#E2E1E1] rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
