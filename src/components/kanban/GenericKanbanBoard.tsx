'use client';

import {
  DndContext,
  closestCorners,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
} from '@dnd-kit/core';
import { createPortal } from 'react-dom';
import { ReactNode } from 'react';
import { KanbanColumn } from './KanbanColumn';
import { useKanban, dropAnimation } from '@/hooks/useKanban';

export interface ColumnConfig {
  id: string;
  title: string;
  color?: {
    bg: string;
    text: string;
    border: string;
  };
}

export interface GenericKanbanBoardProps<T extends { id: string }> {
  items: T[];
  columns: ColumnConfig[];
  groupByKey: keyof T;
  renderCard: (item: T) => ReactNode;
  renderOverlayCard?: (item: T) => ReactNode;
  onItemMove: (itemId: string, newColumnId: string, newIndex: number) => void;
  onCardClick?: (item: T) => void;
}

export function GenericKanbanBoard<T extends { id: string }>({
  items: initialItems,
  columns,
  groupByKey,
  renderCard,
  renderOverlayCard,
  onItemMove,
  onCardClick,
}: GenericKanbanBoardProps<T>) {
  const {
    items: groupedItems,
    activeId,
    handleDragStart,
    handleDragOver,
    handleDragEnd: hookHandleDragEnd,
  } = useKanban(initialItems, groupByKey, columns);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const onDragEnd = (event: DragEndEvent) => {
    hookHandleDragEnd(event, onItemMove);
  };

  const activeItem = initialItems.find((i) => i.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="flex gap-4 h-full overflow-x-auto p-4">
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            color={col.color}
            items={groupedItems[col.id] || []}
            renderCard={renderCard}
            onCardClick={onCardClick}
          />
        ))}
      </div>
      {createPortal(
        <DragOverlay dropAnimation={dropAnimation}>
          {activeItem &&
            (renderOverlayCard
              ? renderOverlayCard(activeItem)
              : renderCard(activeItem))}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
}
