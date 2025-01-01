#!/usr/bin/env node
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import readline from 'readline';
import chalk from 'chalk';

// Load environment variables
dotenv.config({ path: './.dev.vars' });

// Constants
const LOCAL_URL = 'http://127.0.0.1:8787';
const chatId = parseInt(process.env.CHAT_ID, 10);

// Validate Environment Variables
const requiredEnvVars = ['CHAT_ID'];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length) {
	console.error(chalk.red(`\n🚨 Error: Missing required environment variables: ${missingVars.join(', ')}`));
	console.error(chalk.yellow('Please ensure these are set in your .dev.vars file.\n'));
	process.exit(1);
}

console.log(chalk.greenBright('✅  Environment variables loaded successfully!'));

// Helper: Get Message from User
function getMessageFromUser(prompt) {
	return new Promise((resolve) => {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		rl.question(chalk.bold(chalk.bgGreenBright(prompt)) + ' ', (input) => {
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
			from: { id: chatId },
			text: message,
		},
	};

	console.log(chalk.blueBright('🛠️ Sending request to the local bot...'));
	try {
		const response = await fetch(LOCAL_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(mockUpdate),
		});
		const contentType = response.headers.get('Content-Type');
		const responseText =
			contentType && contentType.includes('application/json') ? JSON.stringify(await response.json(), null, 2) : await response.text();

		console.log(chalk.greenBright('🤖 Local Bot Response:'));
		console.log(chalk.whiteBright(responseText));
	} catch (error) {
		console.error(chalk.red(`\n❌ Error sending request: ${error.message}`));
	}
}

// Main Function
async function main() {
	console.log(chalk.greenBright('🚀 Local Testing Environment Started!'));
	console.log(chalk.yellow('Type a message to send to your local bot. Type "exit" to quit.'));

	while (true) {
		const userMessage = await getMessageFromUser('Enter message (or type "exit" to quit):');
		if (userMessage.toLowerCase() === 'exit') {
			console.log(chalk.green('\n👋 Exiting the testing environment. Goodbye!\n'));
			break;
		}
		await sendMockUpdate(userMessage || 'Default test message');
	}
}

// Handle Errors Gracefully
main().catch((error) => {
	console.error(chalk.red(`\n❌ Unexpected error: ${error.message}`));
});
