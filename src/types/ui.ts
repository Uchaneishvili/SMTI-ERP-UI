import type { Inquiry } from './inquiry';

export interface ColumnStats {
  readonly count: number;
  readonly totalValue: number;
}

export interface DragState {
  readonly isDragging: boolean;
  readonly activeId: string | null;
  readonly overId: string | null;
}

export interface SelectedInquiry {
  readonly inquiry: Inquiry;
  readonly isOpen: boolean;
}
