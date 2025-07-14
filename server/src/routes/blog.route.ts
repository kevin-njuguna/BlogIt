import { Router } from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller";
import authenticate from "../controllers/auth.controller";

const router: Router = Router();

router.get("/", getAllBlogs);
router.get("/:blogId", getBlogById);
router.post("/", authenticate, createBlog);
router.patch("/:blogId", authenticate, updateBlog);
router.delete("/:blogId", authenticate, deleteBlog);

export default router;
