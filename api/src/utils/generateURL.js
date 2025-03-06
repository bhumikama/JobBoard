export const generateS3Url = (fileKey) => {
    const baseUrl = process.env.AWS_S3_BASE_URL;
    return `${baseUrl}/${fileKey}`;
  };