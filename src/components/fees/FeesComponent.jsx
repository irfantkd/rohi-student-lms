import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDownloadChallanMutation, useUploadChallanMutation } from "../../api/apiSlice";
import { toast } from "react-toastify";
import { DollarSign, Calendar, Upload, Download, CheckCircle, Clock, FileText } from "lucide-react";

const FeesComponent = () => {
  const studentData = useSelector((state) => state.auth.user);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploadChallan, { isLoading }] = useUploadChallanMutation();
  const [downloadChallan, { isLoading: isDownloading }] = useDownloadChallanMutation();
  const fileInputRefs = useRef({});

  if (!studentData || !studentData.fees?.length) return null;

  const installments = studentData.fees.flatMap(fee =>
    fee.installments.map(inst => ({
      ...inst,
      total_fee: fee.total_fee,
      fee_note: fee.note,
      batch_name: fee.batch_name || studentData.batch_name,
      course_name: studentData.course_name,
      teacher_name: studentData.teacher_name,
    }))
  );

  const firstUnpaidIndex = installments.findIndex(inst => inst.status === "pending");

  const handleFileChange = (e, installmentUuid) => {
    setSelectedFiles(prev => ({ ...prev, [installmentUuid]: e.target.files[0] }));
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
        path: `/user/fees/installments/${installment.installment_uuid}/upload-paid-challan?method=PATCH`,
        formData: formData,
      }).unwrap();

      toast.success(`File uploaded for Installment ${installments.indexOf(installment) + 1}`);
      setSelectedFiles(prev => ({ ...prev, [installment.installment_uuid]: null }));
      
      if (fileInputRefs.current[installment.installment_uuid]) {
        fileInputRefs.current[installment.installment_uuid].value = "";
      }
    } catch (error) {
      console.error("Upload error details:", error);
      toast.error(error?.data?.message || "Upload failed.");
    }
  };

  const handleDownload = async (installment, index) => {
    try {
      await downloadChallan({
        path: `/user/fees/installments/${installment.installment_uuid}/challan`,
        params: {},
        filename: `Challan_Installment_${index + 1}_${studentData.first_name}_${studentData.last_name}.pdf`,
      }).unwrap();

      toast.success(`Challan for Installment ${index + 1} downloaded successfully!`);
    } catch (error) {
      console.error("Challan download error:", error);
      toast.error("Failed to download challan. Please try again.");
    }
  };

  const totalFeeAmount = installments[0]?.total_fee || "0.00";
  const paidInstallments = installments.filter(inst => inst.status === "paid").length;
  const totalInstallments = installments.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#014376] mb-2">Fee Management</h1>
          <p className="text-gray-600">
            {studentData.first_name} {studentData.last_name} - {studentData.course_name}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-[#014376] transform transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Fee</p>
                <p className="text-3xl font-bold text-[#014376]">Rs. {totalFeeAmount}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <DollarSign className="w-8 h-8 text-[#014376]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-[#31918D] transform transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Installments Paid</p>
                <p className="text-3xl font-bold text-[#31918D]">
                  {paidInstallments}/{totalInstallments}
                </p>
              </div>
              <div className="bg-teal-100 p-4 rounded-full">
                <CheckCircle className="w-8 h-8 text-[#31918D]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-amber-500 transform transition-all hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Status</p>
                <p className="text-2xl font-bold text-amber-600">
                  {paidInstallments === totalInstallments ? "Completed" : "In Progress"}
                </p>
              </div>
              <div className="bg-amber-100 p-4 rounded-full">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Installments List */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-[#014376] mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Fee Installments
          </h2>

          <div className="space-y-4">
            {installments.map((inst, index) => {
              const isActive = index === firstUnpaidIndex;
              const isPaid = inst.status === "paid";
              const hasSelectedFile = selectedFiles[inst.installment_uuid];

              return (
                <div
                  key={inst.installment_uuid}
                  className={`relative rounded-xl border-2 p-6 transition-all duration-300 ${
                    isPaid
                      ? "bg-green-50 border-green-300"
                      : isActive
                      ? "bg-gradient-to-r from-blue-50 to-teal-50 border-[#31918D] shadow-lg"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  {/* Status Badge */}
                  {/* <div className="absolute top-4 right-4">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                        isPaid
                          ? "bg-green-500 text-white"
                          : isActive
                          ? "bg-amber-500 text-white"
                          : "bg-gray-400 text-white"
                      }`}
                    >
                      {isPaid ? "PAID" : isActive ? "PENDING" : "LOCKED"}
                    </span>
                  </div> */}

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Installment Details */}
                    <div className="lg:col-span-2">
                      <h3 className="text-xl font-bold text-[#014376] mb-4">
                        Installment {index + 1}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <DollarSign className="w-5 h-5 text-[#31918D] mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Amount</p>
                            <p className="font-semibold text-gray-900">Rs. {inst.amount}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-[#31918D] mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Due Date</p>
                            <p className="font-semibold text-gray-900">
                              {new Date(inst.due_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {inst.paid_date && (
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600">Paid Date</p>
                              <p className="font-semibold text-gray-900">
                                {new Date(inst.paid_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {inst.fee_note && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Note:</span> {inst.fee_note}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 lg:items-end lg:justify-center">
                      {/* Hidden file input */}
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        ref={el => (fileInputRefs.current[inst.installment_uuid] = el)}
                        onChange={(e) => handleFileChange(e, inst.installment_uuid)}
                      />

                      {/* Upload Button */}
                      <button
                        disabled={!isActive || isLoading || isPaid}
                        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                          isActive && !isPaid
                            ? "bg-[#014376] hover:bg-[#013057] text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        onClick={() => {
                          if (fileInputRefs.current[inst.installment_uuid]) {
                            fileInputRefs.current[inst.installment_uuid].click();
                          }
                        }}
                      >
                        <Upload className="w-5 h-5" />
                        {hasSelectedFile ? "Change File" : "Upload Challan"}
                      </button>

                      {/* Submit Button - shown when file is selected */}
                      {hasSelectedFile && (
                        <button
                          disabled={isLoading}
                          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-[#31918D] hover:bg-[#267b78] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handleUpload(inst)}
                        >
                          <CheckCircle className="w-5 h-5" />
                          {isLoading ? "Submitting..." : "Submit"}
                        </button>
                      )}

                      {/* Download Button */}
                      <button
                        disabled={isDownloading}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#014376] to-[#31918D] hover:from-[#013057] hover:to-[#267b78] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleDownload(inst, index)}
                      >
                        <Download className="w-5 h-5" />
                        {isDownloading ? "Downloading..." : "Download Challan"}
                      </button>

                      {hasSelectedFile && (
                        <p className="text-xs text-center text-gray-600 mt-1">
                          📎 {selectedFiles[inst.installment_uuid]?.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Only the first pending installment can be uploaded at a time.</p>
        </div>
      </div>
    </div>
  );
};

export default FeesComponent;