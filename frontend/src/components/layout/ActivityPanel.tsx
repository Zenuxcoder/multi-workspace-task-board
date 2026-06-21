import { useEffect, useState } from 'react';
import { useAppSelector } from '@/app/hooks';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { formatDistanceToNow } from '@/utils/date';
import { Sparkles, MessageSquareDot, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface ActivityPanelProps {
  open: boolean;
  onClose: () => void;
}

function getActivityBadgeStyle(message: string): { border: string; bg: string; text: string; label: string } {
  const lowercaseMsg = message.toLowerCase();
  if (lowercaseMsg.includes('created')) {
    return {
      border: 'border-emerald-100',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      label: 'New Task',
    };
  }
  if (lowercaseMsg.includes('moved')) {
    return {
      border: 'border-amber-100',
      bg: 'bg-amber-50/60',
      text: 'text-amber-700',
      label: 'Update status',
    };
  }
  if (lowercaseMsg.includes('deleted')) {
    return {
      border: 'border-rose-100',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      label: 'Deleted',
    };
  }
  return {
    border: 'border-indigo-100',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    label: 'Updated',
  };
}

export default function ActivityPanel({ open, onClose }: ActivityPanelProps) {
  const events = useAppSelector((s) => s.activity.events);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-80 sm:w-[400px] p-0 bg-white border-l">
        <SheetHeader className="p-4 border-b flex flex-row items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <MessageSquareDot className="h-5 w-5 text-indigo-500 animate-bounce" />
            <SheetTitle className="text-lg font-bold text-slate-800">Real-time Stream</SheetTitle>
          </div>
        </SheetHeader>
        
        <div className="overflow-y-auto h-[calc(100vh-4.5rem)] px-4 py-3">
          {loading ? (
            <div className="space-y-3 mt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3.5 border border-slate-100 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4.5 w-16 rounded-full" />
                    <Skeleton className="h-3 w-12 rounded-md" />
                  </div>
                  <Skeleton className="h-4 w-full rounded-md" />
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6 border border-dashed rounded-2xl bg-slate-50/50 mt-2">
              <HelpCircle className="h-8 w-8 text-slate-300 mb-2" />
              <p className="text-xs text-slate-400 font-semibold leading-normal">
                No recent activity.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {events.map((event) => {
                const styles = getActivityBadgeStyle(event.message);
                return (
                  <li 
                    key={event.id} 
                    className={cn(
                      "p-3.5 border rounded-xl shadow-xs transition-all hover:scale-[1.01] flex flex-col gap-1.5 bg-white",
                      styles.border
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                        styles.bg,
                        styles.text
                      )}>
                        {styles.label}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {formatDistanceToNow(event.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-700 leading-snug break-words">
                      {event.message}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
