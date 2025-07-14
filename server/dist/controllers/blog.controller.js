"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.getBlogById = exports.getAllBlogs = exports.createBlog = void 0;
const client_1 = require("@prisma/client");
const client = new client_1.PrismaClient();
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { image, title, synopsis, content } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const blog = yield client.blog.create({
            data: {
                image,
                title,
                synopsis,
                content,
                authorId: userId,
            },
        });
        res.status(201).json(blog);
    }
    catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.createBlog = createBlog;
const getAllBlogs = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogs = yield client.blog.findMany({
            where: { isDeleted: false },
            include: { author: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(blogs);
    }
    catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.getAllBlogs = getAllBlogs;
const getBlogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogId } = req.params;
    try {
        const blog = yield client.blog.findUnique({
            where: { id: Number(blogId)
            },
            include: { author: true }
        });
        if (!blog || blog.isDeleted) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.json(blog);
    }
    catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.getBlogById = getBlogById;
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { blogId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { image, title, synopsis, content } = req.body;
    try {
        const blog = yield client.blog.findUnique({ where: { id: Number(blogId) } });
        if (!blog || blog.isDeleted) {
            return res.status(404).json({ message: "Blog not found" });
        }
        if (blog.authorId !== userId) {
            return res.status(403).json({ message: "Not allowed to update this blog" });
        }
        const updated = yield client.blog.update({
            where: { id: Number(blogId) },
            data: {
                image,
                title,
                synopsis,
                content,
            },
        });
        res.json(updated);
    }
    catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.updateBlog = updateBlog;
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { blogId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const blog = yield client.blog.findUnique({ where: { id: Number(blogId) } });
        if (!blog || blog.isDeleted) {
            return res.status(404).json({ message: "Blog not found" });
        }
        if (blog.authorId !== userId) {
            return res.status(403).json({ message: "Not allowed to delete this blog" });
        }
        yield client.blog.update({
            where: { id: Number(blogId) },
            data: { isDeleted: true },
        });
        res.json({ message: "Blog deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.deleteBlog = deleteBlog;
