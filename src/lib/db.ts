import { Inquiry, InquiryPhase } from '@/types';
import { MOCK_INQUIRIES } from './mock-data';
import { FileRepository } from './FileRepository';

const repo = new FileRepository<Inquiry>(
  'inquiries.json',
  MOCK_INQUIRIES as unknown as Inquiry[],
  'inquiries',
);

export const db = {
  getAll: () => repo.getAll(),
  getById: (id: string) => repo.getById(id),
  save: (items: Inquiry[]) => repo.save(items),

  async update(id: string, updates: Partial<Inquiry>): Promise<Inquiry | null> {
    const inquiries = await repo.getAll();
    const index = inquiries.findIndex((i) => i.id === id);

    if (index === -1) return null;

    const currentInquiry = inquiries[index];
    const updatedInquiry = {
      ...currentInquiry,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const phaseChanged =
      updates.phase && updates.phase !== currentInquiry.phase;
    const orderChanged =
      typeof updates.order === 'number' &&
      updates.order !== currentInquiry.order;

    if (phaseChanged || orderChanged) {
      const targetPhase = (updates.phase ||
        currentInquiry.phase) as InquiryPhase;
      const targetOrder =
        typeof updates.order === 'number'
          ? updates.order
          : currentInquiry.order;

      const otherItems = inquiries.filter((i) => i.id !== id);

      const phaseItems = otherItems.filter((i) => i.phase === targetPhase);
      phaseItems.sort((a, b) => a.order - b.order);

      const insertIndex = Math.max(0, Math.min(targetOrder, phaseItems.length));
      phaseItems.splice(insertIndex, 0, updatedInquiry);

      const reorderedPhaseItems = phaseItems.map((item, idx) => ({
        ...item,
        order: idx,
      }));
      const nonTargetItems = inquiries.filter(
        (i) => i.phase !== targetPhase && i.id !== id,
      );
      const newInquiries = [...nonTargetItems, ...reorderedPhaseItems];

      await repo.save(newInquiries);
      return reorderedPhaseItems.find((i) => i.id === id) || updatedInquiry;
    }

    return repo.update(id, updates);
  },
};
