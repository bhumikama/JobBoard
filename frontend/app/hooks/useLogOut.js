"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import { toast } from "react-toastify";

const logOutUser = async () => {
  const apiResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/logout`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  if (!apiResponse.ok) {
    throw new Error("logout failed");
  }
  return apiResponse.json();
};

export const useLogOut = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: logOutUser,
    onSuccess: () => {
      dispatch(logout());
      queryClient.removeQueries(["companies"]);
      queryClient.removeQueries(["appliedJobs"]);
      queryClient.removeQueries({ queryKey: ["applicants"] });
      queryClient.removeQueries({ queryKey: ["jobs"] });

      dispatch(logout());
      window.location.href = "/jobs";

      toast.success("You're logged out");
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });
};
