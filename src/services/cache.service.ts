import { inject, singleton } from 'tsyringe';
import { KVRepository } from '@repositories/kv.repository';

@singleton()
export class CacheService {
	constructor(@inject(KVRepository) private kvRepository: KVRepository) {}

	async getCachedResponse<T>(key: string): Promise<T | null> {
		return this.kvRepository.get<T>(key);
	}

	async cacheResponse<T>(key: string, value: T, ttl = 3600): Promise<void> {
		await this.kvRepository.set(key, value, ttl);
	}
}
