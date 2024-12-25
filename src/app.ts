// test2
import 'reflect-metadata';
import type { TEnv } from './types/env.type';
import { ContainerConfig } from '@config/container.config';
import { container } from 'tsyringe';
import { CommandRouter } from '@routes/command.router';
import { formatErrorResponse } from '@utils/error.util';

ContainerConfig.registerHandlers();

export default {
	async fetch(request: Request, env: TEnv): Promise<Response> {
		container.registerInstance('env', env);
		return container.resolve(CommandRouter).handleCommand(request).catch(formatErrorResponse);
	},
};
