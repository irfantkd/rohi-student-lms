import React, { useEffect, useState } from "react";
import SwitchButton from "./SwitchButton";
import EditModal from "../ui/EditModal";
import DeleteModal from "../ui/DeleteModal";
import PencilIcon from "../../assets/icons/Pencil";
import BinIcon from "../../assets/icons/Bin";
import {
  useDeleteMutation,
  useGetQuery,
  usePatchMutation,
} from "../../api/apiSlice";
// import { useDispatch, useSelector } from "react-redux  ";
import { toast } from "react-toastify";
import { showToast } from "../ui/common/ShowToast";

const structure = [
  {
    title: "Ahmed 1 Year anniversry in the code lab .",
    isActive: true,
    description: ` It is a long established fact that a reader will be distracted by the
        readable content of a page when looking at its layout. The point of
        using Lorem Ipsum is that it has a more-or-less normal distribution of
        letters, as opposed to using 'Content here, content here', making it
        look like readable English. Many desktop publishing packages and web
        page editors now use Lorem Ipsum as their default model text, and a
        search for 'lorem ipsum' will uncover many web sites still in their
        infancy. Various versions have evolved over the years, sometimes by
        accident, sometimes on purpose (injected humour and the like).`,
  },
  {
    title: "Ahmed 1 Year anniversry in the code lab .",
    isActive: false,
    description: ` It is a long established fact that a reader will be distracted by the
        readable content of a page when looking at its layout. The point of
        using Lorem Ipsum is that it has a more-or-less normal distribution of
        letters, as opposed to using 'Content here, content here', making it
        look like readable English. Many desktop publishing packages and web
        page editors now use Lorem Ipsum as their default model text, and a
        search for 'lorem ipsum' will uncover many web sites still in their
        infancy. Various versions have evolved over the years, sometimes by
        accident, sometimes on purpose (injected humour and the like).`,
  },
  {
    title: "Ahmed 1 Year anniversry in the code lab .",
    isActive: true,

    description: ` It is a long established fact that a reader will be distracted by the
        readable content of a page when looking at its layout. The point of
        using Lorem Ipsum is that it has a more-or-less normal distribution of
        letters, as opposed to using 'Content here, content here', making it
        look like readable English. Many desktop publishing packages and web
        page editors now use Lorem Ipsum as their default model text, and a
        search for 'lorem ipsum' will uncover many web sites still in their
        infancy. Various versions have evolved over the years, sometimes by
        accident, sometimes on purpose (injected humour and the like).`,
  },
  {
    title: "Ahmed 1 Year anniversry in the code lab     .",
    isActive: false,
    description: ` It is a long established fact that a reader will be distracted by the
        readable content of a page when looking at its layout. The point of
        using Lorem Ipsum is that it has a more-or-less normal distribution of
        letters, as opposed to using 'Content here, content here', making it
        look like readable English. Many desktop publishing packages and web
        page editors now use Lorem Ipsum as their default model text, and a
        search for 'lorem ipsum' will uncover many web sites still in their
        infancy. Various versions have evolved over the years, sometimes by
        accident, sometimes on purpose (injected humour and the like).`,
  },
];
const AnnouncementsDetails = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [data, setData] = useState([]);
  const [formState, setFormState] = useState({});
  const [options, setOptions] = useState(["active", "InActive"]);
  const [selectedID, setSelectedID] = useState(null);
  console.log("formState", formState);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteAnnouncements] = useDeleteMutation();
  // const [currentItem, setCurrentItem] = useState([]);
  const [patch] = usePatchMutation();
  const [currentItem, setCurrentItem] = useState({}); // Initialize as an empty object
  console.log("currentItem222", currentItem);
  console.log("selectedID", selectedID);
  // Get all api annoucements details
  const {
    data: annoucementsData,
    error: annoucementsError,
    isLoading: announcementsLoading,
    refetch: refetchAnnouncements,
  } = useGetQuery({
    path: "/admin/announcements",
  });

  // /admin/announcements/
  const handleDeleteConfirm = async () => {
    try {
      await deleteAnnouncements({
        path: `/admin/announcements/${selectedID}`,
      }).unwrap();
      setIsDeleteModalOpen(false);
      refetchAnnouncements();
    } catch (err) {
      console.error("Failed to delete Announcements", err);
    }
  };

  console.log("annoucementsData", annoucementsData);
  useEffect(() => {
    if (annoucementsData) {
      const formattedData = annoucementsData?.data?.map((annoucements) => ({
        uuid: annoucements.announcement_uuid,
        id: annoucements.id,
        title: annoucements.title,
        description: annoucements.description,
        isActive: annoucements.active_status,
        image: annoucements?.image?.file_url,
      }));
      setData(formattedData);
      console.log("formattedData", formattedData);
    }
  }, [annoucementsData]);

  // const initialValues = {
  //   instructor: currentItem.name || "",
  // };

  const handleEditSubmit = async (formState) => {
    console.log("Form submitted with:", formState);
    const values = {
      title: formState.title,
      description: formState.description,
      active_status: formState.active_status ? 1 : 0,
    };

    console.log("values before update", values);
    console.log("selectedID before update", selectedID);

    try {
      const response = await patch({
        path: `/admin/announcements/${selectedID}`,
        body: values,
      }).unwrap();

      console.log("response", response);
      // Refetch data after successful update
      refetchAnnouncements();
      if (response.status === 1 && response.message === "Success.") {
        showToast("Edit Successfully", "success");
        setIsEditModalOpen(false);
      }
    } catch (err) {
      console.error("Failed to update batch", err);
      setIsEditModalOpen(true);
    }
  };

  const handleEditClick = (item) => {
    setCurrentItem(item); // Set the selected announcement data to currentItem
    setSelectedID(item.uuid); // Set the ID of the selected announcement
    setIsEditModalOpen(true); // Open the edit modal
  };

  const initialValues = {
    title: currentItem.title || "",
    description: currentItem.description || "",
  };

  const handleSubmit = (formState) => {
    console.log("Form submitted with:", formState);
  };

  const Editfields = [
    {
      name: "title",
      label: "Title",
      type: "text",
      placeholder: "Edit Title",
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      placeholder: "Edit Description",
    },
  ];
  // const toggleSwitch = (index) => {
  //   const newData = [...data];
  //   newData[index].isActive = !newData[index].isActive;
  //   setData(newData);
  // };
  const toggleSwitch = async (index, id, currentStatus, title, description) => {
    const newData = [...data];
    newData[index].isActive = !newData[index].isActive;
    console.log("newData", newData);

    setData(newData);

    const updatedStatus = currentStatus ? 0 : 1;

    const values = {
      title,
      description,
      active_status: updatedStatus,
    };

    try {
      const response = await patch({
        path: `/admin/announcements/${id}`,
        body: values,
      }).unwrap();
      refetchAnnouncements();
      console.log("response", response);

      // showToast("Edit Successfully", "error");
    } catch (err) {
      console.error("Failed to update announcement status", err);
    }
  };
  return (
    <>
      {!announcementsLoading && !annoucementsError && (
        <EditModal
          isOpen={isEditModalOpen}
          setIsOpen={setIsEditModalOpen}
          title="Edit Announcements"
          fields={Editfields}
          initialValues={currentItem}
          handleSubmit={handleEditSubmit}
          submitButtonText="Save"
        />
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        title="Delete Batch"
        message="Are you sure you want to delete this announcements?"
        confirmText="Yes"
        cancelText="No"
        onConfirm={handleDeleteConfirm}
        onClose={() => console.log("Delete modal closed")}
        successMessage="Deleted Successfully!"
      />
      {data.map((item, index) => {
        return (
          <details
            key={index}
            className="group border border-grayBorder w-full duration-1000 rounded-sm my-2 bg-grayInActive"
          >
            <summary className="flex items-center justify-between font-poppins marker:content-none hover:cursor-pointer">
              <div className="flex items-center">
                <div className="border-r border-[#e0dcdc] py-3 flex  gap-3 pl-4 pr-8">
                  <input
                    type="checkbox"
                    name="checkbox"
                    id="checkbox"
                    className="border-grayTitle"
                  />
                  <div className="flex gap-1 items-center">
                    <p className="text-sm text-grayCheckbox">SR</p>
                    <p className="text-md  text-grayCheckbox">#</p>
                  </div>
                </div>
                <span className="px-4 text-grayTitle text-lg tracking-tight">
                  {item.title}
                </span>
              </div>

              <div className="flex flex-row justify-center items-center gap-5">
                <div className="pt-1">
                  <SwitchButton
                    isActive={item.isActive}
                    toggleSwitch={() =>
                      toggleSwitch(
                        index,
                        item.uuid,
                        item.isActive,
                        item.title,
                        item.description
                      )
                    }
                  />
                </div>
                <div className="flex pr-2">
                  <button
                    className="bg-editButtonGray text-white w-11 h-8  rounded mx-1 flex items-center justify-center"
                    onClick={() => handleEditClick(item)}
                  >
                    <PencilIcon />
                  </button>
                  <button
                    className="custom-ActionBtn  text-white w-11 h-8 rounded mx-1 flex items-center justify-center"
                    onClick={() => {
                      setIsDeleteModalOpen(true);
                      setSelectedID(item.uuid);
                    }}
                  >
                    <BinIcon />
                  </button>
                </div>
              </div>
            </summary>

            <article className="p-4 border border-[#e0dede] bg-[#ffffff] font-poppins text-md flex gap-6 ">
              <img
                src={item.image}
                alt="image"
                className="w-56 h-36 rounded-lg border object-cover "
              />
              <p className="text-grayText ">{item.description}</p>
            </article>
          </details>
        );
      })}
    </>
  );
};

export default AnnouncementsDetails;
