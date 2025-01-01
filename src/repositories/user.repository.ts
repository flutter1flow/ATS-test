import { inject, singleton } from 'tsyringe';
import { IUser } from '@models/user.model';
import { KvStorage } from '@storage/kv.storage';

@singleton()
export class UserRepository {
	private readonly userKeyPrefix = 'user:';

	constructor(@inject(KvStorage) private kvStorage: KvStorage) {}

	async save(user: IUser): Promise<void> {
		const key = this.getUserKey(user.id);
		await this.kvStorage.set<IUser>(key, user);
	}

	async get(userId: number): Promise<IUser | null> {
		const key = this.getUserKey(userId);
		return await this.kvStorage.get<IUser>(key);
	}

	async getIds(): Promise<number[]> {
		const users = await this.kvStorage.listWithPrefix<IUser>(this.userKeyPrefix);
		return users.map((user) => user.value.id);
	}

	private getUserKey(userId: number): string {
		return `${this.userKeyPrefix}${userId}`;
	}
}
