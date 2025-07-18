import { Request, Response, NextFunction } from "express";
import zxcvbn from "zxcvbn";

export default function verifyPasswordStrength(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { password } = req.body;
  const result = zxcvbn(password);
  if (result.score < 3) {
    res
      .status(400)
      .json({ message: "Password is weak. Please pick a stronger password." });
    return;
  }
  next();
}
