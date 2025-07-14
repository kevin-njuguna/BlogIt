import { Request, Response, NextFunction} from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

const client = new PrismaClient()

export const register = async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, email, username, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);
      await client.user.create({
        data: {
          firstName,
          lastName,
          email,
          username,
          password: hashedPassword,
        },
      });
      res.status(201).json({ message: "user created succesfully" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Something went wrong" });
    }
  }

export const login = async (req: Request, res: Response) => {
    try {
   
    //read identifier and password
    const {identifier, password} = req.body
    
    //query db against identifier
    const user = await client.user.findFirst({
      where: {
        OR: [{username: identifier}, {email: identifier}]
      }
    })

    //no user, wrong login credentials

    if (!user) {
      res.status(400).json({message: "Failed. Wrong login credentials!"})
      return;
    }

    // if user, compare password against stored password
    
      const passwordMatch = await bcrypt.compare(password, user.password)
    //no match, wrong login credentials
    if (!passwordMatch) {
      res.status(400).json({message: "Wrong login credentials"})
      return;
    } 
    
    //match, create token to identify user
    const {password: loginPassword, createdAt, updatedAt, ...userDetails} = user;
    const token = jwt.sign(userDetails, process.env.JWT_SECRET!)
    res.cookie("authToken", token).json(userDetails)

    //res.send(user)
    
    } catch (e) {
        console.log(e)
        res.status(500).json({message: "Something went wrong"})
    }
}


export interface AuthRequest extends Request {
  user?: any;
}

export default function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.authToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

export const logout = (_req: Request, res: Response) => {
  res.clearCookie('authToken', { httpOnly: true, sameSite: 'lax' });
  res.status(200).json({ message: 'Logged out successfully' });
};
