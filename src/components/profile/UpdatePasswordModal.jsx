// import React, { useState } from "react";
// import { usePatchMutation, usePostMutation } from "../../api/apiSlice";
// import * as Yup from "yup";
// import { useFormik } from "formik";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import CloseIcon from "../../assets/icons/Close";

// const defaultState = {
//   current_password: "",
//   password: "",
//   password_confirmation: "",
// };

// const UpdatePasswordModal = ({ setPasswordModal, passwordModal }) => {
//   const [oldPassicon, setOldPassIcon] = useState(false);
//   const [newPassicon, setNewPassIcon] = useState(false);
//   const [confirmPassicon, setConfirmPassIcon] = useState(false);

//   const [formSubmitted, setFormSubmitted] = useState(false);
//   const [updatePassword, { isLoading }] = usePostMutation();
//   const [patch] = usePatchMutation();

//   const signInValidation = Yup.object({
//     password: Yup.string()
//       .min(8, "New Password must be at least 8 characters")
//       .required("New Password is required"),
//     current_password: Yup.string().required("Old Password is required"),
//     password_confirmation: Yup.string()
//       .oneOf(
//         [Yup.ref("password"), null],
//         "Confirm Password must match New Password"
//       )
//       .min(8, "Confirm Password must be at least 8 characters")
//       .required("Confirm Password is required"),
//   });

//   const {
//     handleBlur,
//     handleChange,
//     handleSubmit,
//     values,
//     errors,
//     validateForm,
//     touched,
//     setSubmitting,
//     resetForm,
//   } = useFormik({
//     initialValues: defaultState,
//     validationSchema: signInValidation,
//     validateOnChange: true,
//     validateOnBlur: true,
//     onSubmit: (values, { setSubmitting, resetForm }) => {
//       setFormSubmitted(true);
//       validateForm().then(async (validationErrors) => {
//         if (Object.keys(validationErrors).length === 0) {
//           try {
//             const res = await patch({
//               path: "/user/password",
//               body: values,
//             }).unwrap();
//             console.log("value", values);
//           } catch (err) {
//             console.error("Failed to login:", err);
//           } finally {
//             setSubmitting(false);
//             resetForm();
//           }
//         } else {
//           setSubmitting(false);
//         }
//       });
//     },
//   });
//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 ">
//       <div className="bg-white p-3 rounded-[10px] shadow-lg ">
//         <div className="flex justify-end">
//           <button onClick={() => setPasswordModal(false)}>
//             <CloseIcon />
//           </button>
//         </div>
//         <form
//           className="flex flex-col gap-5 md:gap-10 w-full my-5 px-6"
//           onSubmit={handleSubmit}
//         >
//           <div className="flex flex-col items-center justify-center gap-1">
//             <h1 className="flex gap-2 items-center font-Montserrat tracking-wide text-2xl">
//               Update Password
//             </h1>
//             {/* <p className="text-xs md:text-sm text-center px-5 sm:text-center tracking-wide w-[50%]">
//               Your new password must be different from previously used password
//             </p> */}
//           </div>
//           <div className="relative flex flex-col gap-3 md:flex md:flex-col md:gap-5 md:mx-auto md:items-start">
//             <div className="relative w-full">
//               <input
//                 type={oldPassicon ? "text" : "password"}
//                 name="current_password"
//                 placeholder={
//                   errors.current_password && touched.current_password
//                     ? ""
//                     : "Old Password*"
//                 }
//                 className={`p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 w-96  ${
//                   errors.current_password &&
//                   touched.current_password &&
//                   "border-red-500"
//                 }`}
//                 value={values.current_password}
//                 onBlur={handleBlur}
//                 onChange={handleChange}
//               />
//               {errors.current_password && touched.current_password && (
//                 <div className="text-red-500 absolute top-1 left-2 text-xs font-bold">
//                   {errors.current_password}
//                 </div>
//               )}
//               <span className="absolute right-4 top-4 cursor-pointer">
//                 {oldPassicon ? (
//                   <FaEyeSlash
//                     className="text-xl"
//                     onClick={() => setOldPassIcon(!oldPassicon)}
//                   />
//                 ) : (
//                   <FaEye
//                     className="text-xl"
//                     onClick={() => setOldPassIcon(!oldPassicon)}
//                   />
//                 )}
//               </span>
//             </div>
//             <div className="relative w-full">
//               <input
//                 type={newPassicon ? "text" : "password"}
//                 name="password"
//                 placeholder={
//                   errors.password && touched.password ? "" : "New Password*"
//                 }
//                 className={`p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 w-96 ${
//                   errors.password && touched.password && "border-red-500"
//                 }`}
//                 value={values.password}
//                 onBlur={handleBlur}
//                 onChange={handleChange}
//               />
//               {errors.password && touched.password && (
//                 <div className="text-red-500 absolute top-1 left-2 text-xs font-bold">
//                   {errors.password}
//                 </div>
//               )}
//               <span className="absolute right-4 top-4 cursor-pointer">
//                 {newPassicon ? (
//                   <FaEyeSlash
//                     className="text-xl"
//                     onClick={() => setNewPassIcon(!newPassicon)}
//                   />
//                 ) : (
//                   <FaEye
//                     className="text-xl"
//                     onClick={() => setNewPassIcon(!newPassicon)}
//                   />
//                 )}
//               </span>
//             </div>
//             <div className="relative w-full">
//               <input
//                 type={confirmPassicon ? "text" : "password"}
//                 name="password_confirmation"
//                 placeholder={
//                   errors.password_confirmation && touched.password_confirmation
//                     ? ""
//                     : "Confirm Password*"
//                 }
//                 className={`p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 w-96 ${
//                   errors.password_confirmation &&
//                   touched.password_confirmation &&
//                   "border-red-500"
//                 }`}
//                 value={values.password_confirmation}
//                 onBlur={handleBlur}
//                 onChange={handleChange}
//               />
//               {errors.password_confirmation &&
//                 touched.password_confirmation && (
//                   <div className="text-red-500 absolute top-1 left-2 text-xs font-bold">
//                     {errors.password_confirmation}
//                   </div>
//                 )}
//               <span className="absolute right-4 top-4 cursor-pointer">
//                 {confirmPassicon ? (
//                   <FaEyeSlash
//                     className="text-xl"
//                     onClick={() => setConfirmPassIcon(!confirmPassicon)}
//                   />
//                 ) : (
//                   <FaEye
//                     className="text-xl"
//                     onClick={() => setConfirmPassIcon(!confirmPassicon)}
//                   />
//                 )}
//               </span>
//             </div>
//           </div>
//           <div className="flex gap-4 items-center justify-center ">
//             <button className=" rounded-[10px] font-Montserrat  w-36 p-2 custom-Update text-white">
//               {" "}
//               Save
//             </button>
//             <button
//               className=" rounded-[10px] font-Montserrat bg-buttonGray w-36 p-2"
//               onClick={() => setPasswordModal(false)}
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UpdatePasswordModal;
import React, { useState } from "react";
import { usePatchMutation, usePostMutation } from "../../api/apiSlice";
import * as Yup from "yup";
import { useFormik } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import CloseIcon from "../../assets/icons/Close";
import { showToast } from "../ui/common/ShowToast";

