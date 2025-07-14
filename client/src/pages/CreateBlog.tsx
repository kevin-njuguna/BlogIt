import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

const CreateBlog = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [content, setContent] = useState("");

  const { mutate, isPending, isError } = useMutation({
    mutationFn: async (newBlog: {
      image: string;
      title: string;
      synopsis: string;
      content: string;
    }) => {
      const response = await axiosInstance.post("/api/blogs", newBlog, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: () => {
      navigate("/blogList");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Title and content are required.");
      return;
    }

    mutate({ image, title, synopsis, content });
  };

  return (
    <Grid container justifyContent="center" sx={{ mt: 4 }}>
      <Grid size={{ xs: 11, sm: 8, md: 6 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" mb={3} fontWeight="bold">
            Create New Blog
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={3}>
              <TextField
                label="Featured Image URL"
                fullWidth
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              <TextField
                label="Title"
                fullWidth
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                label="Synopsis"
                fullWidth
                multiline
                rows={2}
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
              />
              <TextField
                label="Content (Markdown)"
                fullWidth
                required
                multiline
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog content here in markdown..."
              />
              <Button
                variant="contained"
                type="submit"
                disabled={isPending}
                size="large"
              >
                {isPending ? "Posting..." : "Post Blog"}
              </Button>
              {isError && (
                <Typography color="error">
                  Something went wrong. Please try again.
                </Typography>
              )}
            </Stack>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CreateBlog;
