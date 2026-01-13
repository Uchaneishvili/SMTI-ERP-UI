import type { Inquiry } from './inquiry';
import type { InquiryPhase } from './phase';

export interface InquiryFilters {
  readonly clientName?: string;
  readonly dateFrom?: string;
  readonly dateTo?: string;
  readonly minValue?: number;
  readonly phase?: InquiryPhase;
}

export interface PaginatedResponse<T> {
  readonly data: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}

export interface InquiriesByPhase {
  readonly [key: string]: readonly Inquiry[];
}

export interface UpdateInquiryPhasePayload {
  readonly id: string;
  readonly phase: InquiryPhase;
}

export interface UpdateInquiryPayload {
  readonly id: string;
  readonly updates: Partial<Omit<Inquiry, 'id' | 'createdAt' | 'updatedAt'>>;
}
