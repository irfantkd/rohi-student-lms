import { ToastContainer } from "react-toastify";
import Router from "./components/routes/Router";
// import { useEffect, useState } from "react";
// import { useGetQuery } from "./api/apiSlice";

function App() {
  // const [adminProfileImage, setAdminProfileImage] = useState(() => {
  //   // Retrieve image from local storage on initial load
  //   return localStorage.getItem("adminProfileImage") || null;
  // });

  // const {
  //   data: adminProfileData,
  //   error: adminProfileError,
  //   isLoading: adminProfileLoading,
  //   refetch: refetchAdminProfiles,
  // } = useGetQuery({
  //   path: "/admin/",
  // });

  // console.log("adminProfileData", adminProfileData?.data?.avatar?.file_url);
  // useEffect(() => {
  //   if (adminProfileData?.data?.avatar?.file_url) {
  //     setAdminProfileImage(adminProfileData?.data?.avatar?.file_url);
  //     // Store image in local storage
  //     localStorage.setItem(
  //       "adminProfileImage",
  //       adminProfileData?.data?.avatar?.file_url
  //     );
  //   }
  // }, [adminProfileData]);

  return (
    <>
      <Router  />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        // theme="colored"
        transition:Bounce
      />
    </>
  );
}

export default App;
