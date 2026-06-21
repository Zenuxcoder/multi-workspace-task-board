export type WorkspaceTheme = {
  gradient: string;
  accent: string;
  bgLight: string;
  text: string;
  border: string;
  glow: string;
  badge: string;
};

const defaultTheme: WorkspaceTheme = {
  gradient: 'from-slate-700 to-slate-800',
  accent: 'bg-slate-700 hover:bg-slate-800 text-white',
  bgLight: 'bg-slate-50',
  text: 'text-slate-700',
  border: 'border-slate-200',
  glow: 'shadow-slate-500/10',
  badge: 'bg-slate-100 text-slate-800 border-slate-200',
};

const themes: Record<string, WorkspaceTheme> = {
  'ws-1': {
    // Personal: Sunset Orange/Rose theme
    gradient: 'from-rose-500 via-orange-400 to-amber-400',
    accent: 'bg-rose-500 hover:bg-rose-600 text-white',
    bgLight: 'bg-rose-50/30',
    text: 'text-rose-600',
    border: 'border-rose-200/50',
    glow: 'shadow-rose-500/20',
    badge: 'bg-rose-50 text-rose-700 border-rose-100',
  },
  'ws-2': {
    // Frontend Team: Cyber Indigo/Cyan theme
    gradient: 'from-indigo-600 via-purple-500 to-cyan-400',
    accent: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    bgLight: 'bg-indigo-50/30',
    text: 'text-indigo-600',
    border: 'border-indigo-200/50',
    glow: 'shadow-indigo-500/20',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  },
  'ws-3': {
    // Marketing: Emerald/Teal/Green theme
    gradient: 'from-emerald-500 via-teal-400 to-green-400',
    accent: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    bgLight: 'bg-emerald-50/30',
    text: 'text-emerald-600',
    border: 'border-emerald-200/50',
    glow: 'shadow-emerald-500/20',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
};

export function getWorkspaceTheme(workspaceId?: string | null): WorkspaceTheme {
  if (!workspaceId) return defaultTheme;
  return themes[workspaceId] || defaultTheme;
}
