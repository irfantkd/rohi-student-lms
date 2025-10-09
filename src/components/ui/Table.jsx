/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import PencilIcon from "../../assets/icons/Pencil";
import EyeIcon from "../../assets/icons/EyeIcon";
import BinIcon from "../../assets/icons/Bin";
import ArrowDown from "../../assets/icons/ArrowDown";
import SwitchButton from "./SwitchButton";
import { useNavigate } from "react-router-dom";
import {
  BATCHES,
  CATEGORY_COURSES,
  COURSES,
  EMPLOYEE,
  INSTRUCTORS,
  STUDENTS,
} from "../routes/RouteConstants";
import AttendanceStatus from "../AttendanceSection/AttendanceStatus";
import Select from "react-select";
import AttendanceLabel from "../AttendanceSection/AttendanceLabel";
import TableHeader from "./TableHeader";
import TableFilters from "./TableFilters";
import { DownloadIcon, Eye, Trash, FileText, User } from "lucide-react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#ffcccc" : "white",
    color: state.isFocused ? "black" : "black",
  }),
  control: (provided) => ({
    ...provided,
    width: "100%",
    backgroundColor: "#f0f0f0",
    borderRadius: "0.375rem",
    fontSize: "1rem",
    boxShadow: "none",
    border: "1px solid #ccc",
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: "1rem",
    color: "inherit",
  }),
  dropdownIndicator: () => null,
  indicatorSeparator: () => null,
  menu: (provided) => ({
    ...provided,
    marginTop: "0.25rem",
    borderRadius: "0.375rem",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    zIndex: 9999,
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
};

const Table = ({
  data = [],
  columns = [],
  columnsFilters = [],
  handleFilterChange = () => {},
  itemsPerPageOptions = [5, 10, 15, 20, 25, 30, 35, 40],
  setIsEditModalOpen,
  setIsDeleteModalOpen,
  setIsMultipleSelected,
  setIsStudentDetailsModalOpen,
  setSelectedID,
  handleEditClick,
  handleSwitchToggle,
  ColumnUnderline = false,
  borderNone = true,
  sourceComponent = "",
  TableHeadingAction = true,
  batchEditButton = true,
  markAttendanceDate = "",
  BatchActiveColor = false,
  updateMarkedAttendance = () => {},
  handleResetChange,
  onViewDetails,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [number, setNumber] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [switchStates, setSwitchStates] = useState({});
  const navigate = useNavigate();

  const user = useSelector(selectCurrentUser);
  const role = user?.role;

  console.log(role, "roleeee");

  const formattedItemsPerPageOptions = itemsPerPageOptions.map((num) => ({
    value: num,
    label: String(num),
  }));

  useEffect(() => {
    console.log("switchStates here", switchStates);
  }, [switchStates]);

  useEffect(() => {
    const initialSwitchStates = data.reduce((acc, item) => {
      acc[item.id] = item.is_active === 1;
      return acc;
    }, {});

    setSwitchStates(initialSwitchStates);
  }, [data]);

  const handleSwitchCheckboxChange = (id) => {
    const newState = !switchStates[id];
    setSwitchStates((prevStates) => ({
      ...prevStates,
      [id]: newState,
    }));

    console.log("newState", newState);
    console.log("id", id);
    handleSwitchToggle(id, newState);
  };

  const handleCheckboxChange = (identifier) => {
    const isSelected = selectedRows.includes(identifier);
    if (isSelected) {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== identifier)
      );
    } else {
      setSelectedRows((prevSelected) => [...prevSelected, identifier]);
    }
  };

  useEffect(() => {
    setIsMultipleSelected && setIsMultipleSelected(selectedRows.length > 0);
  }, [selectedRows]);

  const handlePage = () => {
    setCurrentPage(parseInt(number));
  };

  const handlePageNumber = (e) => {
    setNumber(parseInt(e.target.value));
  };

  const handleChange = (e) => {
    setItemsPerPage(parseInt(e.value));
    setCurrentPage(1);
  };

  const handleClick = (number) => {
    setCurrentPage(number);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allIdentifiers = data?.map((row) => row.name);
      console.log("allIdentifiers", allIdentifiers);
      setSelectedRows(allIdentifiers);
    } else {
      setSelectedRows([]);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(data?.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const showingText = `Showing ${indexOfFirstItem + 1} to ${
    indexOfLastItem > data?.length ? data?.length : indexOfLastItem
  } of ${data?.length}`;

  console.log("data hello", data);
  const hasActiveStatus = data.some((item) => item.is_active !== undefined);

  const handleRowClick = (item) => {
    if (sourceComponent === "CategoriesComponent") {
      navigate(`${COURSES}/${item?.id}`);
    } else if (sourceComponent === "CoursesComponent") {
      navigate(`${BATCHES}/${item?.id}`);
    }
  };

  return (
    <>
      <div className="relative max-w-full overflow-x-auto custom-horizontal-scrollbar">
        <table className="w-full min-w-full bg-white border border-grayBorder">
          <TableHeader
            selectAll={selectAll}
            handleSelectAll={handleSelectAll}
            columns={columns}
            TableHeadingAction={TableHeadingAction}
            hasActiveStatus={hasActiveStatus}
            borderNone={borderNone}
            sourceComponent={sourceComponent}
          />
          {(sourceComponent === "StudentsComponent" ||
            sourceComponent === "InstructorsComponent" ||
            sourceComponent === "EmployeesComponent" ||
            sourceComponent === "BatchesComponent") && (
            <TableFilters
              columnsFilters={columnsFilters}
              handleFilterChange={handleFilterChange}
              handleResetChange={handleResetChange}
            />
          )}
          <tbody>
            {currentItems?.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={index}>
                  <td className="py-2 pl-6 pr-4 border-b border-grayBorder">
                    <div className="flex items-center gap-5 ">
                      <div className="self-center">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(item.name)}
                          onChange={() => handleCheckboxChange(item.name)}
                        ></input>
                      </div>
                      <div className="pl-4 text-base font-nunito">
                        {indexOfFirstItem + index + 1}
                      </div>
                    </div>
                  </td>
                  {columns?.map((column, index) => (
                    <td
                      key={column}
                      className={`py-2 px-4 border-b border-grayBorder text-left font-nunito text-base capitalize`}
                      onClick={() => {
                        if (item?.role === "student" && column === "Name") {
                          setSelectedID(item.uuid);
                          setIsStudentDetailsModalOpen(true);
                        }
                      }}
                      onMouseOut={() => {
                        if (item?.role === "student" && column === "Name") {
                          setIsStudentDetailsModalOpen(false);
                        }
                      }}
                    >
                      <span
                        className={`w-max inline-block ${
                          !BatchActiveColor
                            ? ColumnUnderline && index === 0
                              ? "border-b border-dashed px-1 cursor-pointer"
                              : ""
                            : BatchActiveColor && index === 3
                            ? `py-1 px-3 rounded-lg ${
                                item.status === "In-Active"
                                  ? "bg-bloodred "
                                  : "bg-activeColor"
                              } text-white`
                            : ""
                        }`}
                        onClick={() => {
                          if (index === 0) {
                            handleRowClick(item);
                          }
                        }}
                      >
                        {sourceComponent === "AttendanceMarkSection" &&
                        column === "Attendance" ? (
                          <AttendanceStatus
                            studentId={item.id}
                            markAttendanceDate={markAttendanceDate}
                            updateMarkedAttendance={updateMarkedAttendance}
                          />
                        ) : sourceComponent === "StudentAttendanceTab" &&
                          column === "Status" ? (
                          <AttendanceLabel
                            value={item[column.toLowerCase()]}
                            background={
                              item[column.toLowerCase()] === "Present"
                                ? "#00A30040"
                                : item[column.toLowerCase()] === "Absent"
                                ? "#FF000040"
                                : item[column.toLowerCase()] === "Leave"
                                ? "#F8F9F9"
                                : ""
                            }
                          />
                        ) : (
                          item[column.toLowerCase()]
                        )}
                      </span>
                    </td>
                  ))}
                  {hasActiveStatus && (
                    <SwitchButton
                      id={item.id}
                      switchStates={switchStates}
                      handleSwitchCheckboxChange={handleSwitchCheckboxChange}
                    />
                  )}

                  {TableHeadingAction && (
                    <td className="px-4 py-2 text-base  text-left border-b border-grayBorder w-36 font-nunito">
                      <div className="flex">
                        {sourceComponent === "TrainingInquiries" && (
                          <button
                            className="bg-editButtonGray text-white w-[45px] h-[35px] rounded mx-1 flex items-center justify-center hover:shadow-md transition"
                            onClick={() =>
                              navigate("/dashboard/students/enroll", {
                                state: {
                                  inquiryData: item,
                                  enrollmentId: item.id,
                                },
                              })
                            }
                          >
                            <User className="w-4 h-4" />
                          </button>
                        )}
                        {(item?.role === "employee" ||
                          item?.role === "teacher" ||
                          sourceComponent === "IndividualWorkingSpace" ||
                          sourceComponent === "StudentsComponent" ||
                          sourceComponent === "InstructorsComponent" ||
                          sourceComponent === "CompanyWorkingSpace" ||
                          sourceComponent === "Inventory" ||
                          sourceComponent === "CoursesExpenses" ||
                          sourceComponent === "WsExpenses" ||
                          sourceComponent === "TrainingInquiries") && (
                          <button
                            className=" w-[45px] h-[35px] rounded mx-1 flex items-center justify-center bg-editButtonGray text-white"
                            onClick={() => {
                              if (sourceComponent === "StudentsComponent") {
                                navigate(`${STUDENTS}/${item.uuid}`);
                              } else if (item.role === "employee") {
                                navigate(`${EMPLOYEE}/${item.uuid}`);
                              } else if (item.role === "teacher") {
                                navigate(`${INSTRUCTORS}/${item.uuid}`);
                              } else if (
                                sourceComponent === "IndividualWorkingSpace"
                              ) {
                                console.log("Navigating with uuid:", item.uuid);
                                navigate(
                                  `/dashboard/working-spaces/individual/${item.uuid}`
                                );
                              } else if (
                                sourceComponent === "CompanyWorkingSpace"
                              ) {
                                navigate(
                                  `/dashboard/working-spaces/company/${item.uuid}`
                                );
                              } else if (
                                sourceComponent === "WsExpenses" ||
                                sourceComponent === "CoursesExpenses"
                              ) {
                                if (typeof onViewDetails === "function") {
                                  onViewDetails(item);
                                }
                              } else if (
                                sourceComponent === "TrainingInquiries"
                              ) {
                                if (typeof onViewDetails === "function") {
                                  onViewDetails(item);
                                }
                              }
                            }}
                          >
                            <Eye />
                          </button>
                        )}

                        {batchEditButton && role === "admin" && (
                          <button
                            className="bg-editButtonGray text-white w-[45px] h-[35px] rounded mx-1 flex items-center justify-center"
                            onClick={() => {
                              setIsEditModalOpen(true);
                              setSelectedID(item.id);
                              handleEditClick(item);
                            }}
                          >
                            <PencilIcon />
                          </button>
                        )}
                        {role === "admin" && (
                          <>
                            {item.courses > 0 ||
                            item.batches > 0 ||
                            item["total students"] > 0 ? (
                              <button
                                disabled
                                className="custom-ActionBtn text-black bg-editButtonGray w-[45px] h-[35px] rounded mx-1 flex items-center justify-center opacity-50"
                                onClick={() => {
                                  setSelectedID(item.id);
                                  setIsDeleteModalOpen(true);
                                }}
                              >
                                <BinIcon />
                              </button>
                            ) : (
                              <button
                                className="custom-ActionBtn bg-editButtonGray text-white w-[45px] h-[35px] rounded mx-1 flex items-center justify-center"
                                onClick={() => {
                                  setSelectedID(item.uuid);
                                  setIsDeleteModalOpen(true);
                                }}
                              >
                                <Trash />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 3}
                  className="py-10 text-center text-gray-500 font-semibold text-lg"
                >
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="w-8 h-8 text-gray-400" />
                    <span>No data found</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="relative flex items-center justify-between px-4 py-3 mt-2 border border-grayBorder bg-backgroundGray">
        <div className="flex gap-4">
          <button
            onClick={() => handleClick(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-1 font-light rounded bg-buttonGray font-poppins"
          >
            Previous
          </button>
          <div>
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => handleClick(number)}
                className={`px-3 py-1 mx-1 rounded ${
                  currentPage === number
                    ? "custom-ActionBtn text-white"
                    : "bg-white"
                }`}
              >
                {number}
              </button>
            ))}
          </div>
          <button
            onClick={() => handleClick(currentPage + 1)}
            disabled={currentPage === pageNumbers.length}
            className="px-4 py-1 bg-white rounded"
          >
            Next
          </button>
        </div>

        <div className="relative flex items-center">
          <div>Per Page</div>
          <div className="relative z-10 inline-block mx-3 w-14">
            <Select
              id="quantity"
              name="quantity"
              value={formattedItemsPerPageOptions.find(
                (option) => option.value === itemsPerPage
              )}
              onChange={handleChange}
              options={formattedItemsPerPageOptions}
              styles={customStyles}
              menuPortalTarget={document.body}
              menuPosition="fixed"
              isSearchable={false}
              components={{
                DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ArrowDown width={"10"} height={"8"} className="ml-auto mr-3" />
            </div>
          </div>
          <div>{showingText}</div>
          <div className="mx-3">
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={number}
              onChange={handlePageNumber}
              className="block w-12 py-2 pl-2 text-base border-gray-300 rounded-md focus:outline-none sm:text-sm"
              min={1}
              max={pageNumbers.length}
            />
          </div>
          <button
            className="px-3 py-1 mx-1  rounded custom-ActionBtn font-poppins"
            onClick={handlePage}
          >
            Go
          </button>
        </div>
      </div>
    </>
  );
};

export default Table;
