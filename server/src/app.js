import cors from 'cors';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import taskRoutes from './routes/tasks.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.use('/api/tasks', taskRoutes);

if (process.env.NODE_ENV === 'production') {
  const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
  const clientDirectory = path.resolve(currentDirectory, '../../client/dist');
  app.use(express.static(clientDirectory));
  app.get('*', (_request, response) => response.sendFile(path.join(clientDirectory, 'index.html')));
}

app.use((error, _request, response, _next) => {
  const validationError = error.name === 'ValidationError';
  const status = validationError ? 400 : 500;
  response.status(status).json({
    message: validationError ? error.message : 'Internal server error',
  });
});

export default app;
