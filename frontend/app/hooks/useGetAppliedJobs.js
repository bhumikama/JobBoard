import { useQuery } from "@tanstack/react-query";
import { useApiRequest } from "./useApiRequest";

export const useGetAppliedJobs = () => {
  const { makeApiRequest } = useApiRequest();

  return useQuery({
    queryKey: ["appliedJobs"], 
    queryFn: async () => {
      const response = await makeApiRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/all`
      );
      return response;
    },
    onError: (error) => {
      if (error.message.includes("You have not applied for any job yet")) {
        return [];
      } else {
        toast.error(error.message || "Failed to fetch applied jobs");
      }
    },
    staleTime: 60 * 1000, 
    refetchOnWindowFocus: true, 
  });
};
