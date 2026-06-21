import { configureStore } from '@reduxjs/toolkit';
import { api } from '@/api/base';
import authReducer from '@/features/auth/authSlice';
import workspaceReducer from '@/features/workspace/workspaceSlice';
import activityReducer from '@/features/activity/activitySlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    workspace: workspaceReducer,
    activity: activityReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
