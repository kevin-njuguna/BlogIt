import { Router } from "express";
import {
  updateUser,
  updatePassword,
  getUserBlogs,
} from "../controllers/user.controller";
import authenticate from "../controllers/auth.controller";

const router = Router();

router.patch("/", authenticate, updateUser);
router.patch("/password", authenticate, updatePassword);
router.get("/blogs", authenticate, getUserBlogs);

export default router;
