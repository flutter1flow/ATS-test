import { inject, injectable } from 'tsyringe';

@injectable()
export class KVRepository {
	constructor(@inject('KV_NAMESPACE') private kv: KVNamespace) {}

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
