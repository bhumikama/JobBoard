"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiRequest } from "./useApiRequest";
import { toast } from "react-toastify";

export const useDeleteJob = () => {
  const { makeApiRequest } = useApiRequest();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId) => {
      return await makeApiRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}`,
        {
          method: "DELETE",
        }
      );
    },

    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries(["jobs"]);
      queryClient.setQueryData(["jobs"], (oldJobs) =>
        oldJobs ? oldJobs.filter((job) => job.id !== jobId) : []
      );

      toast.success("Job deleted successfully! 🎉");
    },

    onError: (error) => {
      console.error("Failed to delete job:", error);
      toast.error("Failed to delete job. Please try again.");
    },
  });
};
