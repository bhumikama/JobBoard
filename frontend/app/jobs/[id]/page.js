"use client";
import React, { useEffect, useState, lazy, Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useGetAppliedJobs } from "@/app/hooks/useGetAppliedJobs";
import HomePageNavbar from "@/app/_components/HomePageComponents/HomePageNavbar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const JobApplicationModal = lazy(() =>
  import("@/app/_components/jobSeeker-Components/JobApplicationModal")
);

const JobDescription = () => {
  const { id } = useParams();
  const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const [singleJob, setSingleJob] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const queryClient = useQueryClient();
  const { data: appliedJobs } = useGetAppliedJobs({
    enabled: isAuthenticated,
  });

  const hasApplied = isAuthenticated
    ? appliedJobs?.some(
        (appliedJob) => appliedJob.jobId === Number(singleJob.id)
      )
    : false;
  const fetchJobById = async () => {
    if (!id) {
      setError("Invalid Job ID");
      setLoading(false);
      return;
    }
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${id}`;
      const apiResponse = await fetch(apiUrl, {
        method: "GET",
        credentials: "include",
      });

      if (apiResponse.status === 404) {
        setSingleJob({});
        setLoading(false);
        return;
      }
      if (apiResponse.ok) {
        const job = await apiResponse.json();
        setSingleJob(job);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchJobById();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center my-10 text-lg font-semibold">Loading...</div>
    );
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  if (!singleJob) {
    return <div className="text-center text-gray-500">No job info found.</div>;
  }

  const applyJobHandler = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    } else if (!hasApplied) {
      setModalOpen(true);
    }
  };

  return (
    <>
      <HomePageNavbar />
      <div className="max-w-5xl mx-auto my-10 px-6 md:px-12">
        {/* Job Header */}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {singleJob?.title}
              </h1>
              <p className="text-gray-600 text-md">
                {singleJob?.company?.name} - {singleJob?.location}
              </p>

              {/* Job Tags */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Badge className="bg-blue-100 text-blue-800">
                  {singleJob?.category}
                </Badge>
                <Badge className="bg-red-100 text-red-800">
                  {singleJob?.type}
                </Badge>
                <Badge className="bg-purple-100 text-purple-800">
                  {singleJob?.salary} DKK/month
                </Badge>
              </div>
            </div>

            {/* Apply Button */}
            <Button
              onClick={applyJobHandler}
              disabled={hasApplied}
              className={`mt-4 md:mt-0 px-6 py-3 text-lg rounded-lg transition ${
                hasApplied
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {hasApplied ? "Already Applied" : "Apply Now"}
            </Button>
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-6">
          <h2 className="text-xl font-semibold border-b pb-3 mb-4">
            Job Details
          </h2>

          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Role:</strong>{" "}
              <span className="text-gray-900">{singleJob?.title}</span>
            </p>
            <p>
              <strong>Location:</strong>{" "}
              <span className="text-gray-900">{singleJob?.location}</span>
            </p>
            <p>
              <strong>Description:</strong>{" "}
              <span className="text-gray-900">{singleJob?.description}</span>
            </p>
            <p>
              <strong>Salary:</strong>{" "}
              <span className="text-gray-900">
                {singleJob?.salary} DKK / month
              </span>
            </p>
            <p>
              <strong>Posted Date:</strong>{" "}
              <span className="text-gray-900">
                {singleJob?.createdAt
                  ? new Date(singleJob.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Unknown"}
              </span>
            </p>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <Suspense fallback={<LoadingSpinner message="Loading application form.."/>}>
            <JobApplicationModal
              job={singleJob}
              onClose={() => setModalOpen(false)}
            />
          </Suspense>
        )}
      </div>
    </>
  );
};

export default JobDescription;
