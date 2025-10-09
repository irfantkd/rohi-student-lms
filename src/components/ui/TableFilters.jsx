import React, { useState } from "react";
import Select from "react-select";

const statusOptions = [
  {
    value: 1,
    label: "Active",
  },
  {
    value: 0,
    label: "InActive",
  },
];

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#FF0000" : provided.backgroundColor,
    color: state.isSelected ? "white" : provided.color,
    "&:hover": {
      backgroundColor: state.isSelected ? "" : "#24A0ED", // change on hover if needed
      color: "white",
    },
  }),
  control: (provided) => ({
    ...provided,
    borderRadius: "10px", // Custom border radius
    borderColor: "#ccc", // Border color
    boxShadow: "none",
    paddingTop: "2px", // Add padding top
    paddingBottom: "2px", // Add padding bottom
    "&:hover": {
      borderColor: "#888", // Change border color on hover if needed
    },
  }),
};

// const TableFilters = ({ columnsFilters, handleFilterChange }) => {
//   // const [filters, setFilters] = useState({});

//   // const handleFilterChange = (e) => {
//   //   if (!e.target) {
//   //     const { value } = e;
//   //     setFilters({ ...filters, activeStatus: value });
//   //   }

//   //   const { name, value } = e.target;
//   //   setFilters({ ...filters, [name]: value });
//   // };

//   return (
//     <tr className="bg-backgroundGray">
//       {columnsFilters.map((columnFilter) => (
//         <td
//           key={columnFilter.placeholder}
//           className={`py-4 px-4  text-left text-tableHeading font-poppins`}
//         >
//           {columnFilter.field !== "Dropdown" && (
//             <input
//               value={filters[columnFilter.key]}
//               name={columnFilter.key}
//               type={columnFilter.field}
//               placeholder={columnFilter.placeholder}
//               disabled={columnFilter.isDisabled}
//               className={`p-2 rounded-lg w-40${
//                 columnFilter.isDisabled
//                   ? "cursor-not-allowed bg-white w-40"
//                   : ""
//               }`}
//               onChange={handleFilterChange}
//             />
//           )}
//           {columnFilter.field === "Dropdown" && (
//             <Select
//               className="w-48"
//               onChange={handleFilterChange}
//               value={statusOptions.find(
//                 (option) => option.value === filters.activeStatus
//               )}
//               options={statusOptions}
//               styles={customStyles}
//               placeholder="Select Status"
//             />
//           )}
//         </td>
//       ))}
//     </tr>
//   );
// };

// export default TableFilters;

const TableFilters = ({
  columnsFilters,
  handleFilterChange,
  handleResetChange,
}) => {
  const [filters, setFilters] = useState({});

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFilters({ ...filters, [name]: value });
  //   handleFilterChange(name, value); // Pass filter change to parent
  // };

  // Utility function to convert dd/mm/yyyy to yyyy/mm/dd
  const convertToYYYYMMDD = (dateString) => {
    if (!dateString) return "";

    const parts = dateString.split("/");

    // Ensure we have all parts (dd, mm, yyyy)
    if (parts.length === 3) {
      const [day, month, year] = parts;
      // Check if day, month, and year are valid numbers
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return `${year}-${month}-${day}`;
      }
    }

    return dateString; // Return as-is if conversion fails
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("columnFilter", name);
    console.log("columnFilter", value);

    // Check if the field is a date and convert it to yyyy/mm/dd format
    let formattedValue = value;
    const columnFilter = columnsFilters.find((column) => column.key === name);
    console.log("columnFilter", columnFilter);

    if (columnFilter && columnFilter.field === "date" && value) {
      formattedValue = convertToYYYYMMDD(value); // Convert date format
      console.log("columnFilter", formattedValue);
    }

    setFilters({ ...filters, [name]: formattedValue });
    handleFilterChange(name, formattedValue); // Pass the formatted filter change to parent
  };

  const handleDropdownChange = (selectedOption) => {
    const value = selectedOption?.value;
    setFilters({ ...filters, status: value });
    handleFilterChange("status", value); // Pass filter change to parent
  };
  const handleReset = () => {
    const clearedFilters = {};
    setFilters(clearedFilters); // Reset filters state to empty
    handleFilterChange(clearedFilters); // Pass the cleared filters to parent
    handleResetChange();
  };
  return (
    <tr className="bg-backgroundGray ">
      {columnsFilters.map((columnFilter) => (
        <td
          key={columnFilter.placeholder}
          className={`py-4 px-4  text-left text-tableHeading font-poppins`}
        >
          {columnFilter.field !== "Dropdown" &&
            columnFilter.field !== "button" && (
              <input
                // value={filters[columnFilter.key]}
                value={filters[columnFilter.key] || ""}
                name={columnFilter.key}
                type={columnFilter.field}
                placeholder={columnFilter.placeholder}
                disabled={columnFilter.isDisabled}
                className={`p-2 rounded-lg w-40 bg-white ${
                  columnFilter.isDisabled
                    ? "cursor-not-allowed bg-white w-40"
                    : ""
                }`}
                onChange={handleInputChange}
              />
            )}
          {columnFilter.field === "button" && (
            <button
              type={columnFilter.field}
              className="p-2 rounded-lg w-40 text-white custom-ActionBtn hover:scale-105 duration-500"
              onClick={() => {
                handleReset();
              }}
            >
              Reset
            </button>
          )}
          {columnFilter.field === "Dropdown" && (
            <Select
              className="w-48"
              onChange={handleDropdownChange}
              value={statusOptions.find(
                (option) => option.value === filters.status
              )}
              options={statusOptions}
              styles={customStyles}
              placeholder="Select Status"
            />
          )}
        </td>
      ))}
    </tr>
  );
};

export default TableFilters;
