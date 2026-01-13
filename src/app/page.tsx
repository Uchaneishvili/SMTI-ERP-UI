'use client';

import { useState } from 'react';
import { KanbanBoard, Header } from '@/components';

export default function Home() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Header
        onFilterClick={() => setIsFilterOpen(!isFilterOpen)}
        filterCount={0}
      />

      <main className="flex-1 overflow-hidden">
        <KanbanBoard />
      </main>
    </div>
  );
}
