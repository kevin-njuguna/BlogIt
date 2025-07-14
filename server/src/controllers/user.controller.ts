import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthRequest } from "./auth.controller";

const client = new PrismaClient();

export const updateUser = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { firstName, lastName, username, email } = req.body;

  try {
    const updatedUser = await client.user.update({
      where: { id: userId },
      data: { firstName, lastName, username, email },
    });

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updatePassword = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await client.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect current password" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await client.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUserBlogs = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    const blogs = await client.blog.findMany({
      where: {
        authorId: userId,
        isDeleted: false,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
