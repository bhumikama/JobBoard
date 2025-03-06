"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
const HomeJobCards = ({ job }) => {
  const router = useRouter();

  return (
    <Link href={`/jobs/${job.id}`} prefetch={false}>
      <div
        // onClick={() => router.push(`/jobs/${job.id}`)}
        className="p-6 rounded-lg shadow-lg bg-white border border-gray-200 cursor-pointer hover:scale-[1.02] transition-transform"
      >
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 border border-gray-300">
            <AvatarImage src={job?.imageUrl} />
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">{job?.company?.name}</h2>
            <p className="text-gray-500 text-sm">{job?.company?.location}</p>
          </div>
        </div>

        <div className="mt-3">
          <h1 className="text-xl font-bold">{job?.title}</h1>
          <p className="text-gray-600 text-sm line-clamp-2">
            {job?.description}
          </p>
        </div>

        <div className="mt-4 space-y-1 text-sm text-gray-700">
          <p>
            <span className="font-semibold text-blue-600">Category :</span>
            {job?.category}
          </p>
          <p>
            <span className="font-semibold text-red-500">Type :</span>{" "}
            {job?.type}
          </p>
          <p>
            <span className="font-semibold text-purple-600">Salary :</span>
            {job?.salary} DKK / month
          </p>
        </div>
      </div>
    </Link>
  );
};

export default HomeJobCards;
