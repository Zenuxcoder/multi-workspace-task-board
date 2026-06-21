import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { setupSocket } from './socket/index.js';
import authRoutes from './routes/auth.js';
import workspaceRoutes from './routes/workspaces.js';
import boardRoutes from './routes/boards.js';
import taskRoutes from './routes/tasks.js';

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());

app.use(authRoutes);
app.use(workspaceRoutes);
app.use(boardRoutes);
app.use(taskRoutes);

setupSocket(server);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
