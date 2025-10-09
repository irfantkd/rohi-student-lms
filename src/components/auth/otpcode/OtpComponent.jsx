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
import { NEWPASSWORD, SIGNIN } from "../../routes/RouteConstants";
const defaultState = {
  otp1: "",
  otp2: "",
  otp3: "",
  otp4: "",

  // password: "",
};
const OtpComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passicon, setPassIcon] = useState(false);
  const error = useSelector((state) => state.error.error);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [login, { isLoading }] = usePostMutation();
  const [imageValue, setImageValue] = useState(true);
  const signInValidation = Yup.object({
    // email: Yup.string()
    //   .email("Invalid email address")
    //   .required("Email is required"),
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

  const handleNumbersOnly = (e) => {
    const inputValue = e.target.value;
    // Regex to allow only numbers and spaces
    if (/^[0-9--\s]*$/.test(inputValue) && inputValue.length <= 1) {
      handleChange(e);
    }
  };

  return (
    <section className="flex  pt-16 pb-4 md:pt-10 h-screen">
      <div className="container flex flex-col gap-20 w-full md:w-[60%] md:border-r border-gray-500">
        <div className="flex items-center justify-center md:items-center md:justify-center">
          <img src={CodeLabLogo} alt="logo" className="w-48 md:w-64" />
        </div>
        <form
          className="flex flex-col gap-14 md:gap-28"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col items-center justify-center gap-1">
            <h1 className="flex gap-2 items-center sm:text-4xl text-2xl md:text-4xl font-semibold tracking-wider  ">
              Verify your Email
            </h1>
            <p className="text-xs md:text-sm text-center px-5 sm:text-center tracking-wide w-72">
              Please enter the 4 Digit code we sent to abcdef@gmail.com
            </p>
          </div>
          <div className="relative flex  gap-2 md:gap-5 items-center justify-center">
            <div className="relative">
              <input
                type="text"
                name="otp1"
                placeholder={errors.otp1 && touched.otp1 ? "" : ""}
                className={`p-3 border-b-4 border-[#FF0000] rounded-lg focus:outline-none focus:ring-2 text-center text-3xl bg-[#faeeee]   focus:ring-red-600 w-16 h-16  ${
                  errors.otp1 && touched.otp1 && "border-red-500"
                }`}
                value={values.otp1}
                onBlur={handleBlur}
                onChange={handleNumbersOnly}
              />
              {errors.otp1 && touched.otp1 && (
                <div className="text-red-500 absolute top-1 left-2 text-xs font-bold">
                  {errors.otp1}
                </div>
              )}
            </div>
            <div className="relative ">
              <input
                type="text"
                name="otp2"
                placeholder={errors.otp2 && touched.otp2 ? "" : ""}
                className={`p-3 border-b-4  border-[#FF0000] rounded-lg focus:outline-none bg-[#faeeee] focus:ring-2 w-16 h-16 text-center text-3xl   focus:ring-red-600 ${
                  errors.otp2 && touched.otp2 && "border-red-500"
                }`}
                value={values.otp2}
                onBlur={handleBlur}
                onChange={handleNumbersOnly}
              />
              {errors.otp2 && touched.otp2 && (
                <div className="text-red-500 absolute top-1 left-2 text-xs font-bold">
                  {errors.otp2}
                </div>
              )}
            </div>
            <div className="relative ">
              <input
                type="text"
                name="otp3"
                placeholder={errors.otp3 && touched.otp3 ? "" : ""}
                className={`p-3 border-b-4  border-[#FF0000] rounded-lg focus:outline-none bg-[#faeeee] focus:ring-2 w-16 h-16 text-center text-3xl  focus:ring-red-600 ${
                  errors.otp3 && touched.otp3 && "border-red-500"
                }`}
                value={values.otp3}
                onBlur={handleBlur}
                onChange={handleNumbersOnly}
              />
              {errors.otp3 && touched.otp3 && (
                <div className="text-red-500 absolute top-1 left-2 text-xs font-bold">
                  {errors.otp3}
                </div>
              )}
            </div>
            <div className="relative ">
              <input
                type="text"
                name="otp4"
                placeholder={errors.otp4 && touched.otp4 ? "" : ""}
                className={`p-3 border-b-4  border-[#FF0000] rounded-lg focus:outline-none bg-[#faeeee] focus:ring-2 w-16 h-16 text-center text-3xl  focus:ring-red-600 ${
                  errors.otp4 && touched.otp4 && "border-red-500"
                }`}
                value={values.otp4}
                onBlur={handleBlur}
                onChange={handleNumbersOnly}
              />
              {errors.otp4 && touched.otp4 && (
                <div className="text-red-500 absolute top-1 left-2 text-xs font-bold">
                  {errors.otp4}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col w-40 md:w-48 mx-auto ">
            <button
              onClick={() => navigate(NEWPASSWORD)}
              type="submit"
              className="py-3 bg-red-600 text-lg text-center text-white font-bold rounded-lg hover:bg-red-700 transition duration-300"
            >
              Verify
            </button>
            <div className="flex flex-wrap gap-5 items-center justify-center my-4 ">
              {/* <img src={ArrowImage} alt="" /> */}
              <button
                onClick={() => navigate(SIGNIN)}
                className="text-center cursor-pointer border-b border-dotted font-semibold"
              >
                Resend Code
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
            <img src={ForgetImage} alt="" />
          )}
        </div>
      </div>
    </section>
  );
};

export default OtpComponent;
