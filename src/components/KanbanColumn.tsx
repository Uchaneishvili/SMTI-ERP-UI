import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { cn, formatCurrency } from '@/lib';
import type { Inquiry, PhaseConfig } from '@/types';
import { SortableInquiryCard } from './SortableInquiryCard';

interface KanbanColumnProps {
  config: PhaseConfig;
  inquiries: Inquiry[];
  onCardClick?: (inquiry: Inquiry) => void;
  id: string;
}

export function KanbanColumn({
  config,
  inquiries,
  onCardClick,
  id,
}: KanbanColumnProps) {
  const totalValue = inquiries.reduce(
    (sum, inq) => sum + inq.potentialValue,
    0,
  );

  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <section className="flex flex-col rounded-xl bg-slate-100/80 min-h-[200px] h-full">
      <header
        className={cn(
          'sticky top-0 z-10 rounded-t-xl border-b-2 bg-white/90 backdrop-blur-sm px-3 py-2',
          config.color.border,
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className={cn('font-semibold text-sm', config.color.text)}>
              {config.label}
            </h2>
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs font-medium',
                config.color.bg,
                config.color.text,
              )}
            >
              {inquiries.length}
            </span>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            {formatCurrency(totalValue)}
          </span>
        </div>
      </header>

      <div ref={setNodeRef} className="flex-1 overflow-y-auto p-2 space-y-2">
        <SortableContext
          items={inquiries.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {inquiries.length === 0 ? (
            <div className="flex items-center justify-center h-24 text-sm text-slate-400">
              No inquiries
            </div>
          ) : (
            inquiries.map((inquiry) => (
              <SortableInquiryCard
                key={inquiry.id}
                inquiry={inquiry}
                onClick={() => onCardClick?.(inquiry)}
              />
            ))
          )}
        </SortableContext>
      </div>
    </section>
  );
}
