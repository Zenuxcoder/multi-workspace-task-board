import { Router } from 'express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { authMiddleware } from '../middleware/auth.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = Router();

router.get('/workspaces', authMiddleware, (_req, res) => {
  const workspaces = JSON.parse(readFileSync(join(__dirname, '../data/workspaces.json'), 'utf-8'));
  res.json({ workspaces });
});

export default router;
