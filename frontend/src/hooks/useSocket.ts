import { useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useAppDispatch } from '@/app/hooks';
import { addActivity } from '@/features/activity/activitySlice';
import type { ActivityEvent } from '@/types';

export function useSocket() {
  const dispatch = useAppDispatch();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:3001');
    socketRef.current = socket;

    socket.on('activity', (event: ActivityEvent) => {
      dispatch(addActivity(event));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  return socketRef;
}
