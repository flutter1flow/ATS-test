import { configureContainer, container } from '../config/diContainer';
import { MessageHandler } from './messageHandler';
import { EnvConfig } from '../interfaces/envConfig';

/**
 * Handles incoming HTTP requests by configuring the DI container and delegating POST requests to the MessageHandler.
 * Returns a 200 OK response for unsupported HTTP methods.
 *
 * @param request - The incoming HTTP request.
 * @param env - Environment variables conforming to the EnvConfig interface.
 * @returns A Response indicating the result of the request handling.
 */
export const handleRequest = async (request: Request, env: EnvConfig): Promise<Response> => {
	// Configure the dependency injection container with the provided environment variables
	configureContainer(env);

	// Resolve the MessageHandler instance from the DI container
	const messageHandler = container.resolve(MessageHandler);

	// Handle only POST requests
	if (request.method === 'POST') {
		return await messageHandler.handleMessage(request);
	}

	// Return a 200 OK response for unsupported HTTP methods
	return new Response('OK', { status: 200 });
};
