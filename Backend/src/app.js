import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',        // Allow only this origin
  credentials: true,            // Allow credentials (cookies, etc.)
}));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

// Middleware for logging (uncomment for debugging)
// app.use((req, res, next) => {
//   console.log('Request headers:', req.headers);
//   console.log('Cookies:', req.cookies);
//   next();
// });

import userRouter from './routes/user.routes.js';

app.use('/api/v1/users', userRouter);

export default app;
