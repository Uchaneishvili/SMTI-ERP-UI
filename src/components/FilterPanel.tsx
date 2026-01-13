import { Search, X, Calendar, DollarSign } from 'lucide-react';
import { cn } from '@/lib';
import type { InquiryFilters } from '@/types';

interface FilterPanelProps {
  filters: InquiryFilters;
  onFilterChange: (filters: Partial<InquiryFilters>) => void;
  onClearFilters: () => void;
  className?: string;
  isOpen?: boolean;
}

export function FilterPanel({
  filters,
  onFilterChange,
  onClearFilters,
  className,
  isOpen = false,
}: FilterPanelProps) {
  if (!isOpen) return null;

  return (
    <div className={cn('border-b bg-slate-50 p-4 transition-all', className)}>
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
        <div className="relative">
          <label
            htmlFor="search"
            className="mb-1.5 block text-xs font-medium text-slate-500"
          >
            Search Client
          </label>
          <div className="relative">
            <Search
              className="absolute left-2.5 top-2.5 text-slate-400"
              size={16}
            />
            <input
              type="text"
              id="search"
              placeholder="Filter by name..."
              value={filters.clientName || ''}
              onChange={(e) => onFilterChange({ clientName: e.target.value })}
              className="w-full rounded-lg border-slate-200 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="minValue"
            className="mb-1.5 block text-xs font-medium text-slate-500"
          >
            Min Value (CHF)
          </label>
          <div className="relative">
            <DollarSign
              className="absolute left-2.5 top-2.5 text-slate-400"
              size={16}
            />
            <input
              type="number"
              id="minValue"
              min="0"
              step="1000"
              placeholder="0"
              value={filters.minValue || ''}
              onChange={(e) =>
                onFilterChange({
                  minValue: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-full rounded-lg border-slate-200 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="mb-1.5 block text-xs font-medium text-slate-500">
            Event Date Range
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Calendar
                className="absolute left-2.5 top-2.5 text-slate-400"
                size={16}
              />
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => onFilterChange({ dateFrom: e.target.value })}
                className="w-full rounded-lg border-slate-200 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <span className="text-slate-400">-</span>
            <div className="relative flex-1">
              <Calendar
                className="absolute left-2.5 top-2.5 text-slate-400"
                size={16}
              />
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => onFilterChange({ dateTo: e.target.value })}
                className="w-full rounded-lg border-slate-200 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-4 flex max-w-7xl justify-end border-t border-slate-200 pt-3">
        <button
          onClick={onClearFilters}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
        >
          <X size={14} />
          Clear Filters
        </button>
      </div>
    </div>
  );
}
