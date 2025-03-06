"use client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

const fetchHomeJobs = async () => {
  console.log("Fetching home jobs...");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/jobs?limit=5&order=DESC&sortBy=createdAt`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (response.status === 404) {
      console.log("No jobs found (404)");
      return [];
    }

    if (!response.ok) {
      console.error(`Fetch failed with status ${response.status}`);
      throw new Error("Failed to fetch latest jobs");
    }

    const data = await response.json();
    console.log("Jobs fetched:", data.jobs);
    return data.jobs || [];
  } catch (error) {
    console.error("Error during fetchHomeJobs:", error);
    throw error;
  }
};

export const useHomeJobs = () => {
  return useQuery({
    queryKey: ["homeJobs"],
    queryFn: fetchHomeJobs,
    staleTime: 10000,
    refetchOnWindowFocus: true,
    select: (data) => data,
    onError: (error) => {
      console.error(" useHomeJobs onError:", error);
      toast.error("Failed to load latest jobs");
    },
  });
};
