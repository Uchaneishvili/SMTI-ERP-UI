import { useState, useCallback, useEffect } from 'react';
import {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import type { Inquiry, InquiryPhase } from '@/types';
import { INQUIRY_PHASES } from '@/types';
import { getInquiriesByPhase } from '@/lib';

export const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: { opacity: '0.5' },
    },
  }),
};

export function useInquiryBoard(initialInquiries: Inquiry[]) {
  const [items, setItems] = useState<Record<InquiryPhase, Inquiry[]>>(() =>
    getInquiriesByPhase(initialInquiries),
  );

  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setItems(getInquiriesByPhase(initialInquiries));
  }, [initialInquiries]);

  const flatInquiries = Object.values(items).flat();

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

      const findContainer = (id: string): InquiryPhase | undefined => {
        if (Object.values(INQUIRY_PHASES).includes(id as InquiryPhase)) {
          return id as InquiryPhase;
        }
        return Object.keys(items).find((key) =>
          items[key as InquiryPhase].find((i) => i.id === id),
        ) as InquiryPhase | undefined;
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
        if (Object.values(INQUIRY_PHASES).includes(overId as InquiryPhase)) {
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
            { ...activeItems[activeIndex], phase: overContainer },
            ...prev[overContainer].slice(newIndex, prev[overContainer].length),
          ],
        };
      });
    },
    [items],
  );

  const handleDragEnd = useCallback(
    (
      event: DragEndEvent,
      onSave?: (id: string, phase: InquiryPhase, order: number) => void,
    ) => {
      const { active, over } = event;
      const activeId = active.id as string;
      const overId = over ? (over.id as string) : null;

      const findContainer = (id: string): InquiryPhase | undefined => {
        if (Object.values(INQUIRY_PHASES).includes(id as InquiryPhase)) {
          return id as InquiryPhase;
        }
        return Object.keys(items).find((key) =>
          items[key as InquiryPhase].find((i) => i.id === id),
        ) as InquiryPhase | undefined;
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
          setItems((prev) => ({
            ...prev,
            [activeContainer]: arrayMove(
              prev[activeContainer],
              activeIndex,
              overIndex,
            ),
          }));

          if (onSave) {
            onSave(activeId, activeContainer, overIndex);
          }
        } else if (onSave && activeContainer && overContainer && activeId) {
        }
      }

      const finalContainer = findContainer(activeId);
      if (finalContainer && onSave) {
        const finalIndex = items[finalContainer].findIndex(
          (i) => i.id === activeId,
        );
        onSave(activeId, finalContainer, finalIndex);
      }

      setActiveId(null);
    },
    [items],
  );

  const activeInquiry = activeId
    ? flatInquiries.find((i) => i.id === activeId)
    : null;

  return {
    inquiries: flatInquiries,
    inquiriesByPhase: items,
    activeId,
    activeInquiry,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
