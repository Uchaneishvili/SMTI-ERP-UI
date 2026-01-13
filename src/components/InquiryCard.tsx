import { Calendar, Users } from 'lucide-react';
import {
  cn,
  formatCurrency,
  formatDisplayDate,
  formatRelativeDate,
} from '@/lib';
import type { Inquiry } from '@/types';
import { HIGH_VALUE_THRESHOLD } from '@/types';

interface InquiryCardProps {
  inquiry: Inquiry;
  onClick?: () => void;
}

export function InquiryCard({ inquiry, onClick }: InquiryCardProps) {
  const isHighValue = inquiry.potentialValue >= HIGH_VALUE_THRESHOLD;

  return (
    <article
      onClick={onClick}
      className={cn(
        'group cursor-pointer rounded-lg border bg-white p-3 shadow-sm transition-all',
        'hover:shadow-md hover:border-slate-300',
        'active:scale-[0.98]',
        isHighValue && 'border-l-4 border-l-amber-400',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-slate-900 text-sm leading-tight">
          {inquiry.clientName}
        </h3>
        {isHighValue && (
          <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700">
            High Value
          </span>
        )}
      </div>

      <p className="mt-1 text-xs text-slate-500">{inquiry.contactPerson}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1">
          <Calendar size={14} />
          {formatDisplayDate(inquiry.eventDate)}
        </span>

        <span className="inline-flex items-center gap-1">
          <Users size={14} />
          {inquiry.guestCount}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span
          className={cn(
            'font-semibold text-sm',
            isHighValue ? 'text-amber-600' : 'text-slate-900',
          )}
        >
          {formatCurrency(inquiry.potentialValue)}
        </span>

        <span className="text-xs text-slate-400">
          {formatRelativeDate(inquiry.updatedAt)}
        </span>
      </div>
    </article>
  );
}
