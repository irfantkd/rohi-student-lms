import React, { useState } from "react";
import {
  X,
  BookOpen,
  GraduationCap,
  User,
  Mail,
  Phone,
  Clock,
  MapPin,
  Info,
  Calendar,
  Laptop,
  DollarSign,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";

// Sample data based on your API response
const sampleStudentData = {
  id: 19,
  uuid: "06085745-db77-41c2-9223-1542c291dbcd",
  first_name: "Rhiannon",
  last_name: "Mcbride",
  email: "weqyw@mailinator.com",
  contact: "+1 (527) 476-3066",
  cnic: "312059261695",
  classes: [
    {
      id: 4,
      name: "Class-SMM-Hall 1-Batch-1-2025-evening",
      timing: "14:00 to 17:00",
      starting_date: "2025-12-01",
      time_slot: "evening",
      is_active: true,
      teacher_name: "Muhammad Irfan",
      course_name: "Social Media Marketing & Freelancing",
      fees: {
        total_fee: "63.00",
        discount_fee: "3.00",
        laptop_fee: "3000.00",
        total_installments: "2",
        installments: [
          {
            installment_id: 50,
            amount: 1530,
            due_date: "2025-11-08T19:00:00.000000Z",
            paid_date: "2025-10-29T19:00:00.000000Z",
            status: "paid",
            is_overdue: false,
          },
          {
            installment_id: 51,
            amount: 1530,
            due_date: "2025-12-10T19:00:00.000000Z",
            paid_date: "2025-10-29T19:00:00.000000Z",
            status: "paid",
            is_overdue: false,
          },
        ],
      },
      inventory: [
        {
          id: 66,
          inventory_uuid: "25429372-78f2-47fd-aa4d-e684fdbd4fd9",
          tag: "LAP006",
          is_active: true,
          pivot: {
            status: "assigned",
          },
        },
      ],
    },
  ],
};

const StudentDetailsModal = () => {
  const [showModal, setShowModal] = useState(true);
  const [selectedClassIndex, setSelectedClassIndex] = useState(0);
  const studentData = sampleStudentData;
  const selectedClass = studentData.classes[selectedClassIndex];

  const closeModal = () => setShowModal(false);

  if (!showModal) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-[#014376] to-[#31918D] text-white rounded-lg font-semibold"
        >
          Open Student Details
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm"
      onClick={closeModal}
    >
      <div
        className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#014376] to-[#31918D] p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white opacity-10 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-2">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <span className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Student Details
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-1">
                  {studentData.first_name} {studentData.last_name}
                </h2>
                <p className="text-blue-100 text-sm">
                  CNIC: {studentData.cnic}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-auto max-h-[calc(90vh-10rem)]">
          <div className="space-y-6">
            {/* Student Basic Info */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-[#014376] to-[#31918D] rounded-lg p-2.5">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#014376]">
                  Contact Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#31918D]" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">
                      {studentData.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#31918D]" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">
                      {studentData.contact}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Class Selection if multiple classes */}
            {studentData.classes.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {studentData.classes.map((cls, index) => (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClassIndex(index)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedClassIndex === index
                        ? "bg-gradient-to-r from-[#014376] to-[#31918D] text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cls.course_name}
                  </button>
                ))}
              </div>
            )}

            {/* Class Information */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-2.5">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Class Details
                </h3>
                {selectedClass.is_active && (
                  <span className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full ml-auto">
                    Active
                  </span>
                )}
              </div>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Course Name</p>
                  <p className="font-semibold text-gray-900">
                    {selectedClass.course_name}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Class Name</p>
                  <p className="font-semibold text-gray-900">
                    {selectedClass.name}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <p className="text-xs text-gray-500">Time Slot</p>
                    </div>
                    <p className="font-semibold text-gray-900 capitalize">
                      {selectedClass.time_slot}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedClass.timing}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <p className="text-xs text-gray-500">Start Date</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {new Date(selectedClass.starting_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                    <p className="text-xs text-gray-500">Instructor</p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {selectedClass.teacher_name}
                  </p>
                </div>
              </div>
            </div>

            {/* Laptop Details */}
            {selectedClass.inventory && selectedClass.inventory.length > 0 && (
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-5 border border-indigo-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg p-2.5">
                    <Laptop className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Laptop Details
                  </h3>
                  {selectedClass.inventory[0].is_active && (
                    <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full ml-auto">
                      Active
                    </span>
                  )}
                </div>
                {selectedClass.inventory.map((laptop) => (
                  <div
                    key={laptop.id}
                    className="bg-white rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Laptop Tag</p>
                        <p className="font-bold text-xl text-indigo-600">
                          {laptop.tag}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Status</p>
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            laptop.pivot.status === "assigned"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          <CheckCircle className="w-3 h-3" />
                          {laptop.pivot.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <Info className="w-4 h-4 text-gray-400" />
                      <p className="text-xs text-gray-500">
                        Inventory UUID: {laptop.inventory_uuid}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Fee Details */}
            {selectedClass.fees && (
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg p-2.5">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Fee Information
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">Total Fee</p>
                      <p className="font-bold text-xl text-gray-900">
                        ${selectedClass.fees.total_fee}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">Discount</p>
                      <p className="font-bold text-xl text-green-600">
                        ${selectedClass.fees.discount_fee}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">Laptop Fee</p>
                      <p className="font-bold text-xl text-gray-900">
                        ${selectedClass.fees.laptop_fee}
                      </p>
                    </div>
                  </div>

                  {/* Installments */}
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold text-gray-900">
                        Installments ({selectedClass.fees.installments.length})
                      </p>
                    </div>
                    <div className="space-y-3">
                      {selectedClass.fees.installments.map(
                        (installment, index) => (
                          <div
                            key={installment.installment_id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-orange-100 text-orange-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  ${installment.amount}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Due:{" "}
                                  {new Date(
                                    installment.due_date
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                  installment.status === "paid"
                                    ? "bg-green-100 text-green-700"
                                    : installment.is_overdue
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {installment.status === "paid" ? (
                                  <CheckCircle className="w-3 h-3" />
                                ) : (
                                  <AlertCircle className="w-3 h-3" />
                                )}
                                {installment.status.toUpperCase()}
                              </span>
                              {installment.paid_date && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Paid:{" "}
                                  {new Date(
                                    installment.paid_date
                                  ).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <button
            onClick={closeModal}
            className="w-full py-3 bg-gradient-to-r from-[#014376] to-[#31918D] hover:from-[#013057] hover:to-[#267b78] text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsModal;
