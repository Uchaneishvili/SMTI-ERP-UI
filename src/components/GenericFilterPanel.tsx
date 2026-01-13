import { X, LucideIcon } from 'lucide-react';
import { cn } from '@/lib';
import { DateRangePicker } from './ui/DateRangePicker';

export type FilterType = 'text' | 'number' | 'date-range' | 'select';

export interface FilterFieldConfig {
  key: string;
  label: string;
  type: FilterType;
  placeholder?: string;
  icon?: LucideIcon;
  min?: number;
  step?: number;
  rangeKeys?: [string, string]; // [startKey, endKey]
}

export interface GenericFilterPanelProps<T> {
  fields: FilterFieldConfig[];
  values: T;
  onFilterChange: (updates: Partial<T>) => void;
  onClear: () => void;
  isOpen?: boolean;
  className?: string;
}

export function GenericFilterPanel<T extends Record<string, unknown>>({
  fields,
  values,
  onFilterChange,
  onClear,
  isOpen = false,
  className,
}: GenericFilterPanelProps<T>) {
  if (!isOpen) return null;

  return (
    <div className={cn('border-b bg-slate-50 p-4 transition-all', className)}>
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
        {fields.map((field) => (
          <div
            key={field.key || field.rangeKeys?.[0]}
            className={
              field.type === 'date-range' ? 'col-span-1 md:col-span-2' : ''
            }
          >
            <label className="mb-1.5 block text-xs font-medium text-slate-500">
              {field.label}
            </label>

            <div className="relative">
              {field.icon && (
                <field.icon
                  className="absolute left-2.5 top-2.5 text-slate-400"
                  size={16}
                />
              )}

              {field.type === 'text' && (
                <input
                  type="text"
                  placeholder={field.placeholder}
                  value={(values[field.key] as string) || ''}
                  onChange={(e) =>
                    onFilterChange({
                      [field.key]: e.target.value,
                    } as Partial<T>)
                  }
                  className={cn(
                    'w-full rounded-lg border-slate-200 bg-white py-2 pr-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
                    field.icon ? 'pl-9' : 'pl-3',
                  )}
                />
              )}

              {field.type === 'number' && (
                <input
                  type="number"
                  min={field.min}
                  step={field.step}
                  placeholder={field.placeholder}
                  value={(values[field.key] as string | number) || ''}
                  onChange={(e) =>
                    onFilterChange({
                      [field.key]: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    } as Partial<T>)
                  }
                  className={cn(
                    'w-full rounded-lg border-slate-200 bg-white py-2 pr-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
                    field.icon ? 'pl-9' : 'pl-3',
                  )}
                />
              )}

              {field.type === 'date-range' && field.rangeKeys && (
                <DateRangePicker
                  dateFrom={values[field.rangeKeys[0]] as string | undefined}
                  dateTo={values[field.rangeKeys[1]] as string | undefined}
                  onSelect={(from, to) => {
                    onFilterChange({
                      [field.rangeKeys![0]]: from,
                      [field.rangeKeys![1]]: to,
                    } as unknown as Partial<T>);
                  }}
                  className="w-full"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-4 flex max-w-7xl justify-end border-t border-slate-200 pt-3">
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
        >
          <X size={14} />
          Clear Filters
        </button>
      </div>
    </div>
  );
}
