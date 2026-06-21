import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Task, TaskStatus } from '@/types';

type TaskDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { title: string; description: string; status: TaskStatus }) => void;
  task?: Task | null;
  defaultStatus?: TaskStatus;
};

type TaskFormData = {
  title: string;
  description: string;
  status: TaskStatus;
};

export default function TaskDialog({
  open,
  onOpenChange,
  onSubmit,
  task,
  defaultStatus = 'todo',
}: TaskDialogProps) {
  const { register, handleSubmit, reset, setValue, watch } = useForm<TaskFormData>({
    defaultValues: {
      title: '',
      description: '',
      status: defaultStatus,
    },
  });

  const selectedStatus = watch('status');

  useEffect(() => {
    if (open) {
      if (task) {
        reset({
          title: task.title,
          description: task.description,
          status: task.status,
        });
      } else {
        reset({
          title: '',
          description: '',
          status: defaultStatus,
        });
      }
    }
  }, [open, task, defaultStatus, reset]);

  const onFormSubmit = (data: TaskFormData) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
          <DialogDescription>
            {task ? 'Make changes to your task here.' : 'Add a new task to your board.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Task title"
              {...register('title', { required: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe this task..."
              rows={3}
              {...register('description')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={selectedStatus}
              onValueChange={(val: TaskStatus) => setValue('status', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{task ? 'Save Changes' : 'Create Task'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
