import {
  Inquiry,
  INQUIRY_PHASES,
  EVENT_TYPES,
  type InquiryPhase,
} from '@/types';

const generateId = (prefix: string, index: number): string =>
  `${prefix}-2026-${String(index).padStart(4, '0')}`;

export const MOCK_INQUIRIES: readonly Inquiry[] = [
  {
    id: generateId('INQ', 1),
    clientName: 'Novartis AG',
    contactPerson: 'Anna Mueller',
    eventType: EVENT_TYPES.CONFERENCE,
    eventDate: '2026-03-15',
    guestCount: 120,
    potentialValue: 48500,
    phase: INQUIRY_PHASES.NEW,
    hotels: [],
    notes: 'Client prefers city center location, needs AV equipment',
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-01-10T09:00:00Z',
    order: 0,
  },
  {
    id: generateId('INQ', 2),
    clientName: 'Roche Holding',
    contactPerson: 'Peter Schmidt',
    eventType: EVENT_TYPES.CORPORATE,
    eventDate: '2026-04-20',
    guestCount: 80,
    potentialValue: 35000,
    phase: INQUIRY_PHASES.NEW,
    hotels: [],
    notes: 'Annual team building event, outdoor activities preferred',
    createdAt: '2026-01-11T14:30:00Z',
    updatedAt: '2026-01-11T14:30:00Z',
    order: 1,
  },
  {
    id: generateId('INQ', 3),
    clientName: 'Credit Suisse',
    contactPerson: 'Maria Weber',
    eventType: EVENT_TYPES.CONFERENCE,
    eventDate: '2026-05-10',
    guestCount: 200,
    potentialValue: 85000,
    phase: INQUIRY_PHASES.NEW,
    hotels: [],
    notes: 'Executive leadership summit, premium venue required',
    createdAt: '2026-01-12T10:15:00Z',
    updatedAt: '2026-01-12T10:15:00Z',
    order: 2,
  },
  {
    id: generateId('INQ', 4),
    clientName: 'UBS Group',
    contactPerson: 'Hans Keller',
    eventType: EVENT_TYPES.CONFERENCE,
    eventDate: '2026-02-28',
    guestCount: 150,
    potentialValue: 62000,
    phase: INQUIRY_PHASES.SENT_TO_HOTELS,
    hotels: ['Grand Hotel Zurich', 'Hotel Schweizerhof', 'Park Hyatt Zurich'],
    notes: 'Quarterly strategy meeting, breakout rooms needed',
    createdAt: '2026-01-05T11:00:00Z',
    updatedAt: '2026-01-09T16:45:00Z',
    order: 0,
  },
  {
    id: generateId('INQ', 5),
    clientName: 'Swatch Group',
    contactPerson: 'Sophie Brunner',
    eventType: EVENT_TYPES.EXHIBITION,
    eventDate: '2026-03-25',
    guestCount: 300,
    potentialValue: 120000,
    phase: INQUIRY_PHASES.SENT_TO_HOTELS,
    hotels: ['Baur au Lac', 'The Dolder Grand'],
    notes: 'Product launch event, exhibition space minimum 500m²',
    createdAt: '2026-01-04T09:30:00Z',
    updatedAt: '2026-01-08T14:20:00Z',
    order: 1,
  },
  {
    id: generateId('INQ', 6),
    clientName: 'Lindt & Sprüngli',
    contactPerson: 'Thomas Meier',
    eventType: EVENT_TYPES.CORPORATE,
    eventDate: '2026-04-05',
    guestCount: 60,
    potentialValue: 28000,
    phase: INQUIRY_PHASES.SENT_TO_HOTELS,
    hotels: ['Hotel Storchen', 'Widder Hotel'],
    notes: 'Board dinner, private dining room required',
    createdAt: '2026-01-06T13:45:00Z',
    updatedAt: '2026-01-10T11:30:00Z',
    order: 2,
  },
  {
    id: generateId('INQ', 7),
    clientName: 'Nestle SA',
    contactPerson: 'Christine Huber',
    eventType: EVENT_TYPES.CONFERENCE,
    eventDate: '2026-02-15',
    guestCount: 180,
    potentialValue: 75000,
    phase: INQUIRY_PHASES.OFFERS_RECEIVED,
    hotels: ['Grand Hotel Zurich', 'Hotel Schweizerhof'],
    notes: 'Global marketing summit, simultaneous translation needed',
    createdAt: '2026-01-02T10:00:00Z',
    updatedAt: '2026-01-12T14:30:00Z',
    order: 0,
  },
  {
    id: generateId('INQ', 8),
    clientName: 'ABB Ltd',
    contactPerson: 'Michael Steiner',
    eventType: EVENT_TYPES.CORPORATE,
    eventDate: '2026-03-01',
    guestCount: 45,
    potentialValue: 22000,
    phase: INQUIRY_PHASES.OFFERS_RECEIVED,
    hotels: ['Hotel Allegra', 'Renaissance Zurich'],
    notes: 'Engineering workshop, technical setup required',
    createdAt: '2026-01-03T15:20:00Z',
    updatedAt: '2026-01-11T09:15:00Z',
    order: 1,
  },
  {
    id: generateId('INQ', 9),
    clientName: 'Zurich Insurance',
    contactPerson: 'Sandra Fischer',
    eventType: EVENT_TYPES.CONFERENCE,
    eventDate: '2026-01-20',
    guestCount: 100,
    potentialValue: 52000,
    phase: INQUIRY_PHASES.COMPLETED,
    hotels: ['Baur au Lac'],
    notes: 'Annual conference, successfully booked at Baur au Lac',
    createdAt: '2025-12-15T08:30:00Z',
    updatedAt: '2026-01-08T17:00:00Z',
    order: 0,
  },
  {
    id: generateId('INQ', 10),
    clientName: 'Swiss Re',
    contactPerson: 'Daniel Zimmermann',
    eventType: EVENT_TYPES.CORPORATE,
    eventDate: '2026-01-25',
    guestCount: 75,
    potentialValue: 38000,
    phase: INQUIRY_PHASES.COMPLETED,
    hotels: ['Park Hyatt Zurich'],
    notes: 'Client appreciation dinner, completed successfully',
    createdAt: '2025-12-20T14:00:00Z',
    updatedAt: '2026-01-05T10:45:00Z',
    order: 1,
  },
  {
    id: generateId('INQ', 11),
    clientName: 'Migros Group',
    contactPerson: 'Laura Bauer',
    eventType: EVENT_TYPES.WEDDING,
    eventDate: '2026-02-14',
    guestCount: 200,
    potentialValue: 95000,
    phase: INQUIRY_PHASES.COMPLETED,
    hotels: ['The Dolder Grand'],
    notes: 'Executive wedding celebration, premium package',
    createdAt: '2025-11-10T11:00:00Z',
    updatedAt: '2026-01-02T16:30:00Z',
    order: 2,
  },
] as const;

