"use client";
import React from "react";
import { Button } from "@mui/material";
import CompanyTable from "@/app/_components/recruiter-dashboard-components/CompanyTable";
const Companies = () => {
  return (
    <div>
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex items-center justify-between my-5">
          <h1>All Companies</h1>
          <Button
            sx={{
              color: "white",
              backgroundColor: "gray",
              "&:hover": {
                backgroundColor: "black",
                color: "white",
              },
            }}
            onClick={() =>
              window.location.replace(
                "/recruiter-dashboard/companies/add-company"
              )
            }
          >
            New Company
          </Button>
        </div>
        <CompanyTable />
      </div>
    </div>
  );
};

export default Companies;
