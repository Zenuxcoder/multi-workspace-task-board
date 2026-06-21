import { Router } from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuid } from 'uuid';
import { authMiddleware } from '../middleware/auth.js';
import { getIO } from '../socket/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = Router();
const tasksPath = join(__dirname, '../data/tasks.json');

function readTasks() {
  return JSON.parse(readFileSync(tasksPath, 'utf-8'));
}

function writeTasks(tasks: any[]) {
  writeFileSync(tasksPath, JSON.stringify(tasks, null, 2));
}

function broadcast(message: string, boardId: string) {
  getIO().emit('activity', {
    id: uuid(),
    message,
    timestamp: new Date().toISOString(),
    boardId,
  });
}

router.post('/task', authMiddleware, (req, res) => {
  const { title, description, status, boardId } = req.body;
  const tasks = readTasks();

  const sameColumn = tasks.filter((t: any) => t.boardId === boardId && t.status === status);
  const task = {
    id: uuid(),
    title,
    description: description || '',
    status: status || 'todo',
    boardId,
    position: sameColumn.length,
  };

  tasks.push(task);
  writeTasks(tasks);
  broadcast(`"${title}" created`, boardId);
  res.status(201).json({ task });
});

router.patch('/task/:id', authMiddleware, (req, res) => {
  const tasks = readTasks();
  const index = tasks.findIndex((t: any) => t.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const old = tasks[index];
  const updated = { ...old, ...req.body };
  tasks[index] = updated;

  if (req.body.status && req.body.status !== old.status) {
    const statusLabels: Record<string, string> = {
      'todo': 'Todo',
      'in-progress': 'In Progress',
      'done': 'Done',
    };
    broadcast(`"${old.title}" moved to ${statusLabels[req.body.status]}`, old.boardId);
  } else if (req.body.title && req.body.title !== old.title) {
    broadcast(`"${old.title}" updated`, old.boardId);
  }

  writeTasks(tasks);
  res.json({ task: updated });
});

router.delete('/task/:id', authMiddleware, (req, res) => {
  const tasks = readTasks();
  const task = tasks.find((t: any) => t.id === req.params.id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const filtered = tasks.filter((t: any) => t.id !== req.params.id);
  writeTasks(filtered);
  broadcast(`"${task.title}" deleted`, task.boardId);
  res.json({ success: true });
});

export default router;
