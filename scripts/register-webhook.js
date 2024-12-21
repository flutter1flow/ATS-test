import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const TELEGRAM_API_BASE = 'https://api.telegram.org/bot';

// Function to register the webhook
async function registerWebhook(token, workerUrl) {
	const url = `${TELEGRAM_API_BASE}${token}/setWebhook`;
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ url: workerUrl }),
		});

		if (!response.ok) {
			throw new Error(`Failed to register webhook: ${response.statusText}`);
		}

		const result = await response.json();
		if (!result.ok) {
			throw new Error(`Telegram API error: ${result.description}`);
		}

		console.log('Webhook registered successfully:', result);
	} catch (error) {
		console.error('Error during webhook registration:', error.message);
		process.exit(1);
	}
}

// Script logic
(async () => {
	const botToken = process.env.TELEGRAM_BOT_TOKEN;
	const workerUrl = process.env.WORKER_URL;

	if (!botToken || !workerUrl) {
		console.error('TELEGRAM_BOT_TOKEN and WEBHOOK_URL must be set in the .env file.');
		process.exit(1);
	}

	await registerWebhook(botToken, workerUrl);
})();
