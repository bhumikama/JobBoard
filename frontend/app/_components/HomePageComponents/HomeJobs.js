"use client";
import React from "react";
import { useHomeJobs } from "@/app/hooks/useHomeJobs";
import HomeJobCards from "./HomeJobCards";
import { toast } from "react-toastify";

const HomeJobs = () => {
  const { data: jobs = [], isLoading, error } = useHomeJobs();

  if (isLoading) return <p>Loading latest jobs...</p>;
  if (error) {
    toast.error(`Something went wrong : ${error.message}`);
  }

  return (
    <div className="max-w-7xl mx-auto my-20">
      <h1 className="text-4xl font-bold">
        <span className="text-[#6A38C2]">Latest & Top </span> Job Openings
      </h1>
      <div className="grid grid-cols-3 gap-4 my-5">
        {jobs.length === 0 ? (
          <span>No Jobs Available</span>
        ) : (
          jobs.map((job) => <HomeJobCards key={job.id} job={job} />)
        )}
      </div>
    </div>
  );
};

export default HomeJobs;
