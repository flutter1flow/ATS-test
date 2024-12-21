// src/app/index.spec.ts
import { describe, it, vi, expect } from 'vitest';
import handler from './index';
import { handleRequest } from '../handlers/requestHandler';

vi.mock('../handlers/requestHandler', () => ({
	handleRequest: vi.fn(),
}));

describe('index', () => {
	it('should call handleRequest with request and env', async () => {
		const mockRequest = new Request('https://example.com');
		const mockEnv = { TELEGRAM_BOT_TOKEN: 'mock-token' };
		const mockResponse = new Response('Success');

		(handleRequest as vi.Mock).mockResolvedValue(mockResponse);

		const result = await handler.fetch(mockRequest, mockEnv);

		expect(handleRequest).toHaveBeenCalledWith(mockRequest, mockEnv);
		expect(result).toBe(mockResponse);
	});

	it('should return structured 500 response if handleRequest throws an error', async () => {
		const mockRequest = new Request('https://example.com');
		const mockEnv = { TELEGRAM_BOT_TOKEN: 'mock-token' };
		const mockError = new Error('Test error');
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		(handleRequest as vi.Mock).mockRejectedValue(mockError);

		const result = await handler.fetch(mockRequest, mockEnv);

		const expectedErrorResponse = {
			message: 'Internal Server Error',
			details: 'Test error',
			timestamp: expect.any(String), // Ensure the timestamp exists but avoid exact matching
		};

		expect(consoleErrorSpy).toHaveBeenCalledWith('Unhandled Error:', mockError);
		expect(result.status).toBe(500);
		expect(await result.json()).toEqual(expectedErrorResponse);

		consoleErrorSpy.mockRestore();
	});
});
