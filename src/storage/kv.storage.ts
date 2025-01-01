import { inject, singleton } from 'tsyringe';
import type { TEnv } from '../types/env.type';

export type KVPair<T> = { key: string; value: T };

@singleton()
export class KvStorage {
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

	async listWithPrefix<T>(prefix: string): Promise<KVPair<T>[]> {
		const { keys } = await this.kv.list({ prefix });
		const pairs = await Promise.all(
			keys.map(async ({ name }) => {
				const value = await this.get<T>(name);
				return value !== null
					? ({
							key: name,
							value,
						} as KVPair<T>)
					: null;
			})
		);
		return pairs.filter((pair): pair is KVPair<T> => pair !== null);
	}
}
