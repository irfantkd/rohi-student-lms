import { useEffect, useMemo, useState } from "react";
import EditModal from "../ui/EditModal";
import DeleteModal from "../ui/DeleteModal";
import BulkDeleteModal from "../ui/BulkDeleteModal";
import Table from "../ui/Table";
import Header from "../ui/Header";
import CreateModal from "../ui/CreateModal";
import {
  useGetQuery,
  useDeleteMutation,
  usePostMutation,
  usePatchMutation,
} from "../../api/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  setCategories,
  deleteCategory,
  addCategory,
} from "../../features/categories/catogriesSlice";
import Categories from "../../assets/icons/navbar/Categories";
import { COURSES } from "../routes/RouteConstants";
import showError from "../ui/common/ShowError";
import { showToast } from "../ui/common/ShowToast";
import Loader from "../ui/common/LoaderComponent";

const columns = ["Name", "Courses"];

const columnsFilters = [
  {
    field: "number",
    key: "serialNumber",
    placeholder: "Search SR #",
    isDisabled: true,
  },
  {
    field: "text",
    key: "name",
    placeholder: "Search Name",
    isDisabled: false,
  },

  {
    field: "number",
    key: "course",
    placeholder: "Search Course",
    isDisabled: false,
  },

  {
    field: "button",
    key: "action",
    placeholder: "Reset",
    isDisabled: false,
  },
];

