import { Box, Typography, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#e3f2fd",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      <Box>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Welcome to BlogIt
        </Typography>
        <Typography variant="h6" mb={4}>
          A simple blogging platform to share your thoughts.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" component={Link} to="/register">
            Get Started
          </Button>
          <Button variant="outlined" component={Link} to="/login">
            Login
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default Landing;
