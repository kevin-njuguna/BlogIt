import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Box,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../api/axios";
import useUser from "../store/userStore";
import axios from "axios";

interface LoginDetails {
  identifier: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const { isPending, mutate } = useMutation({
    mutationKey: ["login-user"],
    mutationFn: async (loginDetails: LoginDetails) => {
      const response = await axiosInstance.post(
        "/api/auth/login",
        loginDetails,
      );
      console.log(response.data);
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data);
      navigate("/blogList");
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        setFormError(err.response?.data.message);
      } else {
        setFormError("Something went wrong!");
      }
    },
  });

  function handleLogin() {
    setFormError("");
    mutate({ identifier, password });
  }

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
            align="center"
            gutterBottom
          >
            Login to BlogIt
          </Typography>
          <Box component="form" noValidate autoComplete="off">
            <Stack spacing={2}>
              {formError && <Alert severity="error">{formError}</Alert>}
              <TextField
                label="Username or Email"
                fullWidth
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleLogin}
                disabled={isPending}
              >
                {isPending ? "Logging in..." : "Login"}
              </Button>
              <Typography variant="body2" align="center">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  style={{ textDecoration: "none", color: "#1976d2" }}
                >
                  Register
                </Link>
              </Typography>
            </Stack>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
