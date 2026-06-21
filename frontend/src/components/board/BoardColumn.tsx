import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task, TaskStatus } from '@/types';
import TaskCard from './TaskCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type BoardColumnProps = {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onAddTask?: (status: TaskStatus) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (id: string) => void;
  isReadOnly?: boolean;
};

const columnThemes: Record<TaskStatus, { border: string; headerBg: string; dot: string; text: string }> = {
  'todo': {
    border: 'hover:border-rose-200 focus-within:border-rose-200',
    headerBg: 'bg-rose-50/40 border-b border-rose-100/50',
    dot: 'bg-rose-500 shadow-rose-400/50',
    text: 'text-rose-700',
  },
  'in-progress': {
    border: 'hover:border-amber-200 focus-within:border-amber-200',
    headerBg: 'bg-amber-50/40 border-b border-amber-100/50',
    dot: 'bg-amber-500 shadow-amber-400/50',
    text: 'text-amber-700',
  },
  'done': {
    border: 'hover:border-emerald-200 focus-within:border-emerald-200',
    headerBg: 'bg-emerald-50/40 border-b border-emerald-100/50',
    dot: 'bg-emerald-500 shadow-emerald-400/50',
    text: 'text-emerald-700',
  },
};

export default function BoardColumn({
  status,
  title,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  isReadOnly = false,
}: BoardColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  const cTheme = columnThemes[status];

  return (
    <div className={cn(
      "flex flex-col w-full min-w-[290px] md:min-w-[340px] max-w-[400px] h-[calc(100vh-11rem)] md:h-[calc(100vh-9rem)] bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-2xl overflow-hidden shadow-xs transition-all duration-300",
      cTheme.border
    )}>
      {/* Column Header */}
      <div className={cn("flex items-center justify-between p-4", cTheme.headerBg)}>
        <div className="flex items-center gap-2.5">
          <span className={cn("h-2.5 w-2.5 rounded-full shadow-xs animate-pulse", cTheme.dot)} />
          <h3 className={cn("font-bold text-sm", cTheme.text)}>{title}</h3>
          <Badge variant="outline" className={cn("px-2 py-0.5 text-xs font-semibold rounded-full border-none", 
            status === 'todo' && 'bg-rose-100/60 text-rose-800',
            status === 'in-progress' && 'bg-amber-100/60 text-amber-800',
            status === 'done' && 'bg-emerald-100/60 text-emerald-800',
          )}>
            {tasks.length}
          </Badge>
        </div>
        {!isReadOnly && onAddTask && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer transition-colors"
            onClick={() => onAddTask(status)}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add Task</span>
          </Button>
        )}
      </div>

      {/* Cards List Area */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 p-3.5 space-y-3.5 overflow-y-auto min-h-[150px]"
        )}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              isReadOnly={isReadOnly}
            />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-slate-200/50 rounded-xl text-center p-5 bg-slate-50/30">
            <p className="text-xs text-slate-400 font-semibold leading-normal">
              No tasks here yet
            </p>
            {!isReadOnly && onAddTask && (
              <Button 
                variant="link" 
                size="sm" 
                onClick={() => onAddTask(status)} 
                className="text-xs text-indigo-500 hover:text-indigo-600 font-semibold p-0 h-auto mt-1 cursor-pointer"
              >
                Create task
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
