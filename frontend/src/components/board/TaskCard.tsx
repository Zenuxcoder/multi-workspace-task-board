import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Pencil, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

type TaskCardProps = {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  isReadOnly?: boolean;
};

const statusBorders: Record<Task['status'], { leftBorder: string; hoverGlow: string }> = {
  'todo': {
    leftBorder: 'border-l-[4px] border-l-rose-500',
    hoverGlow: 'hover:shadow-rose-500/10',
  },
  'in-progress': {
    leftBorder: 'border-l-[4px] border-l-amber-500',
    hoverGlow: 'hover:shadow-amber-500/10',
  },
  'done': {
    leftBorder: 'border-l-[4px] border-l-emerald-500',
    hoverGlow: 'hover:shadow-emerald-500/10',
  },
};

export default function TaskCard({ task, onEdit, onDelete, isReadOnly = false }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    disabled: isReadOnly,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const borderStyles = statusBorders[task.status] || { leftBorder: 'border-l-slate-300', hoverGlow: '' };

  return (
    <div ref={setNodeRef} style={style} className={cn(
      'group outline-none transition-all duration-200',
      isDragging && 'opacity-80 scale-[1.03] rotate-[1.5deg] z-50'
    )}>
      <Card className={cn(
        "relative overflow-hidden border border-slate-200/50 bg-white shadow-xs rounded-xl cursor-grab active:cursor-grabbing",
        "transition-all duration-200 hover:shadow-md hover:border-slate-300 hover:-translate-y-[3px]",
        isDragging && 'shadow-xl border-slate-300 ring-2 ring-indigo-200/40',
        borderStyles.leftBorder,
        borderStyles.hoverGlow
      )}>
        <CardContent className="p-3.5 flex items-start gap-2.5">
          {!isReadOnly && (
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors mt-0.5 shrink-0"
            >
              <GripVertical className="h-4 w-4" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm leading-snug text-slate-800 break-words pr-12">
              {task.title}
            </h4>
            {task.description && (
              <p className="mt-1.5 text-xs text-slate-500 line-clamp-3 break-words leading-relaxed font-medium">
                {task.description}
              </p>
            )}
          </div>
          
          {/* Action buttons (only show if not read only) */}
          {!isReadOnly && (onEdit || onDelete) && (
            <div className="absolute right-2 top-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 backdrop-blur-xs pl-1 rounded-lg">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                  onClick={() => onEdit(task)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span className="sr-only">Edit</span>
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                  onClick={() => onDelete(task.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="sr-only">Delete</span>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
