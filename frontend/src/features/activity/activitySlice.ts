import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ActivityEvent } from '@/types';

interface ActivityState {
  events: ActivityEvent[];
}

const initialState: ActivityState = {
  events: [],
};

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    addActivity(state, action: PayloadAction<ActivityEvent>) {
      state.events.unshift(action.payload);
      if (state.events.length > 50) state.events.pop();
    },
    clearActivity(state) {
      state.events = [];
    },
  },
});

export const { addActivity, clearActivity } = activitySlice.actions;
export default activitySlice.reducer;
