"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

const JobCard = React.memo(({ job }) => {
  const router = useRouter();

  const daysAgoFunction = (createdDate) => {
    const createdAt = new Date(createdDate);
    const currentTime = new Date();
    const diffDays = Math.floor(
      (currentTime - createdAt) / (1000 * 60 * 60 * 24)
    );
    return diffDays === 0 ? "Today" : `${diffDays} days ago`;
  };

  return (
    <div className="p-6 rounded-lg shadow-lg bg-white border border-gray-200 transition-transform hover:scale-[1.02]">
      <div className="text-gray-500 text-sm text-right">
        {daysAgoFunction(job?.createdAt)}
      </div>

      <div className="flex items-center gap-3 my-3">
        <Avatar className="w-12 h-12 border border-gray-300">
          <AvatarImage src={job?.imageUrl} />
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold">{job?.company?.name}</h2>
          <p className="text-gray-500 text-sm">{job?.location}</p>
        </div>
      </div>

      <div>
        <h1 className="text-xl font-bold my-2">{job?.title}</h1>
        <p className="text-gray-600 text-sm line-clamp-2">{job?.description}</p>
      </div>

      <div className="mt-4 space-y-1 text-sm text-gray-700">
        <p>
          <span className="font-semibold text-blue-600">Category:</span>{" "}
          {job?.category}
        </p>
        <p>
          <span className="font-semibold text-red-500">Type:</span> {job?.type}
        </p>
        <p>
          <span className="font-semibold text-purple-600">Salary:</span>{" "}
          {job?.salary} DKK / month
        </p>
      </div>

      <div className="flex justify-end mt-5">
        <Button
          onClick={() => router.push(`/jobs/${job?.id}`)}
          variant="outline"
        >
          View Details
        </Button>
      </div>
    </div>
  );
});

export default JobCard;
