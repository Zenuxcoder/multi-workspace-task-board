import { createContext, useContext, useState, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Info, Trash2, MoveRight, Link2, X } from 'lucide-react';

type ToastVariant = 'success' | 'info' | 'destructive';

type Toast = {
  id: string;
  message: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  toast: (message: string, variant?: ToastVariant) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const icons: Record<ToastVariant, ReactNode> = {
  success: <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />,
  info: <Info className="h-4 w-4 text-indigo-500 shrink-0" />,
  destructive: <Trash2 className="h-4 w-4 text-rose-500 shrink-0" />,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const toast = useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, variant }]);
    timers.current[id] = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      delete timers.current[id];
    }, 3500);
  }, []);

  const dismiss = (id: string) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-center gap-2.5 min-w-[240px] max-w-[340px] rounded-xl border bg-white/95 backdrop-blur-md px-3.5 py-2.5 shadow-lg text-sm font-semibold text-slate-800 animate-in fade-in slide-in-from-bottom-3 duration-300',
              t.variant === 'destructive' && 'border-rose-200',
              t.variant === 'success' && 'border-emerald-200',
              t.variant === 'info' && 'border-indigo-200',
            )}
          >
            {icons[t.variant]}
            <span className="flex-1 text-[13px]">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shrink-0">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}

export { Link2, MoveRight };
