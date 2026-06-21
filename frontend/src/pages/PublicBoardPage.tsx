import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetPublicBoardQuery } from '@/api/endpoints';
import BoardColumn from '@/components/board/BoardColumn';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { COLUMNS, STATUS_LABELS } from '@/types';
import { Share2, Check, ArrowLeft, LayoutDashboard, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { getWorkspaceTheme } from '@/utils/theme';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';

export default function PublicBoardPage() {
  const { boardId } = useParams<{ boardId: string }>();

  if (!boardId) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50/50">
        <p className="text-slate-400 font-semibold">Invalid shareable URL.</p>
      </div>
    );
  }

  const { data, isLoading, isError, refetch } = useGetPublicBoardQuery(boardId);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (data?.board) {
      document.title = `${data.board.title} | TaskFlow Public Board`;
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute(
        'content',
        `Public read-only board: ${data.board.title} inside workspace: ${data.workspace?.name || 'TaskFlow'}`
      );
    }
  }, [data]);

  const workspaceId = data?.workspace?.id;
  const theme = getWorkspaceTheme(workspaceId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50/20 to-pink-50/20 flex flex-col">
        <div className="h-16 border-b bg-white/60 backdrop-blur-md flex items-center px-6">
          <Skeleton className="h-6 w-36 rounded-lg" />
        </div>
        <div className="flex-1 p-6 space-y-6 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48 rounded-lg" />
              <Skeleton className="h-4 w-32 rounded-lg" />
            </div>
            <Skeleton className="h-9.5 w-28 rounded-xl" />
          </div>
          <div className="flex-grow p-6 rounded-3xl border border-slate-100 bg-slate-50/20 backdrop-blur-md">
            <div className="flex gap-6 overflow-x-auto pb-4">
              <Skeleton className="h-[480px] min-w-[340px] rounded-2xl shrink-0" />
              <Skeleton className="h-[480px] min-w-[340px] rounded-2xl shrink-0" />
              <Skeleton className="h-[480px] min-w-[340px] rounded-2xl shrink-0" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-6 bg-slate-50/50">
        <div className="h-14 w-14 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
          <AlertCircle className="h-7 w-7 text-rose-500" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Unable to load board</h2>
        <p className="text-sm text-slate-400 mt-1 max-w-xs font-medium">
          Something went wrong. This board might have been deleted, or the link is invalid.
        </p>
        <div className="flex gap-2 mt-4">
          <Button onClick={() => refetch()} variant="outline" className="gap-2 rounded-xl font-bold cursor-pointer">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
          <Button asChild className="rounded-xl cursor-pointer" variant="outline">
            <Link to="/login" className="gap-2 font-bold">
              Go to Login
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const { board, tasks, workspace } = data;

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast('Board link copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50/20 via-purple-50/10 to-pink-50/20 flex flex-col">
      <header className="flex h-16 items-center justify-between border-b border-slate-200/50 bg-white/60 backdrop-blur-md px-6 shadow-xs relative">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-linear-to-r" />
        <div className="flex items-center gap-2">
          <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-tr text-white shadow-xs", theme.gradient)}>
            <LayoutDashboard className="h-4.5 w-4.5" />
          </div>
          <span className="font-bold text-slate-800 text-sm">TaskFlow</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold uppercase tracking-wider">
            Public View
          </span>
        </div>
        <Button asChild variant="ghost" size="sm" className="rounded-lg font-bold text-slate-600 hover:bg-slate-100">
          <Link to="/login" className="text-xs">
            Sign In
          </Link>
        </Button>
      </header>

      <main className="flex-grow p-6 space-y-6 overflow-hidden flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              {workspace?.name || 'Workspace'}
              <Sparkles className={cn("h-3 w-3", theme.text)} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 mt-1">
              {board.title}
            </h1>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopyShareLink} 
            className="gap-2 h-10 px-4 rounded-xl font-bold shadow-xs hover:bg-slate-50 border-slate-200 cursor-pointer self-start sm:self-center"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-500" />
                Copied Link!
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4 text-slate-500" />
                Copy Link
              </>
            )}
          </Button>
        </div>

        <div className={cn(
          "flex-grow p-6 rounded-3xl border transition-all duration-500",
          theme.bgLight || "bg-slate-50/50",
          theme.border || "border-slate-200/60",
          theme.glow || "shadow-xs",
          "backdrop-blur-md relative overflow-hidden"
        )}>
          {/* Sweeping background gradient shimmer matching the workspace theme */}
          <div className={cn("absolute inset-0 opacity-12 blur-2xl bg-gradient-to-r animate-gradient-sweep pointer-events-none select-none z-0", theme.gradient)} />

          {/* Ambient background corner glows for extra visual depth */}
          <div className={cn("absolute -top-32 -left-32 w-64 h-64 rounded-full blur-3xl opacity-10 bg-gradient-to-br", theme.gradient)} />
          <div className={cn("absolute -bottom-32 -right-32 w-64 h-64 rounded-full blur-3xl opacity-10 bg-gradient-to-br", theme.gradient)} />

          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 items-start select-none relative z-10 min-h-[480px] snap-x snap-mandatory md:snap-none">
            {COLUMNS.map((col) => (
              <BoardColumn
                key={col}
                status={col}
                title={STATUS_LABELS[col]}
                tasks={tasks.filter((t) => t.status === col)}
                isReadOnly={true}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
