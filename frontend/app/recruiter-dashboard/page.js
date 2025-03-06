"use client";
import React, { Suspense, lazy } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Building, Plus } from "lucide-react";

const RecruiterDashboard = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen">
      <h1 className="font-bold text-3xl text-center text-gray-900 mb-4">
        Welcome to Your Recruiter Dashboard
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Manage your job postings and company details effortlessly.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/recruiter-dashboard/jobs">
          <Card className="group cursor-pointer hover:shadow-xl transition-all duration-200 p-6 flex flex-col items-center justify-center text-center bg-white border border-gray-200 rounded-lg">
            <CardHeader>
              <Briefcase className="size-14 text-blue-600 transition-transform duration-200 group-hover:scale-110" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg font-semibold text-gray-800">
                Manage Jobs
              </CardTitle>
              <p className="text-sm text-gray-500 mt-2">
                View, edit, and post new jobs for candidates.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/recruiter-dashboard/companies">
          <Card className="group cursor-pointer hover:shadow-xl transition-all duration-200 p-6 flex flex-col items-center justify-center text-center bg-white border border-gray-200 rounded-lg">
            <CardHeader>
              <Building className="size-14 text-green-600 transition-transform duration-200 group-hover:scale-110" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg font-semibold text-gray-800">
                Manage Companies
              </CardTitle>
              <p className="text-sm text-gray-500 mt-2">
                Add and manage company details and job listings.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="mt-10 flex justify-center">
        <Link href="/recruiter-dashboard/jobs/create">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-all shadow-md">
            <Plus className="size-5" /> Post a New Job
          </button>
        </Link>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
