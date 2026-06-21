import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';
import type { Workspace } from '@/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getWorkspaceTheme } from '@/utils/theme';
import { LayoutDashboard, Menu, ChevronDown, Activity, LogOut, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  workspaces: Workspace[];
  activeWorkspaceId: string | undefined;
  onWorkspaceChange: (id: string) => void;
  onToggleSidebar: () => void;
  onToggleActivity: () => void;
}

export default function Header({
  workspaces,
  activeWorkspaceId,
  onWorkspaceChange,
  onToggleSidebar,
  onToggleActivity,
}: HeaderProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const theme = getWorkspaceTheme(activeWorkspaceId);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="flex h-16 items-center gap-3 border-b border-white/40 bg-white/60 backdrop-blur-md px-6 shadow-xs relative z-30">
      {/* Decorative top border gradient line */}
      <div className={cn("absolute top-0 left-0 w-full h-[3px] bg-linear-to-r transition-all duration-500", theme.gradient)} />

      <Button variant="ghost" size="icon" className="md:hidden hover:bg-slate-100" onClick={onToggleSidebar}>
        <Menu className="h-5 w-5 text-slate-600" />
      </Button>

      {/* Brand logo */}
      <div className="flex items-center gap-2 text-sm font-semibold select-none group cursor-pointer" onClick={() => navigate('/')}>
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-tr text-white shadow-md transition-all duration-300 group-hover:scale-105", theme.gradient)}>
          <LayoutDashboard className="h-4.5 w-4.5" />
        </div>
        <span className="text-lg font-bold tracking-tight bg-linear-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">
          TaskFlow
        </span>
      </div>

      <div className="mx-2 h-6 w-px bg-slate-200 hidden sm:block" />

      {/* Switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 h-9 rounded-lg border-slate-200 bg-white shadow-xs hover:bg-slate-50 transition-all font-medium">
            <span className={cn("h-2.5 w-2.5 rounded-full bg-linear-to-tr shadow-xs transition-all duration-300", theme.gradient)} />
            {activeWorkspace?.name ?? 'Workspace'}
            <ChevronDown className="h-4 w-4 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56 mt-1 rounded-xl shadow-lg border-slate-100 p-1 bg-white/95 backdrop-blur-md">
          <DropdownMenuLabel className="text-slate-400 text-xs font-semibold px-2.5 py-2 uppercase tracking-wider">
            Workspaces
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-slate-100 mx-1" />
          {workspaces.map((ws) => {
            const wsTheme = getWorkspaceTheme(ws.id);
            return (
              <DropdownMenuItem
                key={ws.id}
                onClick={() => {
                  onWorkspaceChange(ws.id);
                  navigate('/');
                }}
                className={cn(
                  "flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-colors text-slate-700 hover:bg-slate-50 font-medium",
                  ws.id === activeWorkspaceId && "bg-slate-50 font-semibold text-slate-900"
                )}
              >
                <span className={cn("h-3 w-3 rounded-full bg-linear-to-tr", wsTheme.gradient)} />
                {ws.name}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex-1" />

      {/* Activity Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onToggleActivity} 
        className="relative h-9 w-9 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
      >
        <Activity className="h-4.5 w-4.5" />
      </Button>

      {/* User profile Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-100 text-slate-600">
            <User className="h-4.5 w-4.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 mt-1 rounded-xl shadow-lg border-slate-100 p-1 bg-white/95 backdrop-blur-md">
          <DropdownMenuLabel className="flex flex-col px-2.5 py-2">
            <span className="text-sm font-semibold text-slate-800 leading-none">{user?.name ?? 'User'}</span>
            <span className="text-xs text-slate-400 mt-1 font-medium">{user?.email ?? ''}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-slate-100 mx-1" />
          <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-rose-600 focus:text-rose-700 cursor-pointer focus:bg-rose-50 font-medium">
            <LogOut className="h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
