import jsPDF from "jspdf";
import "jspdf-autotable";
import { BookOpen, School, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetQuery, usePostMutation } from "../../../api/apiSlice";
import FormInput from "../../ui/FormInput";
import Loader from "../../ui/common/LoaderComponent";
import { toast } from "react-toastify";

const StudentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const inquiryData = location.state?.inquiryData || null;
  const training_id = location.state?.enrollmentId || null;
  console.log("Inquiry Data:", inquiryData, "Training ID:", training_id);
  const [createStudent, { isLoading, isSuccess, isError }] = usePostMutation();
  const { data: classData } = useGetQuery({ path: "admin/classes" });
  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ];
  const maritalOptions = [
    { label: "Single", value: "single" },
    { label: "Married", value: "married" },
  ];
  const civilmilitary = [
    { label: "Civil", value: "Civil" },
    { label: "Military", value: "Military" },
  ];
  const [showChallanPrompt, setShowChallanPrompt] = useState(false);
  const [showChallanForm, setShowChallanForm] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [challanData, setChallanData] = useState({
    totalFee: "20000",
    discount: 0,
    installments: 1,
  });
  const [formData, setFormData] = useState({
    first_name: inquiryData?.first_name || "",
    last_name: inquiryData?.last_name || "",
    email: inquiryData?.email || "",
    password: inquiryData?.cnic || "",
    cnic: inquiryData?.cnic || "",
    contact: inquiryData?.phone || "",
    guardianName: inquiryData?.guardian_name || "",
    guardianPhone: inquiryData?.guardian_phone_number || "",
    city: inquiryData?.city || "",
    gender: inquiryData?.gender || "",
    maritalStatus: inquiryData?.marital_status || "",
    civilmilitaryStatus: inquiryData?.civil_military || "",
    dob: inquiryData?.date_of_birth
      ? inquiryData.date_of_birth.split("T")[0]
      : "",
    address: inquiryData?.address || "",
    image: null,
    batchId: "",
    batchName: "",
    instructorId: "",
    courseId: "",
    courseName: "",
    primaryCourse: inquiryData?.primary_course || "",
    secondaryCourse: inquiryData?.secondary_course || "",
    tertiaryCourse: inquiryData?.tertiary_course || "",
    occupation: inquiryData?.company_name || "",
    qualification: inquiryData?.current_qualification || "",
    program: inquiryData?.qualification_programs || "",
    fixedFeeDate: "",
    isPayingStudent: "1",
    isCharityScholarshipStudent: "0",
    laptopProvided: inquiryData?.is_labtop_demanded,
    active_status: "1",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      password: prev.cnic,
    }));
  }, [formData.cnic]);
