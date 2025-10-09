// Header.jsx - Updated with batch creation confirmation
import React, { useState } from "react";
import PlusIcon from "../../assets/icons/Plus";
import DeleteAllBin from "../../assets/icons/DeleteAllBin";
import EditProfile from "../../assets/images/profile/editProfile.png";
import FeeShare from "../../assets/images/fee/FeeShare.png";
import Select from "react-select";
import { FaPlus } from "react-icons/fa";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetQuery } from "../../api/apiSlice";
import InventoryActions from "./InventoryActions";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";

const Header = ({
  icon,
  title,
  setIsCreateModalOpen,
  isMultipleSelected,
  setIsBulkDeleteModalOpen,
  showActionButton = true,
  buttontitle = "Add New",
  setIsEditMode,
  batchButton = null,
  TotalCategories,
  setFeeTab,
  batchesOptions = [],
  handleBatchChange = () => {},
  isAttendanceDetailsTab = false,
  markAttendanceDate = "",
  handleMarkAttendanceDateChange = () => {},
  dateFilter = "",
  handleDateFilterChange = () => {},
  handleSubmitAttendance = () => {},
  sourceComponent = "",
  handleCategoryChange = () => {},
  handleTypeChange = () => {},
  setIsCreateBatchConfirmModalOpen, 
}) => {
  const handleEditClick = () => {
    if (buttontitle === "Edit") {
      setIsEditMode(true);
    }
  };
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const role = user?.role;

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const { data: categories, isLoading: isCategoriesLoading } = useGetQuery({
    path: "/admin/inventory/categories/all",
  });

  const { data: types, isLoading } = useGetQuery({
    path: "/admin/inventory/types/all",
  });

  const categoryOptions =
    categories?.data?.map((cat) => ({
      value: cat.uuid,
      label: cat.name,
    })) || [];

  const typeOptions =
    types?.data?.map((t) => ({
      value: t.uuid,
      label: t.name,
    })) || [];

  const handleCategorySelect = (selected) => {
    setSelectedCategory(selected?.value || null);
    handleCategoryChange(selected);
  };

  const filteredTypeOptions =
    types?.data
      ?.filter(
        (t) => !selectedCategory || t.category?.uuid === selectedCategory
      )
      .map((t) => ({
        value: t.uuid,
        label: t.name,
      })) || [];

  const handleTypeSelect = (selected) => {
    handleTypeChange(selected);
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#FF0000" : provided.backgroundColor,
      color: state.isSelected ? "white" : provided.color,
      "&:hover": {
        backgroundColor: state.isSelected ? "" : "#24A0ED",
        color: "white",
      },
    }),
    control: (provided) => ({
      ...provided,
      borderRadius: "10px",
      borderColor: "#ccc",
      boxShadow: "none",
      paddingTop: "2px",
      paddingBottom: "2px",
      "&:hover": {
        borderColor: "#888",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#014376",
      fontWeight: "bold",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#014376",
      fontWeight: "bold",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#014376",
      "&:hover": {
        color: "#014376",
      },
    }),
  };

  return (
    <div className="flex justify-between custom-Background mt-5 mb-2 px-4 h-[4.37rem] rounded-[20px] items-center">
      <div className="flex items-center justify-center gap-x-2">
        <div className="relative">
          <div className="text-white ">{icon}</div>
          {(batchButton === "category" ||
            batchButton === "course" ||
            batchButton === "batch" ||
            batchButton === "employee" ||
            batchButton === "instructor" ||
            batchButton === "student") && (
            <div
              className={`absolute  ${
                batchButton === "category" && " bottom-5 left-4"
              } ${batchButton === "course" && " bottom-6 left-5"}  ${
                batchButton === "batch" && " bottom-5 left-4 "
              } ${batchButton === "employee" && " bottom-5 left-4"}  ${
                batchButton === "instructor" && " bottom-5 left-4"
              }${
                batchButton === "student" && " bottom-6 left-4"
              }tracking-wide rounded-full flex items-center justify-center w-4 h-4  bg-white font-poppins text-[10px] font-bold  `}
            >
              <span>{TotalCategories ? TotalCategories : 0}</span>
            </div>
          )}
        </div>
        <div className="text-2xl font-semibold text-white font-poppins">
          {title}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {isMultipleSelected && (
          <div
            onClick={() => {
              setIsBulkDeleteModalOpen(true);
            }}
          >
            {/* <DeleteAllBin /> */}
          </div>
        )}
        {sourceComponent === "Inventory" && (
          <div className="flex items-center gap-3">
            <InventoryActions
              title="Categories"
              onCreate={() => setIsCreateCategoryModalOpen(true)}
              onEdit={() => setIsEditCategoryModalOpen(true)}
              onDelete={() => setIsDeleteCategoryModalOpen(true)}
            />
            <InventoryActions
              title="Types"
              onCreate={() => setIsCreateTypeModalOpen(true)}
              onEdit={() => setIsEditTypeModalOpen(true)}
              onDelete={() => setIsDeleteTypeModalOpen(true)}
            />
          </div>
        )}
        {title === "Attendance" && (
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={markAttendanceDate}
              onChange={handleMarkAttendanceDateChange}
              className="focus:outline-none border-none border-2 rounded-[10px] w-48 px-2 py-2"
            />
          </div>
        )}
        {isAttendanceDetailsTab && (
          <input
            type="date"
            value={dateFilter}
            onChange={handleDateFilterChange}
            className="focus:outline-none border-none border-2 rounded-[10px] w-48 px-2 py-2"
          />
        )}
        {sourceComponent === "BatchesComponent" && setIsCreateBatchConfirmModalOpen &&(
          <button
            className="text-brown bg-white text-sm font-poppins font-semibold py-3 px-5 flex items-center gap-2 rounded-[10px] transform transition-transform duration-300 ease-in-out hover:scale-105 hover:text-base"
            onClick={() => setIsCreateBatchConfirmModalOpen(true)} // Open confirmation modal
          >
            Add new batch
          </button>
        )}
        {showActionButton && role !== "receptionist" && (
          <button
            className="text-brown bg-white text-sm font-poppins font-semibold py-3 px-5 flex items-center gap-2 rounded-[10px] transform transition-transform duration-300 ease-in-out hover:scale-105 hover:text-base"
            onClick={() => {
              if (buttontitle === "Edit") {
                handleEditClick();
              } else if (buttontitle === true) {
                setFeeTab(true);
              } else if (buttontitle === "Submit") {
                handleSubmitAttendance();
              } else if (setIsCreateModalOpen) {
                setIsCreateModalOpen(true);
              } else {
                if (sourceComponent === "StudentsComponent") {
                  navigate("/dashboard/students/enroll");
                } else if (sourceComponent === "Courses") {
                  navigate("/courses/add");
                } else if (sourceComponent === "Categories") {
                  navigate("/categories/add");
                } else if (sourceComponent === "BatchesComponent") {
                  navigate("/dashboard/batches/create");
                } else if (
                  sourceComponent === "InstructorsComponent" ||
                  sourceComponent === "EmployeesComponent"
                ) {
                  navigate("/dashboard/instructors/add");
                } else if (sourceComponent === "EmployeesComponent") {
                  navigate("/dashboard/instructors/add");
                }
              }
            }}
          >
            {buttontitle}
            {buttontitle === "Edit" && <Pencil size={16} />}
            {buttontitle === true && (
              <img src={FeeShare} alt="feeshare" className="w-6 " />
            )}
            {buttontitle === "Add New" && <FaPlus className="text-brown" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;