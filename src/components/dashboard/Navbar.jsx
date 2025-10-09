import React, { useState } from "react";
import SearchIcon from "../../assets/icons/navbar/Search";
import BellIcon from "../../assets/icons/navbar/Bell";
import Notification from "./Notification";
import ProfileDetailsDropdown from "./ProfileDetailsDropdown";

const Navbar = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  return (
    <div className="h-16 flex ml-10 my-5 justify-end items-center border-b border-divider pb-4 px-5 overflow-hidden">
      {/* <div className="flex items-center w-[30.75rem] h-12 px-4 bg-white drop-shadow rounded-2xl">
        <SearchIcon className="text-divider mr-2  " />
        <input
          type="text"
          placeholder="Find Something..."
          className="flex-grow outline-none border-none placeholder-divider focus:ring-0 "
        />
      </div> */}
      <div className="flex gap-4 items-center">
        <div onClick={toggleNotification} className="relative">
          {/* <BellIcon /> */}
          {isNotificationOpen && (
            <Notification
              isOpen={isNotificationOpen}
              toggle={toggleNotification}
            />
          )}
        </div>
        <div className="bg-gray-300 h-9 w-px"></div>
        <ProfileDetailsDropdown />
      </div>
    </div>
  );
};

export default Navbar;
