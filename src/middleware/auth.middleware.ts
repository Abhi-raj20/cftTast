
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';

const SECRET_KEY = process.env.JWT_SECRET!;

interface User {
  id: string;
  username: string;
  sessionId: string;
  
}

export interface AuthRequest extends Request {
  user?: User;  
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded: { userId: string; sessionId: string } = jwt.verify(token, SECRET_KEY) as { userId: string; sessionId: string };
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

        if (!user || user.sessionId !== decoded.sessionId) {
            return res.status(401).json({ message: 'Session expired. Please log in again.' });
        }

        req.user = user;  
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
