import 'reflect-metadata';
import type { TEnv } from './types/env.type';
import { RequestHandler } from './handlers/request.handler';
import { formatErrorResponse } from './utils/error.util';
import { container } from 'tsyringe';

export default {
	async fetch(request: Request, env: TEnv): Promise<Response> {
		container.registerInstance('env', env);
		return await container.resolve(RequestHandler).handleRequest(request).catch(formatErrorResponse);
	},

	async scheduled(event: ScheduledEvent, env: TEnv): Promise<void> {
		container.registerInstance('env', env);
		// Do something
	},
};
