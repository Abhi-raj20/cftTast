import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';
import { v4 as uuidv4 } from 'uuid';

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};

export const registerUser = async (email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { email, password: hashedPassword },
  });
};


export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const newSessionId = uuidv4();

  await prisma.user.update({
      where: { id: user.id },
      data: { sessionId: newSessionId }
  });

  const token = jwt.sign(
      { userId: user.id, sessionId: newSessionId },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
  );

  return { user, token };
};