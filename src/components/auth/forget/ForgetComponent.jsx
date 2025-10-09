import React, { useEffect, useState } from "react";
import CodeLabLogo from "../../../assets/images/SigninImages/logo.png";
import logo from '../../../assets/images/park logo.png'
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { usePostMutation } from "../../../api/apiSlice";
import * as Yup from "yup";
import { useFormik } from "formik";
import ForgetImage from "../../../assets/images/forget/forget illustration rohi.png";
import ForgetImage2 from "../../../assets/images/forget/forget illustration rohi.png";
import ArrowImage from "../../../assets/images/forget/arrow.png";
import { SIGNIN, OTP, ADMINDASHBOARD } from "../../routes/RouteConstants";
import { setCredentials } from "../../../features/auth/authSlice";
const defaultState = {
  email: "",
  // password: "",
};
const ForgetComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passicon, setPassIcon] = useState(false);
  const error = useSelector((state) => state.error.error);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [forget, { isLoading }] = usePostMutation();
  const [imageValue, setImageValue] = useState(true);
  const signInValidation = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
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
      console.log("values", values);
      setFormSubmitted(true);
      validateForm().then(async (validationErrors) => {
        if (Object.keys(validationErrors).length === 0) {
          try {
            const res = await forget({
              path: "/admin/authentication/forget-password",
              body: values,
            }).unwrap();
            console.log("value", values);
            dispatch(setCredentials({ user: res.data, token: res.meta.token }));
            navigate(ADMINDASHBOARD);
          } catch (err) {
            console.error("Failed to forget:", err);
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
    <section className="flex h-screen pt-16 pb-4 md:pt-10">
      <div className="container flex flex-col gap-12 w-full md:w-[60%] md:border-r border-gray-500">
        <div className="flex items-center justify-center md:items-center md:justify-center">
          <img src={logo} alt="logo" className="w-40 md:w-44" />
        </div>
        <form className="flex flex-col gap-5 md:gap-20" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center justify-center gap-1">
            <h1 className="flex items-center gap-2 text-2xl font-semibold sm:text-4xl md:text-4xl">
              Forget Password
            </h1>
            <p className="px-5 text-xs tracking-wide text-center md:text-sm sm:text-center">
              Please enter your Email to your confirmation code
            </p>
          </div>
          <div className="relative flex flex-col gap-3 md:flex md:flex-col md:gap-5 md:w-[60%] md:mx-auto md:items-start">
            <div className="relative w-full">
              <input
                type="email"
                name="email"
                placeholder={errors.email && touched.email ? "" : "E-Mail*"}
                className={`p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 w-full ${
                  errors.email && touched.email && "border-red-500"
                }`}
                value={values.email}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors.email && touched.email && (
                <div className="absolute text-xs font-bold text-red-500 top-1 left-2">
                  {errors.email}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col md:w-[40%] mx-auto ">
            <button
              onClick={() => navigate(OTP)}
              type="submit"
              className="py-3 text-lg font-bold text-center text-white transition duration-300 rounded-lg bg-brown hover:bg-lightbrown"
            >
              Send Code
            </button>
            <div className="flex flex-wrap items-center justify-center gap-5 my-4 ">
              <img src={ArrowImage} alt="" />
              <button
                className="font-semibold text-center border-b border-dotted cursor-pointer"
                onClick={() => navigate(SIGNIN)}
              >
                Back to Login Page
              </button>
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
            <img src={ForgetImage} alt=""  className="animate-pulse"/>
          )}
        </div>
      </div>
    </section>
  );
};

export default ForgetComponent;
