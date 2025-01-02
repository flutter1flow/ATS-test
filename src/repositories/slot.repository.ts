import { inject, singleton } from 'tsyringe';
import { ISlot, Slot } from '@models/slot.model';
import { KvStorage } from '@storage/kv.storage';
import { getDate } from '@utils/date.util';

@singleton()
export class SlotRepository {
	private readonly date = getDate();
	private readonly slotKeyPrefix = `slot:${this.date}:`;

	constructor(@inject(KvStorage) private kvStorage: KvStorage) {}

	async create(time: string): Promise<void> {
		const key = this.getSlotKey(time);
		const slot = new Slot(this.date, time);
		await this.kvStorage.set<ISlot>(key, slot);
	}

	async get(time: string): Promise<ISlot | null> {
		const key = this.getSlotKey(time);
		return await this.kvStorage.get<ISlot>(key);
	}

	async getAll(): Promise<ISlot[]> {
		const prefix = this.slotKeyPrefix;
		const slots = await this.kvStorage.listWithPrefix<ISlot>(prefix);
		return slots.map(({ value }) => value);
	}

	async deleteUser(time: string, userId: number): Promise<void> {
		const key = this.getSlotKey(time);
		const slot = await this.kvStorage.get<ISlot>(key);
		if (slot === null) {
			return;
		}

		slot.users = slot.users.filter((id) => id !== userId);
		await this.kvStorage.set<ISlot>(key, slot);
	}

	async addUser(time: string, userId: number): Promise<void> {
		const key = this.getSlotKey(time);
		let slot = await this.kvStorage.get<ISlot>(key);
		if (slot === null) {
			slot = new Slot(this.date, time);
		}

		slot.users.push(userId);
		await this.kvStorage.set<ISlot>(key, slot);
	}

	private getSlotKey(time: string): string {
		return `${this.slotKeyPrefix}${time}`;
	}
}
