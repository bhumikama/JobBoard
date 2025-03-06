import React from "react";

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 text-lg font-medium">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
