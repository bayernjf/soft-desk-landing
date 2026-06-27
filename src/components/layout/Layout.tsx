import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 font-sans antialiased flex overflow-hidden">
      <Sidebar />

      <main
        className={cn(
          'flex-1 flex flex-col overflow-hidden',
          'bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117]'
        )}
      >
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full px-8 py-6 lg:px-12 lg:py-8 max-w-[1600px] mx-auto w-full">
            <Outlet key={location.pathname} />
          </div>
        </div>
      </main>
    </div>
  );
}
