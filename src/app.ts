import 'reflect-metadata';
import type { TEnv } from './types/env.type';
import { ContainerConfig } from '@config/container.config';
import { container } from 'tsyringe';
import { CommandRouter } from '@routes/command.router';
import { formatErrorResponse } from '@utils/error.util';
import { JobRouter } from '@routes/job.router';

ContainerConfig.registerHandlers();

export default {
	async fetch(request: Request, env: TEnv): Promise<Response> {
		console.log('Fetch Event:', request);
		container.registerInstance('env', env);
		return container.resolve(CommandRouter).route(request).catch(formatErrorResponse);
	},

	async scheduled(event: ScheduledEvent, env: TEnv): Promise<void> {
		console.log('Scheduled Event:', event);
		container.registerInstance('env', env);
		return container.resolve(JobRouter).route(event);
	},
};
