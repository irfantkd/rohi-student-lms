// import React, { useEffect, useRef, useState } from "react";
// import Header from "../ui/Header";
// import Select from "react-select";
// import ProfilePhoto from "../../assets/images/profile/profilePhoto.avif";
// import {
//   useGetQuery,
//   usePatchMutation,
//   usePostMutation,
// } from "../../api/apiSlice";
// import { getAdminProfile } from "../../features/adminProfile/adminProfileSlice";
// import { useDispatch } from "react-redux";
// import UpdatePasswordModal from "./UpdatePasswordModal";
// import { showToast } from "../ui/common/ShowToast";
// import imageCompression from "browser-image-compression";

// // Constants
// const VALIDATION_RULES = {
//   CNIC_LENGTH: 13,
//   MAX_IMAGE_SIZE: 1048576, // 1MB
//   VALID_IMAGE_TYPES: ["image/jpeg", "image/png", "image/svg+xml"],
// };

// const VALIDATION_MESSAGES = {
//   IMAGE_TYPE_INVALID: "Please select a valid image file (JPEG, PNG, SVG)",
//   IMAGE_SIZE_EXCEEDED: "Image size should not exceed 1 MB",
// };

// const AdminProfile = () => {
//   // State Management
//   const [formState, setFormState] = useState({});
//   const [initialFormState, setInitialFormState] = useState({});
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [passwordModal, setPasswordModal] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);

//   const fileInputRef = useRef(null);
//   const dispatch = useDispatch();

//   // API Hooks
//   const [patch] = usePatchMutation();
//   const [post] = usePostMutation();

//   const {
//     data: adminProfileData,
//     isLoading: adminProfileLoading,
//     refetch: refetchAdminProfile,
//   } = useGetQuery({
//     path: "/user/get-user",
//   });

//   // Initialize form data from API
//   useEffect(() => {
//     if (adminProfileData?.data) {
//       const profileData = adminProfileData.data;
//       const formData = {
//         uuid: profileData.uuid,
//         firstName: profileData.first_name,
//         lastName: profileData.last_name,
//         fatherName: profileData.father_name,
//         dob: profileData.dob,
//         email: profileData.email,
//         password: "........",
//         contact: profileData.contact,
//         cnic: profileData.cnic,
//         qualification: profileData.qualification,
//         father_contact: profileData.father_contact,
//         address: profileData.address,
//         marital_status: profileData.marital_status,
//         gender: profileData.gender,
//       };

//       setFormState(formData);
//       setInitialFormState(formData);
//       setSelectedImage(profileData.avatar?.file_url);

//       dispatch(getAdminProfile({ adminProfile: profileData }));

//       if (profileData.avatar?.file_url) {
//         localStorage.setItem("adminProfileImage", profileData.avatar.file_url);
//       }
//     }
//   }, [adminProfileData, dispatch]);

//   // Format CNIC with dashes
//   const formatCNIC = (value) => {
//     const digits = value.replace(/[^0-9]/g, "").slice(0, 13);

//     if (digits.length <= 5) {
//       return digits;
//     } else if (digits.length <= 12) {
//       return `${digits.slice(0, 5)}-${digits.slice(5)}`;
//     } else {
//       return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
//     }
//   };

//   // Handle form field changes
//   const handleChange = (e, field) => {
//     let value = field.type === "select" ? e.value : e.target.value;

//     // Format CNIC automatically
//     if (field.name === "cnic") {
//       value = formatCNIC(value);
//     }

//     // Update form state
//     setFormState((prev) => ({
//       ...prev,
//       [field.name]: value,
//     }));
//   };

//   // Handle profile save
//   const handleSaveEdit = async () => {
//     try {
//       const response = await patch({
//         path: "/admin/update-auth",
//         body: formState,
//       }).unwrap();

//       if (response.message === "Success." && response.status === 1) {
//         setIsEditMode(false);
//         setInitialFormState(formState);
//         await refetchAdminProfile();
//         showToast("Profile updated successfully", "success");
//       }
//     } catch (error) {
//       console.error("Failed to update profile:", error);
//       showToast("Failed to update profile. Please try again.", "error");
//     }
//   };

