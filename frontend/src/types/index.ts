export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  boardId: string;
  position: number;
};

export type Board = {
  id: string;
  title: string;
  workspaceId: string;
};

export type Workspace = {
  id: string;
  name: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
};

export type ActivityEvent = {
  id: string;
  message: string;
  timestamp: string;
  boardId: string;
};

export type TaskStatus = Task['status'];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  'todo': 'Todo',
  'in-progress': 'In Progress',
  'done': 'Done',
};

export const COLUMNS: TaskStatus[] = ['todo', 'in-progress', 'done'];
