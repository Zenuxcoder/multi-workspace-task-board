import { api } from './base';
import type { User, Workspace, Board, Task } from '@/types';

export const endpoints = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<{ token: string; user: User }, { email: string; password: string }>({
      query: (body) => ({ url: '/login', method: 'POST', body }),
    }),

    getWorkspaces: build.query<{ workspaces: Workspace[] }, void>({
      query: () => '/workspaces',
      providesTags: ['Workspaces'],
    }),

    getBoards: build.query<{ boards: Board[] }, string>({
      query: (workspaceId) => `/boards?workspaceId=${workspaceId}`,
      providesTags: ['Boards'],
    }),

    getBoard: build.query<{ board: Board; tasks: Task[] }, string>({
      query: (id) => `/board/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Board', id }],
    }),

    getPublicBoard: build.query<{ board: Board; tasks: Task[]; workspace: Workspace }, string>({
      query: (id) => `/public/board/${id}`,
    }),

    createTask: build.mutation<{ task: Task }, Partial<Task>>({
      query: (body) => ({ url: '/task', method: 'POST', body }),
      invalidatesTags: (_r, _e, arg) => [{ type: 'Board', id: arg.boardId }],
    }),

    updateTask: build.mutation<{ task: Task }, { id: string } & Partial<Task>>({
      query: ({ id, ...body }) => ({ url: `/task/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_r, _e, arg) => [{ type: 'Board', id: arg.boardId }],
    }),

    deleteTask: build.mutation<{ success: boolean }, { id: string; boardId: string }>({
      query: ({ id }) => ({ url: `/task/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, arg) => [{ type: 'Board', id: arg.boardId }],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetWorkspacesQuery,
  useGetBoardsQuery,
  useGetBoardQuery,
  useGetPublicBoardQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = endpoints;
