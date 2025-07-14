"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_controller_1 = require("../controllers/blog.controller");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const router = (0, express_1.Router)();
router.get("/", blog_controller_1.getAllBlogs);
router.get("/:blogId", blog_controller_1.getBlogById);
router.post("/", auth_controller_1.default, blog_controller_1.createBlog);
router.patch("/:blogId", auth_controller_1.default, blog_controller_1.updateBlog);
router.delete("/:blogId", auth_controller_1.default, blog_controller_1.deleteBlog);
exports.default = router;
