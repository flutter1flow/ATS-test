import { configureContainer, container } from '../config/diContainer';
import { MessageHandler } from './messageHandler';
import { EnvConfig } from '../interfaces/envConfig';

/**
 * Handles incoming requests by configuring the DI container and delegating to the appropriate handler.
 * @param request - The incoming HTTP request.
 * @param env - Environment variables conforming to the EnvConfig interface.
 * @returns A Response indicating the result of the request handling.
 */
export const handleRequest = async (request: Request, env: EnvConfig): Promise<Response> => {
	// Configure the dependency injection container with environment variables
	configureContainer(env);

	// Resolve the MessageHandler instance from the container
	const messageHandler = container.resolve(MessageHandler);

	// Delegate the request handling to the MessageHandler
	return await messageHandler.handleMessage(request);
};
