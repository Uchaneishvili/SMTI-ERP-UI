'use client';

import { useState, useMemo } from 'react';
import { KanbanBoard, Header, FilterPanel } from '@/components';
import { MOCK_INQUIRIES, filterInquiries } from '@/lib';
import { useDebounce } from '@/hooks';
import type { InquiryFilters } from '@/types';

export default function Home() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<InquiryFilters>({});

  const debouncedFilters = useDebounce(filters, 300);

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== '',
  ).length;

  const filteredInquiries = useMemo(() => {
    return filterInquiries(MOCK_INQUIRIES, debouncedFilters);
  }, [debouncedFilters]);

  const handleFilterChange = (newFilters: Partial<InquiryFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({});
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
        <KanbanBoard inquiries={filteredInquiries} />
      </main>
    </div>
  );
}
