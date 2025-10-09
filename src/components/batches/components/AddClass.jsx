import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import useNavigate
import FormInput from "../../ui/FormInput";
import { useGetQuery, usePostMutation } from "../../../api/apiSlice";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import Loader from "../../ui/common/LoaderComponent";

const AddBatch = () => {
  const navigate = useNavigate(); // ✅ initialize navigate

  const [formData, setFormData] = useState({
    course: "",
    instructor: "",
    timeSlot: "",
    date: "",
    startTime: "",
    endTime: "",
    militaryQuota: "",
    civiliansQuota: "",
    hall_id: "",
    batch_id : "",
    is_active: 1,
  });

  const { data: coursesData } = useGetQuery({ path: "/admin/courses" });
  const { data: halls } = useGetQuery({ path: "admin/halls" });
  const { data: instructorsData } = useGetQuery({
    path: "/admin/users/teacher",
  });
    const { data: batches } = useGetQuery({
    path: "/admin/batches",
  });
  console.log("batches", batches);
  
  const [post, { isLoading }] = usePostMutation();

  const courses =
    coursesData?.data?.map((course) => ({
      value: course.id,
      label: course.name,
    })) || [];

  const instructors =
    instructorsData?.data?.map((instructor) => ({
      value: instructor.id,
      label: `${instructor.first_name} ${instructor.last_name}`,
    })) || [];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const timing = `${formData.startTime} to ${formData.endTime}`;

    const payload = {
      course_id: formData.course,
      teacher_id: formData.instructor,
      time_slot: formData.timeSlot,
      date: formData.date,
      timing,
      military_quota: formData.militaryQuota,
      civilians_quota: formData.civiliansQuota,
      hall_id: formData.hall,
      batch_id: formData.batch_id,
      is_active: formData.is_active,
    };

    try {
      const response = await post({
        path: "admin/class/create",
        body: payload,
      }).unwrap();

    

      console.log("Batch created successfully:", response);

      // reset form
      setFormData({
        course: "",
        instructor: "",
        timeSlot: "",
        date: "",
        startTime: "",
        endTime: "",
        militaryQuota: "",
        civiliansQuota: "",
        hall: "",
        is_active: 1,
        batch_id : "",
      });

      toast.success("Class added successfully!");
      navigate("/dashboard/batches");
    } catch (err) {
  console.error("Failed to create batch:", err);

  const errorMessage =
    err?.data?.message ||                // common error shape
    err?.data?.errors?.timing?.[0] ||    // validation error example
    err?.data?.errors?.teacher_id?.[0] || 
    err?.data?.errors?.hall_id?.[0] ||
    err?.error ||
    "Failed to create class. Please try again.";

  toast.error(errorMessage);
}
  };

  return (

    <div className="min-h-screen p-6">
      {isLoading && (
        <Loader/>
      )}
      <div className="w-11/12 mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[#014376]">Add New Class</h2>
          <X onClick={() => navigate(-1)} className="text-brown" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              type="select"
              label="Course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              options={courses}
              placeholder="Select Course"
              required
            />
               <FormInput
              type="select"
              label="batches"
              name="batch_id"
              value={formData.batch_id}
              onChange={handleChange}
              options={
                batches?.data?.map((batch) => ({
                  value: batch.id,
                  label: batch.name,
                })) || []
              }
              placeholder="Select Batch"
              required
            />
            <FormInput
              type="select"
              label="Instructor"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              options={instructors}
              placeholder="Select Instructor"
              required
            />
            <FormInput
              type="select"
              label="Time Slot"
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleChange}
              options={[
                { value: "morning", label: "Morning" },
                { value: "evening", label: "Evening" },
              ]}
              placeholder="Select Time Slot"
              required
            />
            <FormInput
              type="date"
              label="Batch Date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
            <FormInput
              type="time"
              label="Start Time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
            <FormInput
              type="time"
              label="End Time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
            <FormInput
              type="number"
              label="Military Quota"
              name="militaryQuota"
              value={formData.militaryQuota}
              onChange={handleChange}
              placeholder="Enter quota"
              required
            />
            <FormInput
              type="number"
              label="Civilian Quota"
              name="civiliansQuota"
              value={formData.civiliansQuota}
              onChange={handleChange}
              placeholder="Enter quota"
              required
            />
            <FormInput
              type="select"
              label="Hall"
              name="hall"
              value={formData.hall}
              onChange={handleChange}
              options={
                halls?.data?.map((hall) => ({
                  value: hall.id,
                  label: hall.name,
                })) || []
              }
              placeholder="Select Hall"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-8 w-full custom-AddButton text-white py-3 px-6 rounded-lg font-semibold shadow-lg disabled:opacity-50"
          >
            {isLoading ? "Adding..." : "Add Class"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBatch;
