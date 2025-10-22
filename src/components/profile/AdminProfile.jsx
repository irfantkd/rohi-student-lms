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
//   NAME_MIN_LENGTH: 3,
//   PHONE_LENGTH: 11,
//   CNIC_LENGTH: 13,
//   MAX_IMAGE_SIZE: 1048576, // 1MB
//   VALID_IMAGE_TYPES: ["image/jpeg", "image/png", "image/svg+xml"],
// };

// const VALIDATION_MESSAGES = {
//   ALPHABETS_ONLY: "Only alphabets are allowed",
//   MIN_ALPHABETS: "Must be at least 3 characters",
//   PHONE_FORMAT: "Phone must start with '03' and contain 11 digits",
//   CNIC_FORMAT: "CNIC must be exactly 13 digits",
//   EMAIL_INVALID: "Please enter a valid email address",
//   QUALIFICATION_REQUIRED: "Qualification field is required",
//   IMAGE_TYPE_INVALID: "Please select a valid image file (JPEG, PNG, SVG)",
//   IMAGE_SIZE_EXCEEDED: "Image size should not exceed 1 MB",
// };

// const AdminProfile = () => {
//   // State Management
//   const [formState, setFormState] = useState({});
//   const [initialFormState, setInitialFormState] = useState({});
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [errors, setErrors] = useState({});
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
//   console.log("adminProfileData", adminProfileData);

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

//   // Validation Functions
//   const validateField = (name, value) => {
//     switch (name) {
//       case "firstName":
//       case "lastName":
//       case "fatherName":
//         if (!/^[A-Za-z\s]+$/.test(value)) {
//           return VALIDATION_MESSAGES.ALPHABETS_ONLY;
//         }
//         if (value.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
//           return VALIDATION_MESSAGES.MIN_ALPHABETS;
//         }
//         return null;

//       case "email":
//         const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//         if (!emailRegex.test(value)) {
//           return VALIDATION_MESSAGES.EMAIL_INVALID;
//         }
//         return null;

//       case "contact":
//       case "father_contact":
//         if (!/^03\d{9}$/.test(value)) {
//           return VALIDATION_MESSAGES.PHONE_FORMAT;
//         }
//         return null;

//       case "cnic":
//         const cnicDigits = value.replace(/[^0-9]/g, "");
//         if (cnicDigits.length !== VALIDATION_RULES.CNIC_LENGTH) {
//           return VALIDATION_MESSAGES.CNIC_FORMAT;
//         }
//         return null;

//       case "qualification":
//         if (!value || value.trim().length === 0) {
//           return VALIDATION_MESSAGES.QUALIFICATION_REQUIRED;
//         }
//         return null;

//       default:
//         return null;
//     }
//   };

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

//     // Format CNIC
//     if (field.name === "cnic") {
//       value = formatCNIC(value);
//     }

//     // Format phone numbers
//     if (field.name === "contact" || field.name === "father_contact") {
//       value = value
//         .replace(/[^0-9]/g, "")
//         .slice(0, VALIDATION_RULES.PHONE_LENGTH);
//     }

//     // Validate field
//     const errorMessage = validateField(field.name, value);
//     setErrors((prev) => ({
//       ...prev,
//       [field.name]: errorMessage || "",
//     }));

//     // Update form state
//     setFormState((prev) => ({
//       ...prev,
//       [field.name]: value,
//     }));
//   };

//   // Handle profile save
//   const handleSaveEdit = async () => {
//     // Validate all fields before submission
//     const newErrors = {};
//     Object.keys(formState).forEach((key) => {
//       const error = validateField(key, formState[key]);
//       if (error) {
//         newErrors[key] = error;
//       }
//     });

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       showToast("Please fix all errors before saving", "error");
//       return;
//     }

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
//     setErrors({});
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
//         backgroundColor: state.isSelected ? "#FF0000" : "#24A0ED",
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
//       color: "#9CA3AF",
//     }),
//     container: (provided) => ({
//       ...provided,
//       width: "100%",
//     }),
//     singleValue: (provided) => ({
//       ...provided,
//       color: "#4B5563",
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

//       <div className="bg-white w-full rounded-lg shadow-sm">
//         {/* Profile Header Section */}
//         <div className="flex gap-10 pl-24 pt-6 pb-6 items-center border-b border-gray-200">
//           <div className="relative">
//             {adminProfileLoading || isUploading ? (
//               <div className="rounded-full h-44 w-44 border-2 border-gray-300 flex items-center justify-center">
//                 <div className="h-10 w-10 border-4 border-x-gray-400 rounded-full animate-spin"></div>
//               </div>
//             ) : (
//               <img
//                 src={selectedImage || ProfilePhoto}
//                 alt="Profile"
//                 className="rounded-full h-44 w-44 object-cover border-2 border-gray-200"
//               />
//             )}
//           </div>

