import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Grid,
} from "@mui/material";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import useUser from "../store/userStore";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";

interface Blog {
  id: number;
  title: string;
  image: string;
  synopsis: string;
  createdAt: string;
}

const Profile = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    username: user?.username || "",
    email: user?.email || "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const { mutate: updateUser, isPending: updatingUser } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.patch("/api/user", formData, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: (data) => {
      setUser(data);
      alert("Profile updated successfully!");
    },
    onError: () => {
      alert("Failed to update profile.");
    },
  });

  const { mutate: updatePassword, isPending: updatingPassword } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.patch("/api/user/password", passwords, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      alert("Password updated successfully!");
      setPasswords({ currentPassword: "", newPassword: "" });
    },
    onError: () => {
      alert("Failed to update password. Current password might be wrong.");
    },
  });

  const { data: blogs, refetch } = useQuery({
    queryKey: ["userBlogs"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/user/blogs", {
        withCredentials: true,
      });
      return res.data;
    },
  });

  const { mutate: deleteBlog } = useMutation({
    mutationFn: async (blogId: number) => {
      return axiosInstance.delete(`/api/blogs/${blogId}`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      refetch();
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit Profile
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateUser();
          }}
        >
          <Stack spacing={2}>
            <TextField
              name="firstName"
              label="First Name"
              fullWidth
              value={formData.firstName}
              onChange={handleChange}
            />
            <TextField
              name="lastName"
              label="Last Name"
              fullWidth
              value={formData.lastName}
              onChange={handleChange}
            />
            <TextField
              name="username"
              label="Username"
              fullWidth
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              name="email"
              label="Email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
            />
            <Button type="submit" variant="contained" disabled={updatingUser}>
              {updatingUser ? "Updating..." : "Update Info"}
            </Button>
          </Stack>
        </form>
      </Paper>

      
      <Typography variant="h5" gutterBottom>
        Change Password
      </Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updatePassword();
          }}
        >
          <Stack spacing={2}>
            <TextField
              name="currentPassword"
              label="Current Password"
              type="password"
              fullWidth
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
            />
            <TextField
              name="newPassword"
              label="New Password"
              type="password"
              fullWidth
              value={passwords.newPassword}
              onChange={handlePasswordChange}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={updatingPassword}
            >
              {updatingPassword ? "Updating..." : "Update Password"}
            </Button>
          </Stack>
        </form>
      </Paper>

      
      <Typography variant="h5" gutterBottom>
        Your Blogs
      </Typography>

      {blogs?.length === 0 && (
        <Typography variant="body1">
          You haven't posted any blogs yet.
        </Typography>
      )}

      <Grid container spacing={2}>
        {blogs?.map((blog: Blog) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={blog.id}>
            <Paper sx={{ p: 2 }}>
              <img
                src={blog.image}
                alt={blog.title}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
              <Typography variant="h6" mt={1}>
                {blog.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {blog.synopsis}
              </Typography>
              <Stack direction="row" spacing={1} mt={2}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/blogs/${blog.id}/edit`)}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this blog?")) {
                      deleteBlog(blog.id);
                    }
                  }}
                >
                  Delete
                </Button>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Profile;
