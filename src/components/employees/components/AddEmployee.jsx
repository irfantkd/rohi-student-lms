import { useState } from "react";
import FormInput from "../../ui/FormInput";
import { useGetQuery, usePostMutation } from "../../../api/apiSlice";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../ui/common/LoaderComponent";

export default function AddEmployee() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    contact: "",
    cnic: "",
    dob: "",
    gender: "",
    maritalStatus: "single",
    city: "",
    qualification: "",
    experience: "",
    designation: "",
    basicSalary: "",
    facilities: [],
    guardianName: "",
    guardianPhoneNo: "",
    address: "",
    note: "",
    active_status: true, 
    is_hostalize: false,
    isIntern: false, 
    profileImage: null,
    cnicFront: null,
    cnicBack: null,
    contractPdf: null,
    resumeUpload: null,
    educationPdf: null,
    experiencePdf: null,
    securityClearancePdf: null,
  });

  const { data: facilitiesData = [], isLoading: isFacilitiesLoading } =
    useGetQuery({
      path: "/admin/facilities",
    });

    const navigate = useNavigate()
  const [createTeacher, { isLoading }] = usePostMutation();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFacilitiesChange = (selected) => {
    setFormData((prev) => ({
      ...prev,
      facilities: Array.isArray(selected)
        ? selected.map((opt) => opt.value)
        : [],
    }));
  };

  const validMaritalStatuses = ["single", "married", "divorced", "widow"];

