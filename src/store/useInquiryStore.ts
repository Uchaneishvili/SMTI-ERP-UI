import { create } from 'zustand';
import { Inquiry, InquiryPhase } from '@/types';
import { toast } from 'sonner';

interface InquiryState {
  inquiries: Inquiry[];
  isLoading: boolean;

  setInquiries: (inquiries: Inquiry[]) => void;
  fetchInquiries: () => Promise<void>;
  moveInquiry: (
    id: string,
    newPhase: InquiryPhase,
    newOrder: number,
  ) => Promise<void>;
}

export const useInquiryStore = create<InquiryState>((set, get) => ({
  inquiries: [],
  isLoading: true,

  setInquiries: (inquiries) => set({ inquiries }),

  fetchInquiries: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/inquiries');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      set({ inquiries: data });
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast.error('Failed to load inquiries');
    } finally {
      set({ isLoading: false });
    }
  },

  moveInquiry: async (id, newPhase, newOrder) => {
    const currentInquiries = get().inquiries;
    const previousInquiries = [...currentInquiries];

    set({
      inquiries: currentInquiries.map((inq) =>
        inq.id === id
          ? {
              ...inq,
              phase: newPhase,
              order: newOrder,
              updatedAt: new Date().toISOString(),
            }
          : inq,
      ),
    });

    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase: newPhase, order: newOrder }),
      });

      if (!res.ok) {
        throw new Error('Failed to update inquiry');
      }
    } catch (error) {
      console.error('Failed to move inquiry:', error);
      toast.error('Failed to update inquiry');
      set({ inquiries: previousInquiries });
    }
  },
}));
