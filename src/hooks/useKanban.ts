import { useState, useCallback, useEffect } from 'react';
import {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from '@dnd-kit/core';

export const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: { opacity: '0.5' },
    },
  }),
};

export function useKanban<T extends { id: string }>(
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
      return groups;
    },
    [columns, groupByKey],
  );

  const [items, setItems] = useState<Record<string, T[]>>(() =>
    getGrouped(initialItems),
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setItems(getGrouped(initialItems));
  }, [initialItems, getGrouped]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      if (activeId === overId) return;

      const findContainer = (id: string) => {
        if (columns.some((col) => col.id === id)) return id;
        return Object.keys(items).find((key) =>
          items[key].some((i) => i.id === id),
        );
      };

      const activeContainer = findContainer(activeId);
      const overContainer = findContainer(overId);

      if (
        !activeContainer ||
        !overContainer ||
        activeContainer === overContainer
      ) {
        return;
      }

      setItems((prev) => {
        const activeItems = prev[activeContainer];
        const overItems = prev[overContainer];
        const activeIndex = activeItems.findIndex((i) => i.id === activeId);
        const overIndex = overItems.findIndex((i) => i.id === overId);

        let newIndex;
        if (columns.some((col) => col.id === overId)) {
          newIndex = overItems.length + 1;
        } else {
          const isBelowOverItem =
            over &&
            active.rect.current.translated &&
            active.rect.current.translated.top >
              over.rect.top + over.rect.height;

          const modifier = isBelowOverItem ? 1 : 0;
          newIndex =
            overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
        }

        return {
          ...prev,
          [activeContainer]: [
            ...prev[activeContainer].filter((item) => item.id !== activeId),
          ],
          [overContainer]: [
            ...prev[overContainer].slice(0, newIndex),
            { ...activeItems[activeIndex], [groupByKey]: overContainer },
            ...prev[overContainer].slice(newIndex, prev[overContainer].length),
          ],
        };
      });
    },
    [items, columns, groupByKey],
  );

  const handleDragEnd = useCallback(
    (
      event: DragEndEvent,
      onMove: (id: string, newColId: string, newIndex: number) => void,
    ) => {
      const { active, over } = event;
      const activeId = active.id as string;
      const overId = over ? (over.id as string) : null;

      const findContainer = (id: string) => {
        if (columns.some((col) => col.id === id)) return id;
        return Object.keys(items).find((key) =>
          items[key].some((i) => i.id === id),
        );
      };

      const activeContainer = findContainer(activeId);
      const overContainer = overId ? findContainer(overId) : null;

      if (
        activeContainer &&
        overContainer &&
        activeContainer === overContainer
      ) {
        const activeIndex = items[activeContainer].findIndex(
          (i) => i.id === activeId,
        );
        const overIndex = items[overContainer].findIndex(
          (i) => i.id === overId,
        );

        if (activeIndex !== overIndex) {
          onMove(activeId, activeContainer, overIndex);
        }
      } else if (activeContainer && overContainer) {
        const finalIndex = items[overContainer].findIndex(
          (i) => i.id === activeId,
        );
        onMove(activeId, overContainer, finalIndex);
      }

      setActiveId(null);
    },
    [items, columns],
  );

  return {
    items,
    activeId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
