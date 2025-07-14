import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import useUser from "../store/userStore";
import { useTheme } from "@mui/material/styles";
import axiosInstance from "../api/axios";

const Navbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = async () => {
    try {
      await axiosInstance.post(
        "/api/auth/logout",
        {},
        { withCredentials: true }
      );
      logout();
      navigate("/");
    } catch (e) {
      console.log(e);
      alert("Logout failed.");
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const LoggedOutLinks = (
    <>
      <Button color="inherit" component={Link} to="/login">
        Login
      </Button>
      <Button color="inherit" component={Link} to="/register">
        Sign Up
      </Button>
    </>
  );

  const LoggedInLinks = (
    <>
      <Button color="inherit" component={Link} to="/blogList">
        Posts
      </Button>
      <Button color="inherit" component={Link} to="/create-blog">
        New Blog
      </Button>
      <Button color="inherit" component={Link} to="/profile">
        Profile
      </Button>
      <Button color="inherit" onClick={handleLogout}>
        Logout
      </Button>
    </>
  );

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        
        <Box
          display="flex"
          alignItems="center"
          sx={{ gap: { xs: 1, sm: 1.5, md: 1 } }}
        >
          <img src="/blogit logo.png" alt="Logo" style={{ height: 40 }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            color="inherit"
            sx={{ textDecoration: "none" }}
          >
            BlogIt
          </Typography>
        </Box>

        
        {isMobile ? (
          <>
            <IconButton edge="end" color="inherit" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {user ? (
                <>
                  <MenuItem
                    component={Link}
                    to="/blogList"
                    onClick={handleMenuClose}
                  >
                    Posts
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/create-blog"
                    onClick={handleMenuClose}
                  >
                    New Blog
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/profile"
                    onClick={handleMenuClose}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      handleLogout();
                    }}
                  >
                    Logout
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem
                    component={Link}
                    to="/login"
                    onClick={handleMenuClose}
                  >
                    Login
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/register"
                    onClick={handleMenuClose}
                  >
                    Sign Upp
                  </MenuItem>
                </>
              )}
            </Menu>
          </>
        ) : user ? (
          <Box display="flex" gap={2} alignItems="center">
            <Typography variant="body1" sx={{ ml: 1.5 }}>
              Hello, {user.firstName}!
            </Typography>
            {LoggedInLinks}
          </Box>
        ) : (
          <Box display="flex" gap={2} alignItems="center">
            {LoggedOutLinks}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
