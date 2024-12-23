import { inject, injectable } from 'tsyringe';

@injectable()
export class KVConfig {
	constructor(@inject('KV_NAMESPACE') private kvNamespace: KVNamespace) {}

	getKVInstance(): KVNamespace {
		return this.kvNamespace;
	}
}
