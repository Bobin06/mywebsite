import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import promptsRouter from './routes/prompts.routes';
import authRouter from './routes/auth.routes';

dotenv.config();

const app = express();
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(cors({ origin: frontendUrl, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/prompts', promptsRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
  console.log(`🚀 Backend listening on port ${port}`);
});

export default app;
