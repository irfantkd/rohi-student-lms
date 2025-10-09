/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  INSTRUCTORS,
  STUDENTS,
  ADMINDASHBOARD,
  CATEGORIES,
  COURSES,
  BATCHES,
  SIGNIN,
  FEES,
  ANNOUNCEMENTS,
  EMPLOYEE,
  ATTENDANCE,
  COMPANY,
  INDIVIDUAL,
  STARTUP_SUMMARY,
} from "../routes/RouteConstants";
import Categories from "../../assets/icons/navbar/Categories";
import StudentsIcon from "../../assets/icons/navbar/students";
import IconHome from "../../assets/icons/navbar/home";
import InstructorsIcon from "../../assets/icons/navbar/Instructors";
import BatchesIcon from "../../assets/icons/navbar/Batches";
import LogoutIcon from "../../assets/icons/navbar/Logout";
import CloseMenu from "../../assets/icons/navbar/CloseMenu";
import MenuIcon from "../../assets/icons/navbar/Menu";
import ArrowUp from "../../assets/icons/navbar/ArrowUp";
import ArrowDown from "../../assets/icons/navbar/ArrowDown";
import logo from "../../assets/images/park logo.png";
import coursesIcon from "../../assets/images/navbar/courses.png";
import coursesRedIcon from "../../assets/images/navbar/coursesRed.png";
import announcement from "../../assets/images/navbar/announcement.png";
import announcementRed from "../../assets/images/navbar/announcementRed.png";
import { useDispatch, useSelector } from "react-redux";
import { clearCredentials } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showToast } from "../ui/common/ShowToast";

