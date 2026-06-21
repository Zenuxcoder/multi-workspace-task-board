import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { JWT_SECRET } from '../middleware/auth.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = JSON.parse(readFileSync(join(__dirname, '../data/users.json'), 'utf-8'));
  const user = users.find((u: any) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
});

export default router;
