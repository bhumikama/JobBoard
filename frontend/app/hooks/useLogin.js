"use client";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/features/auth/authSlice";
import { returnPathByRole } from "@/utils/userUtil";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const loginUser = async (credentials) => {
  const apiResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    }
  );

  if (!apiResponse.ok) {
    const errorData = await apiResponse.json();
    throw new Error(errorData.message || "Login failed");
  }

  const data = await apiResponse.json();
  console.log("User fetched:", data);
  return data;
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      const { user } = data;
      dispatch(loginSuccess({ user }));

      const dashboardPath = returnPathByRole(user.role);
      window.location.replace(dashboardPath);
      toast.success("Logged in successfully! 🎉");
    },
    onError: (error) => {
      console.error("Login failed: ", error);

      toast.error(error.message || "Login failed");
    },
  });
};