//   // Handle image upload
//   const handleImageChange = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     // Validate file type
//     if (!VALIDATION_RULES.VALID_IMAGE_TYPES.includes(file.type)) {
//       showToast(VALIDATION_MESSAGES.IMAGE_TYPE_INVALID, "error");
//       return;
//     }

//     // Validate file size
//     if (file.size > VALIDATION_RULES.MAX_IMAGE_SIZE) {
//       showToast(VALIDATION_MESSAGES.IMAGE_SIZE_EXCEEDED, "error");
//       return;
//     }

//     setIsUploading(true);

//     try {
//       // Compress image
//       const options = {
//         maxSizeMB: 1,
//         maxWidthOrHeight: 500,
//         useWebWorker: true,
//       };
//       const compressedFile = await imageCompression(file, options);

//       // Upload image
//       const formData = new FormData();
//       formData.append("avatar", compressedFile);

//       setSelectedImage(URL.createObjectURL(file));

//       const response = await post({
//         path: "/user/upload-avatar?_method=patch",
//         body: formData,
//       }).unwrap();

//       await refetchAdminProfile();
//       showToast("Profile image updated successfully", "success");
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       showToast("Failed to upload image. Please try again.", "error");
//       setSelectedImage(adminProfileData?.data?.avatar?.file_url);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   // Handle cancel edit
//   const handleCancelClick = () => {
//     setFormState(initialFormState);
//     setIsEditMode(false);
//   };

//   // Handle edit image button click
//   const handleEditImageClick = () => {
//     fileInputRef.current.click();
//   };

//   // Form structure configuration
//   const formStructure = [
//     {
//       label: "First Name",
//       name: "firstName",
//       type: "text",
//       placeholder: "Enter first name",
//     },
//     {
//       label: "Last Name",
//       name: "lastName",
//       type: "text",
//       placeholder: "Enter last name",
//     },
//     {
//       label: "Father Name",
//       name: "fatherName",
//       type: "text",
//       placeholder: "Enter father name",
//     },
//     {
//       label: "Date of Birth",
//       name: "dob",
//       type: "date",
//     },
//     {
//       label: "Email",
//       name: "email",
//       type: "email",
//       placeholder: "Enter email address",
//     },
//     {
//       label: "Password",
//       name: "password",
//       type: "password",
//       hasUpdateButton: true,
//       disabled: true,
//     },
//     {
//       label: "Phone",
//       name: "contact",
//       type: "text",
//       placeholder: "03XXXXXXXXX",
//     },
//     {
//       label: "CNIC",
//       name: "cnic",
//       type: "text",
//       placeholder: "XXXXX-XXXXXXX-X",
//     },
//     {
//       label: "Qualification",
//       name: "qualification",
//       type: "text",
//       placeholder: "Enter qualification",
//     },
//     {
//       label: "Guardian Phone No",
//       name: "father_contact",
//       type: "text",
//       placeholder: "03XXXXXXXXX",
//     },
//     {
//       label: "Address",
//       name: "address",
//       type: "text",
//       placeholder: "Enter address",
//     },
//     {
//       label: "Marital Status",
//       name: "marital_status",
//       type: "select",
//       options: [
//         { value: "single", label: "Single" },
//         { value: "married", label: "Married" },
//       ],
//     },
//     {
//       label: "Gender",
//       name: "gender",
//       type: "select",
//       options: [
//         { value: "Male", label: "Male" },
//         { value: "Female", label: "Female" },
//       ],
//     },
//   ];

//   // Custom styles for react-select
//   const customSelectStyles = {
//     option: (provided, state) => ({
//       ...provided,
//       backgroundColor: state.isSelected ? "#FF0000" : provided.backgroundColor,
//       color: state.isSelected ? "white" : provided.color,
//       "&:hover": {
//         backgroundColor: state.isSelected ? "" : "#24A0ED",
//         color: "white",
//       },
//     }),
//     control: (provided, state) => ({
//       ...provided,
//       padding: "0.25rem",
//       backgroundColor: "white",
//       borderColor: state.isFocused ? "#E53E3E" : "#00000026",
//       boxShadow: state.isFocused ? "0 0 0 2px rgba(229, 62, 62, 0.75)" : "none",
//       "&:hover": {
//         borderColor: state.isFocused ? "#E53E3E" : "#D1D5DB",
//       },
//       borderRadius: "10px",
//       width: "24rem",
//     }),
//     placeholder: (provided) => ({
//       ...provided,
//       color: "black",
//     }),
//     container: (provided) => ({
//       ...provided,
//       width: "100%",
//     }),
//     singleValue: (provided) => ({
//       ...provided,
//       color: "#4b5563",
//     }),
//   };

