"use client";
import React, { useEffect } from "react";
import AppliedJobsTable from "../_components/jobSeeker-Components/AppliedJobsTable";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import HomePageNavbar from "../_components/HomePageComponents/HomePageNavbar";
const MyApplicationsPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return (
    <>
      <HomePageNavbar />
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl md:text-3xl font-serif text-gray-800 text-center">
            My Job Applications
          </h1>
          <p className="text-gray-600 text-sm md:text-base text-center mt-2">
            Here is a list of all the jobs you have applied for.
          </p>

          <div className="mt-6 overflow-x-auto">
            <AppliedJobsTable />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyApplicationsPage;
