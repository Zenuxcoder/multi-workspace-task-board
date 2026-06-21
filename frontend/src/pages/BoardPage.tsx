import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import {
  useGetBoardQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from '@/api/endpoints';
import BoardColumn from '@/components/board/BoardColumn';
import TaskDialog from '@/components/tasks/TaskDialog';
import DeleteConfirmDialog from '@/components/tasks/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { COLUMNS, STATUS_LABELS, type Task, type TaskStatus } from '@/types';
import { Share2, Check, Sparkles, KanbanSquare, RefreshCw, AlertCircle } from 'lucide-react';
import { getWorkspaceTheme } from '@/utils/theme';
import { useAppSelector } from '@/app/hooks';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';

export default function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const selectedWorkspaceId = useAppSelector((s) => s.workspace.selectedId);
  const theme = getWorkspaceTheme(selectedWorkspaceId);
  const { toast } = useToast();

  const { data, isLoading, isError, refetch } = useGetBoardQuery(boardId!, { skip: !boardId });
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [targetStatus, setTargetStatus] = useState<TaskStatus>('todo');
  const [copied, setCopied] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!boardId) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center px-4">
        <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
          <KanbanSquare className="h-8 w-8" />
        </div>
        <h3 className="text-base font-bold text-slate-700">No board selected</h3>
        <p className="text-sm text-slate-400 mt-1 max-w-xs">Select or create a board in the sidebar to view tasks.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 flex flex-col h-full">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-4 w-32 rounded-lg" />
          </div>
          <Skeleton className="h-9.5 w-28 rounded-xl" />
        </div>
        <div className="flex-grow p-6 rounded-3xl border border-slate-100 bg-slate-50/20 backdrop-blur-md">
          <div className="flex gap-6 overflow-x-auto pb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[340px] shrink-0 space-y-3.5">
                <Skeleton className="h-14 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl opacity-60" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center px-4">
        <div className="h-14 w-14 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
          <AlertCircle className="h-7 w-7 text-rose-500" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Unable to load board</h2>
        <p className="text-sm text-slate-400 mt-1 max-w-xs font-medium">Something went wrong while loading this board. Check your connection and try again.</p>
        <Button onClick={() => refetch()} variant="outline" className="mt-4 gap-2 rounded-xl font-bold cursor-pointer">
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  const { board, tasks } = data;

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    const isOverColumn = COLUMNS.includes(overId as TaskStatus);
    const targetStatus: TaskStatus = isOverColumn
      ? (overId as TaskStatus)
      : (tasks.find((t) => t.id === overId)?.status ?? activeTask.status);

    if (activeTask.status !== targetStatus) {
      await updateTask({
        id: activeId,
        boardId,
        status: targetStatus,
      }).unwrap();
      toast(`Task moved to ${STATUS_LABELS[targetStatus]}`, 'info');
    }
  };

  const handleAddTaskClick = (status: TaskStatus) => {
    setEditingTask(null);
    setTargetStatus(status);
    setDialogOpen(true);
  };

  const handleEditTaskClick = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDeleteTaskClick = (id: string) => {
    const task = tasks.find((t) => t.id === id) || null;
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    await deleteTask({ id: taskToDelete.id, boardId }).unwrap();
    toast('Task deleted', 'destructive');
    setTaskToDelete(null);
  };

  const handleDialogSubmit = async (formData: { title: string; description: string; status: TaskStatus }) => {
    if (editingTask) {
      await updateTask({
        id: editingTask.id,
        boardId,
        title: formData.title,
        description: formData.description,
        status: formData.status,
      }).unwrap();
      toast('Task updated successfully');
    } else {
      await createTask({
        title: formData.title,
        description: formData.description,
        status: formData.status,
        boardId,
      }).unwrap();
      toast('Task created successfully');
    }
  };

  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}/public/board/${boardId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast('Board link copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">{board.title}</h1>
            <Sparkles className={cn("h-4 w-4 opacity-50", theme.text)} />
          </div>
          <p className="text-sm text-slate-400 font-semibold mt-1">Manage and track your board updates in real time</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleCopyShareLink} 
          className="gap-2 h-10 px-4 rounded-xl font-bold shadow-xs hover:bg-slate-50 border-slate-200 cursor-pointer transition-all self-start sm:self-center"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-500" />
              Copied Share Link!
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4 text-slate-500" />
              Share Board
            </>
          )}
        </Button>
      </div>

      <div className={cn(
        "flex-grow p-4 md:p-6 rounded-3xl border transition-all duration-500",
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

        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 items-start select-none relative z-10 min-h-[480px] snap-x snap-mandatory md:snap-none">
            {COLUMNS.map((col) => (
              <BoardColumn
                key={col}
                status={col}
                title={STATUS_LABELS[col]}
                tasks={tasks.filter((t) => t.status === col)}
                onAddTask={handleAddTaskClick}
                onEditTask={handleEditTaskClick}
                onDeleteTask={handleDeleteTaskClick}
              />
            ))}
          </div>
        </DndContext>
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleDialogSubmit}
        task={editingTask}
        defaultStatus={targetStatus}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        taskTitle={taskToDelete?.title}
      />
    </div>
  );
}
