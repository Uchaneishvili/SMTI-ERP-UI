'use client';

import { useState, useMemo, useEffect } from 'react';
import { KanbanBoard, Header, FilterPanel, Loading } from '@/components';
import { filterInquiries } from '@/lib';
import { useDebounce } from '@/hooks';
import type { InquiryFilters, InquiryPhase } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useInquiryStore } from '@/store/useInquiryStore';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Use Zustand Store for Data & Actions
  const { inquiries, isLoading, fetchInquiries, moveInquiry } =
    useInquiryStore();

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Derive initial filters from URL
  const filters: InquiryFilters = useMemo(() => {
    return {
      clientName: searchParams.get('clientName') || undefined,
      minValue: searchParams.get('minValue')
        ? Number(searchParams.get('minValue'))
        : undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
    };
  }, [searchParams]);

  // Initial Fetch
  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const debouncedFilters = useDebounce(filters, 300);

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== '',
  ).length;

  const filteredInquiries = useMemo(() => {
    return filterInquiries(inquiries, debouncedFilters);
  }, [inquiries, debouncedFilters]);

  const updateFilters = (newFilters: Partial<InquiryFilters>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        current.delete(key);
      } else {
        current.set(key, String(value));
      }
    });

    const search = current.toString();
    const query = search ? `?${search}` : '';

    router.replace(`${window.location.pathname}${query}`, { scroll: false });
  };

  const handleFilterChange = (newFilters: Partial<InquiryFilters>) => {
    updateFilters(newFilters);
  };

  const handleClearFilters = () => {
    router.replace(window.location.pathname, { scroll: false });
  };

  const handleInquiryMove = (
    id: string,
    newPhase: InquiryPhase,
    newOrder: number,
  ) => {
    moveInquiry(id, newPhase, newOrder);
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