const defaultState = {
  current_password: "",
  password: "",
  password_confirmation: "",
};

// Password validation schema
const passwordValidationSchema = Yup.object({
  current_password: Yup.string().required("Current password is required"),
  password: Yup.string()
    .min(8, "New password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .notOneOf(
      [Yup.ref("current_password")],
      "New password must be different from current password"
    )
    .required("New password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your new password"),
});

const UpdatePasswordModal = ({ setPasswordModal, passwordModal }) => {
  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [patch, { isLoading }] = usePostMutation();

  // Formik form handling
  const formik = useFormik({
    initialValues: defaultState,
    validationSchema: passwordValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await patch({
          path: "/user/password",
          body: values,
        }).unwrap();

        // Check for successful response
        if (response.status === 1 || response.message === "Success.") {
          showToast("Password updated successfully", "success");
          resetForm();
          setPasswordModal(false);
        } else {
          showToast(response.message || "Failed to update password", "error");
        }
      } catch (error) {
        console.error("Failed to update password:", error);
        const errorMessage =
          error?.data?.message ||
          error?.message ||
          "Failed to update password. Please try again.";
        showToast(errorMessage, "error");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const { handleBlur, handleChange, handleSubmit, values, errors, touched } =
    formik;

  // Handle modal close
  const handleClose = () => {
    formik.resetForm();
    setPasswordModal(false);
  };

  // Password input field configuration
  const passwordFields = [
    {
      name: "current_password",
      label: "Current Password",
      placeholder: "Enter your current password",
      showPassword: showCurrentPassword,
      setShowPassword: setShowCurrentPassword,
    },
    {
      name: "password",
      label: "New Password",
      placeholder: "Enter your new password",
      showPassword: showNewPassword,
      setShowPassword: setShowNewPassword,
    },
    {
      name: "password_confirmation",
      label: "Confirm New Password",
      placeholder: "Confirm your new password",
      showPassword: showConfirmPassword,
      setShowPassword: setShowConfirmPassword,
    },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 font-Montserrat">
            Update Password
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
            type="button"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Info Text */}
          <p className="text-sm text-gray-600 mb-6 text-center">
            Your new password must be different from your current password and
            contain at least 8 characters with uppercase, lowercase, and
            numbers.
          </p>

          {/* Password Fields */}
          <div className="space-y-5">
            {passwordFields.map((field) => (
              <div key={field.name} className="relative">
                <label
                  htmlFor={field.name}
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    id={field.name}
                    type={field.showPassword ? "text" : "password"}
                    name={field.name}
                    placeholder={
                      errors[field.name] && touched[field.name]
                        ? ""
                        : field.placeholder
                    }
                    className={`w-full p-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors[field.name] && touched[field.name]
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-red-600"
                    }`}
                    value={values[field.name]}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    autoComplete={
                      field.name === "current_password"
                        ? "current-password"
                        : "new-password"
                    }
                  />

                  {/* Eye Icon */}
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => field.setShowPassword(!field.showPassword)}
                  >
                    {field.showPassword ? (
                      <FaEyeSlash className="text-xl" />
                    ) : (
                      <FaEye className="text-xl" />
                    )}
                  </button>

                  {/* Error Message */}
                  {errors[field.name] && touched[field.name] && (
                    <p className="text-red-500 text-xs mt-1 animate-pulse">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Password Requirements */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-700 mb-2">
              Password Requirements:
            </p>
            <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
              <li>At least 8 characters long</li>
              <li>Contains uppercase and lowercase letters</li>
              <li>Contains at least one number</li>
              <li>Different from current password</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={isLoading || !formik.isValid}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                "Update Password"
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordModal;
