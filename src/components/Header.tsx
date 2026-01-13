import { LayoutGrid, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
interface HeaderProps {
  onFilterClick?: () => void;
  filterCount?: number;
}

export function Header({ onFilterClick, filterCount = 0 }: HeaderProps) {
  const router = useRouter();
  return (
    <header className="shrink-0 border-b bg-white">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center gap-3">
          <div
            className="flex cursor-pointer items-center justify-center w-8 h-8 rounded-lg bg-slate-900"
            onClick={() => {
              router.push('/');
            }}
          >
            <LayoutGrid className="text-white" size={18} />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-900">
              Inquiry Kanban
            </h1>
            <p className="hidden md:block text-sm text-slate-500">
              Manage hotel inquiries through phases
            </p>
          </div>
        </div>

        <button
          onClick={onFilterClick}
          className="relative flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Filter size={18} />
          <span className="hidden md:inline">Filters</span>
          {filterCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-500 rounded-full">
              {filterCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
