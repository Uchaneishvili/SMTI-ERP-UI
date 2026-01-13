import { promises as fs } from 'fs';
import path from 'path';

export class FileRepository<T extends { id: string }> {
  private filePath: string;
  private wrapperKey?: string;
  private defaultData: T[];

  constructor(filename: string, defaultData: T[] = [], wrapperKey?: string) {
    this.filePath = path.join(process.cwd(), 'data', filename);
    this.defaultData = defaultData;
    this.wrapperKey = wrapperKey;
  }

  private async readRaw(): Promise<unknown> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  async getAll(): Promise<T[]> {
    const raw = (await this.readRaw()) as Record<string, T[]> | T[] | null;
    if (!raw) {
      await this.save(this.defaultData);
      return this.defaultData;
    }
    return this.wrapperKey
      ? (raw as Record<string, T[]>)[this.wrapperKey]
      : (raw as T[]);
  }

  async getById(id: string): Promise<T | undefined> {
    const items = await this.getAll();
    return items.find((i) => i.id === id);
  }

  async save(items: T[]): Promise<void> {
    const data = this.wrapperKey ? { [this.wrapperKey]: items } : items;
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async update(id: string, updates: Partial<T>): Promise<T | null> {
    const items = await this.getAll();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return null;

    const updated = { ...items[index], ...updates };
    items[index] = updated;
    await this.save(items);
    return updated;
  }
}
