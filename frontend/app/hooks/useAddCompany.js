"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiRequest } from "./useApiRequest";
import { toast } from "react-toastify";
export const useAddCompany = () => {
  const { makeApiRequest } = useApiRequest();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, website, location, imageKey }) => {
      const response = await makeApiRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/api/companies`,
        {
          method: "POST",
          body: { name, website, location, imageKey },
        }
      );

      return response;
    },
    onSuccess: (newCompany) => {
      queryClient.invalidateQueries(["companies"]);
      toast.success("Company added successfully!");
    },
    onError: () => {
      toast.error("Failed to add company. Please try again.");
    },
  });
};
