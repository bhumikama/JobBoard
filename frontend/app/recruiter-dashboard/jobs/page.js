"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import JobsTable from "@/app/_components/recruiter-dashboard-components/JobsTable";

import { useRouter } from "next/navigation";

const JobsPage = () => {
  const router = useRouter();
  return (
    <div>
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex items-center justify-end my-5">
          <Button
            sx={{
              color: "white",
              backgroundColor: "gray",
              "&:hover": {
                backgroundColor: "black",
                color: "white",
              },
            }}
            onClick={() => router.push("/recruiter-dashboard/jobs/create")}
          >
            New Job
          </Button>
        </div>
        <JobsTable />
      </div>
    </div>
  );
};

export default JobsPage;
