#!/usr/bin/env node
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import readline from 'readline';

// Load environment variables
dotenv.config();

// Constants
const LOCAL_URL = 'http://127.0.0.1:8787';
const chatId = parseInt(process.env.CHAT_ID, 10) || 123456789;

// Validate Environment Variables
const requiredEnvVars = ['LOCAL_BOT_TOKEN'];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length) {
	console.error(`Error: Missing required environment variables: ${missingVars.join(', ')}`);
	console.error('Please ensure these are set in your .env file.');
	process.exit(1);
}

// Helper: Get Message from User
function getMessageFromUser(prompt) {
	return new Promise((resolve) => {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		rl.question(prompt, (input) => {
			rl.close();
			resolve(input.trim());
		});
	});
}

// Helper: Send Mock Update
async function sendMockUpdate(message) {
	const mockUpdate = {
		message: {
			chat: { id: chatId }, // Ensure chatId is a valid number
			text: message,
		},
	};

	// console.log('Mock Update:', JSON.stringify(mockUpdate, null, 2));
	try {
		const response = await fetch(LOCAL_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(mockUpdate),
		});
		const contentType = response.headers.get('Content-Type');
		const responseText =
			contentType && contentType.includes('application/json') ? JSON.stringify(await response.json(), null, 2) : await response.text();

		console.log('Local Bot Response:');
		console.log(responseText);
	} catch (error) {
		console.error('Error sending request:', error.message);
	}
}

// Main Function
async function main() {
	const userMessage = process.argv[2] || (await getMessageFromUser('Enter the message to send to the local bot: '));
	const message = userMessage || 'Default test message';
	await sendMockUpdate(message);
}

main().catch((error) => {
	console.error('Unexpected error:', error.message);
});
