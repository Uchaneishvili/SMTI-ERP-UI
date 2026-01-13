'use client';

import { useState } from 'react';
import type { Inquiry, InquiryPhase } from '@/types';
import { PHASE_ORDER, PHASE_CONFIG, INQUIRY_PHASES } from '@/types';
import { MOCK_INQUIRIES, getInquiriesByPhase } from '@/lib';
import { KanbanColumn } from './KanbanColumn';

export function KanbanBoard() {
  const [inquiries] = useState<Inquiry[]>([...MOCK_INQUIRIES]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [activePhase, setActivePhase] = useState<InquiryPhase | null>(null);

  const inquiriesByPhase = getInquiriesByPhase(inquiries);

  return (
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
            config={PHASE_CONFIG[phase]}
            inquiries={inquiriesByPhase[phase]}
            onCardClick={setSelectedInquiry}
          />
        ))}
      </div>

      {/* TODO: Detail modal will go here */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
          <div className="bg-white w-full md:max-w-lg md:rounded-lg max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold">{selectedInquiry.clientName}</h2>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm text-slate-600">
                Detail panel coming next...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
