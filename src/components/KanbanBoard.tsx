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
} from '@dnd-kit/core';
import type { Inquiry, InquiryPhase } from '@/types';
import { PHASE_ORDER, PHASE_CONFIG, INQUIRY_PHASES } from '@/types';
import { KanbanColumn } from './KanbanColumn';
import { DetailModal } from './DetailModal';
import { InquiryCard } from './InquiryCard';
import { useInquiryBoard, dropAnimation } from '@/hooks';

interface KanbanBoardProps {
  inquiries: Inquiry[];
  onInquiryMove?: (
    id: string,
    newPhase: InquiryPhase,
    newOrder: number,
  ) => void;
}

export function KanbanBoard({
  inquiries: initialInquiries,
  onInquiryMove,
}: KanbanBoardProps) {
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [activePhase, setActivePhase] = useState<InquiryPhase | null>(null);

  const {
    inquiriesByPhase,
    activeInquiry,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useInquiryBoard(initialInquiries);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={(event) => handleDragEnd(event, onInquiryMove)}
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

        {/* Mobile: Single column view */}
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
