'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Header,
  Loading,
  InquiryCard,
  DetailModal,
  GenericFilterPanel,
  FilterFieldConfig,
} from '@/components';
import { GenericKanbanBoard } from '@/components/kanban/GenericKanbanBoard';
import { filterInquiries } from '@/lib';
import { useDebounce } from '@/hooks';
import {
  Inquiry,
  InquiryFilters,
  InquiryPhase,
  PHASE_CONFIG,
  PHASE_ORDER,
} from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useInquiryStore } from '@/store/useInquiryStore';
import { Search, DollarSign } from 'lucide-react';

const FILTER_CONFIG: FilterFieldConfig[] = [
  {
    key: 'clientName',
    label: 'Search Client',
    type: 'text',
    placeholder: 'Filter by name...',
    icon: Search,
  },
  {
    key: 'minValue',
    label: 'Min Value (CHF)',
    type: 'number',
    placeholder: '0',
    min: 0,
    step: 1000,
    icon: DollarSign,
  },
  {
    key: 'dateRange',
    label: 'Event Date Range',
    type: 'date-range',
    rangeKeys: ['dateFrom', 'dateTo'],
  },
];

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { inquiries, isLoading, fetchInquiries, moveInquiry } =
    useInquiryStore();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

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
    newColumnId: string,
    newIndex: number,
  ) => {
    moveInquiry(id, newColumnId as InquiryPhase, newIndex);
  };

  const columns = useMemo(
    () =>
      PHASE_ORDER.map((phase) => ({
        id: PHASE_CONFIG[phase].id,
        title: PHASE_CONFIG[phase].label,
        color: PHASE_CONFIG[phase].color,
      })),
    [],
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Header
        onFilterClick={() => setIsFilterOpen(!isFilterOpen)}
        filterCount={activeFilterCount}
      />

      <GenericFilterPanel
        isOpen={isFilterOpen}
        values={filters}
        fields={FILTER_CONFIG}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      <main className="flex-1 overflow-hidden">
        {isLoading ? (
          <Loading />
        ) : (
          <GenericKanbanBoard<Inquiry>
            items={filteredInquiries}
            columns={columns}
            groupByKey="phase"
            onItemMove={handleInquiryMove}
            onCardClick={setSelectedInquiry}
            renderCard={(inquiry) => <InquiryCard inquiry={inquiry} />}
          />
        )}
      </main>

      {selectedInquiry && (
        <DetailModal
          inquiry={selectedInquiry}
          isOpen={true}
          onClose={() => setSelectedInquiry(null)}
          onPhaseChange={(newPhase) => {
            const targetCount = inquiries.filter(
              (i) => i.phase === newPhase,
            ).length;
            handleInquiryMove(selectedInquiry.id, newPhase, targetCount); // Append by default
            setSelectedInquiry({ ...selectedInquiry, phase: newPhase });
          }}
        />
      )}
    </div>
  );
}
