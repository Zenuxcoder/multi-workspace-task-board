import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useLoginMutation } from '@/api/endpoints';
import { useAppDispatch } from '@/app/hooks';
import { setCredentials } from '@/features/auth/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, ShieldCheck, Square, Circle } from 'lucide-react';

type LoginForm = { email: string; password: string };

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [error, setError] = useState('');
  const { register, handleSubmit } = useForm<LoginForm>({
    defaultValues: { email: 'demo@taskflow.com', password: 'password123' },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      const result = await login(data).unwrap();
      dispatch(setCredentials(result));
      navigate('/');
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 px-4 overflow-hidden">
      {/* Dimmed, subtle lighting blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-slate-500/5 blur-[130px] pointer-events-none" />

      {/* Floating geometric objects in a fixed pattern */}
      
      {/* 1. Slow spinning hollow ring */}
      <div className="absolute top-[15%] left-[12%] w-24 h-24 rounded-full border-2 border-white/28 animate-spin-slow pointer-events-none flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border border-dashed border-white/28" />
      </div>

      {/* 2. Dotted Grid */}
      <div className="absolute bottom-[20%] left-[8%] opacity-45 animate-float-up pointer-events-none">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="2" fill="white" />
          <circle cx="30" cy="10" r="2" fill="white" />
          <circle cx="50" cy="10" r="2" fill="white" />
          <circle cx="70" cy="10" r="2" fill="white" />
          <circle cx="90" cy="10" r="2" fill="white" />
          <circle cx="10" cy="30" r="2" fill="white" />
          <circle cx="30" cy="30" r="2" fill="white" />
          <circle cx="50" cy="30" r="2" fill="white" />
          <circle cx="70" cy="30" r="2" fill="white" />
          <circle cx="90" cy="30" r="2" fill="white" />
          <circle cx="10" cy="50" r="2" fill="white" />
          <circle cx="30" cy="50" r="2" fill="white" />
          <circle cx="50" cy="50" r="2" fill="white" />
          <circle cx="70" cy="50" r="2" fill="white" />
          <circle cx="90" cy="50" r="2" fill="white" />
          <circle cx="10" cy="70" r="2" fill="white" />
          <circle cx="30" cy="70" r="2" fill="white" />
          <circle cx="50" cy="70" r="2" fill="white" />
          <circle cx="70" cy="70" r="2" fill="white" />
          <circle cx="90" cy="70" r="2" fill="white" />
        </svg>
      </div>

      {/* 3. Floating Square */}
      <div className="absolute top-[25%] right-[10%] text-white/28 animate-float-down pointer-events-none">
        <Square className="w-10 h-10 stroke-[1.5]" />
      </div>

      {/* 4. Diagonal floating nested circle */}
      <div className="absolute bottom-[15%] right-[12%] text-white/28 animate-float-diagonal pointer-events-none">
        <Circle className="w-14 h-14 stroke-[1.5]" />
      </div>

      {/* 5. Faint decorative line cross */}
      <div className="absolute top-[10%] right-[35%] w-16 h-px bg-white/28 animate-pulse pointer-events-none" />
      <div className="absolute top-[8%] right-[37%] w-px h-16 bg-white/28 animate-pulse pointer-events-none" />

      <Card className="w-full max-w-md relative z-10 border-white/5 bg-white/5 backdrop-blur-xl shadow-2xl text-white rounded-2xl overflow-hidden">
        {/* Subtle, elegant single-colored top border line */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-indigo-500/80" />
        
        <CardHeader className="text-center pt-8 pb-4">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/90 text-white shadow-lg shadow-indigo-600/20">
            <LayoutDashboard className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            TaskFlow
          </CardTitle>
          <CardDescription className="text-slate-400 text-sm mt-1">
            Organize and plan workspaces with beautiful clarity
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-6 pb-8 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="demo@taskflow.com"
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 focus:bg-white/10 transition-all rounded-lg h-10 text-sm"
                {...register('email', { required: true })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 focus:bg-white/10 transition-all rounded-lg h-10 text-sm"
                {...register('password', { required: true })}
              />
            </div>

            {error && (
              <p className="text-xs text-rose-400 font-medium bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:scale-100 cursor-pointer"
            >
              {isLoading ? 'Entering Portal...' : 'Sign In to Workspace'}
            </Button>
          </form>

          <div className="relative flex py-2 items-center text-slate-500 text-xs">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-white/30 uppercase tracking-widest font-mono text-[9px]">
              Demo Environment
            </span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-start gap-2.5">
            <ShieldCheck className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-400 leading-relaxed">
              <span className="font-semibold text-white">Preloaded credentials:</span> Use <code className="text-indigo-400 font-bold">demo@taskflow.com</code> with <code className="text-indigo-400 font-bold">password123</code>.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