//           <div className="space-y-3">
//             <h2 className="font-bold text-2xl text-gray-800">
//               {formState.firstName && formState.lastName
//                 ? `${formState.firstName} ${formState.lastName}`
//                 : "Loading..."}
//             </h2>
//             <p className="font-light text-gray-600">Administrator</p>
//             <button
//               onClick={handleEditImageClick}
//               disabled={isUploading}
//               className="bg-slate-100 text-sm font-poppins font-semibold py-2 px-6 flex items-center gap-2 rounded-md transform transition-all duration-300 ease-in-out hover:scale-105 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
//         <div className="p-6 grid lg:grid-cols-2 grid-cols-1 gap-6 lg:place-items-center">
//           {formStructure.map((field) => (
//             <div key={field.name} className="mb-4 relative w-full max-w-md">
//               <label className="flex flex-col text-gray-700 text-sm font-bold mb-2 capitalize">
//                 {field.label}
//               </label>

//               {field.type === "select" ? (
//                 <Select
//                   styles={customSelectStyles}
//                   value={
//                     field.options?.find(
//                       (opt) => opt.value === formState[field.name]
//                     ) || null
//                   }
//                   placeholder={`Select ${field.label.toLowerCase()}`}
//                   isDisabled={!isEditMode}
//                   onChange={(e) => handleChange(e, field)}
//                   options={field.options}
//                 />
//               ) : (
//                 <div className="relative">
//                   <input
//                     type={field.type}
//                     name={field.name}
//                     placeholder={field.placeholder}
//                     className={`border border-gray-300 p-3 w-full rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
//                       !isEditMode && "bg-gray-100 cursor-not-allowed"
//                     } ${errors[field.name] && "border-red-500"} ${
//                       field.hasUpdateButton && "pr-28"
//                     }`}
//                     value={formState[field.name] || ""}
//                     onChange={(e) => handleChange(e, field)}
//                     disabled={!isEditMode || field.disabled}
//                   />

//                   {field.hasUpdateButton && (
//                     <button
//                       type="button"
//                       className="absolute right-0 top-0 h-full w-24 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-r-md hover:from-red-600 hover:to-red-700 transition-all"
//                       onClick={() => setPasswordModal(true)}
//                     >
//                       Update
//                     </button>
//                   )}
//                 </div>
//               )}

//               {errors[field.name] && (
//                 <p className="text-red-500 text-xs mt-1 animate-pulse">
//                   {errors[field.name]}
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Action Buttons */}
//         {isEditMode && (
//           <div className="flex justify-end gap-3 mb-6 mr-24 pb-6">
//             <button
//               className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-md hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 min-w-[140px]"
//               onClick={handleSaveEdit}
//             >
//               Save Changes
//             </button>
//             <button
//               className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition-all transform hover:scale-105 min-w-[140px]"
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
  CNIC_LENGTH: 13,
  MAX_IMAGE_SIZE: 1048576, // 1MB
  VALID_IMAGE_TYPES: ["image/jpeg", "image/png", "image/svg+xml"],
};

const VALIDATION_MESSAGES = {
  IMAGE_TYPE_INVALID: "Please select a valid image file (JPEG, PNG, SVG)",
  IMAGE_SIZE_EXCEEDED: "Image size should not exceed 1 MB",
};