const CategoriesComponent = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isMultipleSelected, setIsMultipleSelected] = useState(false);
  const [selectedCategoryID, setSelectedCategoryID] = useState(null);
  const [editSelect, setEditSelect] = useState({});
  const [initialValues, setInitialValues] = useState({});
  const [filters, setFilters] = useState({
    name: "",
    course: "",
    // project: "",
    // salary: "",
    // status: "",
  });

  // const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(100);

  console.log("selectedCategoryID", selectedCategoryID);
  const dispatch = useDispatch();
  const {
    data,
    CategoryError,
    CategoryIsLoading,
    refetch: refetchCategories,
  } = useGetQuery({
    path: "/admin/categories",
    params: {
      per_page: itemsPerPage,
      // page: currentPage,
    },
  });

  // useEffect(() => {
  //   refetchCategories();
  // }, []);

  const [deleteCategoryAPi] = useDeleteMutation();
  const [postCategory] = usePostMutation();
  const [patchCategory] = usePatchMutation();
  useEffect(() => {
    if (data) {
      const formattedData = data.data.map(
        (category) => (
          console.log("category222222", category),
          {
            uuid: category.uuid,
            id: category.id,
            name: category.name,
            courses: category.course_count,
          }
        )
      );
      console.log("formattedData", formattedData);
      dispatch(setCategories(formattedData));
    }
  }, [data, dispatch]);

  const categoriesData = useSelector((state) => state.categories.categories);
  console.log("categoriesData", categoriesData);
  // Callback to update filters from TableFilters component
  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  // console.log();

  const filteredStudentsData = useMemo(() => {
    return categoriesData?.filter((student) => {
      return (
        (filters?.name === "" ||
          student?.name
            ?.toLowerCase()
            ?.includes(filters?.name?.toLowerCase())) &&
        (filters?.course === "" ||
          student?.courses?.toString()?.includes(filters?.course?.toString()))
      );
    });
  }, [categoriesData, filters]);

  console.log("filteredStudentsData here", filteredStudentsData);

  const handleBulkDeleteConfirm = () => {
    console.log("All selected items deleted successfully");
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCategoryAPi({
        path: `/admin/category/${selectedCategoryID}`,
      }).unwrap();
      refetchCategories();
      dispatch(deleteCategory(selectedCategoryID));

      setIsDeleteModalOpen(false);
      console.log("Item deleted successfully");
    } catch (err) {
      showError(err);
      console.error("Failed to delete category", err);
    }
  };

  const handleEditSubmit = async (formState) => {
    try {
      const response = await patchCategory({
        path: `/admin/category/${selectedCategoryID}`,
        body: { name: formState.category },
      }).unwrap();
      refetchCategories();
      if (response.message === "Success." && response.status === 1) {
        showToast("Edit Successfully", "success");
      }
      setIsEditModalOpen(false);
    } catch (err) {
      showError(err);
      setIsEditModalOpen(true);
    }
  };
  const Editfields = [
    {
      name: "category",
      label: "Category",
      placeholder: "edit category",
    },
  ];

  const handleEditClick = (selectedCategory) => {
    setEditSelect(selectedCategory); // Set selected category data
    setSelectedCategoryID(selectedCategory.uuid);
    // Set the initial values to be passed to the EditModal
    setInitialValues({ category: selectedCategory.name });
    setIsEditModalOpen(true);
    refetchCategories();
  };

  const handleSubmit = async (formState, resetFormState) => {
    console.log("Form submitted with:", formState);
    const values = { name: formState.category };
    try {
      const response = await postCategory({
        path: "/admin/category/create",
        body: values,
      }).unwrap();
      // refetchCategories();
      if (response.message === "Success." && response.status === 1) {
        showToast("Added Successfully", "success");
      }
      console.log("response", response);
      dispatch(addCategory(response.data));
      console.log("Category create successfully");
      setIsCreateModalOpen(false);
      resetFormState(); // Clear the form state on successful submission
    } catch (err) {
      showError(err);
      setIsCreateModalOpen(true);
    }
  };

  const fields = [
    {
      name: "category",
      label: "Category",
      placeholder: "Add new category",
    },
  ];

  const isFilterApplied = Object.values(filters).some((value) => value !== "");
  console.log("isFilterApplied", isFilterApplied);

  const handleResetChange = () => {
    setFilters({ name: "", course: "" });
  };

  return (
    <div className="w-11/12 mx-auto">
      <Header
        title="Categories"
        setIsCreateModalOpen={setIsCreateModalOpen}
        isMultipleSelected={isMultipleSelected}
        setIsBulkDeleteModalOpen={setIsBulkDeleteModalOpen}
        icon={<Categories />}
        batchButton="category"
        TotalCategories={
          CategoryIsLoading || CategoryError ? null : categoriesData?.length
        }
      />
      {CategoryIsLoading && <Loader/>}
      {CategoryError && <div>Error loading categories</div>}
      {!CategoryIsLoading && !CategoryError && (
        <Table
          data={isFilterApplied ? filteredStudentsData : categoriesData}
          columns={columns}
          columnsFilters={columnsFilters}
          handleFilterChange={handleFilterChange}
          setIsEditModalOpen={setIsEditModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          setIsMultipleSelected={setIsMultipleSelected}
          setSelectedID={setSelectedCategoryID}
          handleEditClick={handleEditClick}
          sectionName={"category"}
          ColumnUnderline={true}
          NavigateName={COURSES}
          sourceComponent="CategoriesComponent"
          handleResetChange={handleResetChange}
        />
      )}

      <EditModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        title="Edit Category"
        fields={Editfields}
        initialValues={initialValues}
        handleSubmit={handleEditSubmit}
        submitButtonText="Save"
      />
      <CreateModal
        isOpen={isCreateModalOpen}
        setIsOpen={setIsCreateModalOpen}
        title="Category"
        fields={fields}
        handleSubmit={handleSubmit}
        submitButtonText="Add"
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        confirmText="Yes"
        cancelText="No"
        onConfirm={handleDeleteConfirm}
        onClose={() => console.log("Delete modal closed")}
        successMessage="Deleted Successfully!"
      />
      <BulkDeleteModal
        isOpen={isBulkDeleteModalOpen}
        setIsOpen={setIsBulkDeleteModalOpen}
        message="Are you sure you want to delete all the selected categories?"
        confirmText="Yes"
        cancelText="No"
        onConfirm={handleBulkDeleteConfirm}
        onClose={() => console.log("Bulk delete modal closed")}
        successMessage="Deleted Successfully!"
      />
    </div>
  );
};

export default CategoriesComponent;
