import {Request, Response, NextFunction} from 'express'
import { PrismaClient } from '@prisma/client';

const client = new PrismaClient()

export default async function checkUsernameAndEmailReuse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { username, email } = req.body;
  const userWithUserName = await client.user.findFirst({
    where: { username },
  });
  if (userWithUserName) {
    res.status(400).json({ message: "Username already in use" });
    return;
  }

  const userWithEmail = await client.user.findFirst({
    where: { email },
  });
  if (userWithEmail) {
    res.status(400).json({ message: "Email already in use" });
    return;
  }
  next();
}

