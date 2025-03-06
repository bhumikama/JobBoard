"use client";
import { useMutation } from "@tanstack/react-query";
import { useTokenRefresh } from "@/components/Context/TokenRefreshContext.js";
import { refreshTokenRequest } from "@/components/api/authApi";

export const useRefreshToken = () => {
  const { setIsRefreshing, onTokenRefreshed } = useTokenRefresh();

  return useMutation({
    mutationFn: refreshTokenRequest,
    onSuccess: (data) => {
      setIsRefreshing(true);
      onTokenRefreshed(data.accessToken);
    },
    onError: (error) => {
      console.error("Failed to refresh token:", error.message);
    },
    onSettled: () => {
      setIsRefreshing(false);
    },
  });
};
