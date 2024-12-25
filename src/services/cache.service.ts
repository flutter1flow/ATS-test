import { inject, singleton } from 'tsyringe';
import { KvStorage } from '@storage/kv.storage';

@singleton()
export class CacheService {
	constructor(@inject(KvStorage) private kvStorage: KvStorage) {}

	async getCachedResponse<T>(key: string): Promise<T | null> {
		return this.kvStorage.get<T>(key);
	}

	async cacheResponse<T>(key: string, value: T, ttl = 3600): Promise<void> {
		await this.kvStorage.set(key, value, ttl);
	}
}
