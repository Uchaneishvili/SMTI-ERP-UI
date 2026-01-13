export const INQUIRY_PHASES = {
  NEW: 'new',
  SENT_TO_HOTELS: 'sent_to_hotels',
  OFFERS_RECEIVED: 'offers_received',
  COMPLETED: 'completed',
} as const;

export type InquiryPhase = (typeof INQUIRY_PHASES)[keyof typeof INQUIRY_PHASES];

export const PHASE_ORDER: readonly InquiryPhase[] = [
  INQUIRY_PHASES.NEW,
  INQUIRY_PHASES.SENT_TO_HOTELS,
  INQUIRY_PHASES.OFFERS_RECEIVED,
  INQUIRY_PHASES.COMPLETED,
] as const;

export interface PhaseConfig {
  readonly id: InquiryPhase;
  readonly label: string;
  readonly description: string;
  readonly color: {
    readonly bg: string;
    readonly border: string;
    readonly text: string;
  };
}

export const PHASE_CONFIG: Record<InquiryPhase, PhaseConfig> = {
  [INQUIRY_PHASES.NEW]: {
    id: INQUIRY_PHASES.NEW,
    label: 'New',
    description: 'Newly received inquiries',
    color: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-300',
      text: 'text-emerald-700',
    },
  },
  [INQUIRY_PHASES.SENT_TO_HOTELS]: {
    id: INQUIRY_PHASES.SENT_TO_HOTELS,
    label: 'Sent to Hotels',
    description: 'Inquiries sent to hotels for offers',
    color: {
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      text: 'text-blue-700',
    },
  },
  [INQUIRY_PHASES.OFFERS_RECEIVED]: {
    id: INQUIRY_PHASES.OFFERS_RECEIVED,
    label: 'Offers Received',
    description: 'Waiting for client decision',
    color: {
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      text: 'text-amber-700',
    },
  },
  [INQUIRY_PHASES.COMPLETED]: {
    id: INQUIRY_PHASES.COMPLETED,
    label: 'Completed',
    description: 'Finalized inquiries',
    color: {
      bg: 'bg-green-50',
      border: 'border-green-300',
      text: 'text-green-700',
    },
  },
} as const;
