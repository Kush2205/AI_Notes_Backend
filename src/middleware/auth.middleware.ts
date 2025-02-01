import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();
const jwtsecret:string = process.env.JWT_SECRET || "";
export const authmiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (!token) {
     res.status(401).json({ msg: 'No token, authorization denied' });
     return;
  }
  try {
    const decoded = jwt.verify(token, jwtsecret);
    if (typeof decoded !== 'string' && 'id' in decoded) {
      req.body.userId= decoded.id;
      
    } else {
     res.status(400).json({ msg: 'Token is not valid' });
     return;
    }
    next();
  } catch (error) {
    res.status(400).json({ msg: 'Token is not valid' });
    return;
  }
};