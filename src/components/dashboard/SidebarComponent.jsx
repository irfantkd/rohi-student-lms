import {
  BanknoteArrowDown,
  BookOpen,
  Box,
  Building,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowDown from "../../assets/icons/navbar/ArrowDown";
import ArrowUp from "../../assets/icons/navbar/ArrowUp";
import MenuIcon from "../../assets/icons/navbar/Menu";
import {
  ATTENDANCE,
  BATCHES,
  CATEGORIES,
  COMPANY,
  COURSE,
  COURSE_SUMMARY,
  COURSES,
  COURSES_EXPENSES,
  DASHBOARD,
  EMPLOYEE,
  EMPLOYEE_SUMMARY,
  FEES,
  FINANCE_SUMMARY,
  INDIVIDUAL,
  INSTRUCTORS,
  INVENTORY,
  INVENTORY_SUMMARY,
  MANAGE_WORKINGSPACE,
  REPORTS,
  STARTUP_INQUIRY,
  STARTUP_SUMMARY,
  STUDENT_SUMMARY,
  STUDENTS,
  TRAINING_INQUIRY,
  USER_MANAGEMENT,
  WORKINGSPACE,
  WS_EXPENSES,
} from "../routes/RouteConstants";
import SidebarLogo from "./SidebarLogo";

const SidebarComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [hovered, setHovered] = useState(null);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [expandedSubMenu, setExpandedSubMenu] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedSubMenu, setSelectedSubMenu] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      label: "Admin Panel",
      icon: <LayoutDashboard />,
      expandable: true,
    },
    {
      route: STUDENTS,
      label: "Students",
      icon: <GraduationCap />,
      expandable: true,
    },
    {
      label: "Startups/Working Spaces",
      icon: <Building />,
      expandable: true,
    },
    {
      label: "Courses/Training",
      icon: <BookOpen />,
      expandable: true,
    },
    {
      label: "Employees",
      icon: <BanknoteArrowDown />,
      route: INSTRUCTORS,
      expandable: true,
    },
    {
      label: "Inventory",
      icon: <Box />,
      route: INVENTORY,
      expandable: true,
    },
     {
      label: "Inquiry",
      icon: <HelpCircle />,
      expandable : true
    },
  ];

  const submenuItems = {
    "Admin Panel": [
      { route: DASHBOARD, label: "Dashboard" },
      {
        label: "Finances",
        expandable: true,
        subItems: [
          // { route: FINANCE_SUMMARY, label: "Finance Summary" },
          { route: WORKINGSPACE, label: "Working Spaces" },
          { route: COURSE, label: "Course" },
        ],
      },
      {
        label: "Expenses",
        expandable: true,
        subItems: [
          { route: WS_EXPENSES, label: "Working Spaces" },
          { route: COURSES_EXPENSES, label: "Course" },
        ],
      },
      { route: USER_MANAGEMENT, label: "User Management" },
      { route: REPORTS, label: " Reports" },
    ],
    Students: [
      // { route: STUDENT_SUMMARY, label: "Student Summary" },
      { route: STUDENTS, label: "Students" },
      { route: FEES, label: "Fees" },
      { route: ATTENDANCE, label: "Attendance" },
    ],
    "Courses/Training": [
      // { route: COURSE_SUMMARY, label: "Course Summary" },
      { route: CATEGORIES, label: "Categories" },
      { route: COURSES, label: "Courses" },
      { route: BATCHES, label: "Classes" },
    ],
    Employees: [
      // { route: EMPLOYEE_SUMMARY, label: "HR Summary" },
      { route: INSTRUCTORS, label: "SMEs" },
      { route: EMPLOYEE, label: "Employee" },
    ],
    "Startups/Working Spaces": [
      // { route: STARTUP_SUMMARY, label: "Startup/Working Space Summary" },
      { route: MANAGE_WORKINGSPACE, label: "Manage Workspace" },
      { route: INDIVIDUAL, label: "Individual" },
      { route: COMPANY, label: "Company" },
    ],
    Inventory: [
      // { route: INVENTORY_SUMMARY, label: "Inventory Summary" },
      { route: INVENTORY, label: "Inventory" },
    ],
       Inquiry: [
      { route: TRAINING_INQUIRY, label: "Training " },
      { route: STARTUP_INQUIRY, label: "Startup" },
    ],
  };

  const handleMenuItemClick = (route, isSubMenu = false) => {
    if (!isSubMenu) {
      localStorage.setItem("selectedMenu", route);
      setSelectedSubMenu(null);
    }
    navigate(route);
  };

