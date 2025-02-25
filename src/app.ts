import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';

const app = express();

app.use(cors({ credentials: true, origin: '*' }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

export default app;
