'use client';

import { useState, useMemo, useEffect } from 'react';
import { KanbanBoard, Header, FilterPanel, Loading } from '@/components';
import { filterInquiries } from '@/lib';
import { useDebounce } from '@/hooks';
import type { Inquiry, InquiryFilters } from '@/types';

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
          <KanbanBoard inquiries={filteredInquiries} />
        )}
      </main>
    </div>
  );
}
