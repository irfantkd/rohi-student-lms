import {
  ArrowLeft,
  BookOpen,
  Building,
  Clock,
  GraduationCap,
  Info,
  Laptop,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useGetQuery } from "../../../api/apiSlice";
import { path } from "d3";
import { FEEDBACK_FORM } from "../../routes/RouteConstants";
import { useNavigate } from "react-router-dom";

const ClassModal = ({ selectedClass, handleBackToList }) => {
  const { data } = useGetQuery({
    path: `/user/classes/${selectedClass?.id}/feedback`,
  });
  console.log("data", data);

  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50 p-6">
      <div className="w-11/12 mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBackToList}
          className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-800 transition-colors group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-semibold">Back to Classes</span>
        </button>

        {/* Class Detail Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#014376] to-[#31918D] p-8 text-white relative overflow-hidden flex justify-between items-center">
            <div className="absolute inset-0 bg-gradient-to-br from-white opacity-10 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-2">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                {selectedClass.is_active && (
                  <span className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">
                {selectedClass.course_name}
              </h1>
              {selectedClass.name && (
                <p className="text-blue-100 text-lg">{selectedClass.name}</p>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="space-y-6">
              {/* Instructor Information */}
              {selectedClass.teacher_name && (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100 flex justify-between items-center">
                  <div className="">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-gradient-to-br from-[#014376] to-[#31918D] rounded-lg p-2.5">
                        <GraduationCap className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-[#014376]">
                        Instructor Information
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-[#31918D]" />
                        <div>
                          <p className="text-xs text-gray-500">Name</p>
                          <p className="font-semibold text-gray-900">
                            {selectedClass.teacher_name}
                          </p>
                        </div>
                      </div>
                      {selectedClass.teacher_email && (
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-[#31918D]" />
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="font-medium text-gray-900">
                              {selectedClass.teacher_email}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedClass.teacher_phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-[#31918D]" />
                          <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="font-medium text-gray-900">
                              {selectedClass.teacher_phone}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {!data || data?.questions?.length === 0 || data?.message ? (
                    <h1 className="bg-green-200 p-3 rounded-full px-6">
                      {data?.message || " No feedback Form available"}
                    </h1>
                  ) : (
                    <div
                      onClick={() =>
                        navigate(`/dashboard/feedback-form/${selectedClass.id}`)
                      }
                      className="bg-gradient-to-br from-[#014376] to-[#31918D] p-3 px-5 rounded-full cursor-pointer hover:bg-gradient-to-br hover:from-[#012376] hover:to-[#31913D] text-white text-lg"
                    >
                      <button>Feedback Form</button>
                    </div>
                  )}
                </div>
              )}

              {/* Class Schedule */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg p-2.5">
                    <Clock className="w-5 h-5 text-zinc-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Class Schedule
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedClass.time_slot && (
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">Time Slot</p>
                      <p className="font-semibold text-gray-900 capitalize">
                        {selectedClass.time_slot}
                        {selectedClass.timing && (
                          <span className="text-gray-600 font-normal ml-1">
                            ({selectedClass.timing})
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  {selectedClass.starting_date && (
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">Start Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(
                          selectedClass.starting_date
                        ).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                  {selectedClass.ending_date && (
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">End Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(selectedClass.ending_date).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  )}
                  {selectedClass.days && (
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">Class Days</p>
                      <p className="font-semibold text-gray-900">
                        {selectedClass.days}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {selectedClass.inventory &&
                selectedClass.inventory.length > 0 && (
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg p-2.5">
                        <Laptop className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Assigned Laptop
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {selectedClass.inventory.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-lg p-4 flex items-center justify-between"
                        >
                          <div>
                            <p className="font-semibold text-gray-900 mb-1">
                              {item.tag}
                            </p>
                            {item.serial_numbers && (
                              <p className="text-sm text-gray-600">
                                Serial: {item.serial_numbers}
                              </p>
                            )}
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              item.pivot.status === "assigned"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {item.pivot.status === "assigned"
                              ? "Assigned"
                              : item.pivot.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              {/* Location Information */}
              {(selectedClass.location ||
                selectedClass.room ||
                selectedClass.building) && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-2.5">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Location Details
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {selectedClass.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-purple-600" />
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="font-semibold text-gray-900">
                            {selectedClass.location}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedClass.building && (
                      <div className="flex items-center gap-3">
                        <Building className="w-4 h-4 text-purple-600" />
                        <div>
                          <p className="text-xs text-gray-500">Building</p>
                          <p className="font-semibold text-gray-900">
                            {selectedClass.building}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedClass.room && (
                      <div className="flex items-center gap-3">
                        <Info className="w-4 h-4 text-purple-600" />
                        <div>
                          <p className="text-xs text-gray-500">Room</p>
                          <p className="font-semibold text-gray-900">
                            {selectedClass.room}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Fee Information */}

              {/* Inventory/Laptop Assignment */}

              {/* Additional Information */}
              {(selectedClass.description ||
                selectedClass.notes ||
                selectedClass.capacity) && (
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg p-2.5">
                      <Info className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Additional Information
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {selectedClass.capacity && (
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-xs text-gray-500 mb-1">
                          Class Capacity
                        </p>
                        <p className="font-semibold text-gray-900">
                          {selectedClass.capacity} Students
                        </p>
                      </div>
                    )}
                    {selectedClass.description && (
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-xs text-gray-500 mb-2">
                          Description
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {selectedClass.description}
                        </p>
                      </div>
                    )}
                    {selectedClass.notes && (
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-xs text-gray-500 mb-2">Notes</p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {selectedClass.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassModal;
