import {
  Box,
  Typography,
  Container,
  Avatar,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";

import useUser from "../store/userStore";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import axiosInstance from "../api/axios";
import ReactMarkdown from "react-markdown";

interface Author {
  firstName: string;
  lastName: string;
  username: string;
}

interface Blog {
  id: number;
  image: string;
  title: string;
  synopsis: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
}

const BlogDetails = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();

  const { data, isLoading, error } = useQuery<Blog>({
    queryKey: ["blog", blogId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/blogs/${blogId}`);
      return response.data;
    },
  });

  const isAuthor = data?.author?.username === user?.username;

  const { mutate: deleteBlog, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      return axiosInstance.delete(`/api/blogs/${blogId}`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      navigate("/blogList");
    },
  });

  if (isLoading)
    return (
      <Box p={4} textAlign="center">
        <CircularProgress />
      </Box>
    );
  if (error || !data)
    return (
      <Typography textAlign="center" mt={4}>
        Blog not found.
      </Typography>
    );

  const initials =
    `${data.author.firstName[0]}${data.author.lastName[0]}`.toUpperCase();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box mb={2}>
          <img
            src={data.image}
            alt={data.title}
            style={{
              width: "100%",
              maxHeight: "400px",
              objectFit: "cover",
              borderRadius: 12,
            }}
          />
        </Box>

        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {data.title}
        </Typography>

        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          {data.synopsis}
        </Typography>

        <Box display="flex" alignItems="center" mb={3}>
          <Avatar sx={{ mr: 1, bgcolor: "#1976d2" }}>{initials}</Avatar>
          <Typography variant="body2">
            {data.author.firstName} {data.author.lastName}
          </Typography>
        </Box>

        <Box sx={{ lineHeight: 1.75, fontSize: "1rem" }}>
          <ReactMarkdown>{data.content}</ReactMarkdown>
        </Box>
      </Paper>

      {isAuthor && (
        <Box mt={2} display="flex" gap={2}>
          <Button
            variant="outlined"
            onClick={() => navigate(`/blogs/${blogId}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (confirm("Are you sure you want to delete this blog?")) {
                deleteBlog();
              }
            }}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default BlogDetails;
