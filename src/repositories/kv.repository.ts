import { inject, singleton } from 'tsyringe';
import type { TEnv } from '../types/env.type';

@singleton()
export class KVRepository {
	private kv: KVNamespace;

	constructor(@inject('env') private env: TEnv) {
		this.kv = env.KV_NAMESPACE;
	}

	async get<T>(key: string): Promise<T | null> {
		const data = await this.kv.get(key, { type: 'json' });
		return data as T | null;
	}

	async set<T>(key: string, value: T, expirationSeconds?: number): Promise<void> {
		await this.kv.put(key, JSON.stringify(value), { expirationTtl: expirationSeconds });
	}

	async delete(key: string): Promise<void> {
		await this.kv.delete(key);
	}
}
