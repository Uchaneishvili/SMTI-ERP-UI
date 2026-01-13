'use client';

import { useState, useMemo, useEffect } from 'react';
import { KanbanBoard, Header, FilterPanel, Loading } from '@/components';
import { filterInquiries } from '@/lib';
import { useDebounce } from '@/hooks';
import type { Inquiry, InquiryFilters, InquiryPhase } from '@/types';

export default function Home() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<InquiryFilters>({});

  useEffect(() => {
    async function fetchInquiries() {
      try {
        const res = await fetch('/api/inquiries');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setInquiries(data);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInquiries();
  }, []);

  const debouncedFilters = useDebounce(filters, 300);

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== '',
  ).length;

  const filteredInquiries = useMemo(() => {
    return filterInquiries(inquiries, debouncedFilters);
  }, [inquiries, debouncedFilters]);

  const handleFilterChange = (newFilters: Partial<InquiryFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleInquiryMove = async (
    id: string,
    newPhase: InquiryPhase,
    newOrder: number,
  ) => {
    // Optimistic update
    setInquiries((prev) =>
      prev.map((inq) =>
        inq.id === id
          ? { ...inq, phase: newPhase, updatedAt: new Date().toISOString() }
          : inq,
      ),
    );

    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase: newPhase }),
      });

      if (!res.ok) {
        throw new Error('Failed to update inquiry');
      }
    } catch (error) {
      console.error('Failed to move inquiry:', error);
      // Revert optimization on error (simplified for now, ideally fetching fresh data)
      // For a real app, we'd keep prev state ref or re-fetch.
      // fetchInquiries();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Header
        onFilterClick={() => setIsFilterOpen(!isFilterOpen)}
        filterCount={activeFilterCount}
      />

      <FilterPanel
        isOpen={isFilterOpen}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      <main className="flex-1 overflow-hidden">
        {isLoading ? (
          <Loading />
        ) : (
          <KanbanBoard
            inquiries={filteredInquiries}
            onInquiryMove={handleInquiryMove}
          />
        )}
      </main>
    </div>
  );
}
