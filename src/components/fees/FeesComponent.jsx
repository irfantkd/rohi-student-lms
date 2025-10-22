import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  useDownloadChallanMutation,
  useUploadChallanMutation,
} from "../../api/apiSlice";
import { toast } from "react-toastify";
import {
  DollarSign,
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
  const fileInputRefs = useRef({});

  if (!studentData) return null;

  // Extract installments from fees array
  const installments =
    studentData.fees?.flatMap(
      (fee) =>
        fee.installments?.map((inst) => ({
          ...inst,
          total_fee: fee.total_fee,
          fee_note: fee.note,
          batch_name: fee.batch_name || studentData.batch_name,
          course_name: studentData.course_name,
          teacher_name: studentData.teacher_name,
        })) || []
    ) || [];

  if (installments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No Fee Information Available
            </h2>
            <p className="text-gray-600">
              There are no fee installments to display at this time.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const firstUnpaidIndex = installments.findIndex(
    (inst) => inst.status === "pending"
  );

  const handleFileChange = (e, installmentUuid) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file.");
        return;
      }

      // Validate file size (max 5MB)
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
    // Clean up preview URL
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

  const handleUpload = async (installment) => {
    const file = selectedFiles[installment.installment_uuid];
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("challan_file", file);
    formData.append("_method", "PATCH");

    try {
      const result = await uploadChallan({
        path: `/user/fees/installments/${installment.installment_uuid}/upload-paid-challan`,
        formData: formData,
      }).unwrap();

      toast.success(
        `Challan submitted successfully for Installment ${
          installments.indexOf(installment) + 1
        }`
      );

      // Clean up preview URL
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

  const handleDownload = async (installment, index) => {
    try {
      await downloadChallan({
        path: `/user/fees/installments/${installment.installment_uuid}/challan`,
        params: {},
        filename: `Challan_Installment_${index + 1}_${studentData.first_name}_${
          studentData.last_name
        }.pdf`,
      }).unwrap();

      toast.success(`Challan downloaded successfully`);
    } catch (error) {
      console.error("Challan download error:", error);
      toast.error("Failed to download challan. Please try again.");
    }
  };

  const totalFeeAmount = installments[0]?.amount || "0.00";
  const paidInstallments = installments.filter(
    (inst) => inst.status === "paid"
  ).length;
  const totalInstallments = installments.length;
  const totalPaidAmount = installments
    .filter((inst) => inst.status === "paid")
    .reduce((sum, inst) => sum + parseFloat(inst.amount.replace(/,/g, "")), 0)
    .toLocaleString();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Fee Management
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="font-medium">
                {studentData.first_name} {studentData.last_name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gray-400" />
              <span>{studentData.course_name}</span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#014376] to-[#013057] rounded-xl shadow-lg p-6 transform transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-2">
                  Total Fee Amount
                </p>
                <p className="text-3xl font-bold text-white">
                  Rs. {totalFeeAmount}
                </p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur-sm">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#31918D] to-[#267b78] rounded-xl shadow-lg p-6 transform transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm font-medium mb-2">
                  Installments Progress
                </p>
                <p className="text-3xl font-bold text-white">
                  {paidInstallments} / {totalInstallments}
                </p>
                <p className="text-xs text-teal-100 mt-1">Completed</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur-sm">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-xl shadow-lg p-6 transform transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium mb-2">
                  Total Amount Paid
                </p>
                <p className="text-3xl font-bold text-white">
                  Rs. {totalPaidAmount}
                </p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur-sm">
                <Clock className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Installments List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-900">
              Fee Installments
            </h2>
          </div>

          <div className="space-y-6">
            {installments.map((inst, index) => {
              const isActive = index === firstUnpaidIndex;
              const isPaid = inst.status === "paid";
              const hasSelectedFile = selectedFiles[inst.installment_uuid];

              return (
                <div
                  key={inst.installment_uuid}
                  className={`relative rounded-xl border transition-all duration-300 overflow-hidden ${
                    isPaid
                      ? "bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-50 border-emerald-300 shadow-md"
                      : isActive
                      ? "bg-white border-[#31918D] border-2 shadow-lg hover:shadow-xl"
                      : "bg-gray-50 border-gray-200 opacity-70"
                  }`}
                >
                  {/* Decorative accent bar for active installment */}
                  {isActive && !isPaid && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#014376] via-[#31918D] to-[#014376]"></div>
                  )}

                  {/* Decorative accent bar for paid installment */}
                  {isPaid && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500"></div>
                  )}

                  <div className="p-6">
                    {/* Status Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          Installment {index + 1}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                            isPaid
                              ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
                              : isActive
                              ? "bg-gradient-to-r from-[#014376] to-[#31918D] text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {isPaid && <Check className="w-3.5 h-3.5" />}
                          {isPaid
                            ? "Paid"
                            : isActive
                            ? "Pending Payment"
                            : "Locked"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Installment Details */}
                      <div className="lg:col-span-2 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-gradient-to-br from-[#014376] to-[#31918D] p-2 rounded-lg shadow-sm">
                              <DollarSign className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Amount Due
                              </p>
                              <p className="text-base font-semibold text-gray-900 mt-0.5">
                                Rs. {inst.amount}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="bg-gradient-to-br from-[#31918D] to-[#267b78] p-2 rounded-lg shadow-sm">
                              <Calendar className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Due Date
                              </p>
                              <p className="text-base font-semibold text-gray-900 mt-0.5">
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
                            <div className="flex items-start gap-3">
                              <div className="bg-gradient-to-br from-emerald-500 to-green-500 p-2 rounded-lg shadow-sm">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                  Payment Date
                                </p>
                                <p className="text-base font-semibold text-gray-900 mt-0.5">
                                  {new Date(inst.paid_date).toLocaleDateString(
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
                          )}
                        </div>

                        {(inst.note || inst.fee_note) && (
                          <div className="space-y-2">
                            {inst.note && (
                              <div className="bg-white p-3 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium text-gray-900">
                                    Note:
                                  </span>{" "}
                                  {inst.note}
                                </p>
                              </div>
                            )}
                            {inst.fee_note && (
                              <div className="bg-white p-3 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium text-gray-900">
                                    Fee Note:
                                  </span>{" "}
                                  {inst.fee_note}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {hasSelectedFile && (
                          <div className="relative group">
                            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                              <FileText className="w-4 h-4 text-[#014376] flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-[#014376] truncate">
                                  {selectedFiles[inst.installment_uuid]?.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(
                                    selectedFiles[inst.installment_uuid]?.size /
                                    1024
                                  ).toFixed(1)}{" "}
                                  KB
                                </p>
                              </div>
                              <button
                                onClick={() =>
                                  handleRemoveFile(inst.installment_uuid)
                                }
                                className="p-1.5 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
                                title="Remove file"
                              >
                                <X className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        {/* Hidden file input */}
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          ref={(el) =>
                            (fileInputRefs.current[inst.installment_uuid] = el)
                          }
                          onChange={(e) =>
                            handleFileChange(e, inst.installment_uuid)
                          }
                        />

                        {/* Download Button - Only show for unpaid installments */}
                        {!isPaid && (
                          <button
                            disabled={isDownloading}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm bg-gradient-to-r from-[#014376] to-[#31918D] hover:from-[#013057] hover:to-[#267b78] text-white shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 disabled:transform-none"
                            onClick={() => handleDownload(inst, index)}
                          >
                            <Download className="w-5 h-5" />
                            {isDownloading ? (
                              <>
                                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                Downloading...
                              </>
                            ) : (
                              "Download Challan"
                            )}
                          </button>
                        )}

                        {/* Upload Button - Only active for first unpaid installment */}
                        {!isPaid && (
                          <>
                            <button
                              disabled={!isActive}
                              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                                isActive
                                  ? "bg-gradient-to-r from-[#014376] to-[#31918D] hover:from-[#013057] hover:to-[#267b78] text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                              }`}
                              onClick={() => {
                                if (
                                  fileInputRefs.current[inst.installment_uuid]
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
                                : "Select Challan"}
                            </button>

                            {/* Preview Button - shown when file is selected */}
                            {hasSelectedFile && (
                              <button
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                                onClick={() =>
                                  handlePreview(inst.installment_uuid)
                                }
                              >
                                <Eye className="w-5 h-5" />
                                Preview Challan
                              </button>
                            )}

                            {/* Submit Button - shown when file is selected */}
                            {hasSelectedFile && (
                              <button
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                onClick={() => handleUpload(inst)}
                              >
                                <CheckCircle className="w-5 h-5" />
                                {isLoading ? (
                                  <>
                                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                    Submitting...
                                  </>
                                ) : (
                                  "Submit Challan"
                                )}
                              </button>
                            )}
                          </>
                        )}

                        {/* Paid Status Message */}
                        {isPaid && (
                          <div className="relative overflow-hidden">
                            <div className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg text-white shadow-md">
                              <CheckCircle className="w-5 h-5" />
                              <span className="text-sm font-semibold">
                                Payment Completed Successfully
                              </span>
                            </div>
                            <div className="absolute top-0 left-0 right-0 h-full bg-white opacity-10 animate-pulse"></div>
                          </div>
                        )}

                        {!isActive && !isPaid && (
                          <div className="flex items-start gap-2 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-semibold text-amber-900 mb-0.5">
                                Locked
                              </p>
                              <p className="text-xs text-amber-700">
                                Complete previous installment to unlock
                              </p>
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

        {/* Footer Info */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-200 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-gradient-to-br from-[#014376] to-[#31918D] p-2 rounded-lg shadow-sm">
              <AlertCircle className="w-5 h-5 text-white flex-shrink-0" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#014376] mb-1">
                Payment Instructions
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Download the challan form, complete the payment at your bank,
                and upload the paid challan receipt. Installments must be
                completed sequentially - complete the current installment to
                unlock the next one.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && currentPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm"
          onClick={closePreview}
        >
          <div
            className="relative bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">
                Challan Preview
              </h3>
              <button
                onClick={closePreview}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-5rem)]">
              <img
                src={currentPreview}
                alt="Challan Preview"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeesComponent;
