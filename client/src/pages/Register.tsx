import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  Alert,
  Stack,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");

  const navigate = useNavigate();

  interface User {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
  }

  const { isPending, mutate } = useMutation({
    mutationKey: ["register"],
    mutationFn: async (newUser: User) => {
      const response = await axios.post(
        "http://localhost:4000/api/auth/register",
        newUser,
      );
      return response.data;
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        setFormError(err.response?.data.message || "Something went wrong");
      } else {
        setFormError("Server error. Please try again.");
      }
    },
    onSuccess: () => {
      navigate("/login");
    },
  });

  const handleSignUp = () => {
    setFormError("");

    if (password !== confirmPassword) {
      setFormError("Password and confirm password must match!");
      return;
    }

    const newUser: User = {
      firstName,
      lastName,
      email,
      username,
      password,
    };

    mutate(newUser);
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}
    >
      <Grid size={{ xs: 11, sm: 8, md: 5, lg: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            align="center"
          >
            Create an Account
          </Typography>

          <Box component="form" noValidate autoComplete="off">
            <Stack spacing={2}>
              {formError && <Alert severity="error">{formError}</Alert>}

              <TextField
                label="First Name"
                fullWidth
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />

              <TextField
                label="Last Name"
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />

              <TextField
                label="Username"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <LoadingButton
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSignUp}
                loading={isPending}
              >
                Sign Up
              </LoadingButton>

              <Typography variant="body2" align="center">
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{ textDecoration: "none", color: "#1976d2" }}
                >
                  Login
                </Link>
              </Typography>
            </Stack>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Register;
