// src/handlers/requestHandler.spec.ts
import { describe, it, vi, expect } from 'vitest';
import { handleRequest } from './requestHandler';
import { configureContainer, container } from '../config/diContainer';
import { MessageHandler } from './messageHandler';

vi.mock('../config/diContainer', () => ({
	configureContainer: vi.fn(),
	container: {
		resolve: vi.fn(),
	},
}));

vi.mock('./messageHandler', () => ({
	MessageHandler: vi.fn().mockImplementation(() => ({
		handleMessage: vi.fn(),
	})),
}));

describe('handleRequest', () => {
	it('should configure container and call handleMessage', async () => {
		const mockRequest = new Request('https://example.com');
		const mockEnv = { TELEGRAM_BOT_TOKEN: 'mock-token' };
		const mockResponse = new Response('Handled');

		const mockMessageHandler = new MessageHandler();
		(mockMessageHandler.handleMessage as vi.Mock).mockResolvedValue(mockResponse);
		(container.resolve as vi.Mock).mockReturnValue(mockMessageHandler);

		const result = await handleRequest(mockRequest, mockEnv);

		expect(configureContainer).toHaveBeenCalledWith(mockEnv);
		expect(container.resolve).toHaveBeenCalledWith(MessageHandler);
		expect(mockMessageHandler.handleMessage).toHaveBeenCalledWith(mockRequest);
		expect(result).toBe(mockResponse);
	});
});
