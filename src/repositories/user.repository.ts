import { inject, singleton } from 'tsyringe';
import { User } from '@models/user.model';
import { KvStorage } from '@storage/kv.storage';

@singleton()
export class UserRepository {
	private readonly userKeyPrefix = 'user:';

	constructor(@inject(KvStorage) private kvStorage: KvStorage) {}

	async saveUser(user: User): Promise<void> {
		const key = this.getUserKey(user.id);
		await this.kvStorage.set<User>(key, user);
	}

	async getUser(userId: number): Promise<User | null> {
		const key = this.getUserKey(userId);
		return await this.kvStorage.get<User>(key);
	}

	private getUserKey(userId: number): string {
		return `${this.userKeyPrefix}${userId}`;
	}
}
