"use client";
import Button from "@mui/material/Button";
import UploadIcon from "@mui/icons-material/Upload";
import React, { useState } from "react";
import { handleFileUpload } from "@/utils/handleFileUpload";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  Alert,
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  Stack,
} from "@mui/material";
import { useAddCompany } from "@/app/hooks/useAddCompany";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

const CreateCompany = () => {
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const { mutate: addCompany } = useAddCompany();

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];

    if (imagePreview) URL.revokeObjectURL(imagePreview);

    if (selectedImage && selectedImage.size / (1024 * 1024) > 5) {
      setErrors({ ...errors, image: "File size exceeds 5MB limit" });
      setImagePreview(null);
      event.target.value = "";
    } else {
      setImage(selectedImage);
      setImagePreview(URL.createObjectURL(selectedImage));
      setErrors({ ...errors, image: null });
    }
  };

  const checkForErrors = () => {
    const errors = {};
    if (!name.trim()) errors.name = "Please provide a valid name";
    if (!website.trim()) errors.website = "Please provide a valid website";
    if (!location) errors.location = "Please provide a valid location";
    if (!image) errors.image = "Please upload an image";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const errorFields = checkForErrors();
    if (Object.keys(errorFields).length > 0) {
      setErrors(errorFields);
      setIsLoading(false);
      return;
    }

    try {
      const imageKey = await handleFileUpload(image);
      const companyName = capitalizeFirstLetter(name);
      console.log("companyName after capitalization:", companyName);
      addCompany(
        { name: companyName, website, location, imageKey },
        {
          onSuccess: () => {
            setName("");
            setWebsite("");
            setLocation("");
            setImage(null);
            setImagePreview(null);
            router.push("/recruiter-dashboard/companies");
          },
          onError: () => {
            setIsLoading(false);
          },
        }
      );
    } catch (error) {
      console.log(error);
      toast.error(error?.message || "Something went wrong");

      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 6 }}>
      <Stack spacing={2} textAlign="center">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "1.4rem", sm: "1.8rem" },
            color: "#1a202c",
          }}
        >
          Create a New Company
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: "#4a5568",
            fontSize: { xs: "1rem", sm: "1.2rem" },
          }}
        >
          Fill in the details below to create your company.
        </Typography>
      </Stack>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Paper
          elevation={4}
          sx={{
            width: "100%",
            maxWidth: 600,
            p: 4,
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Company Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                required
              />

              <TextField
                fullWidth
                label="Website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                error={!!errors.website}
                helperText={errors.website}
                required
              />

              <TextField
                fullWidth
                label="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                error={!!errors.location}
                helperText={errors.location}
                required
              />

              {imagePreview && (
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      borderRadius: "8px",
                    }}
                  />
                </Box>
              )}

              <Stack alignItems="center">
                <label htmlFor="image-upload">
                  <Button
                    variant="contained"
                    component="span"
                    sx={{ bgcolor: "#333", "&:hover": { bgcolor: "#555" } }}
                  >
                    <UploadIcon sx={{ mr: 1 }} />
                    Upload a company logo
                  </Button>
                </label>
                <input
                  type="file"
                  id="image-upload"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {errors.image && (
                  <Typography color="error">{errors.image}</Typography>
                )}
              </Stack>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  mt: 3,
                  bgcolor: "#333",
                  color: "#fff",
                  "&:hover": { bgcolor: "#555" },
                }}
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Create Company"}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateCompany;
