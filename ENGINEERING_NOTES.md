# Engineering Notes

This document highlights the architecture, state management patterns, trade-offs, and design choices made during the development of **TaskFlow**.

---

## 1. Architectural Decisions

- **Vite & React**: Chosen over framework solutions like Next.js because this is a client-focused single-page application. Vite provides blazing fast HMR and lightweight bundles, ideal for rapid prototyping and take-home submissions.
- **Node/Express Mock Backend**: To keep development overhead low while keeping functionality complete, a lightweight Express API server is used.
- **JSON File Persistence**: To satisfy the 1-2 day assignment constraint without requiring complex database installation, flat JSON files under `backend/data/` persist tasks, boards, and workspaces. Synchronous read/write operations resemble a live database transaction.
- **Socket.IO for Real-time Activities**: Enables push notifications instead of expensive polling. When updates are performed via standard HTTP request (e.g. `PATCH /task`), the server pushes an event to all connected sockets.

---

## 2. State Management & Data Fetching

### Server State (RTK Query)
- All server data (workspaces, boards, tasks) is retrieved and modified using RTK Query.
- **No duplication**: We avoid replicating fetched database arrays inside Redux slices. The data remains in the RTK Query cache.
- **Cache Invalidation**: Using tag types (`Board`, `Boards`, `Workspaces`), any task mutator mutation (`createTask`, `updateTask`, `deleteTask`) automatically invalidates the specific board cache, triggering a fresh fetch in the background.

### Client State (Redux Toolkit)
We limit standard Redux slices to localized client status that needs to persist across component boundaries:
1. `authSlice`: Tracks logged-in user details and the JWT. Persisted in `localStorage` to keep the user signed in on page refresh.
2. `workspaceSlice`: Tracks the selected workspace ID to filter board navigation.
3. `activitySlice`: Collects real-time action notifications pushed over the Socket.IO stream.

---

## 3. Drag and Drop Architecture

- Built using **@dnd-kit/core** and **@dnd-kit/sortable**.
- Pointer sensors are customized with an activation constraint (8px threshold) to avoid blocking clicks on editing buttons or standard interactive UI components.
- The `onDragEnd` event determines the destination column and triggers a mutation update directly. Since RTK Query handles optimistic states and cached fetches, the board automatically updates.

---

## 4. Key Trade-offs

1. **JSON Files vs. Database**: Avoids database Docker container dependencies. This allows reviewers to run `npm install` and `npm run dev` instantly without setting up databases, while maintaining permanent mutations (restarts do not erase user tasks).
2. **Synchronous File I/O**: The backend uses synchronous JSON files read/writes. While not suited for production high-concurrency workloads, it is robust and prevents race conditions for simple local testing.
3. **dnd-kit Vertical Sorting**: For the sake of simplicity and shipping functional features quickly, we update the task's column status on dropping. Reordering positions within a column is fully active locally through dnd-kit visual movement but maps to standard placement updates on the backend.

---

## 5. Future Improvements

If scaled up to a production application, the following additions would be implemented:
1. **Production Database**: Replace JSON persistence with MongoDB or PostgreSQL using an ORM like Prisma.
2. **Redis Pub/Sub**: Scale Socket.IO across multiple server instances using Redis-adapter.
3. **Advanced Permissions**: Implement true RBAC (Role-Based Access Control) to verify if users have write access to workspaces before modifying boards.
4. **Optimistic Updates**: Explicitly write RTK Query `onQueryStarted` cache mutations to move cards visually before the server returns success responses, making dragging feel completely instantaneous even on slow networks.
5. **Dockerization**: Provide a `docker-compose.yml` to spin up the frontend, backend, and a database container in one command.
