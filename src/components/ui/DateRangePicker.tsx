import { useState, useRef, useEffect } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { cn } from '@/lib';
import 'react-day-picker/dist/style.css';

interface DateRangePickerProps {
  dateFrom: string | undefined;
  dateTo: string | undefined;
  onSelect: (from: string | undefined, to: string | undefined) => void;
  className?: string;
}

export function DateRangePicker({
  dateFrom,
  dateTo,
  onSelect,
  className,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedRange: DateRange = {
    from: dateFrom ? parseISO(dateFrom) : undefined,
    to: dateTo ? parseISO(dateTo) : undefined,
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (range: DateRange | undefined) => {
    if (!range) {
      onSelect(undefined, undefined);
      return;
    }
    const fromStr = range.from ? format(range.from, 'yyyy-MM-dd') : undefined;
    const toStr = range.to ? format(range.to, 'yyyy-MM-dd') : undefined;
    onSelect(fromStr, toStr);
  };

  const displayText =
    dateFrom && dateTo
      ? `${format(parseISO(dateFrom), 'LLL dd, y')} - ${format(
          parseISO(dateTo),
          'LLL dd, y',
        )}`
      : dateFrom
        ? format(parseISO(dateFrom), 'LLL dd, y')
        : 'Pick a date range';

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      <div className="relative w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex w-full items-center justify-start text-left font-normal',
            'rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm',
            !dateFrom && 'text-slate-500',
            'hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span className="truncate">{displayText}</span>
        </button>
        {dateFrom && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(undefined, undefined);
              setIsOpen(false);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4 cursor-pointer" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute left-0 top-12 z-50 rounded-lg border bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-200">
          <DayPicker
            mode="range"
            defaultMonth={selectedRange.from}
            selected={selectedRange}
            onSelect={handleSelect}
            numberOfMonths={1}
            styles={{
              caption: { color: 'primary-900' },
            }}
            modifiersClassNames={{
              selected: 'group',
              range_start: 'bg-gray-400 rounded-l-md hover:bg-primary-600',
              range_end: 'bg-gray-400 rounded-r-md hover:bg-primary-600',
              range_middle: 'bg-gray-100 text-primary-900 rounded-none',
              today: 'text-primary-500 font-bold',
            }}
          />
        </div>
      )}
    </div>
  );
}