//   return (
//     <div className="w-11/12 mx-auto font-poppins">
//       <Header
//         title="My Profile"
//         buttontitle="Edit"
//         headerButtonTittle={false}
//         setIsEditMode={setIsEditMode}
//       />

//       <div className="bg-white w-full">
//         {/* Profile Header Section */}
//         <div className="flex gap-10 pl-[6.2rem] pt-6 items-center">
//           <div className="relative">
//             {adminProfileLoading || isUploading ? (
//               <div className="rounded-full h-44 w-44 border border-gray flex items-center justify-center">
//                 <div className="h-10 w-10 border-4 border-x-grayCheckbox rounded-full animate-spin duration-1000"></div>
//               </div>
//             ) : (
//               <div className="rounded-full h-44 w-44 border-2 border-grayText">
//                 <img
//                   src={selectedImage || ProfilePhoto}
//                   alt="Profile"
//                   className="object-cover w-full h-full rounded-full"
//                 />
//               </div>
//             )}
//           </div>

//           <div className="space-y-4">
//             <p className="font-bold text-2xl">
//               {formState.firstName && formState.lastName
//                 ? `${formState.firstName} ${formState.lastName}`
//                 : "Loading..."}
//             </p>
//             {/* <p className="font-light">Administrator</p> */}
//             <button
//               onClick={handleEditImageClick}
//               disabled={isUploading}
//               className="bg-slate-100 text-sm font-poppins font-semibold py-2 px-4 flex items-center gap-2 rounded-md transform transition-transform duration-300 ease-in-out hover:scale-105 hover:text-base disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isUploading ? "Uploading..." : "Edit Image"}
//             </button>
//             <input
//               type="file"
//               ref={fileInputRef}
//               style={{ display: "none" }}
//               onChange={handleImageChange}
//               accept="image/jpeg,image/png,image/svg+xml"
//             />
//           </div>
//         </div>

//         {/* Form Fields Section */}
//         <div className="p-6 grid lg:grid-cols-2 grid-cols-1 lg:place-items-center lg:place-content-center place-items-start">
//           {formStructure.map((field) => (
//             <div key={field.name} className="mb-4 relative capitalize">
//               <label className="flex flex-col text-gray-700 text-sm font-bold mb-2">
//                 {field.label}
//               </label>

//               {field.type === "select" ? (
//                 <Select
//                   styles={customSelectStyles}
//                   placeholder={field.value}
//                   value={
//                     field.options?.find(
//                       (opt) => opt.value === formState[field.name]
//                     ) || null
//                   }
//                   isDisabled={!isEditMode}
//                   onChange={(e) => handleChange(e, field)}
//                   options={field.options}
//                 />
//               ) : (
//                 <>
//                   <input
//                     type={field.type || "text"}
//                     name={field.name}
//                     placeholder={field.placeholder}
//                     className={`border border-grayBorder p-2 w-96 rounded-md text-sm ${
//                       !isEditMode && "bg-gray-200"
//                     }`}
//                     value={formState[field.name] || ""}
//                     onChange={(e) => handleChange(e, field)}
//                     disabled={!isEditMode || field.disabled}
//                   />
//                   {field.hasUpdateButton && (
//                     <button
//                       className="absolute right-0 mt-[1px] w-24 mx-auto text-sm p-2 rounded-r-md custom-Update font-Montserrat text-white font-bold cursor-pointer"
//                       onClick={() => setPasswordModal(true)}
//                     >
//                       Update
//                     </button>
//                   )}
//                 </>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Action Buttons */}
//         {isEditMode && (
//           <div className="flex justify-end gap-2 mb-6 mr-[6.4rem]">
//             <button
//               className="p-3 custom-AddButton w-36 text-white rounded-md hover:bg-bloodred"
//               onClick={handleSaveEdit}
//             >
//               Save
//             </button>
//             <button
//               className="p-3 custom-AddButton w-36 text-white rounded-md hover:bg-bloodred"
//               onClick={handleCancelClick}
//             >
//               Cancel
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Password Update Modal */}
//       {passwordModal && (
//         <UpdatePasswordModal
//           setPasswordModal={setPasswordModal}
//           passwordModal={passwordModal}
//         />
//       )}
//     </div>
//   );
// };

