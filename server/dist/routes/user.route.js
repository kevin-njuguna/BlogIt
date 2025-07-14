"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const router = (0, express_1.Router)();
router.patch("/", auth_controller_1.default, user_controller_1.updateUser);
router.patch("/password", auth_controller_1.default, user_controller_1.updatePassword);
router.get("/blogs", auth_controller_1.default, user_controller_1.getUserBlogs);
exports.default = router;
