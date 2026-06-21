import { NavLink, useParams } from 'react-router-dom';
import type { Board } from '@/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Kanban, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getWorkspaceTheme } from '@/utils/theme';
import { useAppSelector } from '@/app/hooks';

interface SidebarProps {
  boards: Board[];
  activeBoardId?: string;
  open: boolean;
  onClose: () => void;
}

type BoardListProps = Omit<SidebarProps, 'open'> & {
  workspaceId: string | null;
};

function BoardList({ boards, activeBoardId, onClose, workspaceId }: BoardListProps) {
  const theme = getWorkspaceTheme(workspaceId);

  return (
    <nav className="space-y-1.5 px-3">
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Boards
        </span>
        <Sparkles className={cn("h-3.5 w-3.5 opacity-60 animate-pulse", theme.text)} />
      </div>
      {boards.map((board) => (
        <NavLink
          key={board.id}
          to={`/board/${board.id}`}
          onClick={onClose}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-all duration-250',
              isActive
                ? `bg-linear-to-r ${theme.gradient} text-white shadow-md ${theme.glow} font-bold border-l-[3px] border-white/40`
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 font-semibold'
            )
          }
        >
          <Kanban className="h-4.5 w-4.5" />
          {board.title}
        </NavLink>
      ))}
      {boards.length === 0 && (
        <div className="px-3 py-6 text-center border border-dashed rounded-xl bg-slate-50/50 mt-2">
          <p className="text-xs text-slate-400 font-medium">No boards created yet</p>
        </div>
      )}
    </nav>
  );
}

export default function Sidebar({ boards, activeBoardId, open, onClose }: SidebarProps) {
  const selectedWorkspaceId = useAppSelector((s) => s.workspace.selectedId);
  const theme = getWorkspaceTheme(selectedWorkspaceId);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-slate-200/60 bg-white/40 backdrop-blur-md pt-5 relative overflow-hidden">
        {/* Soft sidebar corner ambient glow matching the workspace theme */}
        <div className={cn(
          "absolute -bottom-16 -left-16 w-36 h-36 rounded-full opacity-15 blur-3xl pointer-events-none select-none z-0 transition-all duration-500 bg-gradient-to-tr",
          theme.gradient
        )} />
        
        {/* Subtle dynamic right-edge border accent line */}
        <div className={cn(
          "absolute top-0 right-0 w-[2px] h-full opacity-40 pointer-events-none transition-all duration-500 bg-gradient-to-b",
          theme.gradient
        )} />

        <div className="relative z-10 flex flex-col h-full">
          <BoardList boards={boards} activeBoardId={activeBoardId} onClose={() => {}} workspaceId={selectedWorkspaceId} />
        </div>
      </aside>

      {/* Mobile sidebar sheet */}
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="left" className="w-60 p-0 pt-5 bg-white border-r">
          <SheetHeader className="px-6 pb-4 border-b">
            <SheetTitle className="text-lg font-bold text-slate-800">Navigation</SheetTitle>
          </SheetHeader>
          <div className="pt-4">
            <BoardList boards={boards} activeBoardId={activeBoardId} onClose={onClose} workspaceId={selectedWorkspaceId} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
