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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
exports.default = authenticate;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client = new client_1.PrismaClient();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, username, password } = req.body;
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        yield client.user.create({
            data: {
                firstName,
                lastName,
                email,
                username,
                password: hashedPassword,
            },
        });
        res.status(201).json({ message: "user created succesfully" });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //read identifier and password
        const { identifier, password } = req.body;
        //query db against identifier
        const user = yield client.user.findFirst({
            where: {
                OR: [{ username: identifier }, { email: identifier }]
            }
        });
        //no user, wrong login credentials
        if (!user) {
            res.status(400).json({ message: "Failed. Wrong login credentials!" });
            return;
        }
        // if user, compare password against stored password
        const passwordMatch = yield bcryptjs_1.default.compare(password, user.password);
        //no match, wrong login credentials
        if (!passwordMatch) {
            res.status(400).json({ message: "Wrong login credentials" });
            return;
        }
        //match, create token to identify user
        const { password: loginPassword, createdAt, updatedAt } = user, userDetails = __rest(user, ["password", "createdAt", "updatedAt"]);
        const token = jsonwebtoken_1.default.sign(userDetails, process.env.JWT_SECRET);
        res.cookie("authToken", token).json(userDetails);
        //res.send(user)
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.login = login;
function authenticate(req, res, next) {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.authToken;
    if (!token)
        return res.status(401).json({ message: "Unauthorized" });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (_b) {
        res.status(401).json({ message: "Invalid token" });
    }
}
const logout = (_req, res) => {
    res.clearCookie('authToken', { httpOnly: true, sameSite: 'lax' });
    res.status(200).json({ message: 'Logged out successfully' });
};
exports.logout = logout;