useEffect(() => {
  const storedMenu = localStorage.getItem("selectedMenu");
  if (storedMenu) setSelectedMenu(storedMenu);

  setSelectedSubMenu(null);
  setExpandedMenu(null);
  setExpandedSubMenu(null);

  let matchedMenu = null;
  let matchedSubMenu = null;
  let matchedExpandedMenu = null;

  // Flatten all menu + submenus
  const allRoutes = [];

  menuItems.forEach((item) => {
    if (item.route) {
      allRoutes.push({
        menu: item.label,
        route: item.route,
      });
    }

    if (submenuItems[item.label]) {
      submenuItems[item.label].forEach((subItem) => {
        if (subItem.route) {
          allRoutes.push({
            menu: item.label,
            sub: subItem.route,
            route: subItem.route,
          });
        }
        if (subItem.subItems) {
          subItem.subItems.forEach((nested) => {
            allRoutes.push({
              menu: item.label,
              sub: nested.route,
              route: nested.route,
              expanded: subItem.label,
            });
          });
        }
      });
    }
  });

  // ✅ Find the longest matching route
  const current = location.pathname;
  const match = allRoutes
    .filter((r) => current.startsWith(r.route))
    .sort((a, b) => b.route.length - a.route.length)[0]; // longest match

  if (match) {
    matchedMenu = match.menu;
    matchedSubMenu = match.sub || null;
    matchedExpandedMenu = match.expanded || null;

    setSelectedMenu(matchedMenu);
    setSelectedSubMenu(matchedSubMenu);
    setExpandedMenu(matchedMenu);
    setExpandedSubMenu(matchedExpandedMenu);
    localStorage.setItem("selectedMenu", matchedMenu);
  }
}, [location]);


  const getMenuItemClasses = (item) => {
    const baseClasses =
      "flex group items-center h-12 hover:rounded-xl pl-4 py-2 m-4 cursor-pointer";
    const activeClasses =
      hovered === item.label || selectedMenu === item.label
        ? "custom-Navbar rounded-xl"
        : "";
    return `${baseClasses} ${activeClasses}`;
  };

  const getTextClasses = (label) => {
    const baseClasses =
      "text-heading group-hover:text-white leading-6 font-poppins";
    const activeClasses =
      hovered === label || selectedMenu === label ? "text-white" : "";
    return `${baseClasses} ${activeClasses}`;
  };

  const getSubmenuTextClasses = (route) => {
    const baseClasses = "text-heading leading-6 font-poppins";
    const activeClasses =
      hovered === route || selectedSubMenu === route
        ? "text-white custom-Navbar w-full py-2 pl-2 mr-3 rounded-lg"
        : "";
    return `${baseClasses} ${activeClasses}`;
  };

  const getIconClasses = (label) => {
    const baseClasses = "text-brown group-hover:text-white";
    const activeClasses =
      hovered === label || selectedMenu === label ? "text-white" : "";
    return `${baseClasses} ${activeClasses}`;
  };

  return (
    <div className="sticky top-0 flex flex-shrink-0 h-screen overflow-y-auto text-white transition-all duration-300 bg-white">
      <div
        className={`flex flex-col h-max-content ${
          collapsed ? "w-16 custom-Sidebar" : "w-96"
        } transition-all duration-300`}
      >
        <div className="flex items-center justify-end pt-2 pr-2">
          <div
            className="cursor-pointer"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <MenuIcon className="w-5 h-5 text-heading" />
            ) : (
              <X color="black" />
            )}
          </div>
        </div>
        {!collapsed && <SidebarLogo />}

        <div
          className={`flex-grow text-white transition-all duration-300 mt-8 ${
            collapsed ? "opacity-0 invisible" : "opacity-100 visible"
          }`}
        >
          <nav className="flex flex-col h-full bg-white">
            <div className="flex-grow overflow-y-auto">
              <ul>
                {menuItems.map((item) => (
                  <React.Fragment key={item.route || item.label}>
                    <li
                      className={getMenuItemClasses(item)}
                      onClick={() => {
                        if (item.expandable) {
                          setExpandedMenu(
                            expandedMenu === item.label ? null : item.label
                          );
                          setExpandedSubMenu(null);
                        } else {
                          handleMenuItemClick(item.route);
                          setSelectedMenu(item.label);
                          localStorage.setItem("selectedMenu", item.label);
                        }
                      }}
                      onMouseEnter={() => setHovered(item.label)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div
                          className={`flex items-center gap-3 ${getTextClasses(
                            item.label
                          )}`}
                        >
                          <span className={getIconClasses(item.label)}>
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </div>
                        {item.expandable && (
                          <div className="mr-3">
                            {expandedMenu === item.label ? (
                              <ArrowDown className="text-brown group-hover:text-white" />
                            ) : (
                              <ArrowUp className="text-brown group-hover:text-white" />
                            )}
                          </div>
                        )}
                      </div>
                    </li>
                    <div className="w-64 mx-auto border-b border-divider"></div>
                    {item.expandable && expandedMenu === item.label && (
                      <ul className="ml-10">
                        {submenuItems[item.label]?.map((subItem) => (
                          <React.Fragment key={subItem.route || subItem.label}>
                            <li
                              className="flex group items-center h-[40px] pl-2 py-2 m-2 text-sm cursor-pointer"
                              onClick={() => {
                                if (subItem.expandable) {
                                  setExpandedSubMenu(
                                    expandedSubMenu === subItem.label
                                      ? null
                                      : subItem.label
                                  );
                                } else {
                                  handleMenuItemClick(subItem.route, true);
                                  setSelectedSubMenu(subItem.route);
                                }
                              }}
                              onMouseEnter={() =>
                                setHovered(subItem.route || subItem.label)
                              }
                              onMouseLeave={() => setHovered(null)}
                            >
                              <div className="flex items-center justify-between w-full">
                                <div
                                  className={getSubmenuTextClasses(
                                    subItem.route || subItem.label
                                  )}
                                >
                                  {subItem.label}
                                </div>
                                {subItem.expandable && (
                                  <div className="mr-3">
                                    {expandedSubMenu === subItem.label ? (
                                      <ArrowDown className="text-brown group-hover:text-white" />
                                    ) : (
                                      <ArrowUp className="text-brown group-hover:text-white" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </li>
                            {subItem.expandable &&
                              expandedSubMenu === subItem.label && (
                                <ul className="ml-6">
                                  {subItem.subItems?.map((nestedItem) => (
                                    <li
                                      key={nestedItem.route}
                                      className="flex group items-center h-[40px] pl-2 py-2 m-2 text-sm cursor-pointer"
                                      onClick={() => {
                                        handleMenuItemClick(
                                          nestedItem.route,
                                          true
                                        );
                                        setSelectedSubMenu(nestedItem.route);
                                      }}
                                      onMouseEnter={() =>
                                        setHovered(nestedItem.route)
                                      }
                                      onMouseLeave={() => setHovered(null)}
                                    >
                                      <div
                                        className={getSubmenuTextClasses(
                                          nestedItem.route
                                        )}
                                      >
                                        {nestedItem.label}
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              )}
                          </React.Fragment>
                        ))}
                      </ul>
                    )}
                  </React.Fragment>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SidebarComponent;
