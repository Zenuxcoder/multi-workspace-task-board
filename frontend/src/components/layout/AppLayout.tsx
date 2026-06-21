import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { setWorkspace } from '@/features/workspace/workspaceSlice';
import { useGetWorkspacesQuery, useGetBoardsQuery } from '@/api/endpoints';
import { useSocket } from '@/hooks/useSocket';
import Header from './Header';
import Sidebar from './Sidebar';
import ActivityPanel from './ActivityPanel';
import { Circle, Square, Triangle, Hexagon } from 'lucide-react';
import { getWorkspaceTheme } from '@/utils/theme';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';

export default function AppLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { boardId } = useParams();
  const selectedWorkspaceId = useAppSelector((s) => s.workspace.selectedId);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);

  useSocket();

  const { data: workspacesData } = useGetWorkspacesQuery();
  const workspaces = workspacesData?.workspaces ?? [];

  useEffect(() => {
    if (workspaces.length > 0 && !selectedWorkspaceId) {
      dispatch(setWorkspace(workspaces[0].id));
    }
  }, [workspaces, selectedWorkspaceId, dispatch]);

  const activeWorkspaceId = selectedWorkspaceId || workspaces[0]?.id;
  const theme = getWorkspaceTheme(activeWorkspaceId);
  const { data: boardsData } = useGetBoardsQuery(activeWorkspaceId!, { skip: !activeWorkspaceId });
  const boards = boardsData?.boards ?? [];

  useEffect(() => {
    if (boards.length > 0 && !boardId) {
      navigate(`/board/${boards[0].id}`, { replace: true });
    }
  }, [boards, boardId, navigate]);

  const { toast } = useToast();

  const handleWorkspaceChange = (id: string) => {
    dispatch(setWorkspace(id));
    const ws = workspaces.find((w) => w.id === id);
    if (ws) toast(`Switched to ${ws.name}`, 'info');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      <Sidebar
        boards={boards}
        activeBoardId={boardId}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Dynamic ambient gradient background blobs for dashboard layout */}
        <div className="absolute top-[10%] right-[10%] w-[380px] h-[380px] rounded-full bg-linear-to-br opacity-8 blur-[100px] pointer-events-none transition-all duration-700 select-none z-0" style={{ backgroundImage: `linear-gradient(to bottom right, var(--color-indigo-400), var(--color-pink-400))` }} />
        <div className="absolute bottom-[10%] left-[5%] w-[380px] h-[380px] rounded-full bg-linear-to-br opacity-8 blur-[100px] pointer-events-none transition-all duration-700 select-none z-0" style={{ backgroundImage: `linear-gradient(to bottom right, var(--color-purple-400), var(--color-amber-400))` }} />
        
        {/* Dynamic active workspace ambient glow that physically travels from left edge to right edge and back */}
        <div className={cn(
          "absolute top-[20%] w-[450px] h-[450px] rounded-full opacity-25 blur-[90px] pointer-events-none select-none z-0 bg-gradient-to-r animate-horizontal-sweep transition-all duration-700",
          theme.gradient
        )} />

        {/* Slow drifting outline shapes in layout background (unique per workspace theme) */}
        {activeWorkspaceId === 'ws-1' && (
          <>
            <div className="absolute top-[18%] right-[22%] text-rose-500/12 animate-float-up pointer-events-none z-0 select-none">
              <Circle className="w-16 h-16 stroke-[1.2]" />
            </div>
            <div className="absolute bottom-[28%] left-[24%] text-orange-500/12 animate-float-diagonal pointer-events-none z-0 select-none">
              <Circle className="w-12 h-12 stroke-[1.2]" />
            </div>
            <div className="absolute top-[55%] right-[10%] text-amber-500/12 animate-float-down pointer-events-none z-0 select-none">
              <Circle className="w-8 h-8 stroke-[1.2] opacity-80" />
            </div>
          </>
        )}

        {activeWorkspaceId === 'ws-2' && (
          <>
            <div className="absolute top-[18%] right-[22%] text-indigo-500/12 animate-float-up pointer-events-none z-0 select-none">
              <Square className="w-16 h-16 stroke-[1.2] rotate-12" />
            </div>
            <div className="absolute bottom-[28%] left-[24%] text-cyan-500/12 animate-float-diagonal pointer-events-none z-0 select-none">
              <Square className="w-12 h-12 stroke-[1.2] -rotate-12" />
            </div>
            <div className="absolute top-[55%] right-[10%] text-purple-500/12 animate-float-down pointer-events-none z-0 select-none">
              <Square className="w-8 h-8 stroke-[1.2] rotate-45 opacity-80" />
            </div>
          </>
        )}

        {activeWorkspaceId === 'ws-3' && (
          <>
            <div className="absolute top-[18%] right-[22%] text-emerald-500/12 animate-float-up pointer-events-none z-0 select-none">
              <Triangle className="w-16 h-16 stroke-[1.2] rotate-12" />
            </div>
            <div className="absolute bottom-[28%] left-[24%] text-teal-500/12 animate-float-diagonal pointer-events-none z-0 select-none">
              <Hexagon className="w-14 h-14 stroke-[1.2]" />
            </div>
            <div className="absolute top-[55%] right-[10%] text-green-500/12 animate-float-down pointer-events-none z-0 select-none">
              <Triangle className="w-8 h-8 stroke-[1.2] -rotate-12 opacity-80" />
            </div>
          </>
        )}

        <Header
          workspaces={workspaces}
          activeWorkspaceId={activeWorkspaceId}
          onWorkspaceChange={handleWorkspaceChange}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onToggleActivity={() => setActivityOpen(!activityOpen)}
        />
        <main className="flex-1 overflow-auto p-4 md:p-6 relative z-10 bg-transparent">
          <Outlet />
        </main>
      </div>
      <ActivityPanel open={activityOpen} onClose={() => setActivityOpen(false)} />
    </div>
  );
}
