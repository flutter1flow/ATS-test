import 'reflect-metadata';
import type { TEnv } from './types/env.type';
import { ContainerConfig, resolve } from './config/container.config';
import { RequestHandler } from './handlers/request.handler';
import { formatErrorResponse } from './utils/error.util';

export default {
	async fetch(request: Request, env: TEnv): Promise<Response> {
		ContainerConfig.initialize(env);
		return await resolve(RequestHandler).handleRequest(request).catch(formatErrorResponse);
	},
};
