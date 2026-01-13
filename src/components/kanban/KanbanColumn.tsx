import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { cn } from '@/lib';
import { ReactNode } from 'react';
import { SortableItem } from './SortableItem';

interface KanbanColumnProps<T extends { id: string }> {
  id: string;
  title: string;
  items: T[];
  color?: {
    bg: string;
    text: string;
    border: string;
  };
  renderCard: (item: T) => ReactNode;
  onCardClick?: (item: T) => void;
  summary?: string;
}

export function KanbanColumn<T extends { id: string }>({
  id,
  title,
  items,
  color,
  renderCard,
  onCardClick,
  summary,
}: KanbanColumnProps<T>) {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <section className="flex flex-col rounded-xl bg-slate-100/80 min-h-[200px] w-80 flex-shrink-0 md:w-auto md:flex-shrink h-full">
      <header
        className={cn(
          'sticky top-0 z-10 rounded-t-xl border-b-2 bg-white/90 backdrop-blur-sm px-3 py-2',
          color?.border,
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className={cn('font-semibold text-sm', color?.text)}>
              {title}
            </h2>
            <div className="flex flex-col items-end">
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-medium mb-1',
                  color?.bg,
                  color?.text,
                )}
              >
                {items.length}
              </span>
            </div>
          </div>
          {summary && (
            <div className="text-xs font-semibold text-slate-500">
              {summary}
            </div>
          )}
        </div>
      </header>

      <div ref={setNodeRef} className="flex-1 overflow-y-auto p-2 space-y-2">
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-24 text-sm text-slate-400">
              Empty
            </div>
          ) : (
            items.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                onClick={() => onCardClick?.(item)}
              >
                {renderCard(item)}
              </SortableItem>
            ))
          )}
        </SortableContext>
      </div>
    </section>
  );
}
