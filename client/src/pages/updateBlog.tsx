import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
} from "@mui/material";
import axiosInstance from "../api/axios";

const UpdateBlog = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();

  const { data: blog } = useQuery({
    queryKey: ["blog", blogId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/blogs/${blogId}`, {
        withCredentials: true,
      });
      return res.data;
    },
  });

  const [form, setForm] = useState({
    image: "",
    title: "",
    synopsis: "",
    content: "",
  });

  useEffect(() => {
    if (blog) {
      setForm({
        image: blog.image,
        title: blog.title,
        synopsis: blog.synopsis,
        content: blog.content,
      });
    }
  }, [blog]);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return axiosInstance.patch(`/api/blogs/${blogId}`, form, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      navigate(`/blogs/${blogId}`);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Paper sx={{ p: 4, maxWidth: 700, mx: "auto" }}>
        <Typography variant="h5" gutterBottom>
          Update Blog
        </Typography>
        <Stack spacing={2}>
          <TextField
            name="title"
            label="Title"
            fullWidth
            value={form.title}
            onChange={handleChange}
          />
          <TextField
            name="image"
            label="Image URL"
            fullWidth
            value={form.image}
            onChange={handleChange}
          />
          <TextField
            name="synopsis"
            label="Synopsis"
            fullWidth
            value={form.synopsis}
            onChange={handleChange}
          />
          <TextField
            name="content"
            label="Markdown Content"
            fullWidth
            multiline
            minRows={6}
            value={form.content}
            onChange={handleChange}
          />
          <Button
            variant="contained"
            onClick={() => mutate()}
            disabled={isPending}
          >
            {isPending ? "Updating..." : "Update Blog"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default UpdateBlog;
