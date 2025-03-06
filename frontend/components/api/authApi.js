export const refreshTokenRequest = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/refresh-token`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Refresh Token Expired");
  }

  const data = await response.json();
  return data;
};
