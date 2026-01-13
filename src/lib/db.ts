import { promises as fs } from 'fs';
import path from 'path';
import { MOCK_INQUIRIES } from './mock-data';
import { Inquiry, InquiryPhase } from '@/types';

const DB_PATH = path.join(process.cwd(), 'data', 'inquiries.json');

interface DbSchema {
  inquiries: Inquiry[];
}

export const db = {
  async getAll(): Promise<Inquiry[]> {
    try {
      const data = await fs.readFile(DB_PATH, 'utf-8');
      const parsed: DbSchema = JSON.parse(data);
      return parsed.inquiries;
    } catch (error) {
      await this.save(MOCK_INQUIRIES as unknown as Inquiry[]);
      return [...MOCK_INQUIRIES];
    }
  },

  async getById(id: string): Promise<Inquiry | undefined> {
    const inquiries = await this.getAll();
    return inquiries.find((i) => i.id === id);
  },

  async save(inquiries: Inquiry[]): Promise<void> {
    const data: DbSchema = { inquiries };
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  },

  async update(id: string, updates: Partial<Inquiry>): Promise<Inquiry | null> {
    const inquiries = await this.getAll();
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

      await this.save(newInquiries);
      return reorderedPhaseItems.find((i) => i.id === id) || updatedInquiry;
    }

    inquiries[index] = updatedInquiry;
    await this.save(inquiries);
    return updatedInquiry;
  },
};
