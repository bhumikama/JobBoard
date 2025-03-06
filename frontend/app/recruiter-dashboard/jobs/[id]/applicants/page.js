"use client";
import React, { useEffect } from "react";
import ViewApplicantsTable from "@/app/_components/recruiter-dashboard-components/ViewApplicantsTable";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const ApplicantsPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl md:text-3xl font-serif text-gray-800 text-center">
          List of all the applicants for the job
        </h1>

        <div className="mt-6 overflow-x-auto">
          <ViewApplicantsTable />
        </div>
      </div>
    </div>
  );
};

export default ApplicantsPage;
