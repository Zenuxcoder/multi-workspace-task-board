# Multi-Workspace Task Board with Shareable Views

TaskFlow is a multi-workspace task board (Kanban board) application built with React, TypeScript, Redux Toolkit, and Node.js. It features mock JWT authentication, drag-and-drop task movements, real-time activity feed notifications via Socket.IO, and public shareable links.

## Project Structure

```text
assignment/
├── frontend/             # React application (Vite)
│   ├── src/
│   │   ├── api/          # RTK Query API layer
│   │   ├── app/          # Redux Store config and typed hooks
│   │   ├── components/   # UI & layout components
│   │   ├── features/     # Redux slices (auth, workspace, activity)
│   │   ├── hooks/        # Custom hooks (e.g. useSocket)
│   │   ├── pages/        # Route pages (Login, Board, Public View)
│   │   ├── routes/       # React Router setup & protected routes
│   │   ├── types/        # TypeScript models
│   │   └── utils/        # Date formatting, class merges
├── backend/              # Node.js + Express mock API server
│   ├── data/             # JSON flat files for persistence
│   ├── middleware/       # JWT auth token middleware
│   ├── routes/           # Auth, Workspace, Board, Task routers
│   ├── socket/           # Socket.IO connection event loop
│   └── server.ts         # Main server entrypoint
```

## Setup & Running Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (installed with Node)

---

### Step 1: Run the Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server in development mode:
   ```bash
   npm run dev
   ```
   The backend server will run on **http://localhost:3001**.

---

### Step 2: Run the Frontend

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   Open **http://localhost:5173** in your web browser.

---

## Demo Credentials

To access the workspaces and board management features, log in using:

* **Email**: `demo@taskflow.com`
* **Password**: `password123`

---

## Key Features

1. **Authentication**: Form-based login with simulated JWT authorization stored in `localStorage`. Graceful redirection for unauthenticated routes.
2. **Multi-Workspace Support**: Toggle workspaces via header switcher. Boards and task lists adapt instantly. Selected workspace is persisted.
3. **Task Board CRUD**: Add new tasks, edit existing task details, and delete tasks from the board columns (*Todo*, *In Progress*, *Done*).
4. **Drag & Drop**: Interactive drag and drop task moving across columns powered by `@dnd-kit/core` and `@dnd-kit/sortable`.
5. **Real-time Activity Feed**: Lightweight updates using `Socket.IO`. Broadcasters push status alerts (e.g., `"Landing Page moved to Done"`) to the sliding Activity panel in real time.
6. **Public View**: Copy board share link to clipboard. Open the link directly in an incognito window to view a read-only rendering of the board (no sign-in required). Includes lightweight SEO metadata.
