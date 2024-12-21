import 'reflect-metadata';
import { describe, it, vi, expect } from 'vitest';
import { MessageHandler } from './messageHandler';
import { TelegramService } from '../services/telegramService';

vi.mock('../services/telegramService', () => ({
	TelegramService: vi.fn().mockImplementation(() => ({
		sendMessage: vi.fn(),
	})),
}));

describe('MessageHandler', () => {
	it('should send a reply when valid message is provided', async () => {
		const mockTelegramService = new TelegramService();
		const messageHandler = new MessageHandler(mockTelegramService);

		const mockRequest = new Request('https://example.com', {
			method: 'POST',
			body: JSON.stringify({
				message: {
					chat: { id: 123 },
					text: 'Hello',
				},
			}),
		});

		await messageHandler.handleMessage(mockRequest);

		expect(mockTelegramService.sendMessage).toHaveBeenCalledWith(123, 'You said: Hello');
	});

	it('should return 400 if required fields are missing', async () => {
		const mockTelegramService = new TelegramService();
		const messageHandler = new MessageHandler(mockTelegramService);

		const mockRequest = new Request('https://example.com', {
			method: 'POST',
			body: JSON.stringify({}),
		});

		const response = await messageHandler.handleMessage(mockRequest);

		expect(response.status).toBe(400);
		expect(await response.text()).toBe('Invalid request: missing required message fields');
	});

	it('should return 500 if an error occurs', async () => {
		const mockTelegramService = new TelegramService();
		const messageHandler = new MessageHandler(mockTelegramService);

		const mockRequest = new Request('https://example.com', {
			method: 'POST',
			body: JSON.stringify({
				message: {
					chat: { id: 123 },
					text: 'Hello',
				},
			}),
		});

		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		(mockTelegramService.sendMessage as vi.Mock).mockRejectedValue(new Error('Test error'));

		const response = await messageHandler.handleMessage(mockRequest);

		expect(response.status).toBe(500);
		expect(await response.text()).toBe('Internal Server Error');
		expect(consoleErrorSpy).toHaveBeenCalledWith('Error handling message:', expect.any(Error));

		consoleErrorSpy.mockRestore(); // Restore original console.error after the test
	});
});
