"use client";
import React, { useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Category } from "@mui/icons-material";

const filterOptions = [
  {
    heading: "Category",
    key: "category",
    options: ["Engineering & Technology", "Management", "IT"],
  },
  {
    heading: "Type",
    key: "type",
    options: ["remote", "in-office"],
  },
  {
    heading: "Salary",
    key: "salary",
    options: [
      { label: "0K - 50K", value: { min: 0, max: 50000 } },
      { label: "50K - 80K", value: { min: 50000, max: 80000 } },
      { label: "80K - 120K", value: { min: 80000, max: 120000 } },
    ],
  },
];

const FilterCard = React.memo(({ searchParamsMemo }) => {
  const router = useRouter();

  const handleFilterChange = useCallback(
    (filterType, rawValue) => {
      const params = new URLSearchParams(searchParamsMemo);
      let value = rawValue;

      if (filterType === "salary") {
        value = JSON.parse(rawValue);
        params.set("minSalary", value.min);
        params.set("maxSalary", value.max);
      } else {
        params.set(filterType, value);
      }

      params.set("page", "1");

      router.push(`/jobs?${params.toString()}`);
    },
    [searchParamsMemo, router]
  );

  const selectedValues = useMemo(() => {
    return {
      category: searchParamsMemo.get("category") || "",
      type: searchParamsMemo.get("type") || "",
      salary: JSON.stringify({
        min: searchParamsMemo.get("minSalary")
          ? Number(searchParamsMemo.get("minSalary"))
          : 0,
        max: searchParamsMemo.get("maxSalary")
          ? Number(searchParamsMemo.get("maxSalary"))
          : 0,
      }),
    };
  }, [searchParamsMemo]);

  return (
    <div className="w-full rounded-md bg-white p-3">
      <h1 className="font-bold text-lg">Filter Jobs</h1>
      <hr className="mt-2" />

      {filterOptions.map(({ heading, key, options }) => (
        <div key={key}>
          <h1 className="font-bold text-lg pb-3 mt-3">{heading}</h1>
          <RadioGroup
            value={
              key === "salary" ? selectedValues.salary : selectedValues[key]
            }
            onValueChange={(value) => handleFilterChange(key, value)}
          >
            {options.map((option, index) => {
              const id = `radio-${key}-${index}`;
              const value = option.value
                ? JSON.stringify(option.value)
                : option;
              return (
                <div
                  key={option.label || option}
                  className="flex items-center space-x-2 mx-2 gap-1"
                >
                  <RadioGroupItem
                    value={value}
                    id={id}
                    className="w-4 h-4 border border-gray-300 rounded-full data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                  <Label htmlFor={id}>{option.label || option}</Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>
      ))}
    </div>
  );
});

export default FilterCard;
