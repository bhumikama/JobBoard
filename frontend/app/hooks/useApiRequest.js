"use client";
import { useState } from "react";
import { useTokenRefresh } from "@/components/Context/TokenRefreshContext.js";
import { toast } from "react-toastify";
import { useRefreshToken } from "./useRefreshToken";
import { useSelector } from "react-redux";

export const useApiRequest = () => {
  const { isRefreshing, subscribeTokenRefresh, setIsRefreshing } =
    useTokenRefresh();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { mutateAsync: refreshToken } = useRefreshToken();

  const makeApiRequest = async (url, options = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const isFormData = options.body instanceof FormData;

      const headers = {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...options.headers,
      };

      const fetchOptions = {
        method: options.method || "GET",
        headers,
        credentials: "include",
        body: isFormData
          ? options.body
          : options.body
          ? JSON.stringify(options.body)
          : undefined,
      };

      let response = await fetch(url, fetchOptions);

      if (response.ok) {
        return await response.json();
      }

      if (response.status === 401 && isAuthenticated) {
        if (isRefreshing) {
          await new Promise((resolve) => {
            subscribeTokenRefresh(resolve);
          });

          response = await fetch(url, {
            ...fetchOptions,
            credentials: "include",
          });

          if (response.ok) {
            return await response.json();
          } else if (response.status === 403) {
            toast.error("Session expired. Please log in again.");
            throw new Error("Session expired");
          }
        } else {
          setIsRefreshing(true);

          try {
            await refreshToken();
          } catch (refreshError) {
            toast.error("Session expired. Please log in again.");
            throw refreshError;
          } finally {
            setIsRefreshing(false);
          }

          response = await fetch(url, {
            ...fetchOptions,
            credentials: "include",
          });

          if (response.ok) {
            return await response.json();
          } else if (response.status === 403) {
            toast.error("Session expired. Please log in again.");
            throw new Error("Session expired");
          }
        }
      }

      let errorMessage = `Request failed with status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData?.message || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    } catch (err) {
      setError(err.message);
      throw err; 
    } finally {
      setIsLoading(false);
    }
  };

  return { makeApiRequest, isLoading, error };
};
