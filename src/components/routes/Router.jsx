import { Navigate, useRoutes } from "react-router-dom";
import { useCheckAuthToken } from "../../hooks/useCheckAuthToken";
import Inventory from "../../inventory/Inventory";
import InventorySummary from "../../inventory/InventorySumary";
import PrivateRoute from "../../utils/PrivateRoutes";
import PublicRoutes from "../../utils/PublicRoutes";
import AttendanceMarkSection from "../AttendanceSection/AttendanceMarkSection";
import Reports from "../Reports/Reports";
import UserManagement from "../UserManagement/UserManagement";
import DashboardComponent from "../adminDashboard/DashboardComponent";
import Announcements from "../announcements/Announcements";
import SignInHero from "../auth/SignIn/SignInHero";
import SignUpHero from "../auth/SignUp/SignUpHero";
import ForgetComponent from "../auth/forget/ForgetComponent";
import NewPasswordComponent from "../auth/newpassword/NewPasswordComponent";
import OtpComponent from "../auth/otpcode/OtpComponent";
import ResetComponent from "../auth/reset/ResetComponent";
import AddBatch from "../batches/components/AddClass";
import CategoriesComponent from "../categories/CategoriesComponent";
import CourseSummary from "../courses/CourseSummary";
import CoursesComponent from "../courses/CoursesComponent";
import DashboardLayout from "../dashboard/DashboardLayout";
import EmployeeSummary from "../employees/EmployeeSummary";
import AddEmployee from "../employees/components/AddEmployee";
import EmployeeDetails from "../employees/employeeDetailsPages/EmployeeDetails";
import CoursesExpenses from "../expenses/CoursesExpenses";
import WsExpenses from "../expenses/WsExpenses";
import ExpenseDetails from "../expenses/components/ExpenseModal";
import FeesComponent from "../fees/FeesComponent";
import FinanceSummary from "../finance/FinanceSummary";
import Course from "../finance/courses/Course";
import WorkingSpace from "../finance/workingspace/WorkingSpace";
import StartupInquiry from "../inquiry/StartupInquiry";
import TrainingInquiry from "../inquiry/trainingInquiry/TrainingInquiry";
import InstructorsComponent from "../instructors/InstructorsComponent";
import InstructorDetailsTab from "../instructors/instructorDetailsPages/InstructorDetailsTab";
import AdminProfile from "../profile/AdminProfile";
import StartupSummary from "../spaces/StartupSummary";
import Company from "../spaces/company/Company";
import CompanyDetails from "../spaces/company/CompanyDetails";
import Individual from "../spaces/individual/Individual";
import IndividualDetails from "../spaces/individual/components/IndividualDetails";
import Managespaces from "../spaces/manageSpaces/Managespaces";
import StudentSummaryPage from "../students/StudentSummaryPage";
import StudentsComponent from "../students/StudentsComponent";
import StudentForm from "../students/addStudentModal/StudentForm.";
import StudentDetails from "../students/studentDetailsPages/StudentDetails";
import {
  ADD_EMPLOYEE,
  ADMINDASHBOARD,
  ANNOUNCEMENTS,
  ATTENDANCE,
  BATCH_CREATE,
  BATCHES,
  CATEGORIES,
  COMPANY,
  COMPANY_DETAIL,
  COURSE,
  Course_EXPENSE_DETAILS,
  COURSE_STUDENTS,
  COURSE_SUMMARY,
  COURSES,
  COURSES_EXPENSES,
  EMPLOYEE,
  EMPLOYEE_SUMMARY,
  EMPLOYEEID,
  ENROLL_STUDENT,
  FEES,
  FINANCE_SUMMARY,
  FORGET,
  INDIVIDUAL,
  INDIVIDUAL_DETAIL,
  INSTRUCTORS,
  INSTRUCTORSID,
  INVENTORY,
  INVENTORY_SUMMARY,
  MANAGE_WORKINGSPACE,
  NEWPASSWORD,
  OTP,
  PROFILE,
  REPORTS,
  RESET,
  SIGNIN,
  SIGNUP,
  STARTUP_INQUIRY,
  STARTUP_SUMMARY,
  STUDENT,
  STUDENT_SUMMARY,
  STUDENTS,
  TRAINING_INQUIRY,
  TRAINING_INQUIRY_COURSE,
  TRAINING_INQUIRY_DETAILS,
  USER_MANAGEMENT,
  WORKINGSPACE,
  WS_EXPENSE_DETAILS,
  WS_EXPENSES,
} from "./RouteConstants";
import InquiryDetailPage from "../inquiry/trainingInquiry/InquiryDetailPage";
import InquiryDetailView from "../inquiry/trainingInquiry/InquiryDetailView";
import CourseStudentsPage from "../courses/components/CourseStudents";
import EmployeesComponent from "../employees/EmployeesComponent";
import ClassesComponent from "../batches/ClassesComponent";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";

