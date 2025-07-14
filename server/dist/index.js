"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const blog_route_1 = __importDefault(require("./routes/blog.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.get("/", (_req, res) => {
    res.send("<h1>Hey There, Welcome to BlogIt!</h1>");
});
app.use("/api/auth", auth_route_1.default);
app.use("/api/blogs", blog_route_1.default);
app.use("/api/user", user_route_1.default);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
