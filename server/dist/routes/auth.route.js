"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyUserInformation_1 = __importDefault(require("../middlewares/verifyUserInformation"));
const verifyPasswordStrength_1 = __importDefault(require("../middlewares/verifyPasswordStrength"));
const checkUsernameAndEmailReuse_1 = __importDefault(require("../middlewares/checkUsernameAndEmailReuse"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_controller_2 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
router.post("/register", verifyUserInformation_1.default, checkUsernameAndEmailReuse_1.default, verifyPasswordStrength_1.default, auth_controller_1.register);
router.post("/login", auth_controller_1.login);
router.post("/logout", auth_controller_2.logout);
exports.default = router;
