import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service';
import prisma from '../config/db'; 
import { AuthRequest } from '../middleware/auth.middleware'; 

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await registerUser(email, password);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);

   
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });

    res.json({ message: 'Login successful', user });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    await prisma.user.update({
      where: { id: req.user.id },
      data: { sessionId: null }
    });

    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' });
    res.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};