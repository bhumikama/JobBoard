"use client";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { toast } from "react-toastify";

const fetchJobs = async ({ queryKey }) => {
  const [_key, queryString] = queryKey;
  const apiResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/jobs?${queryString}`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  if (apiResponse.status === 404) {
    return [];
  }

  if (!apiResponse.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return apiResponse.json();
};

export const useJobs = () => {
  const searchParams = useSearchParams();

  // Memoized search params string
  const queryString = useMemo(() => searchParams.toString(), [searchParams]);

  return useQuery({
    queryKey: ["jobs", queryString],
    queryFn: fetchJobs,
    staleTime: 10000,
    refetchOnWindowFocus: true,
    keepPreviousData: true,
    select: (data) => ({
      jobs: data.jobs,
      totalJobs: data.totalJobs,
      currentPage: data.currentPage,
      totalPages: data.totalPages,
    }),
    onError: (err) => {
      console.error("Error fetching jobs", err);
      toast.error("Error fetching jobs");
    },
  });
};
