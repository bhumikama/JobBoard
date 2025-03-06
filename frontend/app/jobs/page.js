"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import HomePageNavbar from "../_components/HomePageComponents/HomePageNavbar";
import FilterCard from "../_components/jobSeeker-Components/FilterCard";
import JobCard from "../_components/jobSeeker-Components/JobCard";
import { useJobs } from "../hooks/useJobs";

const Jobs = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("title") || ""
  );

  const { data, isLoading, error } = useJobs();

  const { jobs, totalJobs, currentPage, totalPages } = data ?? {};

  const searchParamsMemo = useMemo(() => {
    return new URLSearchParams(searchParams.toString());
  }, [searchParams]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParamsMemo);

      if (searchQuery) {
        params.set("title", searchQuery);
      } else {
        params.delete("title");
      }

      params.set("page", "1");

      router.push(`/jobs?${params.toString()}`, { scroll: false });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchParamsMemo, router]);

  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage < 1 || newPage > totalPages) return;

      const params = new URLSearchParams(searchParamsMemo);
      params.set("page", newPage.toString());

      router.push(`/jobs?${params.toString()}`, { scroll: false });
    },
    [totalPages, searchParamsMemo, router]
  );

  if (isLoading) return <span>Loading jobs...</span>;
  if (error) return <span>Error fetching jobs</span>;

  return (
    <>
      <HomePageNavbar />
      <div className="max-w-7xl mx-auto mt-12">
        <div className="flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto">
          <input
            type="text"
            placeholder="Find your dream jobs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="outline-none border-none w-full"
          />
          <Button className="rounded-r-full bg-[#6A38C2]">
            <Search className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex gap-4 mt-4">
          <div className="w-[20%]">
            <FilterCard searchParamsMemo={searchParamsMemo} />
          </div>

          <div className="flex-1 h-[88vh] overflow-y-auto pb-4">
            {jobs?.length === 0 ? (
              <span>No jobs found</span>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-4">
                  {jobs?.map((job) => (
                    <div key={job.id}>
                      <JobCard job={job} />
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center mt-4">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      Prev
                    </button>
                    <span className="mx-4">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Jobs;
