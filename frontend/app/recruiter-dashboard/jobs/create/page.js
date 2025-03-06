"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import Input from "@/components/ui/input";
import Button from "@mui/material/Button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { useAddJob } from "@/app/hooks/useAddJob";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useCompanies } from "@/app/hooks/useCompanies";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

const categories = ["Engineering & Technology", "Management", "IT"];
const worktypes = ["remote", "in-office"];

const PostJob = () => {
  const [companyError, setCompanyError] = useState("");
  const [errors, setErrors] = useState({}); // Stores field-specific errors
  const [input, setInput] = useState({
    title: "",
    description: "",
    category: "",
    salary: "",
    location: "",
    type: "",
    companyId: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { mutate: addJob } = useAddJob();
  const queryClient = useQueryClient();

  const cachedCompanies = queryClient.getQueryData(["companies"]);
  const { data: companyList } = useCompanies({ enabled: !cachedCompanies });
  const companies = cachedCompanies || companyList || [];

  const validateFields = () => {
    let newErrors = {};
    if (!input.title) newErrors.title = "Job title is required.";
    if (!input.description) newErrors.description = "Description is required.";
    if (!input.category) newErrors.category = "Category is required.";
    if (!input.salary) newErrors.salary = "Salary is required.";
    if (!input.location) newErrors.location = "Location is required.";
    if (!input.type) newErrors.type = "Job type is required.";
    if (!input.companyId) {
      newErrors.companyId = "Company selection is required.";
      setCompanyError("Please select a company.");
    } else {
      setCompanyError("");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company.name.toLowerCase() === value.toLowerCase()
    );
    setInput({ ...input, companyId: selectedCompany?.id || "" });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateFields()) {
      toast.error("Please fill all required fields.");
      return;
    }

    setLoading(true);
    addJob(input, {
      onSuccess: () => {
        router.push("/recruiter-dashboard/jobs");
      },
      onError: () => {
        toast.error("Failed to post job.");
        setLoading(false);
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-gray-100 p-8 shadow-lg rounded-lg border border-gray-300">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
        Post a New Job
      </h2>
      <form onSubmit={submitHandler} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Label className="font-medium">Job Title</Label>
            <Input
              type="text"
              name="title"
              value={input.title}
              onChange={changeEventHandler}
              className={`border bg-white rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:outline-none ${
                errors.title ? "border-red-500" : "border-gray-400"
              }`}
              placeholder="Enter job title"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label className="font-medium">Description</Label>
            <Textarea
              name="description"
              value={input.description}
              onChange={changeEventHandler}
              className={`border bg-white rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:outline-none ${
                errors.description ? "border-red-500" : "border-gray-400"
              }`}
              placeholder="Describe the job role..."
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <Label className="font-medium">Category</Label>
            <Select
              onValueChange={(value) => setInput({ ...input, category: value })}
            >
              <SelectTrigger
                className={`w-full border rounded-md p-3 focus:ring-2 focus:ring-green-500 ${
                  errors.category ? "border-red-500" : "border-gray-400"
                }`}
              >
                <SelectValue placeholder="Select a Category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-400 shadow-lg rounded-md border border-gray-400 text-lg font-medium">
                <SelectGroup>
                  {categories.map((type) => (
                    <SelectItem
                      key={type}
                      value={type}
                      className="cursor-pointer p-3 hover:bg-gray-200"
                    >
                      {type}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <Label className="font-medium">Salary</Label>
            <Input
              type="text"
              name="salary"
              value={input.salary}
              onChange={changeEventHandler}
              className={`border bg-white rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:outline-none ${
                errors.salary ? "border-red-500" : "border-gray-400"
              }`}
              placeholder="Enter salary"
            />
            {errors.salary && (
              <p className="text-red-500 text-xs mt-1">{errors.salary}</p>
            )}
          </div>

          <div>
            <Label className="font-medium">Location</Label>
            <Input
              type="text"
              name="location"
              value={input.location}
              onChange={changeEventHandler}
              className={`border bg-white rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:outline-none ${
                errors.location ? "border-red-500" : "border-gray-400"
              }`}
              placeholder="Job location"
            />
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">{errors.location}</p>
            )}
          </div>

          <div>
            <Label className="font-medium">Job Type</Label>
            <Select
              onValueChange={(value) => setInput({ ...input, type: value })}
            >
              <SelectTrigger className="w-full border border-gray-400 bg-white rounded-md p-3 focus:ring-2 focus:ring-green-500">
                <SelectValue placeholder="Select a Work Type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-400 shadow-lg rounded-md border border-gray-400 text-lg font-medium">
                <SelectGroup>
                  {worktypes.map((type) => (
                    <SelectItem
                      key={type}
                      value={type}
                      className="cursor-pointer p-3 hover:bg-gray-200"
                    >
                      {type}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label className="font-medium">Company</Label>
            <Select onValueChange={selectChangeHandler}>
              <SelectTrigger
                className={`w-full border rounded-md p-3 focus:ring-2 focus:ring-green-500 ${
                  errors.companyId ? "border-red-500" : "border-gray-400"
                }`}
              >
                <SelectValue placeholder="Select a Company" />
              </SelectTrigger>
              <SelectContent className="bg-gray-400 shadow-lg rounded-md border border-gray-400 text-lg font-medium">
                <SelectGroup>
                  {companies.map((company) => (
                    <SelectItem
                      key={company.id}
                      value={company.name}
                      className="cursor-pointer p-3 hover:bg-gray-200"
                    >
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.companyId && (
              <p className="text-red-500 text-xs mt-1">{errors.companyId}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={loading}
        >
          {loading ? "Please wait..." : "Create Job"}
        </Button>
      </form>
    </div>
  );
};

export default PostJob;
