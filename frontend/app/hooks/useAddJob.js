"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiRequest } from "./useApiRequest";
import { toast } from "react-toastify";

export const useAddJob = () => {
  const { makeApiRequest } = useApiRequest();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobData) => {
      const response = await makeApiRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs`,
        {
          method: "POST",
          body: jobData,
        }
      );

      return response;
    },
    onSuccess: (newJob) => {
      queryClient.invalidateQueries(["jobs"]);
      toast.success("Job added successfully! 🎉");
    },
    onError: () => {
      toast.error("Failed to add job. Please try again.");
    },
  });
};
