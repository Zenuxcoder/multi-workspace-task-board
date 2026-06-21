# Deployment Guide

This guide provides step-by-step instructions for deploying the **TaskFlow** application:
1. **Backend** (Express & Socket.IO) on **Render**
2. **Frontend** (Vite & React) on **Vercel**

---

## 1. Backend Deployment (Render)

Render supports WebSockets and Node.js servers, making it the ideal host for the Express + Socket.IO backend.

### Option A: Using the Blueprint (`render.yaml`)

Since this repository contains a `render.yaml` file in the root, Render can auto-configure the backend.

1. Create a free account at [Render](https://render.com/).
2. From the dashboard, click **New** > **Blueprint**.
3. Connect your GitHub repository: `https://github.com/Zenuxcoder/multi-workspace-task-board`.
4. Render will automatically detect the `render.yaml` configuration and create the Web Service named `taskflow-backend`.
5. Click **Apply**. Once built, Render will provide a public URL for your backend (e.g., `https://taskflow-backend.onrender.com`). Save this URL.

### Option B: Manual Setup on Render

If you prefer to configure it manually:

1. Log in to [Render](https://render.com/).
2. Click **New** > **Web Service**.
3. Select your repository `multi-workspace-task-board`.
4. Configure the settings:
   - **Name**: `taskflow-backend`
   - **Region**: Choose closest to you (e.g., Oregon or Frankfurt)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `NODE_ENV` = `production`
6. Click **Deploy Web Service**. Once deployed, copy your service's URL.

---

## 2. Frontend Deployment (Vercel)

Vercel is the recommended host for Vite/React applications.

1. Create a free account at [Vercel](https://vercel.com/).
2. Click **Add New** > **Project**.
3. Import your GitHub repository: `https://github.com/Zenuxcoder/multi-workspace-task-board`.
4. In the Project configuration:
   - **Framework Preset**: `Vite` (Vercel will auto-detect this)
   - **Root Directory**: Click *Edit* and select **`frontend`**
   - **Build and Output Settings**: Keep default (`npm run build` and `dist`)
5. Under **Environment Variables**, add the environment variable linking the frontend to your backend on Render:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://taskflow-backend.onrender.com` (use your actual Render backend URL)
6. Click **Deploy**. Vercel will build the frontend and provide your live application URL!

---

## 3. Post-Deployment Verification

1. Open your Vercel deployment URL.
2. Log in using the credentials:
   - **Email**: `demo@taskflow.com`
   - **Password**: `password123`
3. Verify that boards and tasks load. Try adding, updating, and dragging tasks.
4. Verify that real-time Socket.IO notifications appear in the sliding **Activity** panel.
5. Click **Share Board** to copy the public link. Open it in a private/incognito window to verify the read-only board rendering.
