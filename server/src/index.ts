import express, { Express } from "express";


import cors from "cors";
const app: Express = express();
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.route";
import blogRouter from "./routes/blog.route";
import userRouter from "./routes/user.route";

app.use(
  cors({
    origin: ["https://blog-it-ruddy.vercel.app"],
    methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("<h1>Hey There, Welcome to BlogIt!</h1>");
});

app.use("/api/auth", authRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/user", userRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
