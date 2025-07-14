import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Avatar,
  Button,
  Box,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axios";
import { Link } from "react-router-dom";


interface Blog {
  id: number;
  image: string;
  title: string;
  synopsis: string;
  author: {
    firstName: string;
    lastName: string;
  };
}

const BlogList = () => {
  const {
    data: blogs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/blogs", {
        withCredentials: true,
      });
      return response.data;
    },
  });

  if (isLoading) return <Typography>Loading blogs...</Typography>;
  if (isError) return <Typography>Error loading blogs.</Typography>;

  return (
    <>
      
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          Latest Blogs
        </Typography>
        <Grid container spacing={4}>
          {blogs.map((blog: Blog) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={blog.id}>
              <Card sx={{ height: "100%" }}>
                <CardMedia
                  component="img"
                  height="160"
                  image={blog.image}
                  alt={blog.title}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {blog.title}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {blog.synopsis}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ width: 24, height: 24 }}>
                      {blog.author.firstName[0]}
                      {blog.author.lastName[0]}
                    </Avatar>
                    <Typography variant="body2">
                      {blog.author.firstName} {blog.author.lastName}
                    </Typography>
                  </Box>

                  <Box mt={2}>
                    <Link
                      to={`/blogs/${blog.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Button variant="outlined" fullWidth>
                        Read More
                      </Button>
                    </Link>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default BlogList;