const handleChange = (e) => {
  const { name, value, files } = e.target;
  let processedValue = value;
  
  if (name === "laptopProvided") {
    processedValue = value === "true" || value === true;
  }
  
  if (name === "batchId") {
    // Find the selected class from classData
    const selectedClass = classData?.data?.find(
      (batch) => String(batch.name) === String(value)
    );
    
    console.log("Selected Class:", selectedClass, "Value:", value);
    
    setFormData((prev) => ({
      ...prev,
      batchId: selectedClass?.class_id || "", // Use class_id from the API response
      batchName: value,
      courseId: selectedClass?.course?.id || "",
      courseName: selectedClass?.course?.name || "",
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : processedValue,
    }));
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      const fieldMapping = {
        first_name: "firstName",
        last_name: "lastName",
        contact: "contact",
        dob: "dob",
        maritalStatus: "maritalStatus",
        batchId: "batchId",
        batchName: "batchName",
        courseId: "courseId",
        courseName: "courseName",
        gender: "gender",
        image: "image",
        guardianName: "guardianName",
        guardianPhone: "guardianPhone",
        cnic: "cnic",
        email: "email",
        password: "password",
        city: "city",
        institute: "institute",
        occupation: "occupation",
        qualification: "qualification",
        program: "program",
        dateOfJoining: "dateOfJoining",
        fixedFeeDate: "fixedFeeDate",
        referenceSource: "referenceSource",
        note: "note",
        isPayingStudent: "isPayingStudent",
        isCharityScholarshipStudent: "isCharityScholarshipStudent",
        laptopProvided: "laptopProvided",
        active_status: "active_status",
        is_hostalize: "is_hostalize",
        is_intern: "is_intern",
        fatherOccupation: "fatherOccupation",
      };
      for (const key in formData) {
        if (key === "batchName" || key === "courseName") continue;
        const backendKey = fieldMapping[key] || key;
        let value = formData[key];
        if (key === "laptopProvided") {
          value = formData.laptopProvided ? 1 : 0;
        }
        payload.append(backendKey, value);
      }
      if (training_id) {
        payload.append("training_id", training_id);
      }
      const response = await createStudent({
        path: "/admin/user/store",
        body: payload,
      }).unwrap();
      setStudentId(response.studentId || "TEMP_ID");
      setShowChallanPrompt(true);
    } catch (error) {
      console.error("Error enrolling student:", error);
      toast.error(error?.data?.message || "Failed to enroll student");
    }
  };

  const generateChallanPDF = (student, challanData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width; // ~210mm for A4
    const pageHeight = doc.internal.pageSize.height; // ~297mm for A4
    const challanWidth = pageWidth / 3; // ~70mm per challan
    const instituteName = "Rohi E-Skill Learning Hub";
    const instituteTagline = "Building Future Leaders";
    const logoUrl = "../../../assets/Rohi logo 3d.png";
    const img = new Image();
    img.src = logoUrl;

    const drawChallan = (copyTitle, xOffset) => {
      // Header Border
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.rect(5 + xOffset, 10, challanWidth - 10, 30);
      if (img.complete) {
        doc.addImage(img, "PNG", 8 + xOffset, 12, 15, 15);
      }
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text(instituteName, 25 + xOffset, 20, {
        maxWidth: challanWidth - 30,
      });
      doc.setFontSize(7);
      doc.setFont(undefined, "normal");
      doc.text(instituteTagline, 25 + xOffset, 25, {
        maxWidth: challanWidth - 30,
      });
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.3);
      doc.line(5 + xOffset, 42, challanWidth - 5 + xOffset, 42);
      doc.line(5 + xOffset, 50, challanWidth - 5 + xOffset, 50);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont(undefined, "bold");
      doc.text(`FEE CHALLAN - ${copyTitle}`, 8 + xOffset, 47, {
        maxWidth: challanWidth - 16,
      });
      doc.setFontSize(7);
      doc.setFont(undefined, "normal");
      doc.text(
        `Issue: ${new Date().toLocaleDateString()}`,
        challanWidth - 25 + xOffset,
        47
      );
      let yPos = 55;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.3);
      doc.rect(8 + xOffset, yPos, challanWidth - 16, 30);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont(undefined, "bold");
      doc.text("Student Info", 10 + xOffset, yPos + 6);
      doc.line(8 + xOffset, yPos + 8, challanWidth - 8 + xOffset, yPos + 8);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(7);
      doc.setFont(undefined, "normal");
      doc.text("Name:", 10 + xOffset, yPos + 14);
      doc.setFont(undefined, "bold");
      doc.text(student.name || "Unknown", 25 + xOffset, yPos + 14, {
        maxWidth: challanWidth - 35,
      });
      doc.setFont(undefined, "normal");
      doc.text("Course:", 10 + xOffset, yPos + 22);
      doc.setFont(undefined, "bold");
      doc.text(student.courseName || "N/A", 25 + xOffset, yPos + 22, {
        maxWidth: challanWidth - 35,
      });
      yPos = 90;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.3);
      doc.rect(8 + xOffset, yPos, challanWidth - 16, 8);
      doc.setFillColor(0, 0, 0);
      doc.rect(8 + xOffset, yPos, challanWidth - 16, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont(undefined, "bold");
      doc.text("Fee Breakdown", 10 + xOffset, yPos + 6);
      yPos += 10;
      const { totalFee = 0, discount = 0, installments = 1 } = challanData;
      const netPayable = totalFee - discount;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.3);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(7);
      doc.setFont(undefined, "normal");
      doc.text("Total Fee", 10 + xOffset, yPos);
      doc.setFont(undefined, "bold");
      doc.text(
        `Rs ${totalFee.toLocaleString()}`,
        challanWidth - 10 + xOffset,
        yPos,
        { align: "right" }
      );
      doc.line(8 + xOffset, yPos + 2, challanWidth - 8 + xOffset, yPos + 2);
      yPos += 8;
      doc.setFont(undefined, "normal");
      doc.text("Discount", 10 + xOffset, yPos);
      doc.setFont(undefined, "bold");
      doc.text(
        `- Rs ${discount.toLocaleString()}`,
        challanWidth - 10 + xOffset,
        yPos,
        { align: "right" }
      );
      doc.line(8 + xOffset, yPos + 2, challanWidth - 8 + xOffset, yPos + 2);
      yPos += 8;
      doc.setDrawColor(0, 0, 0);
      doc.roundedRect(8 + xOffset, yPos - 3, challanWidth - 16, 8, 1, 1);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(8);
      doc.setFont(undefined, "bold");
      doc.text("Net Payable", 10 + xOffset, yPos + 2);
      doc.text(
        `Rs ${netPayable.toLocaleString()}`,
        challanWidth - 10 + xOffset,
        yPos + 2,
        { align: "right" }
      );
      yPos += 12;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.3);
      doc.roundedRect(8 + xOffset, yPos, challanWidth - 16, 20, 2, 2);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont(undefined, "bold");
      doc.text("Installments", 10 + xOffset, yPos + 6);
      doc.line(8 + xOffset, yPos + 8, challanWidth - 8 + xOffset, yPos + 8);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(7);
      doc.setFont(undefined, "normal");
      doc.text("No.:", 10 + xOffset, yPos + 14);
      doc.setFont(undefined, "bold");
      doc.text(String(installments), 25 + xOffset, yPos + 14);
      doc.setFont(undefined, "normal");
      doc.text("Per Inst.:", challanWidth - 35 + xOffset, yPos + 14);
      doc.setFont(undefined, "bold");
      const installmentAmount = Math.ceil(netPayable / installments);
      doc.text(
        `Rs ${installmentAmount.toLocaleString()}`,
        challanWidth - 10 + xOffset,
        yPos + 14,
        { align: "right" }
      );
      yPos += 25;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.3);
      doc.roundedRect(8 + xOffset, yPos, challanWidth - 16, 30, 2, 2);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont(undefined, "bold");
      doc.text("Payment Instructions", 10 + xOffset, yPos + 6);
      doc.line(8 + xOffset, yPos + 8, challanWidth - 8 + xOffset, yPos + 8);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(6);
      doc.setFont(undefined, "normal");
      const instructions = [
        "• Pay via bank or institute reception",
        `• ${
          copyTitle === "Bank Copy"
            ? "Submit to bank"
            : copyTitle === "Institute Copy"
            ? "Submit to institute"
            : "Keep for records"
        }`,
        "• Late payment incurs penalty",
      ];
      instructions.forEach((instruction, index) => {
        doc.text(instruction, 10 + xOffset, yPos + 14 + index * 5, {
          maxWidth: challanWidth - 20,
        });
      });
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.3);
      doc.line(
        5 + xOffset,
        pageHeight - 20,
        challanWidth - 5 + xOffset,
        pageHeight - 20
      );
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(6);
      doc.text(
        "Computer-generated challan. No signature required.",
        challanWidth / 2 + xOffset,
        pageHeight - 10,
        { align: "center", maxWidth: challanWidth - 10 }
      );
    };

    drawChallan("Bank Copy", 0);
    drawChallan("Institute Copy", challanWidth);
    drawChallan("Student Copy", challanWidth * 2);

    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Challan_${student.name || "Student"}_${new Date().getTime()}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleChallanSubmit = (e) => {
    e.preventDefault();
    if (!challanData.totalFee || challanData.totalFee <= 0) {
      alert("Please enter a valid total fee.");
      return;
    }
    const student = {
      name: `${formData.first_name} ${formData.last_name}`,
      courseName: formData.courseName,
      id: studentId || "TEMP_ID",
    };
    generateChallanPDF(student, challanData);
    setShowChallanForm(false);
    setShowChallanPrompt(false);
    navigate("/dashboard/students");
  };

  return (
    <div className="min-h-screen p-4 overflow-hidden">
      {isLoading && <Loader />}
      <div className="z-10 w-11/12 mx-auto overflow-hidden">
        <div className="p-8 text-white custom-Background">
          <X className="float-end" onClick={() => navigate(-1)} />
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-white/20">
              <BookOpen />
            </div>
            <h1 className="mb-2 text-4xl font-bold tracking-tight">
              Enroll Student
            </h1>
          </div>
        </div>
        <div className="p-8">
          <div className="mb-10">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-10 h-10 mr-4 rounded-full custom-Background">
                <User color="white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#014376]">
                  Personal Information
                </h2>
                <div className="w-20 h-1 mt-1 rounded-full custom-Background"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FormInput
                type="text"
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
              <FormInput
                type="text"
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
              <FormInput
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <FormInput
                type="password"
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <FormInput
                type="text"
                label="CNIC"
                name="cnic"
                value={formData.cnic}
                onChange={handleChange}
                required
              />
              <FormInput
                type="tel"
                label="Phone Number"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
              />
              <FormInput
                type="text"
                label="Guardian Name"
                name="guardianName"
                value={formData.guardianName}
                onChange={handleChange}
                required
              />
              <FormInput
                type="tel"
                label="Guardian Phone"
                name="guardianPhone"
                value={formData.guardianPhone}
                onChange={handleChange}
                required
              />
              <FormInput
                type="select"
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={genderOptions}
              />
              <FormInput
                type="text"
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
              <FormInput
                type="select"
                label="Marital Status"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                options={maritalOptions}
              />
              <FormInput
                type="date"
                label="Date of Birth"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
              <FormInput
                type="select"
                label="Civil/Military Status"
                name="civilmilitaryStatus"
                value={formData.civilmilitaryStatus}
                onChange={handleChange}
                options={civilmilitary}
              />
              <FormInput
                type="textarea"
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                required
              />
              <FormInput
                type="file"
                label="Profile Image"
                name="image"
                onChange={handleChange}
                accept="image/*"
              />
            </div>
          </div>
          <div className="mb-10">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-10 h-10 mr-4 rounded-full custom-Background">
                <School color="white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#014376]">
                  Academic & Course Information
                </h2>
                <div className="w-20 h-1 mt-1 rounded-full custom-Background"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FormInput
                type="text"
                label="Primary Course"
                name="primaryCourse"
                value={formData.primaryCourse}
                onChange={handleChange}
                required
              />
              <FormInput
                type="text"
                label="Secondary Course"
                name="secondaryCourse"
                value={formData.secondaryCourse}
                onChange={handleChange}
              />
              <FormInput
                type="text"
                label="Tertiary Course"
                name="tertiaryCourse"
                value={formData.tertiaryCourse}
                onChange={handleChange}
              />
              <div className="flex flex-col">
                <label className="mb-2 text-sm font-semibold text-gray-700">
                  Class <span className="text-red-500">*</span>
                </label>
                <select
                  name="batchId"
                  value={formData.batchName}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a Class</option>
                  {classData?.data?.map((batch) => (
                    <option key={batch.class_id} value={batch.name}>
                      {batch.name}
                    </option>
                  ))}
                </select>
              </div>
              <FormInput
                type="text"
                label="Course"
                name="courseName"
                value={formData.courseName}
                disabled
              />
              <FormInput
                type="text"
                label="Qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                required
              />
              <FormInput
                type="text"
                label="Program"
                name="program"
                value={formData.program}
                onChange={handleChange}
                required
              />
              <FormInput
                type="text"
                label="Organization/Institute"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
              />
              <FormInput
                type="select"
                label="Laptop Provided"
                name="laptopProvided"
                value={formData.laptopProvided}
                onChange={handleChange}
                options={[
                  { label: "Yes", value: true },
                  { label: "No", value: false },
                ]}
              />
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={handleSubmit}
              className="px-12 py-4 rounded-xl font-bold text-lg shadow-xl custom-Background text-white"
            >
              Submit Enrollment
            </button>
          </div>
        </div>
      </div>
      {showChallanPrompt && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[400px] text-center">
            <h2 className="text-xl font-semibold mb-4">
              Generate challan for this student?
            </h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setShowChallanForm(true);
                  setShowChallanPrompt(false);
                }}
                className="bg-green-600 text-white px-5 py-2 rounded-lg"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  setShowChallanPrompt(false);
                  navigate("/dashboard/students");
                }}
                className="bg-gray-400 text-white px-5 py-2 rounded-lg"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {showChallanForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <form
            onSubmit={handleChallanSubmit}
            className="bg-white p-6 rounded-xl shadow-xl w-[420px]"
          >
            <h2 className="text-xl font-bold mb-4 text-center">
              Challan Details
            </h2>
            <label className="block mb-2 font-semibold">Discount (%)</label>
            <input
              type="number"
              value={challanData.discount}
              onChange={(e) =>
                setChallanData((prev) => ({
                  ...prev,
                  discount: e.target.value,
                }))
              }
              className="w-full mb-4 border px-3 py-2 rounded"
              min="0"
            />
            <label className="block mb-2 font-semibold">Installments</label>
            <input
              type="number"
              value={challanData.installments}
              onChange={(e) =>
                setChallanData((prev) => ({
                  ...prev,
                  installments: e.target.value,
                }))
              }
              className="w-full mb-4 border px-3 py-2 rounded"
              min="1"
            />
            <label className="block mb-2 font-semibold">Total Fee</label>
            <input
              type="number"
              value={challanData.totalFee}
              onChange={(e) =>
                setChallanData((prev) => ({
                  ...prev,
                  totalFee: e.target.value,c
                }))
              }
              className="w-full mb-4 border px-3 py-2 rounded"
              min="0"
            />
            <button
              type="submit"
              className="w-full custom-AddButton text-white py-2 rounded-lg font-semibold"
            >
              Generate Challan
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default StudentForm; 