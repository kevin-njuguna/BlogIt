import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from './auth.controller';

const client = new PrismaClient();

export const createBlog = async (req: AuthRequest, res: Response) => {
  try {
    const { image, title, synopsis, content } = req.body;
    const userId = req.user?.id; 
    const blog = await client.blog.create({
      data: {
        image,
        title,
        synopsis,
        content,
        authorId: userId,
      },
    });

    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};


export const getAllBlogs = async (_req: Request, res: Response) => {
  try {
    const blogs = await client.blog.findMany({
      where: { isDeleted: false },
      include: { author: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getBlogById = async (req: Request, res: Response) => {
  const { blogId } = req.params;

  try {
    const blog = await client.blog.findUnique({ 
      where: { id: Number(blogId)
     },
    include: {author: true}
    });
    if (!blog || blog.isDeleted) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateBlog = async (req: AuthRequest, res: Response) => {
  const { blogId } = req.params;
  const userId = req.user?.id;
  const { image, title, synopsis, content } = req.body;

  try {
    const blog = await client.blog.findUnique({ where: { id: Number(blogId) } });

    if (!blog || blog.isDeleted) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.authorId !== userId) {
      return res.status(403).json({ message: "Not allowed to update this blog" });
    }

    const updated = await client.blog.update({
      where: { id: Number(blogId) },
      data: {
        image,
        title,
        synopsis,
        content,
      },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteBlog = async (req: AuthRequest, res: Response) => {
  const { blogId } = req.params;
  const userId = req.user?.id;

  try {
    const blog = await client.blog.findUnique({ where: { id: Number(blogId) } });

    if (!blog || blog.isDeleted) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.authorId !== userId) {
      return res.status(403).json({ message: "Not allowed to delete this blog" });
    }

    await client.blog.update({
      where: { id: Number(blogId) },
      data: { isDeleted: true },
    });

    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};