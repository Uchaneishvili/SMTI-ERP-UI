'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  DndContext,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  DropAnimation,
} from '@dnd-kit/core';
import type { Inquiry, InquiryPhase } from '@/types';
import { PHASE_ORDER, PHASE_CONFIG, INQUIRY_PHASES } from '@/types';
import { getInquiriesByPhase } from '@/lib';
import { KanbanColumn } from './KanbanColumn';
import { DetailModal } from './DetailModal';
import { InquiryCard } from './InquiryCard';

interface KanbanBoardProps {
  inquiries: Inquiry[];
  onInquiryMove?: (id: string, newPhase: InquiryPhase) => void;
}

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

export function KanbanBoard({ inquiries, onInquiryMove }: KanbanBoardProps) {
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [activePhase, setActivePhase] = useState<InquiryPhase | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const inquiriesByPhase = getInquiriesByPhase(inquiries);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts (prevents accidental clicks)
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeInquiryId = active.id as string;
    // The over.id will be the column ID (phase) because we set droppable id to phase
    // OR it could be another card ID if we sort over a card.
    // BUT we need to find the phase of the over container.

    // Check if dropping on a column directly
    let newPhase: InquiryPhase | undefined = undefined;

    // If over.id is a phase name
    if (Object.values(INQUIRY_PHASES).includes(over.id as InquiryPhase)) {
      newPhase = over.id as InquiryPhase;
    } else {
      // Dropped over a card, find that card's phase
      const overCardId = over.id as string;
      const overCard = inquiries.find((i) => i.id === overCardId);
      if (overCard) {
        newPhase = overCard.phase;
      }
    }

    const currentCard = inquiries.find((i) => i.id === activeInquiryId);

    if (currentCard && newPhase && currentCard.phase !== newPhase) {
      onInquiryMove?.(activeInquiryId, newPhase);
    }

    setActiveId(null);
  };

  const activeInquiry = activeId
    ? inquiries.find((i) => i.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-full">
        {/* Mobile: Tabs for phases */}
        <div className="md:hidden flex overflow-x-auto border-b bg-white sticky top-0 z-20">
          {PHASE_ORDER.map((phase) => {
            const config = PHASE_CONFIG[phase];
            const count = inquiriesByPhase[phase].length;
            const isActive =
              activePhase === phase ||
              (activePhase === null && phase === INQUIRY_PHASES.NEW);

            return (
              <button
                key={phase}
                onClick={() => setActivePhase(phase)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? `${config.color.text} border-current`
                    : 'text-slate-500 border-transparent'
                }`}
              >
                {config.label}
                <span className="ml-1.5 text-xs">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Mobile: Single column view (Drop disabled for now on mobile tab view for simplicity or enable per column) */}
        {/* Note: DnD is tricky with tabs. We usually disable DnD on mobile or allow dragging to tabs (complex).
            For now, we'll render the active column. Dragging within the column works. */}
        <div className="md:hidden flex-1 overflow-y-auto p-4">
          {(() => {
            const phase = activePhase || INQUIRY_PHASES.NEW;
            return (
              <KanbanColumn
                id={phase}
                config={PHASE_CONFIG[phase]}
                inquiries={inquiriesByPhase[phase]}
                onCardClick={setSelectedInquiry}
              />
            );
          })()}
        </div>

        {/* Desktop: All columns side by side */}
        <div className="hidden md:grid md:grid-cols-4 gap-4 flex-1 overflow-hidden p-4">
          {PHASE_ORDER.map((phase) => (
            <KanbanColumn
              key={phase}
              id={phase}
              config={PHASE_CONFIG[phase]}
              inquiries={inquiriesByPhase[phase]}
              onCardClick={setSelectedInquiry}
            />
          ))}
        </div>

        {createPortal(
          <DragOverlay dropAnimation={dropAnimation}>
            {activeInquiry ? <InquiryCard inquiry={activeInquiry} /> : null}
          </DragOverlay>,
          document.body,
        )}

        {selectedInquiry && (
          <DetailModal
            inquiry={selectedInquiry}
            isOpen={true}
            onClose={() => setSelectedInquiry(null)}
          />
        )}
      </div>
    </DndContext>
  );
}
