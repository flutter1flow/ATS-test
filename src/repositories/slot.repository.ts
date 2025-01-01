import { inject, singleton } from 'tsyringe';
import { ISlot } from '@models/slot.model';
import { KvStorage } from '@storage/kv.storage';

@singleton()
export class SlotRepository {
	private readonly slotKeyPrefix = 'slot:';

	constructor(@inject(KvStorage) private kvStorage: KvStorage) {}

	async save(date: string, time: string, users: number[]): Promise<void> {
		const key = this.getSlotKey(date, time);
		const slot: ISlot = { date, time, users };
		await this.kvStorage.set<ISlot>(key, slot);
	}

	async get(date: string, time: string): Promise<ISlot | null> {
		const key = this.getSlotKey(date, time);
		return await this.kvStorage.get<ISlot>(key);
	}

	async getAll(date: string): Promise<ISlot[]> {
		const prefix = this.getSlotDatePrefix(date);
		const slots = await this.kvStorage.listWithPrefix<ISlot>(prefix);
		return slots.map(({ value }) => value);
	}

	async deleteUser(date: string, time: string, userId: number): Promise<void> {
		const key = this.getSlotKey(date, time);
		const slot = await this.kvStorage.get<ISlot>(key);
		if (slot === null) {
			return;
		}

		slot.users = slot.users.filter((id) => id !== userId);
		await this.kvStorage.set<ISlot>(key, slot);
	}

	async addUser(date: string, time: string, userId: number): Promise<void> {
		const key = this.getSlotKey(date, time);
		const slot = await this.kvStorage.get<ISlot>(key);
		if (slot === null) {
			return;
		}

		slot.users.push(userId);
		await this.kvStorage.set<ISlot>(key, slot);
	}

	private getSlotKey(date: string, time: string): string {
		return `${this.slotKeyPrefix}${date}:${time}`;
	}

	private getSlotDatePrefix(date: string): string {
		return `${this.slotKeyPrefix}${date}:`;
	}
}
