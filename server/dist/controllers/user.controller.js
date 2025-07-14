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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserBlogs = exports.updatePassword = exports.updateUser = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client = new client_1.PrismaClient();
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { firstName, lastName, username, email } = req.body;
    try {
        const updatedUser = yield client.user.update({
            where: { id: userId },
            data: { firstName, lastName, username, email },
        });
        res.json({ message: "User updated successfully", user: updatedUser });
    }
    catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.updateUser = updateUser;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { currentPassword, newPassword } = req.body;
    try {
        const user = yield client.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const isMatch = yield bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Incorrect current password" });
        const hashedNewPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        yield client.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });
        res.json({ message: "Password updated successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.updatePassword = updatePassword;
const getUserBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const blogs = yield client.blog.findMany({
            where: {
                authorId: userId,
                isDeleted: false,
            },
            orderBy: { createdAt: "desc" },
        });
        res.json(blogs);
    }
    catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.getUserBlogs = getUserBlogs;
