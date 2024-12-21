import 'reflect-metadata';
import { handleRequest } from '../handlers/requestHandler';
import { formatErrorResponse } from '../utils/errorHandler';

export default {
	async fetch(request: Request, env: { TELEGRAM_BOT_TOKEN: string }): Promise<Response> {
		return await handleRequest(request, env).catch(formatErrorResponse);
	},
};
