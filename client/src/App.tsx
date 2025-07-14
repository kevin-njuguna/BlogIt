import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./Components/Navbar";
import Landing from "./pages/Landing";
import BlogList from "./pages/BlogList";
import BlogDetails from "./pages/BlogDetails";
import CreateBlog from "./pages/CreateBlog";
import UpdateBlog from "./pages/updateBlog";
import Profile from "./pages/Profile";
import Protected from "./pages/Protected";

const client = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={client}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/blogList"
          element={
            <Protected>
              <BlogList />
            </Protected>
          }
        />
        <Route path="/blogs/:blogId" element={<BlogDetails />} />
        <Route
          path="/create-blog"
          element={
            <Protected>
              <CreateBlog />
            </Protected>
          }
        />
        <Route path="/blogs/:blogId/edit" element={<UpdateBlog />} />
        <Route
          path="/profile"
          element={
            <Protected>
              <Profile />
            </Protected>
          }
        />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
