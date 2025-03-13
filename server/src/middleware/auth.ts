import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

interface JwtPayload {
  id: number;
  username: string;
}

export const authenticateToken =  async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    const secretKey = process.env.JWT_SECRET_KEY || '';

    try {
      const decoded = jwt.verify(token, secretKey) as JwtPayload;
      console.log('Decoded:', decoded);

      const user = await User.findByPk(decoded.id);
      console.log('User:', user);

      if (!user) {
        return res.sendStatus(403); // Forbidden
      }

      req.user = user as JwtPayload;
      return next();
    } catch (err) {
      console.error(err);
      return res.sendStatus(403);
    } 
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

export default authenticateToken;