const Sidebar = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [submenuItemHovered, setSubmenuItemHovered] = useState(null);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [studentsExpanded, setStudentsExpanded] = useState(false);
  const [instructorsExpanded, setInstructorsExpanded] = useState(false);
  const [spacesExpanded, setSpacesExpanded] = useState(false);

  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedSubMenu, setSelectedSubMenu] = useState(null);

  const handleMenuItemClick = (route, isSubMenu = false) => {
    if (!isSubMenu) {
      localStorage.setItem("selectedMenu", route);
      setSelectedSubMenu(null);
    }
    navigate(route);
  };

  useEffect(() => {
    const storedMenu = localStorage.getItem("selectedMenu");
    console.log("storedMenu", storedMenu);

    if (storedMenu) {
      setSelectedMenu(storedMenu);
    }

    // Check if the current route is a sub-route and set the correct state
    studentSubmenuItems.forEach((subItem) => {
      if (location.pathname.includes(subItem.route)) {
        setSelectedMenu("Students");
        setSelectedSubMenu(subItem.route);
        setStudentsExpanded(true);
      }
    });

    instructorSubMenuItems.forEach((subItem) => {
      if (location.pathname.includes(subItem.route)) {
        setSelectedMenu("Team Members");
        setSelectedSubMenu(subItem.route);
        setInstructorsExpanded(true);
      }
    });

    spacesSubMenuItems.forEach((subItem) => {
      if (location.pathname.includes(subItem.route)) {
        setSelectedMenu("Working Spaces");
        setSelectedSubMenu(subItem.route);
        setSpacesExpanded(true);
      }
    });
  }, [location]);

  const menuItems = [
    { route: ADMINDASHBOARD, label: "Dashboard", icon: <IconHome /> },
    { route: CATEGORIES, label: "Categories", icon: <Categories /> },
    {
      route: COURSES,
      label: "Courses",
      icon:
        hovered === COURSES || selectedMenu === "Courses" ? (
          <img src={coursesRedIcon} width="35" height="33" />
        ) : (
          <img src={coursesIcon} width="35" height="33" />
        ),
    },
    { route: BATCHES, label: "Batches", icon: <BatchesIcon /> },
    {
      route: INSTRUCTORS,
      label: "Team Members",
      icon: <InstructorsIcon />,
      expandable: true,
    },
    {
      route: STUDENTS,
      label: "Students",
      icon: <StudentsIcon />,
      expandable: true,
    },
    {
      route: COMPANY,
      label: "Working Spaces",
      icon: <StudentsIcon />,
      expandable: true,
    },
    {
      route: ANNOUNCEMENTS,
      label: "Announcements",
      icon:
        hovered === ANNOUNCEMENTS || selectedMenu === "Announcements" ? (
          <img src={announcementRed} width="35" height="33" />
        ) : (
          <img src={announcement} width="35" height="33" />
        ),
    },
    { route: ATTENDANCE, label: "Attendance", icon: <IconHome /> },
  ];

  const studentSubmenuItems = [
    { route: STUDENTS, label: "Students" },
    { route: FEES, label: "Fees" },
  ];

  const instructorSubMenuItems = [
    { route: EMPLOYEE, label: "Tech Team" },
    { route: INSTRUCTORS, label: "Tech Trainers" },
  ];

  const spacesSubMenuItems = [
    { route: STARTUP_SUMMARY, label: "Startup Summary" },
    { route: COMPANY, label: "Company" },
    { route: INDIVIDUAL, label: "Individual" },
  ];

  return (
    <div className="sticky top-0 flex flex-shrink-0 overflow-y-auto text-white transition-all duration-300 bg-white rounded-r-3xl h-fit">
      <div className="flex flex-col custom-Sidebar rounded-r-3xl h-max-content">
        <div
          className="flex items-center justify-center p-4 mt-5 mb-8 cursor-pointer"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <MenuIcon className="w-6 h-6 text-white" />
          ) : (
            <CloseMenu className="w-6 h-6 text-white" />
          )}
        </div>
        <div className="flex-grow text-white">
          <ul>
            {menuItems.map((item) => (
              <li
                key={item.route}
                className="flex items-center h-12 py-2 mt-4 mb-12 cursor-pointer"
                onClick={() => {
                  if (item.expandable) {
                    if (item.label === "Students") {
                      setStudentsExpanded(!studentsExpanded);
                    } else if (item.label === "Team Members") {
                      setInstructorsExpanded(!instructorsExpanded);
                    } else if (item.label === "Working Spaces") {
                      setSpacesExpanded(!spacesExpanded);
                    }
                  } else {
                    handleMenuItemClick(item.route);
                    setSelectedMenu(item.label);
                    localStorage.setItem("selectedMenu", item.label);
                  }
                }}
                onMouseEnter={() => setHovered(item.route)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="flex items-center justify-center px-4 py-1 group">
                  <div
                    className={`rounded-2xl w-[47px] h-[47px] flex items-center justify-center ${
                      hovered === item.route ? " bg-white" : ""
                    } ${selectedMenu === item.label ? "bg-white" : ""}`}
                  >
                    <div
                      className={`group-hover:text-brown ${
                        hovered === item.route ? "text-brown" : ""
                      } ${selectedMenu === item.label ? "text-beige" : ""}`}
                    >
                      {item.icon}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div
          className="flex items-center h-12 py-2 my-4 mt-auto cursor-pointer"
          onClick={() => {
            dispatch(clearCredentials());
            showToast("Logout Successfully", "success");
            handleMenuItemClick(SIGNIN);
          }}
          onMouseEnter={() => setHovered("LOGOUT")}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="flex items-center justify-center px-4 group">
            <div
              className={`rounded-2xl w-[47px] h-[47px] flex items-center justify-center ${
                hovered === "LOGOUT" ? "bg-white" : ""
              }`}
            >
              <LogoutIcon
                className={`group-hover:text-brown ${
                  hovered === "LOGOUT" ? "text-brown" : ""
                }`}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className={`transition-all duration-700 ${
          collapsed
            ? "max-w-0 opacity-0 invisible"
            : "max-w-60 opacity-100 visible"
        }`}
      >
        <nav className="flex flex-col w-48 bg-white rounded-r-3xl">
          <div className="px-4">
            <img
              className="object-cover w-[60%] h-full mx-auto"
              src={logo}
              alt="logo"
            />
          </div>
          <div className="flex-grow overflow-y-auto">
            <ul>
              {menuItems.map((item) => (
                <React.Fragment key={item.route}>
                  <li
                    className={`flex group items-center h-12 hover:rounded-xl pl-4 py-2 m-4 cursor-pointer ${
                      hovered === item.route ? "custom-Navbar rounded-xl" : ""
                    } ${
                      selectedMenu === item.label ? "custom-Navbar rounded-xl" : ""
                    }`}
                    onClick={() => {
                      if (item.expandable) {
                        if (item.label === "Students") {
                          setStudentsExpanded(!studentsExpanded);
                        } else if (item.label === "Team Members") {
                          setInstructorsExpanded(!instructorsExpanded);
                        } else if (item.label === "Working Spaces") {
                          setSpacesExpanded(!spacesExpanded);
                        }
                      } else {
                        handleMenuItemClick(item.route);
                        setSelectedMenu(item.label);
                        localStorage.setItem("selectedMenu", item.label);
                      }
                    }}
                    onMouseEnter={() => setHovered(item.route)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div
                      className={`text-heading group-hover:text-white leading-6 font-poppins ${
                        hovered === item.route ? "text-white" : ""
                      } ${selectedMenu === item.label ? "text-white" : ""}`}
                    >
                      {item.label}
                    </div>

                    {item.expandable &&
                      (item.label === "Students" ? (
                        studentsExpanded ? (
                          <ArrowDown className="ml-auto mr-3 text-heading group-hover:text-white" />
                        ) : (
                          <ArrowUp className="ml-auto mr-3 text-heading group-hover:text-white" />
                        )
                      ) : item.label === "Team Members" ? (
                        instructorsExpanded ? (
                          <ArrowDown className="ml-auto mr-3 text-heading group-hover:text-white" />
                        ) : (
                          <ArrowUp className="ml-auto mr-3 text-heading group-hover:text-white" />
                        )
                      ) : item.label === "Working Spaces" ? (
                        spacesExpanded ? (
                          <ArrowDown className="ml-auto mr-3 text-heading group-hover:text-white" />
                        ) : (
                          <ArrowUp className="ml-auto mr-3 text-heading group-hover:text-white" />
                        )
                      ) : null)}
                  </li>

                  <div className="w-24 m-6 border-b border-divider"></div>

                  {item.expandable &&
                    (item.label === "Students" && studentsExpanded ? (
                      <ul className="ml-8">
                        {studentSubmenuItems.map((subItem) => (
                          <li
                            key={subItem.route}
                            className="flex group items-center h-[40px] pl-2 py-2 m-2 text-sm cursor-pointer"
                            onClick={() => {
                              handleMenuItemClick(subItem.route, true);
                              setSelectedSubMenu(subItem.route);
                            }}
                            onMouseEnter={() => setHovered(subItem.route)}
                            onMouseLeave={() => setHovered(null)}
                          >
                            <div
                              className={`text-heading leading-6 font-poppins ${
                                hovered === subItem.route ||
                                selectedSubMenu === subItem.route
                                  ? "text-white custom-Navbar w-full py-2 pl-2 mr-3 rounded-lg"
                                  : ""
                              }`}
                            >
                              {subItem.label}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : item.label === "Team Members" && instructorsExpanded ? (
                      <ul className="ml-8">
                        {instructorSubMenuItems.map((subItem) => (
                          <li
                            key={subItem.route}
                            className="flex group items-center h-[40px] pl-2 py-2 m-2 text-sm cursor-pointer"
                            onClick={() => {
                              handleMenuItemClick(subItem.route, true);
                              setSelectedSubMenu(subItem.route);
                            }}
                            onMouseEnter={() => setHovered(subItem.route)}
                            onMouseLeave={() => setHovered(null)}
                          >
                            <div
                              className={`text-heading leading-6 font-poppins ${
                                hovered === subItem.route ||
                                selectedSubMenu === subItem.route
                                  ? "text-white custom-Navbar w-full py-2 pl-2 mr-3 rounded-lg"
                                  : ""
                              }`}
                            >
                              {subItem.label}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : item.label === "Working Spaces" && spacesExpanded ? (
                      <ul className="ml-8">
                        {spacesSubMenuItems.map((subItem) => (
                          <li
                            key={subItem.route}
                            className="flex group items-center h-[40px] pl-2 py-2 m-2 text-sm cursor-pointer"
                            onClick={() => {
                              handleMenuItemClick(subItem.route, true);
                              setSelectedSubMenu(subItem.route);
                            }}
                            onMouseEnter={() => setHovered(subItem.route)}
                            onMouseLeave={() => setHovered(null)}
                          >
                            <div
                              className={`text-heading leading-6 font-poppins ${
                                hovered === subItem.route ||
                                selectedSubMenu === subItem.route
                                  ? "text-white custom-Navbar w-full py-2 pl-2 mr-3 rounded-lg"
                                  : ""
                              }`}
                            >
                              {subItem.label}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : null)}
                </React.Fragment>
              ))}s
            </ul>
          </div>
          <div
            className={`flex group items-center h-12 hover:rounded-xl pl-4 py-2 my-4 mt-auto mx-4 cursor-pointer ${
              hovered === "LOGOUT" ? "custom-Navbar rounded-xl" : ""
            }`}
            onClick={() => {
              dispatch(clearCredentials());
              showToast("Logout Successfully", "success");
              handleMenuItemClick(SIGNIN);
            }}
            onMouseEnter={() => setHovered("LOGOUT")}
            onMouseLeave={() => setHovered(null)}
          >
            <div
              className={`text-heading group-hover:text-white leading-6 font-poppins ${
                hovered === "LOGOUT" ? "text-white" : ""
              }`}
            >
              Logout
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;