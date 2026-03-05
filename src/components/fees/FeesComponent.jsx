import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  useDownloadChallanMutation,
  useUploadChallanMutation,
} from "../../api/apiSlice";
import { toast } from "react-toastify";
import {
  Calendar,
  Upload,
  Download,
  CheckCircle,
  Clock,
  FileText,
  User,
  BookOpen,
  X,
  Eye,
  AlertCircle,
  Check,
  Users,
  Lock,
} from "lucide-react";

const FeesComponent = () => {
  const studentData = useSelector((state) => state.auth?.userData);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [previewUrls, setPreviewUrls] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [currentPreview, setCurrentPreview] = useState(null);
  const [uploadChallan, { isLoading }] = useUploadChallanMutation();
  const [downloadChallan, { isLoading: isDownloading }] =
    useDownloadChallanMutation();
  const [downloadingInstallmentId, setDownloadingInstallmentId] =
    useState(null);
  const fileInputRefs = useRef({});

  if (!studentData) return null;

  // Extract classes and their installments
  const classesWithFees =
    studentData.classes?.map((classItem) => {
      const feeData = classItem.fees;
      const installments = feeData?.installments || [];

      return {
        classItem,
        feeData,
        installments,
      };
    }) || [];

  // Calculate totals across all classes
  const totalFeeAmount = classesWithFees.reduce((sum, item) => {
    const totalFee = parseFloat(item.feeData?.total_fee || 0);
    const discountFee = parseFloat(item.feeData?.discount_fee || 0);
    const laptopFee = parseFloat(item.feeData?.laptop_fee || 0);
    return sum + (totalFee - discountFee + laptopFee);
  }, 0);

  const totalInstallments = classesWithFees.reduce(
    (sum, item) => sum + item.installments.length,
    0
  );

  const paidInstallments = classesWithFees.reduce(
    (sum, item) =>
      sum + item.installments.filter((inst) => inst.status === "paid").length,
    0
  );

  const totalPaidAmount = classesWithFees.reduce((sum, item) => {
    return (
      sum +
      item.installments
        .filter((inst) => inst.status === "paid")
        .reduce((s, inst) => s + parseFloat(inst.amount || 0), 0)
    );
  }, 0);

  if (classesWithFees.length === 0 || totalInstallments === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No Fee Information Available
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              There are no fee installments to display at this time. Please
              contact the administration for more information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleFileChange = (e, installmentUuid) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB.");
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setSelectedFiles((prev) => ({ ...prev, [installmentUuid]: file }));
      setPreviewUrls((prev) => ({ ...prev, [installmentUuid]: previewUrl }));
    }
  };

  const handleRemoveFile = (installmentUuid) => {
    if (previewUrls[installmentUuid]) {
      URL.revokeObjectURL(previewUrls[installmentUuid]);
    }

    setSelectedFiles((prev) => ({
      ...prev,
      [installmentUuid]: null,
    }));

    setPreviewUrls((prev) => ({
      ...prev,
      [installmentUuid]: null,
    }));

    if (fileInputRefs.current[installmentUuid]) {
      fileInputRefs.current[installmentUuid].value = "";
    }
  };

  const handlePreview = (installmentUuid) => {
    if (previewUrls[installmentUuid]) {
      setCurrentPreview(previewUrls[installmentUuid]);
      setShowPreview(true);
    }
  };

  const closePreview = () => {
    setShowPreview(false);
    setCurrentPreview(null);
  };

  const handleUpload = async (installment, classIndex, instIndex) => {
    const file = selectedFiles[installment.installment_uuid];
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("challan_file", file);
    formData.append("_method", "PATCH");

    try {
      await uploadChallan({
        path: `/user/fees/installments/${installment.installment_uuid}/upload-paid-challan`,
        formData: formData,
      }).unwrap();

      toast.success(
        `Challan submitted successfully for Installment ${instIndex + 1}`
      );

      if (previewUrls[installment.installment_uuid]) {
        URL.revokeObjectURL(previewUrls[installment.installment_uuid]);
      }

      setSelectedFiles((prev) => ({
        ...prev,
        [installment.installment_uuid]: null,
      }));

      setPreviewUrls((prev) => ({
        ...prev,
        [installment.installment_uuid]: null,
      }));

      if (fileInputRefs.current[installment.installment_uuid]) {
        fileInputRefs.current[installment.installment_uuid].value = "";
      }
    } catch (error) {
      console.error("Upload error details:", error);
      toast.error(error?.data?.message || "Upload failed. Please try again.");
    }
  };

  const handleDownload = async (installment, classIndex, instIndex) => {
    setDownloadingInstallmentId(installment.installment_id);
    try {
      await downloadChallan({
        path: `/user/fees/installments/${installment.installment_uuid}/challan`,
        params: {},
        filename: `Challan_Installment_${instIndex + 1}_${
          studentData.first_name
        }_${studentData.last_name}.pdf`,
      }).unwrap();

      toast.success(`Challan downloaded successfully`);
    } catch (error) {
      console.error("Challan download error:", error);
      toast.error("Failed to download challan. Please try again.");
    } finally {
      setDownloadingInstallmentId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Fee Management Portal
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <User className="w-5 h-5 text-[#014376]" />
              <span className="font-semibold text-gray-900">
                {studentData.first_name} {studentData.last_name}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <BookOpen className="w-5 h-5 text-[#31918D]" />
              <span className="text-gray-700">
                {classesWithFees.length}{" "}
                {classesWithFees.length === 1 ? "Class" : "Classes"} Enrolled
              </span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-br from-[#014376] to-[#013057] rounded-2xl shadow-xl p-6 transform transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-2">
                  Total Fee Amount
                </p>
                <p className="text-4xl font-bold text-white mb-1">
                  Rs. {totalFeeAmount.toLocaleString()}
                </p>
                <p className="text-xs text-blue-200">Across all classes</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-xl backdrop-blur-sm">
                <h1 className="w-8 h-8 flex items-center justify-center rounded-full text-white text-2xl font-semibold">
                  Rs
                </h1>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#31918D] to-[#267b78] rounded-2xl shadow-xl p-6 transform transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm font-medium mb-2">
                  Payment Progress
                </p>
                <p className="text-4xl font-bold text-white mb-1">
                  {paidInstallments} / {totalInstallments}
                </p>
                <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mt-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(paidInstallments / totalInstallments) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-xl backdrop-blur-sm">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl shadow-xl p-6 transform transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium mb-2">
                  Amount Paid
                </p>
                <p className="text-4xl font-bold text-white mb-1">
                  Rs. {totalPaidAmount.toLocaleString()}
                </p>
                <p className="text-xs text-emerald-200">
                  {((totalPaidAmount / totalFeeAmount) * 100).toFixed(1)}%
                  completed
                </p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-xl backdrop-blur-sm">
                <Clock className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Classes with Installments */}
        {classesWithFees.map((classData, classIndex) => {
          const { classItem, feeData, installments } = classData;

          if (installments.length === 0) return null;

          const firstUnpaidIndex = installments.findIndex(
            (inst) => inst.status === "pending" || inst.status === "unpaid"
          );

          const totalFee = parseFloat(feeData?.total_fee || 0);
          const discountFee = parseFloat(feeData?.discount_fee || 0);
          const laptopFee = parseFloat(feeData?.laptop_fee || 0);
          const netPayable = totalFee - discountFee + laptopFee;

          const classPaidInstallments = installments.filter(
            (inst) => inst.status === "paid"
          ).length;
          const classTotalPaid = installments
            .filter((inst) => inst.status === "paid")
            .reduce((sum, inst) => sum + parseFloat(inst.amount || 0), 0);
          const classRemainingAmount = netPayable - classTotalPaid;

          return (
            <div
              key={classItem.id}
              className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-10"
            >
              {/* Class Header */}
              <div className="mb-8 pb-6 border-b-2 border-gray-200">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-[#014376] to-[#31918D] p-3 rounded-xl shadow-lg">
                      <BookOpen className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-1">
                        {classItem.course_name}
                      </h2>
                      <p className="text-lg text-gray-600 font-medium">
                        {classItem.name}
                      </p>
                    </div>
                  </div>
                  <span className="px-5 py-2 bg-gradient-to-r from-[#014376] to-[#31918D] text-white rounded-full text-sm font-bold shadow-lg">
                    Class {classIndex + 1}
                  </span>
                </div>

                {/* Class Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-[#014376]" />
                      <p className="text-xs text-gray-600 font-medium">
                        Instructor
                      </p>
                    </div>
                    <p className="font-bold text-gray-900">
                      {classItem.teacher_name}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <p className="text-xs text-gray-600 font-medium">
                        Start Date
                      </p>
                    </div>
                    <p className="font-bold text-gray-900">
                      {new Date(classItem.starting_date).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <p className="text-xs text-gray-600 font-medium">
                        Time Slot
                      </p>
                    </div>
                    <p className="font-bold text-gray-900 capitalize">
                      {classItem.time_slot}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="w-8 h-8 flex items-center justify-center rounded-full text-emerald-600 text-md font-semibold">
                        Rs
                      </h1>
                      <p className="text-xs text-gray-600 font-medium">
                        Net Payable
                      </p>
                    </div>
                    <p className="font-bold text-gray-900">
                      Rs. {netPayable.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Fee Breakdown */}
                {feeData && (
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <h1 className="w-8 h-8 flex items-center justify-center rounded-full text-[#014376] text-md font-semibold">
                        Rs
                      </h1>
                      Fee Breakdown
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <div className="bg-white rounded-xl p-4 border-2 border-green-300 shadow-sm">
                        <p className="text-xs text-gray-600 mb-1 font-semibold">
                          Course Fee
                        </p>
                        <p className="text-2xl font-bold text-green-700">
                          Rs. {parseFloat(feeData.total_fee).toLocaleString()}
                        </p>
                      </div>
                      {parseFloat(feeData.discount_fee) > 0 && (
                        <div className="bg-white rounded-xl p-4 border-2 border-purple-300 shadow-sm">
                          <p className="text-xs text-gray-600 mb-1 font-semibold">
                            Discount
                          </p>
                          <p className="text-2xl font-bold text-purple-700">
                            - Rs.{" "}
                            {parseFloat(feeData.discount_fee).toLocaleString()}
                          </p>
                        </div>
                      )}
                      {parseFloat(feeData.laptop_fee) > 0 && (
                        <div className="bg-white rounded-xl p-4 border-2 border-orange-300 shadow-sm">
                          <p className="text-xs text-gray-600 mb-1 font-semibold">
                            Laptop Fee
                          </p>
                          <p className="text-2xl font-bold text-orange-700">
                            + Rs.{" "}
                            {parseFloat(feeData.laptop_fee).toLocaleString()}
                          </p>
                        </div>
                      )}
                      <div className="bg-white rounded-xl p-4 border-2 border-[#014376] shadow-sm">
                        <p className="text-xs text-gray-600 mb-1 font-semibold">
                          Net Amount
                        </p>
                        <p className="text-2xl font-bold text-[#014376]">
                          Rs. {netPayable.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-white rounded-xl p-4 border-2 border-emerald-300 shadow-sm">
                        <p className="text-xs text-gray-600 mb-1 font-semibold">
                          Paid Amount
                        </p>
                        <p className="text-2xl font-bold text-emerald-700">
                          Rs. {classTotalPaid.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Installments List */}
              <div className="space-y-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <FileText className="w-6 h-6 text-[#014376]" />
                    Installment Schedule
                  </h3>
                  <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-4 py-2 rounded-full border border-gray-300">
                    {classPaidInstallments} / {installments.length} Completed
                  </span>
                </div>

                {installments.map((inst, instIndex) => {
                  const isActive = instIndex === firstUnpaidIndex;
                  const isPaid = inst.status === "paid";
                  const isLocked = !isPaid && !isActive;
                  const hasSelectedFile = selectedFiles[inst.installment_uuid];

                  return (
                    <div
                      key={inst.installment_uuid}
                      className={`relative rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                        isPaid
                          ? "bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-50 border-emerald-400 shadow-lg"
                          : isActive
                          ? "bg-white border-[#31918D] shadow-xl hover:shadow-2xl"
                          : "bg-gray-50 border-gray-300 opacity-60"
                      }`}
                    >
                      {isActive && !isPaid && (
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#014376] via-[#31918D] to-[#014376] animate-pulse"></div>
                      )}

                      {isPaid && (
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500"></div>
                      )}

                      {isLocked && (
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gray-400 to-gray-500"></div>
                      )}

                      <div className="p-6">
                        <div className="flex items-start justify-between mb-5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                                isPaid
                                  ? "bg-gradient-to-br from-emerald-500 to-green-500 text-white"
                                  : isActive
                                  ? "bg-gradient-to-br from-[#014376] to-[#31918D] text-white"
                                  : "bg-gray-300 text-gray-600"
                              }`}
                            >
                              {isPaid ? (
                                <Check className="w-6 h-6" />
                              ) : isLocked ? (
                                <Lock className="w-6 h-6" />
                              ) : (
                                instIndex + 1
                              )}
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-900 mb-1">
                                Installment {instIndex + 1}
                              </h4>
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                                  isPaid
                                    ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
                                    : isActive
                                    ? "bg-gradient-to-r from-[#014376] to-[#31918D] text-white"
                                    : "bg-gray-300 text-gray-700"
                                }`}
                              >
                                {isPaid && <Check className="w-3.5 h-3.5" />}
                                {isLocked && <Lock className="w-3.5 h-3.5" />}
                                {isPaid
                                  ? "Paid"
                                  : isActive
                                  ? "Ready to Pay"
                                  : "Locked"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                          <div className="lg:col-span-2 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="flex items-start gap-3 bg-white p-4 rounded-xl border-2 border-blue-200 shadow-sm">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                  <h1 className="w-6 h-6 flex items-center justify-center rounded-full text-[#014376] text-lg font-semibold">
                                    Rs
                                  </h1>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 font-medium mb-1">
                                    Amount Due
                                  </p>
                                  <p className="text-xl font-bold text-gray-900">
                                    Rs.{" "}
                                    {parseFloat(inst.amount).toLocaleString()}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-3 bg-white p-4 rounded-xl border-2 border-purple-200 shadow-sm">
                                <div className="bg-purple-100 p-2 rounded-lg">
                                  <Calendar className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 font-medium mb-1">
                                    Due Date
                                  </p>
                                  <p className="text-sm font-bold text-gray-900">
                                    {new Date(inst.due_date).toLocaleDateString(
                                      "en-US",
                                      {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      }
                                    )}
                                  </p>
                                </div>
                              </div>

                              {inst.paid_date && (
                                <div className="flex items-start gap-3 bg-white p-4 rounded-xl border-2 border-emerald-200 shadow-sm sm:col-span-2">
                                  <div className="bg-emerald-100 p-2 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-600 font-medium mb-1">
                                      Payment Completed On
                                    </p>
                                    <p className="text-sm font-bold text-gray-900">
                                      {new Date(
                                        inst.paid_date
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {inst.note && (
                              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border-2 border-blue-200">
                                <div className="flex items-start gap-2">
                                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs font-bold text-gray-900 mb-1">
                                      Important Note:
                                    </p>
                                    <p className="text-sm text-gray-700">
                                      {inst.note}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {hasSelectedFile && (
                              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-300">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                  <FileText className="w-5 h-5 text-[#014376]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-[#014376] truncate">
                                    {selectedFiles[inst.installment_uuid]?.name}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {(
                                      selectedFiles[inst.installment_uuid]
                                        ?.size / 1024
                                    ).toFixed(1)}{" "}
                                    KB
                                  </p>
                                </div>
                                <button
                                  onClick={() =>
                                    handleRemoveFile(inst.installment_uuid)
                                  }
                                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                >
                                  <X className="w-5 h-5 text-red-600" />
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="space-y-3">
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              ref={(el) =>
                                (fileInputRefs.current[inst.installment_uuid] =
                                  el)
                              }
                              onChange={(e) =>
                                handleFileChange(e, inst.installment_uuid)
                              }
                              disabled={isLocked}
                            />

                            {!isPaid && (
                              <button
                                disabled={
                                  isLocked ||
                                  (isDownloading &&
                                    downloadingInstallmentId ===
                                      inst.installment_id)
                                }
                                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm shadow-lg transition-all duration-300 ${
                                  isLocked
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-[#014376] to-[#31918D] hover:from-[#013057] hover:to-[#267b78] text-white hover:shadow-xl hover:scale-105"
                                } disabled:opacity-50`}
                                onClick={() =>
                                  handleDownload(inst, classIndex, instIndex)
                                }
                              >
                                <Download className="w-5 h-5" />
                                {isDownloading &&
                                downloadingInstallmentId === inst.installment_id
                                  ? "Downloading..."
                                  : "Download Challan"}
                              </button>
                            )}

                            {!isPaid && (
                              <>
                                <button
                                  disabled={isLocked}
                                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                                    isActive
                                      ? "bg-gradient-to-r from-[#014376] to-[#31918D] hover:from-[#013057] hover:to-[#267b78] text-white shadow-lg hover:shadow-xl hover:scale-105"
                                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  }`}
                                  onClick={() => {
                                    if (
                                      isActive &&
                                      fileInputRefs.current[
                                        inst.installment_uuid
                                      ]
                                    ) {
                                      fileInputRefs.current[
                                        inst.installment_uuid
                                      ].click();
                                    }
                                  }}
                                >
                                  <Upload className="w-5 h-5" />
                                  {hasSelectedFile
                                    ? "Change Challan"
                                    : "Upload Challan"}
                                </button>

                                {hasSelectedFile && (
                                  <>
                                    <button
                                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                                      onClick={() =>
                                        handlePreview(inst.installment_uuid)
                                      }
                                    >
                                      <Eye className="w-5 h-5" />
                                      Preview Challan
                                    </button>

                                    <button
                                      disabled={isLoading}
                                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                      onClick={() =>
                                        handleUpload(
                                          inst,
                                          classIndex,
                                          instIndex
                                        )
                                      }
                                    >
                                      <CheckCircle className="w-5 h-5" />
                                      {isLoading
                                        ? "Submitting..."
                                        : "Submit Payment"}
                                    </button>
                                  </>
                                )}
                              </>
                            )}

                            {isPaid && (
                              <div className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl text-white shadow-lg">
                                <CheckCircle className="w-5 h-5" />
                                <span className="text-sm font-bold">
                                  Payment Completed ✓
                                </span>
                              </div>
                            )}

                            {isLocked && (
                              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border-2 border-amber-300">
                                <div className="flex items-start gap-2">
                                  <Lock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-sm font-bold text-amber-900 mb-1">
                                      Installment Locked
                                    </p>
                                    <p className="text-xs text-amber-700">
                                      Please complete previous installment to
                                      unlock
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Footer Info */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 rounded-2xl p-6 border-2 border-blue-300 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <AlertCircle className="w-6 h-6 text-[#014376]" />
            </div>
            <div>
              <p className="text-base font-bold text-[#014376] mb-2">
                Payment Instructions
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-[#014376] font-bold">1.</span>
                  <span>
                    Download the challan form for the active installment
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#014376] font-bold">2.</span>
                  <span>
                    Complete the payment at your bank or authorized payment
                    center
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#014376] font-bold">3.</span>
                  <span>
                    Upload the paid challan receipt (image format, max 5MB)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#014376] font-bold">4.</span>
                  <span>
                    Installments must be completed sequentially - you cannot
                    skip ahead
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && currentPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4 backdrop-blur-sm"
          onClick={closePreview}
        >
          <div
            className="relative bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b-2 border-gray-200 bg-gradient-to-r from-[#014376] to-[#31918D]">
              <h3 className="text-xl font-bold text-white">Challan Preview</h3>
              <button
                onClick={closePreview}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            <div className="p-6 overflow-auto max-h-[calc(90vh-5rem)] bg-gray-50">
              <img
                src={currentPreview}
                alt="Challan Preview"
                className="w-full h-auto rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeesComponent;
