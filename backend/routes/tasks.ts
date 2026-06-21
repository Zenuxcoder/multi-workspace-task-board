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
  const { title, description, status, position } = req.body;

  const statusChanged = status && status !== old.status;
  const positionChanged = typeof position === 'number' && position !== old.position;

  if (statusChanged || positionChanged) {
    const boardId = old.boardId;
    const targetStatus = status || old.status;

    // Get all tasks for this board
    const boardTasks = tasks.filter((t: any) => t.boardId === boardId);

    // Get source column tasks (excluding dragged) sorted
    const sourceColTasks = boardTasks
      .filter((t: any) => t.status === old.status && t.id !== old.id)
      .sort((a: any, b: any) => a.position - b.position);

    // Re-index source tasks to be solid sequential
    sourceColTasks.forEach((t: any, idx: number) => {
      t.position = idx;
    });

    if (statusChanged) {
      // Moving across columns
      const targetColTasks = boardTasks
        .filter((t: any) => t.status === targetStatus)
        .sort((a: any, b: any) => a.position - b.position);

      const targetPos = typeof position === 'number'
        ? Math.max(0, Math.min(position, targetColTasks.length))
        : targetColTasks.length;

      // Shift target column items to make room
      targetColTasks.forEach((t: any) => {
        if (t.position >= targetPos) {
          t.position += 1;
        }
      });

      const statusLabels: Record<string, string> = {
        'todo': 'Todo',
        'in-progress': 'In Progress',
        'done': 'Done',
      };
      broadcast(`"${old.title}" moved to ${statusLabels[targetStatus]}`, old.boardId);

      old.status = targetStatus;
      old.position = targetPos;
    } else {
      // Reordering within the same column
      const colTasks = boardTasks
        .filter((t: any) => t.status === old.status && t.id !== old.id)
        .sort((a: any, b: any) => a.position - b.position);

      const targetPos = Math.max(0, Math.min(position, colTasks.length));

      colTasks.forEach((t: any) => {
        if (old.position < targetPos) {
          // Dragged down: shift intermediate tasks up
          if (t.position > old.position && t.position <= targetPos) {
            t.position -= 1;
          }
        } else {
          // Dragged up: shift intermediate tasks down
          if (t.position >= targetPos && t.position < old.position) {
            t.position += 1;
          }
        }
      });

      old.position = targetPos;
    }
  }

  if (title !== undefined) old.title = title;
  if (description !== undefined) old.description = description;

  if (title && title !== old.title && !statusChanged) {
    broadcast(`"${old.title}" updated`, old.boardId);
  }

  writeTasks(tasks);
  res.json({ task: old });
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