export const getInquiriesByPhase = (
  inquiries: readonly Inquiry[],
): Record<InquiryPhase, Inquiry[]> => {
  const grouped: Record<InquiryPhase, Inquiry[]> = {
    [INQUIRY_PHASES.NEW]: [],
    [INQUIRY_PHASES.SENT_TO_HOTELS]: [],
    [INQUIRY_PHASES.OFFERS_RECEIVED]: [],
    [INQUIRY_PHASES.COMPLETED]: [],
  };

  for (const inquiry of inquiries) {
    if (grouped[inquiry.phase]) {
      grouped[inquiry.phase].push(inquiry);
    }
  }

  // Sort by order
  for (const phase of Object.keys(grouped)) {
    grouped[phase as InquiryPhase].sort((a, b) => a.order - b.order);
  }

  return grouped;
};

export const calculateColumnStats = (
  inquiries: readonly Inquiry[],
): { count: number; totalValue: number } => ({
  count: inquiries.length,
  totalValue: inquiries.reduce((sum, inq) => sum + inq.potentialValue, 0),
});

export const filterInquiries = (
  inquiries: readonly Inquiry[],
  filters: {
    clientName?: string;
    dateFrom?: string;
    dateTo?: string;
    minValue?: number;
  },
): Inquiry[] => {
  return inquiries.filter((inquiry) => {
    if (
      filters.clientName &&
      !inquiry.clientName
        .toLowerCase()
        .includes(filters.clientName.toLowerCase())
    ) {
      return false;
    }

    if (filters.dateFrom && inquiry.eventDate < filters.dateFrom) {
      return false;
    }
    if (filters.dateTo && inquiry.eventDate > filters.dateTo) {
      return false;
    }

    if (filters.minValue && inquiry.potentialValue < filters.minValue) {
      return false;
    }

    return true;
  });
};
