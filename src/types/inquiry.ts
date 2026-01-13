import type { InquiryPhase } from './phase';

export const EVENT_TYPES = {
  CONFERENCE: 'Conference',
  WEDDING: 'Wedding',
  CORPORATE: 'Corporate',
  EXHIBITION: 'Exhibition',
  PRIVATE: 'Private',
  OTHER: 'Other',
} as const;

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

export interface BaseEntity {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface Inquiry extends BaseEntity {
  readonly clientName: string;
  readonly contactPerson: string;
  readonly eventType: EventType;
  readonly eventDate: string;
  readonly guestCount: number;
  readonly potentialValue: number;
  readonly phase: InquiryPhase;
  readonly hotels: readonly string[];
  readonly notes: string;
  readonly order: number;
}

export const HIGH_VALUE_THRESHOLD = 50000;

export const isHighValueInquiry = (inquiry: Inquiry): boolean =>
  inquiry.potentialValue >= HIGH_VALUE_THRESHOLD;
