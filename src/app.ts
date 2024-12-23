import 'reflect-metadata';
import { handleRequest } from './handlers/request.handler';
import { formatErrorResponse } from './utils/error.handler';
import { EnvInterface } from './interfaces/env.interface';

/**
 * The entry point for handling incoming fetch events.
 * Delegates the request to the appropriate handler and ensures consistent error handling.
 */
export default {
	/**
	 * Handles the fetch event by delegating to the request handler and formatting errors if they occur.
	 * @param request - The incoming HTTP request.
	 * @param env - Environment variables including the Telegram bot token.
	 * @returns A Promise resolving to an HTTP Response.
	 */
	async fetch(request: Request, env: EnvInterface): Promise<Response> {
		return await handleRequest(request, env).catch(formatErrorResponse);
	},
};