export default function Router() {
  //   const user = useSelector(selectCurrentUser);
  // const role = useSelector(selectUserRole);
  const routes = useRoutes([
    { element: <Navigate to={SIGNIN} />, index: true },

    {
      path: ADMINDASHBOARD,
      element: <DashboardLayout />,
      children: [
        {
          index: true,
          path: ADMINDASHBOARD,
          element: (
            <PrivateRoute
              element={<DashboardComponent />}
              isAuthenticated={useCheckAuthToken}
            />
          ),
        },
        // {
        //   path: ADMINDASHBOARD,
        //   element: <DashboardComponent />,
        //   index: true,
        // },
        {
          path: INSTRUCTORS,
          element: (
            <PrivateRoute
              element={<InstructorsComponent />}
              isAuthenticated={useCheckAuthToken}
            />
          ),
        },
        {
          path: INSTRUCTORSID + "/:id",
          element: <InstructorDetailsTab />,
        },

        {
          path: EMPLOYEE,
          element: (
            <PrivateRoute
              element={<EmployeesComponent />}
              isAuthenticated={useCheckAuthToken}
            />
          ),
        },

        {
          path: INSTRUCTORS,
          element: <InstructorsComponent />,
        },
        {
          path: EMPLOYEEID + "/:id",
          element: <EmployeeDetails />,
        },
        {
          path: INDIVIDUAL,
          element: (
            <PrivateRoute
              element={<Individual />}
              isAuthenticated={useCheckAuthToken}
            />
          ),
        },
        {
          path: INDIVIDUAL_DETAIL,
          element: <IndividualDetails />,
        },
        {
          path: COMPANY,
          element: (
            <PrivateRoute
              element={<Company />}
              isAuthenticated={useCheckAuthToken}
            />
          ),
        },
        {
          path: COMPANY_DETAIL,
          element: <CompanyDetails />,
        },
        {
          path: MANAGE_WORKINGSPACE,
          element: <Managespaces />,
        },

        {
          path: CATEGORIES,
          element: (
            <PrivateRoute
              element={<CategoriesComponent />}
              isAuthenticated={useCheckAuthToken}
            />
          ),
        },
        // {
        //   path: CATEGORIES,
        //   element: <CategoriesComponent />,
        // },
        {
          path: COURSES + "/:id",
          element: (
            <PrivateRoute
              element={<CoursesComponent />}
              isAuthenticated={useCheckAuthToken}
            />
          ),
        },
        {
          path: COURSES,
          element: (
            <PrivateRoute
              element={<CoursesComponent />}
              isAuthenticated={useCheckAuthToken}
            />
          ),
        },
        {
          path: COURSE_STUDENTS,
          element: (
            <PrivateRoute
              element={<CourseStudentsPage />}
              isAuthenticated={useCheckAuthToken}
            />
          ),
        },
        // {
        //   path: COURSES,
        //   element: <CoursesComponent />,
        // },
        {
          path: BATCHES + "/:id",
          element: (
            <PrivateRoute
              element={<ClassesComponent />}
              isAuthenticated={useCheckAuthToken}
            />
          ),
        },
        {
          path: BATCHES,
          element: <ClassesComponent />,
        },
        {
          path: BATCH_CREATE,
          element: <AddBatch />,
        },
        {
          path: STUDENTS,
          element: (
            <PrivateRoute
              element={<StudentsComponent />}
              isAuthenticated={useCheckAuthToken}
            />
          ),
        },
        {
          path: STUDENT_SUMMARY,
          element: <StudentSummaryPage />,
        },
        {
          path: COURSE_SUMMARY,
          element: <CourseSummary />,
        },
        {
          path: STARTUP_SUMMARY,
          element: <StartupSummary />,
        },
        {
          path: EMPLOYEE_SUMMARY,
          element: <EmployeeSummary />,
        },
        {
          path: FINANCE_SUMMARY,
          element: <FinanceSummary />,
        },
        {
          path: USER_MANAGEMENT,
          element: <UserManagement />,
        },
        {
          path: REPORTS,
          element: <Reports />,
        },
        {
          path: WORKINGSPACE,
          element: (
            <PrivateRoute
              element={<WorkingSpace />}
              isAuthenticated={useCheckAuthToken}
            />
          ),
        },

        {
          path: COURSE,
          element: (
            <PrivateRoute
              element={<Course />}
              isAuthenticated={useCheckAuthToken}
            />
          ),
        },

        {
          path: WS_EXPENSES,
          element: (
            <PrivateRoute
              element={<WsExpenses />}
              isAuthenticated={useCheckAuthToken}
            />
          ),
        },
        {
          path: COURSES_EXPENSES,
          element: (
            <PrivateRoute
              element={<CoursesExpenses />}
              isAuthenticated={useCheckAuthToken}
            />
          ),
        },
        {
          path: WS_EXPENSE_DETAILS,
          element: (
            <PrivateRoute
              element={<ExpenseDetails type="workspace" />}
              isAuthenticated={useCheckAuthToken}
            />
          ),
        },
        {
          path: Course_EXPENSE_DETAILS,
          element: (
            <PrivateRoute
              element={<ExpenseDetails type="course" />}
              isAuthenticated={useCheckAuthToken}
            />
          ),
        },

        {
          path: INVENTORY,
          element: (
            <PrivateRoute
              element={<Inventory />}
              isAuthenticated={useCheckAuthToken}
            />
          ),
        },

        {
          path: TRAINING_INQUIRY,
          element: (
            <PrivateRoute
              element={<TrainingInquiry />}
              isAuthenticated={useCheckAuthToken}
            />
          ),
        },
        {
          path: TRAINING_INQUIRY_COURSE,
          element: (
            <PrivateRoute
              element={<InquiryDetailPage />}
              isAuthenticated={useCheckAuthToken}
            />
          ),
        },
        {
          path: TRAINING_INQUIRY_DETAILS,
          element: (
            <PrivateRoute
              element={<InquiryDetailView />}
              isAuthenticated={useCheckAuthToken}
            />
          ),
        },
        {
          path: STARTUP_INQUIRY,
          element: (
            <PrivateRoute
              element={<StartupInquiry />}
              isAuthenticated={useCheckAuthToken}
            />
          ),
        },

        // {
        //   path: STUDENTS,
        //   element: <StudentsComponent />,
        // },
        // {
        //   path: FEES,
        //   element: (
        //     <PrivateRoute
        //       element={<FeesComponent />}
        //       isAuthenticated={useCheckAuthToken}
        //     />
        //   ),
        // },
        {
          path: FEES,
          element: <FeesComponent />,
        },

        {
          path: ANNOUNCEMENTS,
          element: (
            <PrivateRoute
              element={<Announcements />}
              isAuthenticated={useCheckAuthToken}
            />
          ),
        },
        // {
        //   path: ANNOUNCEMENTS,
        //   element: <Announcements />,
        // },
        {
          path: PROFILE,
          element: (
            <PrivateRoute
              element={<AdminProfile />}
              isAuthenticated={useCheckAuthToken}
            />
          ),
        },
        // {
        //   path: PROFILE,
        //   element: <AdminProfile />,
        // },
        {
          path: STUDENT + "/:id",
          element: (
            <PrivateRoute
              element={<StudentDetails />}
              isAuthenticated={useCheckAuthToken}
            />
          ),
        },
        {
          path: ENROLL_STUDENT,
          element: (
            <PrivateRoute
              element={<StudentForm />}
              isAuthenticated={useCheckAuthToken}
            />
          ),
        },

        {
          path: ADD_EMPLOYEE,
          element: (
            <PrivateRoute
              element={<AddEmployee />}
              isAuthenticated={useCheckAuthToken}
            />
          ),
        },

        {
          path: ATTENDANCE,
          element: (
            <PrivateRoute
              element={<AttendanceMarkSection />}
              isAuthenticated={useCheckAuthToken}
            />
          ),
        },
        {
          path: INVENTORY_SUMMARY,
          element: (
            <PrivateRoute
              element={<InventorySummary />}
              isAuthenticated={useCheckAuthToken}
            />
          ),
        },
      ],
    },
    {
      path: SIGNIN,
      element: (
        <PublicRoutes
          element={<SignInHero />}
          isAuthenticated={useCheckAuthToken}
        />
      ),
    },
    // {
    //   path: SIGNIN,
    //   element: <SignInHero />,
    // },
    {
      path: SIGNUP,
      element: (
        <PublicRoutes
          element={<SignUpHero />}
          isAuthenticated={useCheckAuthToken}
        />
      ),
    },
    // {
    //   path: SIGNUP,
    //   element: <SignUpHero />,
    // },

    {
      path: FORGET,
      element: (
        <PublicRoutes
          element={<ForgetComponent />}
          isAuthenticated={useCheckAuthToken}
        />
      ),
    },
    // {
    //   path: FORGET,
    //   element: <ForgetComponent />,
    // },
    {
      path: RESET,
      element: <ResetComponent />,
    },

    {
      path: OTP,
      element: (
        <PublicRoutes
          element={<OtpComponent />}
          isAuthenticated={useCheckAuthToken}
        />
      ),
    },
    // {
    //   path: OTP,
    //   element: <OtpComponent />,
    // },
    {
      path: NEWPASSWORD,
      element: (
        <PublicRoutes
          element={<NewPasswordComponent />}
          isAuthenticated={useCheckAuthToken}
        />
      ),
    },
    // {
    //   path: NEWPASSWORD,
    //   element: <NewPasswordComponent />,
    // },
  ]);
  return routes;
}
