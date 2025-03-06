"use client";
import React, { createContext, useState, useContext } from "react";

// Create a context
const TokenRefreshContext = createContext();

// Provide the context value to components
export const TokenRefreshProvider = ({ children }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [subscribers, setSubscribers] = useState([]);

  // Subscribe to token refresh
  const subscribeTokenRefresh = (callback) => {
    setSubscribers((prevSubscribers) => [...prevSubscribers, callback]);
  };

  // Called when token is refreshed, notify all subscribers
  const onTokenRefreshed = () => {
    subscribers.forEach((callback) => callback()); // Call each subscriber
    setSubscribers([]); // Reset subscribers after token refresh
  };

  return (
    <TokenRefreshContext.Provider
      value={{
        isRefreshing,
        setIsRefreshing,
        subscribeTokenRefresh,
        onTokenRefreshed,
      }}
    >
      {children}
    </TokenRefreshContext.Provider>
  );
};

// Custom hook to access the context
export const useTokenRefresh = () => {
  return useContext(TokenRefreshContext);
};