const AdminProfile = () => {
  // State Management
  const [formState, setFormState] = useState({});
  const [initialFormState, setInitialFormState] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  // API Hooks
  const [patch] = usePatchMutation();
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
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        fatherName: profileData.father_name,
        dob: profileData.dob,
        email: profileData.email,
        password: "........",
        contact: profileData.contact,
        cnic: profileData.cnic,
        qualification: profileData.qualification,
        father_contact: profileData.father_contact,
        address: profileData.address,
        marital_status: profileData.marital_status,
        gender: profileData.gender,
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

  // Handle profile save
  const handleSaveEdit = async () => {
    try {
      const response = await patch({
        path: "/admin/update-auth",
        body: formState,
      }).unwrap();

      if (response.message === "Success." && response.status === 1) {
        setIsEditMode(false);
        setInitialFormState(formState);
        await refetchAdminProfile();
        showToast("Profile updated successfully", "success");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      showToast("Failed to update profile. Please try again.", "error");
    }
  };

  // Handle image upload
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!VALIDATION_RULES.VALID_IMAGE_TYPES.includes(file.type)) {
      showToast(VALIDATION_MESSAGES.IMAGE_TYPE_INVALID, "error");
      return;
    }

    // Validate file size
    if (file.size > VALIDATION_RULES.MAX_IMAGE_SIZE) {
      showToast(VALIDATION_MESSAGES.IMAGE_SIZE_EXCEEDED, "error");
      return;
    }

    setIsUploading(true);

    try {
      // Compress image
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 500,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      // Upload image
      const formData = new FormData();
      formData.append("avatar", compressedFile);

      setSelectedImage(URL.createObjectURL(file));

      const response = await post({
        path: "/user/upload-avatar?_method=patch",
        body: formData,
      }).unwrap();

      await refetchAdminProfile();
      showToast("Profile image updated successfully", "success");
    } catch (error) {
      console.error("Error uploading image:", error);
      showToast("Failed to upload image. Please try again.", "error");
      setSelectedImage(adminProfileData?.data?.avatar?.file_url);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle cancel edit
  const handleCancelClick = () => {
    setFormState(initialFormState);
    setIsEditMode(false);
  };

  // Handle edit image button click
  const handleEditImageClick = () => {
    fileInputRef.current.click();
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
      backgroundColor: state.isSelected ? "#FF0000" : provided.backgroundColor,
      color: state.isSelected ? "white" : provided.color,
      "&:hover": {
        backgroundColor: state.isSelected ? "" : "#24A0ED",
        color: "white",
      },
    }),
    control: (provided, state) => ({
      ...provided,
      padding: "0.25rem",
      backgroundColor: "white",
      borderColor: state.isFocused ? "#E53E3E" : "#00000026",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(229, 62, 62, 0.75)" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#E53E3E" : "#D1D5DB",
      },
      borderRadius: "10px",
      width: "24rem",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "black",
    }),
    container: (provided) => ({
      ...provided,
      width: "100%",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#4b5563",
    }),
  };

  return (
    <div className="w-11/12 mx-auto font-poppins">
      <Header
        title="My Profile"
        buttontitle="Edit"
        headerButtonTittle={false}
        setIsEditMode={setIsEditMode}
      />

      <div className="bg-white w-full">
        {/* Profile Header Section */}
        <div className="flex gap-10 pl-[6.2rem] pt-6 items-center">
          <div className="relative">
            {adminProfileLoading || isUploading ? (
              <div className="rounded-full h-44 w-44 border border-gray flex items-center justify-center">
                <div className="h-10 w-10 border-4 border-x-grayCheckbox rounded-full animate-spin duration-1000"></div>
              </div>
            ) : (
              <div className="rounded-full h-44 w-44 border-2 border-grayText">
                <img
                  src={selectedImage || ProfilePhoto}
                  alt="Profile"
                  className="object-cover w-full h-full rounded-full"
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <p className="font-bold text-2xl">
              {formState.firstName && formState.lastName
                ? `${formState.firstName} ${formState.lastName}`
                : "Loading..."}
            </p>
            {/* <p className="font-light">Administrator</p> */}
            <button
              onClick={handleEditImageClick}
              disabled={isUploading}
              className="bg-slate-100 text-sm font-poppins font-semibold py-2 px-4 flex items-center gap-2 rounded-md transform transition-transform duration-300 ease-in-out hover:scale-105 hover:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading..." : "Edit Image"}
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
        <div className="p-6 grid lg:grid-cols-2 grid-cols-1 lg:place-items-center lg:place-content-center place-items-start">
          {formStructure.map((field) => (
            <div key={field.name} className="mb-4 relative capitalize">
              <label className="flex flex-col text-gray-700 text-sm font-bold mb-2">
                {field.label}
              </label>

              {field.type === "select" ? (
                <Select
                  styles={customSelectStyles}
                  placeholder={field.value}
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
                <>
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    placeholder={field.placeholder}
                    className={`border border-grayBorder p-2 w-96 rounded-md text-sm ${
                      !isEditMode && "bg-gray-200"
                    }`}
                    value={formState[field.name] || ""}
                    onChange={(e) => handleChange(e, field)}
                    disabled={!isEditMode || field.disabled}
                  />
                  {field.hasUpdateButton && (
                    <button
                      className="absolute right-0 mt-[1px] w-24 mx-auto text-sm p-2 rounded-r-md custom-Update font-Montserrat text-white font-bold cursor-pointer"
                      onClick={() => setPasswordModal(true)}
                    >
                      Update
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        {isEditMode && (
          <div className="flex justify-end gap-2 mb-6 mr-[6.4rem]">
            <button
              className="p-3 custom-AddButton w-36 text-white rounded-md hover:bg-bloodred"
              onClick={handleSaveEdit}
            >
              Save
            </button>
            <button
              className="p-3 custom-AddButton w-36 text-white rounded-md hover:bg-bloodred"
              onClick={handleCancelClick}
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
