import express from 'express';
import { login, register, logout } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout',logout);

export default router;
