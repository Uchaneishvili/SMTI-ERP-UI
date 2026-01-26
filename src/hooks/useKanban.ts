import { useState, useCallback, useEffect, useRef } from 'react';
import {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

export const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: { opacity: '0.5' },
    },
  }),
};

export function useKanban<T extends { id: string; order?: number }>(
  initialItems: T[],
  groupByKey: keyof T,
  columns: { id: string }[],
) {
  const getGrouped = useCallback(
    (itemsList: T[]) => {
      const groups: Record<string, T[]> = {};
      columns.forEach((col) => (groups[col.id] = []));
      itemsList.forEach((item) => {
        const key = String(item[groupByKey]);
        if (groups[key]) groups[key].push(item);
      });
      Object.keys(groups).forEach((key) => {
        groups[key].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      });
      return groups;
    },
    [columns, groupByKey],
  );

  const [items, setItems] = useState<Record<string, T[]>>(() =>
    getGrouped(initialItems),
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  // Sync ref - updated inside setState to guarantee latest value
  const itemsRef = useRef<Record<string, T[]>>(items);

  useEffect(() => {
    const grouped = getGrouped(initialItems);
    setItems(grouped);
    itemsRef.current = grouped;
  }, [initialItems, getGrouped]);

  const findContainer = useCallback(
    (id: string, currentItems: Record<string, T[]>) => {
      if (columns.some((col) => col.id === id)) return id;
      return Object.keys(currentItems).find((key) =>
        currentItems[key].some((i) => i.id === id),
      );
    },
    [columns],
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeItemId = active.id as string;
      const overId = over.id as string;

      if (activeItemId === overId) return;

      setItems((prev) => {
        const activeContainer = findContainer(activeItemId, prev);
        const overContainer = findContainer(overId, prev);

        if (!activeContainer || !overContainer) {
          return prev;
        }

        // Same column reordering
        if (activeContainer === overContainer) {
          const activeIndex = prev[activeContainer].findIndex(
            (i) => i.id === activeItemId,
          );
          const overIndex = prev[overContainer].findIndex(
            (i) => i.id === overId,
          );

          if (activeIndex !== overIndex && activeIndex !== -1 && overIndex !== -1) {
            const newState = {
              ...prev,
              [overContainer]: arrayMove(prev[overContainer], activeIndex, overIndex),
            };
            itemsRef.current = newState;
            return newState;
          }
          return prev;
        }

        // Cross-column move
        const activeItems = prev[activeContainer];
        const overItems = prev[overContainer];
        const activeIndex = activeItems.findIndex((i) => i.id === activeItemId);
        const overIndex = overItems.findIndex((i) => i.id === overId);

        if (activeIndex === -1) return prev;

        let newIndex: number;
        if (columns.some((col) => col.id === overId)) {
          // Dropping on empty column
          newIndex = overItems.length;
        } else if (overIndex < 0) {
          newIndex = overItems.length;
        } else {
          // Insert at the position of the over item
          newIndex = overIndex;
        }

        const movedItem = { ...activeItems[activeIndex], [groupByKey]: overContainer };
        const newOverItems = [...overItems];
        newOverItems.splice(newIndex, 0, movedItem);

        const newState = {
          ...prev,
          [activeContainer]: prev[activeContainer].filter(
            (item) => item.id !== activeItemId,
          ),
          [overContainer]: newOverItems,
        };
        itemsRef.current = newState;
        return newState;
      });
    },
    [columns, groupByKey, findContainer],
  );

  const handleDragEnd = useCallback(
    (
      event: DragEndEvent,
      onMove: (id: string, newColId: string, newIndex: number) => void,
    ) => {
      const { active } = event;
      const activeItemId = active.id as string;

      // Find the item's current position from the sync ref
      const currentItems = itemsRef.current;
      
      for (const columnId of Object.keys(currentItems)) {
        const index = currentItems[columnId].findIndex((i) => i.id === activeItemId);
        if (index !== -1) {
          onMove(activeItemId, columnId, index);
          break;
        }
      }

      setActiveId(null);
    },
    [],
  );

  return {
    items,
    activeId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
