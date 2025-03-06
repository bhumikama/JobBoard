"use client";
import { useMutation } from "@tanstack/react-query";
import { useApiRequest } from "./useApiRequest";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();
  const { makeApiRequest } = useApiRequest();

  return useMutation({
    mutationFn: async ({ jobId, applicationId, status }) => {
      return await makeApiRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}/applicants/${applicationId}`,
        {
          method: "PUT",
          body: { status },
        }
      );
    },

    onMutate: async ({ jobId, applicationId, status }) => {
      await queryClient.cancelQueries(["applicants", jobId]);

      const previousApplicants = queryClient.getQueryData([
        "applicants",
        jobId,
      ]);

      queryClient.setQueryData(["applicants", jobId], (oldApplicants) =>
        oldApplicants?.map((applicant) =>
          applicant.id === applicationId ? { ...applicant, status } : applicant
        )
      );

      return { previousApplicants };
    },

    onSuccess: () => {
      toast.success("Application updated successfully");
    },

    onError: (error, _, context) => {
      if (context?.previousApplicants) {
        queryClient.setQueryData(
          ["applicants", context.jobId],
          context.previousApplicants
        );
      }
      toast.error("Failed to update application. Please try again.");
    },

    onSettled: (data, error, { jobId }) => {
      queryClient.invalidateQueries(["applicants", jobId]);
      queryClient.invalidateQueries(["appliedJobs"]);
    },
  });
};
