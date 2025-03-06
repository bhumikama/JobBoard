export const handleFileUpload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return data.fileKey;
    } else {
      const error = await response.json();
      console.error("Error details:", error);
      throw new Error(error.message || "File upload failed"); 
    }
  } catch (error) {
    console.error("Error uploading video", error);
    throw new Error("File upload failed"); 
  }
};
