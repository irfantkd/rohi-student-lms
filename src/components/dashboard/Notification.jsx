import React from "react";
import IconComment from "../../assets/icons/navbar/Comment";
import IconPurchase from "../../assets/icons/navbar/Purchase";
import IconStar from "../../assets/icons/navbar/Star";

const Notification = ({ isOpen, toggle }) => {
  const notifications = [
    {
      id: 1,
      user: "John",
      action: "give a 5 star rating on your course",
      course: "2021 ui/ux design with figma",
      time: "5 mins ago",
      type: "star",
    },
    {
      id: 2,
      user: "Kevin",
      action: 'comments on your lecture "What is ux"',
      course: "2021 ui/ux design with figma",
      time: "Just now",
      type: "comment",
    },
    {
      id: 3,
      user: "Sraboni",
      action: "purchase your course",
      course: "2021 ui/ux design with figma",
      time: "6 mins ago",
      type: "purchase",
    },
    {
      id: 4,
      user: "Arif",
      action: "purchase your course",
      course: "2021 ui/ux design with figma",
      time: "19 mins ago",
      type: "purchase",
    },
    {
      id: 5,
      user: "Monir",
      action: "give a 5 star rating on your course",
      course: "2021 ui/ux design with figma",
      time: "5 mins ago",
      type: "star",
    },
  ];

  return (
    isOpen && (
      <div className="absolute right-0 mt-2 w-[432px] bg-white shadow-lg rounded-lg z-10 max-h-96">
        <div className="p-4 border-b border-divider flex justify-between items-center">
          <h2 className="text-xl leading-6 font-poppins">Notification</h2>
          <button
            onClick={toggle}
            className="text-sm font-normal text-gray focus:outline-none font-poppins"
          >
            Mark as Read
          </button>
        </div>
        <ul className="max-h-80 overflow-y-auto ">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="p-4 flex items-start space-x-2 hover:bg-hoverGray"
            >
              <div
                className={`rounded-full flex items-center justify-center bg-orange p-2`}
              >
                {notification.type === "star" && <IconStar />}
                {notification.type === "comment" && <IconComment />}
                {notification.type === "purchase" && <IconPurchase />}
              </div>
              <div>
                <p className="text-sm font-nunito text-heading">
                  <span className="font-semibold"> {notification.user} </span>
                  <span className="text-gray font-semibold">
                    {notification.action}{" "}
                  </span>
                  <span className="font-normal text-heading">
                    "{notification.course}"
                  </span>
                </p>
                <p className="text-xs text-lightGray">{notification.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  );
};

export default Notification;
