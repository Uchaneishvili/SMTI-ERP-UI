import { Loader2 } from 'lucide-react';

export function Loading() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-slate-500">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <p className="text-sm font-medium animate-pulse">Loading inquiries...</p>
    </div>
  );
}
