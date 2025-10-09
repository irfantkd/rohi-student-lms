/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Instructors from "./components/Instructors";
import AttendanceChart from "./components/AttendenceChart";
import { useGetQuery } from "../../api/apiSlice";
import hostelImage from "../../assets/images/adminDashboard/hostel.png";
import HomeImage from "../../assets/images/adminDashboard/Home.png";
import Student from "../../assets/images/adminDashboard/student.png";
import StudentsStats from "../dashboard/StudentsStats";
import StudentFeeStats from "../dashboard/StudentFeeStats";
import FeeChart from "../dashboard/FeeStats";
import BatchStats from "../dashboard/BatchStats";
import StartsupsStats from "../dashboard/StartsupsStats";
import CoursesStats from "../dashboard/CoursesStats";
import RentStats from "../dashboard/RentStats";
import StudentPercentageStats from "../dashboard/StudentPercentageStats";
import EnrollmentChart from "./EnrollmentChart";
import TotalStats from "./components/TotalStats";
import Inventory from "../../inventory/Inventory";
import InventoryStats from "../dashboard/InventoryStats";
import EmployeeDetails from "../employees/employeeDetailsPages/EmployeeDetails";
import EmployeeStats from "./components/EmployeeStats";
import CompletionStats from "../dashboard/CompletionStats";
import { useNavigate } from "react-router-dom";

const DashboardComponent = () => {
  const navigate = useNavigate()
  const { data, error, isLoading, refetch } = useGetQuery({
    path: "/admin/dashboard",
  });
  console.log(data, "dashboard data");

  const {
    data: adminProfileData,
    error: adminProfileError,
    isLoading: adminProfileLoading,
    refetch: refetchAdminProfiles,
  } = useGetQuery({
    path: "/admin",
  });

  const getPercentage = (value, total) => {
    if (!total || isNaN(value) || isNaN(total) || total === 0) return 0;
    const percentage = (value / total) * 100;
    return percentage > 100 ? 100 : percentage < 0 ? 0 : percentage;
  };

  console.log("adminProfileData", adminProfileData?.data?.avatar?.file_url);
  useEffect(() => {
    if (adminProfileData?.data?.avatar?.file_url) {
      // Store image in local storage
      localStorage.setItem(
        "adminProfileImage",
        adminProfileData?.data?.avatar?.file_url
      );
    }
  }, [adminProfileData]);

  const dashboardData = data?.data;
  console.log("dashboardData", dashboardData);

  useEffect(() => {
    refetch();
  }, []);

  const totalDropouts =
    data?.data?.drop_outs?.daily_dropout_count +
    data?.data?.drop_outs?.weekly_dropout_count +
    data?.data?.drop_outs?.monthly_dropout_count;

  const dashboardDataa = [
    {
      title: "Male Students",
      percentage: getPercentage(
        data?.data?.students?.total_male_students,
        data?.data?.students?.all_students
      ),
      color: "#0C72EB",
    }, 
    {
      title: "Female Students",
      percentage: getPercentage(
        data?.data?.students?.total_female_students,
        data?.data?.students?.all_students
      ),
      color: "#CF4688",
    }, 
    {
      title: "Military Male",
      percentage: getPercentage(
        data?.data?.students?.total_female_students,
        data?.data?.students?.all_students
      ),
      color: "#1A834B",
    },
    {
      title: "Military Female",
      percentage: getPercentage(
        data?.data?.students?.total_female_students,
        data?.data?.students?.all_students
      ),
      color: "#623CB7",
    }, 
    {
      title: "Dropout Students",
      percentage: getPercentage(
        totalDropouts,
        data?.data?.students.all_students
      ),
      color: "#D74747",
    },
    {
      title: "Total Students",
      percentage: 100.0,
      color: "#002558",
    }, 
  ];

  const paid = data?.data?.fee?.paid_students || 0;
  const unpaid = data?.data?.fee?.unpaid_students || 0;

  const studentCategoryData = [
    {
      label: "Non-Hostelites Students",
      percentage: getPercentage(
        data?.data?.students?.total_non_hostelized_students,
        data?.data?.students?.all_students
      ),
      color: "#D97224",
      bgColor: "#F56565",
      icon: HomeImage,
    },
    {
      label: "Hostelites Students",
      percentage: getPercentage(
        data?.data?.students?.all_hostelized_students,
        data?.data?.students?.all_students
      ),
      color: "#D74747",
      bgColor: "#C4A484",
      icon: hostelImage,
    },
    {
      label: "Free Students",
      percentage: 60,
      color: "#5BB9B5",
      bgColor: "#31918d",
      icon: Student,
    },
  ];

  return (
    <div className="flex flex-col bg-midnight">
      <div className="px-12 pb-12">
        <div className="mb-10 text-2xl font-semiboldd text-heading font-poppins">
          Admin Dashboard
        </div>
        <TotalStats/>
         <div 
         onClick={() => navigate('/dashboard/course-summary')}
         className="grid grid-cols-1 gap-4 my-6">
          <h1 className="my-2 text-xl font-medium cursor-pointer">
            Course Enrollment Summary
          </h1>
     
            <CoursesStats />
         
        </div>

        
        <div className="grid grid-cols-1 xl:grid-cols-[30%_70%] gap-4 my-6">
          <div onClick={() => navigate('/dashboard/finance-summary')}>
            <h1 className="my-3 text-xl font-medium">Fee Summary</h1>
            <StudentFeeStats data={{ paid: paid, unpaid: unpaid }} />
          </div>
          <div  onClick={() => navigate('/dashboard/finance-summary')}>
            <h1 className="my-4 text-xl font-medium">Fee Collection</h1>
            <FeeChart fee={data?.data?.fee} />
          </div>
        </div>
        
        
      

        <div onClick={() => navigate('/dashboard/employee-summary')}>
          <EmployeeStats/>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-[40%_60%] gap-4 my-4">
           <div className="mt-2">
            <h1 className="my-2 text-xl font-medium">Completion Rate</h1>
          <CompletionStats/>
           </div>
          <div
           onClick={() => navigate('/dashboard/startup-summary')}
          className="mt-2">
            <h1 className="my-2 text-xl font-medium">Startups</h1>
            <StartsupsStats />
          </div>
        
        </div>
        <div 
         onClick={() => navigate('/dashboard/startup-summary')}
        className="grid grid-cols-2 gap-4">
            <div>
            <h1 className="my-2 text-xl font-medium">Rent Payment </h1>
            <RentStats />
          </div>
       <div onClick={() => navigate('/dashboard/inventory-summary')}>
           <h1 className="my-2 text-xl font-medium">Inventory</h1>
           <InventoryStats/>
       </div>
        </div>
       
        
      </div>
    </div>
  );
};

export default DashboardComponent;