// export default AdminProfile;
import React, { useEffect, useRef, useState } from "react";
import Header from "../ui/Header";
import Select from "react-select";
import ProfilePhoto from "../../assets/images/profile/profilePhoto.avif";
import {
  useGetQuery,
  usePatchMutation,
  usePostMutation,
} from "../../api/apiSlice";
import { getAdminProfile } from "../../features/adminProfile/adminProfileSlice";
import { useDispatch } from "react-redux";
import UpdatePasswordModal from "./UpdatePasswordModal";
import { showToast } from "../ui/common/ShowToast";
import imageCompression from "browser-image-compression";

// Constants
const VALIDATION_RULES = {
  MAX_IMAGE_SIZE: 1048576, // 1MB
  VALID_IMAGE_TYPES: ["image/jpeg", "image/png", "image/svg+xml"],
};

const AdminProfile = () => {
  // State Management
  const [formState, setFormState] = useState({});
  const [initialFormState, setInitialFormState] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  // API Hooks
  const [post] = usePostMutation();

  const {
    data: adminProfileData,
    isLoading: adminProfileLoading,
    refetch: refetchAdminProfile,
  } = useGetQuery({
    path: "/user/get-user",
  });

  // Initialize form data from API
  useEffect(() => {
    if (adminProfileData?.data) {
      const profileData = adminProfileData.data;
      const formData = {
        uuid: profileData.uuid,
        firstName: profileData.first_name || "",
        lastName: profileData.last_name || "",
        fatherName: profileData.father_name || "",
        dob: profileData.dob || "",
        email: profileData.email || "",
        password: "........",
        contact: profileData.contact || "",
        cnic: profileData.cnic || "",
        qualification: profileData.qualification || "",
        father_contact: profileData.father_contact || "",
        address: profileData.address || "",
        marital_status: profileData.marital_status || "",
        gender: profileData.gender || "",
      };

      setFormState(formData);
      setInitialFormState(formData);
      setSelectedImage(profileData.avatar?.file_url);

      dispatch(getAdminProfile({ adminProfile: profileData }));

      if (profileData.avatar?.file_url) {
        localStorage.setItem("adminProfileImage", profileData.avatar.file_url);
      }
    }
  }, [adminProfileData, dispatch]);

  // Format CNIC with dashes
  const formatCNIC = (value) => {
    const digits = value.replace(/[^0-9]/g, "").slice(0, 13);

    if (digits.length <= 5) {
      return digits;
    } else if (digits.length <= 12) {
      return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    } else {
      return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
    }
  };

  // Handle form field changes
  const handleChange = (e, field) => {
    let value = field.type === "select" ? e.value : e.target.value;

    // Format CNIC automatically
    if (field.name === "cnic") {
      value = formatCNIC(value);
    }

    // Update form state
    setFormState((prev) => ({
      ...prev,
      [field.name]: value,
    }));
  };

  // Check if form has changes
  const hasFormChanges = () => {
    return Object.keys(formState).some(
      (key) => formState[key] !== initialFormState[key]
    );
  };

  // Handle profile save - Only send filled fields
  const handleSaveEdit = async () => {
    // Check if there are any changes
    if (!hasFormChanges()) {
      showToast("No changes detected", "info");
      setIsEditMode(false);
      return;
    }

    setIsSaving(true);

    try {
      // Prepare data to send - Only include filled and changed fields
      const dataToSend = { uuid: formState.uuid };

      Object.keys(formState).forEach((key) => {
        const value = formState[key];
        const initialValue = initialFormState[key];

        // Skip password field
        if (key === "password") return;

        // Only include if:
        // 1. Value has changed from initial
        // 2. Value is not empty/null/undefined
        if (value !== initialValue && value && value.trim() !== "") {
          dataToSend[key] = value;
        }
      });

      // If only uuid in the object, no actual changes to send
      if (Object.keys(dataToSend).length === 1) {
        showToast("No valid changes to save", "info");
        setIsSaving(false);
        return;
      }

      const response = await post({
        path: "/admin/update-auth?_method=patch",
        body: dataToSend,
      }).unwrap();

      if (response.message === "Success." && response.status === 1) {
        setIsEditMode(false);
        setInitialFormState(formState);
        await refetchAdminProfile();
        showToast("Profile updated successfully", "success");
      } else {
        throw new Error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      showToast(
        error?.data?.message || "Failed to update profile. Please try again.",
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Handle image upload
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!VALIDATION_RULES.VALID_IMAGE_TYPES.includes(file.type)) {
      showToast("Please select a valid image file (JPEG, PNG, SVG)", "error");
      return;
    }

    // Validate file size
    if (file.size > VALIDATION_RULES.MAX_IMAGE_SIZE) {
      showToast("Image size should not exceed 1 MB", "error");
      return;
    }

    setIsUploading(true);
    const originalImage = selectedImage;

    try {
      // Compress image
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 500,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      // Create preview
      setSelectedImage(URL.createObjectURL(compressedFile));

      // Upload image
      const formData = new FormData();
      formData.append("avatar", compressedFile);

      await post({
        path: "/user/upload-avatar?_method=patch",
        body: formData,
      }).unwrap();

      await refetchAdminProfile();
      showToast("Profile image updated successfully", "success");
    } catch (error) {
      console.error("Error uploading image:", error);
      showToast(
        error?.data?.message || "Failed to upload image. Please try again.",
        "error"
      );
      setSelectedImage(originalImage);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle cancel edit
  const handleCancelClick = () => {
    setFormState(initialFormState);
    setIsEditMode(false);
  };

  // Handle edit image button click
  const handleEditImageClick = () => {
    fileInputRef.current?.click();
  };

  // Form structure configuration
  const formStructure = [
    {
      label: "First Name",
      name: "firstName",
      type: "text",
      placeholder: "Enter first name",
    },
    {
      label: "Last Name",
      name: "lastName",
      type: "text",
      placeholder: "Enter last name",
    },
    {
      label: "Father Name",
      name: "fatherName",
      type: "text",
      placeholder: "Enter father name",
    },
    {
      label: "Date of Birth",
      name: "dob",
      type: "date",
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      placeholder: "Enter email address",
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      hasUpdateButton: true,
      disabled: true,
    },
    {
      label: "Phone",
      name: "contact",
      type: "text",
      placeholder: "03XXXXXXXXX",
    },
    {
      label: "CNIC",
      name: "cnic",
      type: "text",
      placeholder: "XXXXX-XXXXXXX-X",
    },
    {
      label: "Qualification",
      name: "qualification",
      type: "text",
      placeholder: "Enter qualification",
    },
    {
      label: "Guardian Phone No",
      name: "father_contact",
      type: "text",
      placeholder: "03XXXXXXXXX",
    },
    {
      label: "Address",
      name: "address",
      type: "text",
      placeholder: "Enter address",
    },
    {
      label: "Marital Status",
      name: "marital_status",
      type: "select",
      options: [
        { value: "single", label: "Single" },
        { value: "married", label: "Married" },
      ],
    },
    {
      label: "Gender",
      name: "gender",
      type: "select",
      options: [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
      ],
    },
  ];

  // Custom styles for react-select
  const customSelectStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#EF4444" : provided.backgroundColor,
      color: state.isSelected ? "white" : provided.color,
      "&:hover": {
        backgroundColor: state.isSelected ? "#EF4444" : "#3B82F6",
        color: "white",
      },
      cursor: "pointer",
    }),
    control: (provided, state) => ({
      ...provided,
      padding: "0.25rem",
      backgroundColor: isEditMode ? "white" : "#E5E7EB",
      borderColor: state.isFocused ? "#EF4444" : "#D1D5DB",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(239, 68, 68, 0.2)" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#EF4444" : "#9CA3AF",
      },
      borderRadius: "0.5rem",
      minHeight: "2.75rem",
      cursor: isEditMode ? "pointer" : "not-allowed",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9CA3AF",
    }),
    container: (provided) => ({
      ...provided,
      width: "100%",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#374151",
    }),
  };

  // Loading skeleton
  if (adminProfileLoading && !formState.firstName) {
    return (
      <div className="w-11/12 mx-auto font-poppins">
        <Header
          title="My Profile"
          buttontitle="Edit"
          headerButtonTittle={false}
          setIsEditMode={setIsEditMode}
        />
        <div className="bg-white w-full p-6 flex items-center justify-center min-h-[400px] rounded-lg shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-11/12 mx-auto font-poppins">
      <Header
        title="My Profile"
        buttontitle={isEditMode ? "" : "Edit"}
        headerButtonTittle={false}
        setIsEditMode={setIsEditMode}
      />

      <div className="bg-white w-full shadow-md rounded-lg overflow-hidden">
        {/* Profile Header Section */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 px-8 md:pl-[6.2rem] pt-8 pb-6 items-center border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="relative">
            {isUploading ? (
              <div className="rounded-full h-44 w-44 border-2 border-gray-300 flex items-center justify-center bg-gray-50 shadow-inner">
                <div className="h-10 w-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="rounded-full h-44 w-44 border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                <img
                  src={selectedImage || ProfilePhoto}
                  alt="Profile"
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.src = ProfilePhoto;
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-3 text-center md:text-left">
            <h2 className="font-bold text-3xl text-gray-800">
              {formState.firstName && formState.lastName
                ? `${formState.firstName} ${formState.lastName}`
                : "Admin User"}
            </h2>
            <p className="text-gray-600 font-medium flex items-center gap-2 justify-center md:justify-start">
              <svg
                className="w-5 h-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              Administrator
            </p>
            <button
              onClick={handleEditImageClick}
              disabled={isUploading}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-semibold py-2.5 px-6 rounded-lg transform transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 mx-auto md:mx-0"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {isUploading ? "Uploading..." : "Change Photo"}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
              accept="image/jpeg,image/png,image/svg+xml"
            />
          </div>
        </div>

        {/* Form Fields Section */}
        <div className="p-8 grid lg:grid-cols-2 grid-cols-1 gap-6 lg:place-items-center">
          {formStructure.map((field) => (
            <div key={field.name} className="w-full max-w-md">
              <label className="flex items-center text-gray-700 text-sm font-semibold mb-2 capitalize">
                {field.label}
              </label>

              {field.type === "select" ? (
                <Select
                  name={field.name}
                  styles={customSelectStyles}
                  placeholder={`Select ${field.label.toLowerCase()}`}
                  value={
                    field.options?.find(
                      (opt) => opt.value === formState[field.name]
                    ) || null
                  }
                  isDisabled={!isEditMode}
                  onChange={(e) => handleChange(e, field)}
                  options={field.options}
                />
              ) : (
                <div className="relative">
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    placeholder={field.placeholder}
                    className={`border border-gray-300 focus:ring-2 focus:ring-red-200 focus:border-red-500 p-3 w-full rounded-lg text-sm transition-all duration-200 ${
                      !isEditMode
                        ? "bg-gray-100 cursor-not-allowed text-gray-600"
                        : "bg-white text-gray-900"
                    } ${field.disabled ? "cursor-not-allowed" : ""}`}
                    value={formState[field.name] || ""}
                    onChange={(e) => handleChange(e, field)}
                    disabled={!isEditMode || field.disabled}
                  />
                  {field.hasUpdateButton && (
                    <button
                      className="absolute right-0 top-0 h-full px-5 rounded-r-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-semibold transition-all duration-200 hover:shadow-md"
                      onClick={() => setPasswordModal(true)}
                      type="button"
                    >
                      Update
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        {isEditMode && (
          <div className="flex justify-center md:justify-end gap-3 px-8 pb-8 border-t border-gray-200 pt-6 bg-gray-50">
            <button
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 min-w-[140px] justify-center"
              onClick={handleSaveEdit}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
            <button
              className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
              onClick={handleCancelClick}
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Password Update Modal */}
      {passwordModal && (
        <UpdatePasswordModal
          setPasswordModal={setPasswordModal}
          passwordModal={passwordModal}
        />
      )}
    </div>
  );
};

export default AdminProfile;