const handleSubmit = async (e) => {
  e.preventDefault();

  const ms = String(formData.maritalStatus || "").trim().toLowerCase();
  const validMaritalStatuses = ["single", "married", "divorced", "widow"];

  if (!validMaritalStatuses.includes(ms)) {
    alert(`Invalid marital status: must be ${validMaritalStatuses.join(", ")}`);
    return;
  }

  try {
    const payload = new FormData();

    for (const key in formData) {
      const val = formData[key];

      if (key === "facilities" && Array.isArray(val)) {
        val.forEach((f) => payload.append("facilities[]", f));
        continue;
      }

      if (key === "maritalStatus") {
        payload.append("maritalStatus", ms);
        continue;
      }

      if (key === "isIntern") {
        payload.append("isIntern", val ? 1 : 0);
        continue;
      }

      if (typeof val === "boolean") {
        payload.append(key, val ? 1 : 0);
        continue;
      }

      if (val instanceof File) {
        payload.append(key, val);
        continue;
      }

      if (val !== null && val !== undefined && val !== "") {
        payload.append(key, String(val).trim());
      }
    }

    await createTeacher({
      path: "/admin/teacher/store",
      body: payload,
    }).unwrap();
    toast.success("Instructor registered successfully");
    navigate(-1)

    // ✅ Reset form after successful submission
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      contact: "",
      cnic: "",
      dob: "",
      gender: "",
      maritalStatus: "single",
      city: "",
      qualification: "",
      experience: "",
      designation: "",
      basicSalary: "",
      facilities: [],
      guardianName: "",
      guardianPhoneNo: "",
      address: "",
      note: "",
      active_status: true,
      is_hostalize: false,
      isIntern: false,
      profileImage: null,
      cnicFront: null,
      cnicBack: null,
      contractPdf: null,
      resumeUpload: null,
      educationPdf: null,
      experiencePdf: null,
      securityClearancePdf: null,
    });

    // ✅ Optional: reset file inputs manually
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => (input.value = ""));
  } catch (error) {
    console.error("Error registering teacher:", error);
    alert(error?.data?.message || "Failed to register teacher");
  }
};



  const facilityOptions = facilitiesData?.data?.map((facility) => ({
    label: facility.facility_name,
    value: facility.id,
  }));

  return (
    <div className="min-h-screen py-12 px-4">
      {isLoading && <Loader/>}
      <div className="w-11/12 mx-auto bg-white rounded-2xl shadow-2xl p-8">
      <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl text-brown font-bold  text-center">
           Registration
        </h1>
        <X 
          onClick={() => navigate(-1)}
        className="text-brown "/>
      </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <FormInput label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
            <FormInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
            <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            <FormInput label="Phone" name="contact" type="tel" value={formData.contact} onChange={handleChange} required />
            <FormInput label="CNIC" name="cnic" value={formData.cnic} onChange={handleChange} required />
            <FormInput label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
            <FormInput label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} required />
            <FormInput
              label="Gender"
              name="gender"
              type="select"
              value={formData.gender}
              onChange={handleChange}
              options={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
             
              ]}
              required
            />
            {/* NOTE: values are lowercase so they match backend */}
            <FormInput
              label="Marital Status"
              name="maritalStatus"
              type="select"
              value={formData.maritalStatus}
              onChange={handleChange}
              options={[
                { label: "Single", value: "Single" },
                { label: "Married", value: "Married" },
           
              ]}
              required
            />
            <FormInput label="City" name="city" value={formData.city} onChange={handleChange} required />
            <FormInput label="Qualification" name="qualification" value={formData.qualification} onChange={handleChange} required />
            <FormInput label="Experience (years)" name="experience" type="number" value={formData.experience} onChange={handleChange} required />
            <FormInput label="Designation" name="designation" value={formData.designation} onChange={handleChange} required />
            <FormInput label="Basic Salary" name="basicSalary" type="number" value={formData.basicSalary} onChange={handleChange} required />
            <FormInput
              label="Facilities"
              name="facilities"
              type="select"
              value={formData.facilities}
              onChange={handleFacilitiesChange}
              options={facilityOptions}
              isMulti
              isLoading={isFacilitiesLoading}
            />
            <FormInput label="Guardian Name" name="guardianName" value={formData.guardianName} onChange={handleChange} />
            <FormInput label="Guardian Phone" name="guardianPhoneNo" type="tel" value={formData.guardianPhoneNo} onChange={handleChange} />
          </div>

          <FormInput label="Address" name="address" type="textarea" value={formData.address} onChange={handleChange} rows={3} required />
          <FormInput label="Note" name="note" type="textarea" value={formData.note} onChange={handleChange} rows={3} />

          <div className="grid grid-cols-2 gap-4 mb-5">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="active_status" checked={formData.active_status} onChange={handleChange} className="w-5 h-5 accent-[#014376]" />
              <span className="text-sm font-semibold text-gray-700">Active Status</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="is_hostalize" checked={formData.is_hostalize} onChange={handleChange} className="w-5 h-5 accent-[#014376]" />
              <span className="text-sm font-semibold text-gray-700">Is Hostelite</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="isIntern" checked={formData.isIntern} onChange={handleChange} className="w-5 h-5 accent-[#014376]" />
              <span className="text-sm font-semibold text-gray-700">Is Intern</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <FormInput label="Profile Image" name="profileImage" type="file" accept="image/*" onChange={handleChange} />
            <FormInput label="CNIC Front Upload" name="cnicFront" type="file" accept="image/*,application/pdf" onChange={handleChange} />
            <FormInput label="CNIC Back Upload" name="cnicBack" type="file" accept="image/*,application/pdf" onChange={handleChange} />
            <FormInput label="Contract PDF" name="contractPdf" type="file" accept="application/pdf" onChange={handleChange} />
            <FormInput label="Resume" name="resumeUpload" type="file" accept="application/pdf" onChange={handleChange} />
            <FormInput label="Education PDF" name="educationPdf" type="file" accept="application/pdf" onChange={handleChange} />
            <FormInput label="Experience PDF" name="experiencePdf" type="file" accept="application/pdf" onChange={handleChange} />
            <FormInput label="Security Clearance PDF" name="securityClearancePdf" type="file" accept="application/pdf" onChange={handleChange} />
          </div>

          <button
            type="submit"
            className="w-full mt-6 py-4 custom-AddButton text-white font-bold rounded-lg shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit Registration"}
          </button>
        </form>
      </div>
    </div>
  );
}
