import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig({
	test: {
		poolOptions: {
			workers: {
				wrangler: { configPath: './wrangler.toml' },
			},
		},
		coverage: {
			provider: 'istanbul', // Ensure 'v8' is set for coverage
		},
	},
});
