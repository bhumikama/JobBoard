"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiRequest } from "@/app/hooks/useApiRequest";
import { handleFileUpload } from "@/utils/handleFileUpload";
import { toast } from "react-toastify";

const JobApplicationModal = ({ job, onClose }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  console.log("Received job info:", job);
  const { makeApiRequest } = useApiRequest();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    resume: null,
  });

  const mutation = useMutation({
    mutationFn: async (formData) => {
      if (!job?.id) {
        throw new Error("Invalid Job ID");
      }

      const resumeKey = await handleFileUpload(formData.resume);

      if (!resumeKey) {
        throw new Error("failed to upload");
      }

      const response = await makeApiRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${job.id}/apply`,
        {
          method: "POST",
          body: {
            name: formData.name,
            email: formData.email,
            resume: resumeKey,
          },
        }
      );
      return response;
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["appliedJobs"]);
      setFormData({
        name: "",
        email: "",
        resume: null,
      });
      onClose();
      toast.success("Congrats! , You successfully applied for a job");
    },
    onError: (error) => {
      const errorMessage = error?.message || "Failed to apply for the job";
      toast.error(errorMessage);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, resume: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      return (window.location.href = "/login");
    }
    if (!formData.resume) {
      return toast.error("Please upload a resume");
    }

    const allowedTypes = ["application/pdf", "application/msword"];
    if (!allowedTypes.includes(formData.resume.type)) {
      return toast.error(
        "Invalid file type. Please upload a PDF or Word document."
      );
    }
    if (formData.resume.size > 3 * 1024 * 1024) {
      return toast.error("File size exceeds 5MB.");
    }

    mutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold">Apply for {job.title}</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Applying..." : "Submit Application"}
          </button>
        </form>
        <button onClick={onClose} className="mt-4 text-red-500">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default JobApplicationModal;
