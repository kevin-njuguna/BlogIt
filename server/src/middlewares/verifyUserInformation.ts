import { Request, Response, NextFunction } from "express";

export default function verifyUserInformation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { firstName, lastName, email, username, password } = req.body;

  if (!firstName) {
    res.status(400).json({ message: "First name is required" });
    return;
  }
  if (!lastName) {
    res.status(400).json({ message: "Last name is required" });
    return;
  }
  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }
  if (!username) {
    res.status(400).json({ message: "Username is required" });
    return;
  }
  if (!password) {
    res.status(400).json({ message: "Password is required" });
    return;
  }
  next();
}
