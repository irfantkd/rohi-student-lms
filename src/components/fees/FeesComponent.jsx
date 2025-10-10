import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDownloadChallanMutation, useUploadChallanMutation } from "../../api/apiSlice";
import { toast } from "react-toastify";

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
    // Some Laravel/PHP backends need this for PATCH with FormData
    formData.append("_method", "PATCH");

    // Debug: Check what's being sent
    console.log("File being uploaded:", file);
    console.log("File name:", file.name);
    console.log("File size:", file.size);
    console.log("File type:", file.type);
    
    // Verify FormData contents
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const result = await uploadChallan({
        path: `/user/fees/installments/${installment.installment_uuid}/upload-paid-challan?method=patch`,
        formData: formData,
      }).unwrap();

      console.log("Upload result:", result);
      toast.success(`File uploaded for Installment ${installments.indexOf(installment) + 1}`);
      setSelectedFiles(prev => ({ ...prev, [installment.installment_uuid]: null }));
      
      // Reset the file input
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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6" style={{ color: "#014376" }}>
        Fee Installments for {studentData.first_name} {studentData.last_name}
      </h2>

      <div className="space-y-5">
        {installments.map((inst, index) => (
          <div
            key={inst.installment_uuid}
            className="p-5 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center transition-transform hover:scale-105"
            style={{
              backgroundColor: index % 2 === 0 ? "#EAF4F4" : "#fff",
              borderLeft: `6px solid ${inst.status === "paid" ? "green" : "#31918D"}`,
            }}
          >
            <div className="mb-4 md:mb-0">
              <p className="text-lg font-semibold" style={{ color: "#014376" }}>
                Installment {index + 1} ({inst.status.toUpperCase()})
              </p>
              <p><strong>Total Fee:</strong> {inst.total_fee}</p>
              <p><strong>Amount:</strong> {inst.amount}</p>
              <p><strong>Due Date:</strong> {new Date(inst.due_date).toLocaleDateString()}</p>
              <p>
                <strong>Paid Date:</strong>{" "}
                {inst.paid_date ? new Date(inst.paid_date).toLocaleDateString() : "Not Paid"}
              </p>
              {inst.fee_note && <p><strong>Note:</strong> {inst.fee_note}</p>}
              <p><strong>Batch:</strong> {inst.batch_name}</p>
              <p><strong>Course:</strong> {inst.course_name}</p>
              <p><strong>Teacher:</strong> {inst.teacher_name}</p>
            </div>

            <div className="flex flex-col gap-2">
              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={el => (fileInputRefs.current[inst.installment_uuid] = el)}
                onChange={(e) => handleFileChange(e, inst.installment_uuid)}
              />

              {/* Upload button triggers file input */}
              <button
                disabled={index !== firstUnpaidIndex || isLoading}
                style={{
                  backgroundColor: index === firstUnpaidIndex ? "#014376" : "#ccc",
                  color: "#fff",
                  padding: "0.6rem 1.2rem",
                  borderRadius: "0.5rem",
                  cursor: index === firstUnpaidIndex ? "pointer" : "not-allowed",
                  height: "fit-content",
                }}
                onClick={() => {
                  if (fileInputRefs.current[inst.installment_uuid]) {
                    fileInputRefs.current[inst.installment_uuid].click();
                  }
                }}
              >
                {selectedFiles[inst.installment_uuid]
                  ? "File Selected! Click to Upload"
                  : "Upload"}
              </button>

              {/* Confirm upload button */}
              {selectedFiles[inst.installment_uuid] && (
                <button
                  disabled={isLoading}
                  className="mt-1 px-4 py-2 rounded bg-[#31918D] text-white hover:bg-[#267b78] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleUpload(inst)}
                >
                  {isLoading ? "Uploading..." : "Submit"}
                </button>
              )}

              {/* Download Challan button */}
              <button
                disabled={isDownloading}
                className="mt-1 px-4 py-2 rounded bg-[#014376] text-white hover:bg-[#013057] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleDownload(inst, index)}
              >
                {isDownloading ? "Downloading..." : "Download Challan"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeesComponent;