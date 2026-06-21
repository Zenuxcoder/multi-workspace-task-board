import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';
import LoginPage from '@/pages/LoginPage';
import BoardPage from '@/pages/BoardPage';
import PublicBoardPage from '@/pages/PublicBoardPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/public/board/:boardId',
    element: <PublicBoardPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <BoardPage /> },
          { path: '/board/:boardId', element: <BoardPage /> },
        ],
      },
    ],
  },
]);
