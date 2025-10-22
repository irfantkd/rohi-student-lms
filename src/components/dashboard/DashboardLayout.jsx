import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import SidebarComponent from "./SidebarComponent";
import { useGetQuery } from "../../api/apiSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "../../features/auth/authSlice";
import Loader from "../ui/common/LoaderComponent";

const DashboardLayout = () => {
  const { data, isLoading } = useGetQuery({
    path: "user/get-user",
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setUserData(data?.data));
  }, [data]);

  return (
    <div className="flex w-full bg-midnight">
      <SidebarComponent />
      <div className="flex-grow overflow-x-scroll">
        <Navbar />
        {isLoading ? <Loader /> : <Outlet />}
      </div>
    </div>
  );
};

export default DashboardLayout;
