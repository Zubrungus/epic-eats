import { Router, type Request, type Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';

export const signUp = async (req: Request, res: Response) => {
  const { username, password } = req.body;

try {
  const newUser = await User.create({ username, password });

  const secretKey = process.env.JWT_SECRET_KEY || 'password';

  const token = jwt.sign({ username, id: newUser.id }, secretKey, { expiresIn: '7d' });
  return res.status(201).json({ token });

  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }

};

const router = Router();

// POST /login - Login a user
router.post('/', signUp);

export default router;