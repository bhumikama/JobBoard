"use client";
import { useQuery } from "@tanstack/react-query";
import { useApiRequest } from "./useApiRequest";
import { toast } from "react-toastify";
export const useApplicants = (jobId) => {
  const { makeApiRequest } = useApiRequest();

  return useQuery({
    queryKey: ["applicants", jobId],
    queryFn: async () => {
      console.log("fetching from API.....");
      const response = await makeApiRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}/applicants`
      );
      return response;
    },
    onError: (error) => {
      if (error.message.includes("No one has applied yet")) {
        return [];
      } else {
        toast.error(error.message || "Failed to fetch applicants");
      }
    },
    staleTime: 5 * 60 * 1000, 
    cacheTime: 30 * 60 * 1000, 
    refetchOnWindowFocus: false, 
    refetchOnMount: false, 
  });
};
