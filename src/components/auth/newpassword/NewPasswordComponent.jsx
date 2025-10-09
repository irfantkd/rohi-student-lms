import React, { useEffect, useState } from "react";
import CodeLabLogo from "../../../assets/images/SigninImages/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { usePostMutation } from "../../../api/apiSlice";
import * as Yup from "yup";
import { useFormik } from "formik";
import ForgetImage from "../../../assets/images/forget/ezgif.com-video-to-gif-converter.gif";
import ForgetImage2 from "../../../assets/images/forget/Forgotpassword1-ezgif.com-video-to-gif-converter.gif";
import ArrowImage from "../../../assets/images/forget/arrow.png";
import { SIGNIN, NEWPASSWORD } from "../../routes/RouteConstants";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { setCredentials } from "../../../features/auth/authSlice";
const defaultState = {
  password_confirmation: "",
  password: "",
};
const ForgetComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passicon, setPassIcon] = useState(false);
  const error = useSelector((state) => state.error.error);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [login, { isLoading }] = usePostMutation();
  const [imageValue, setImageValue] = useState(true);
  const signInValidation = Yup.object({
    password_confirmation: Yup.string()
      .min(8, "Confirm Password must be at least 8 characters")
      .required("Confirm Password is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setImageValue(false);
    }, 2000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [imageValue]);
  const {
    handleBlur,
    handleChange,
    handleSubmit,
    values,
    errors,
    validateForm,
    touched,
    setSubmitting,
    resetForm,
  } = useFormik({
    initialValues: defaultState,
    validationSchema: signInValidation,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setFormSubmitted(true);
      validateForm().then(async (validationErrors) => {
        if (Object.keys(validationErrors).length === 0) {
          try {
            const res = await login({
              path: "admin/authentication/login",
              body: values,
            }).unwrap();
            console.log("value", values);
            dispatch(setCredentials({ user: res.data, token: res.meta.token }));
            navigate(ADMINDASHBOARD);
          } catch (err) {
            console.error("Failed to login:", err);
          } finally {
            setSubmitting(false);
            resetForm();
          }
        } else {
          setSubmitting(false);
        }
      });
    },
  });
  return (
    <section className="flex pt-16 pb-4 md:pt-10 h-screen">
      <div className="container flex flex-col gap-12 w-full md:w-[60%] md:border-r border-gray-500">
        <div className="flex items-center justify-center md:items-center md:justify-center">
          <img src={CodeLabLogo} alt="logo" className="w-48 md:w-64" />
        </div>
        <form className="flex flex-col gap-5 md:gap-20" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center justify-center gap-1">
            <h1 className="flex gap-2 items-center sm:text-4xl text-2xl md:text-4xl font-semibold">
              New Password
            </h1>
            <p className="text-xs md:text-sm text-center px-5 sm:text-center tracking-wide">
              Your new password must be differnet from previously used password
            </p>
          </div>
          <div className="relative flex flex-col gap-3 md:flex md:flex-col md:gap-5 md:w-[60%] md:mx-auto md:items-start">
            <div className="relative w-full">
              <input
                type={passicon ? "text" : "password"}
                name="password"
                placeholder={
                  errors.password && touched.password ? "" : "New Password*"
                }
                className={`p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 w-full ${
                  errors.password && touched.password && "border-red-500"
                }`}
                value={values.password}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors.password && touched.password && (
                <div className="text-red-500 absolute top-1 left-2 text-xs font-bold">
                  {errors.password}
                </div>
              )}
              <span className="absolute right-4 top-4 cursor-pointer">
                {passicon ? (
                  <FaEyeSlash
                    className="text-xl"
                    onClick={() => setPassIcon(!passicon)}
                  />
                ) : (
                  <FaEye
                    className="text-xl"
                    onClick={() => setPassIcon(!passicon)}
                  />
                )}
              </span>
            </div>
            <div className="relative w-full">
              <input
                type={passicon ? "text" : "password"}
                name="password_confirmation"
                placeholder={
                  errors.password_confirmation && touched.password_confirmation
                    ? ""
                    : "Confirm Password*"
                }
                className={`p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 w-full ${
                  errors.password_confirmation &&
                  touched.password_confirmation &&
                  "border-red-500"
                }`}
                value={values.password_confirmation}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors.password_confirmation &&
                touched.password_confirmation && (
                  <div className="text-red-500 absolute top-1 left-2 text-xs font-bold">
                    {errors.password_confirmation}
                  </div>
                )}
              <span className="absolute right-4 top-4 cursor-pointer">
                {passicon ? (
                  <FaEyeSlash
                    className="text-xl"
                    onClick={() => setPassIcon(!passicon)}
                  />
                ) : (
                  <FaEye
                    className="text-xl"
                    onClick={() => setPassIcon(!passicon)}
                  />
                )}
              </span>
            </div>
          </div>
          <div className="flex flex-col md:w-[40%] mx-auto ">
            <Link
              to={NEWPASSWORD}
              type="submit"
              className="py-3 bg-red-600 text-center text-lg text-white font-bold rounded-lg hover:bg-red-700 transition duration-300"
            >
              Send Code
            </Link>
            <div className="flex flex-wrap gap-5 items-center justify-center my-4 ">
              <img src={ArrowImage} alt="" />
              <Link
                to={SIGNIN}
                className="text-center cursor-pointer border-b border-dotted font-semibold"
              >
                Back to Login Page
              </Link>
            </div>
          </div>
        </form>
        {error && (
          <div className="error">
            {error.title}: {error.description}
          </div>
        )}
      </div>
      <div className="container mx-auto md:mt-24 md:pr-16 lg:mt-20 lg:pr-28 w-[40%] hidden md:block">
        <div className="mx-auto">
          {imageValue ? (
            <img src={ForgetImage2} alt="" />
          ) : (
            <img src={ForgetImage} alt="" />
          )}
        </div>
      </div>
    </section>
  );
};

export default ForgetComponent;
