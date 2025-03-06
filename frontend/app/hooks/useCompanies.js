"use client";
import { useQuery } from "@tanstack/react-query";
import { useApiRequest } from "./useApiRequest";
import { toast } from "react-toastify";

export const useCompanies = () => {
  const { makeApiRequest } = useApiRequest();

  return useQuery({
    queryKey: ["companies"], 
    queryFn: async () => {
      const response = await makeApiRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/api/companies/all`
      );

      return response;
    },
    onError: (error) => {
      if (error.message.includes("You have not created any companies yet")) {
        return [];
      } else {
        toast.error(error.message || "Failed to fetch companies");
      }
    },
    staleTime: 60 * 1000, 
    refetchOnWindowFocus: false, 
  });
};
