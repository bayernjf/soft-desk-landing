import { useState, useCallback } from 'react';
import type { Software, Workflow } from '@/data/types';
import { RadialMenu } from './RadialMenu';

interface RadialMenuButtonProps {
  software: Software[];
  workflows: Workflow[];
}

export default function RadialMenuButton({ software, workflows }: RadialMenuButtonProps) {
  const [open, setOpen] = useState(false);

  const handleLaunchSoftware = useCallback((id: string) => {
    console.debug('launch software', id);
  }, []);

  const handleLaunchWorkflow = useCallback((id: string) => {
    console.debug('launch workflow', id);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-lg border border-brand/30 bg-gradient-to-r from-brand/10 to-accent/10 px-3 py-2.5 text-sm text-brand transition-all hover:from-brand/20 hover:to-accent/20"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="3" />
          <circle cx="12" cy="3" r="1.5" />
          <circle cx="12" cy="21" r="1.5" />
          <circle cx="3" cy="12" r="1.5" />
          <circle cx="21" cy="12" r="1.5" />
          <circle cx="5.64" cy="5.64" r="1.5" />
          <circle cx="18.36" cy="18.36" r="1.5" />
          <circle cx="5.64" cy="18.36" r="1.5" />
          <circle cx="18.36" cy="5.64" r="1.5" />
        </svg>
        <span className="flex-1 text-left">径向菜单</span>
        <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-500">中键</span>
      </button>
      <RadialMenu
        software={software}
        workflows={workflows}
        open={open}
        onOpenChange={setOpen}
        onLaunchSoftware={handleLaunchSoftware}
        onLaunchWorkflow={handleLaunchWorkflow}
      />
    </>
  );
}
