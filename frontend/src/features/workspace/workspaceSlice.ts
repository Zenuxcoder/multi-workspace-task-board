import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface WorkspaceState {
  selectedId: string | null;
}

const initialState: WorkspaceState = {
  selectedId: localStorage.getItem('workspaceId'),
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setWorkspace(state, action: PayloadAction<string>) {
      state.selectedId = action.payload;
      localStorage.setItem('workspaceId', action.payload);
    },
  },
});

export const { setWorkspace } = workspaceSlice.actions;
export default workspaceSlice.reducer;
