import { Router } from 'express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { authMiddleware } from '../middleware/auth.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = Router();

function readJSON(file: string) {
  return JSON.parse(readFileSync(join(__dirname, `../data/${file}`), 'utf-8'));
}

router.get('/boards', authMiddleware, (req, res) => {
  const { workspaceId } = req.query;
  const boards = readJSON('boards.json');
  const filtered = workspaceId
    ? boards.filter((b: any) => b.workspaceId === workspaceId)
    : boards;
  res.json({ boards: filtered });
});

router.get('/board/:id', authMiddleware, (req, res) => {
  const boards = readJSON('boards.json');
  const tasks = readJSON('tasks.json');
  const board = boards.find((b: any) => b.id === req.params.id);

  if (!board) {
    return res.status(404).json({ error: 'Board not found' });
  }

  const boardTasks = tasks.filter((t: any) => t.boardId === board.id);
  res.json({ board, tasks: boardTasks });
});

router.get('/public/board/:id', (req, res) => {
  const boards = readJSON('boards.json');
  const tasks = readJSON('tasks.json');
  const workspaces = readJSON('workspaces.json');
  const board = boards.find((b: any) => b.id === req.params.id);

  if (!board) {
    return res.status(404).json({ error: 'Board not found' });
  }

  const workspace = workspaces.find((w: any) => w.id === board.workspaceId);
  const boardTasks = tasks.filter((t: any) => t.boardId === board.id);
  res.json({ board, tasks: boardTasks, workspace });
});

export default router;
