const BOT_COMMANDS = [{ command: 'start', description: 'تسجيل' }];

dotenv.config({ path: './.dev.vars' });

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
	console.error('Error: BOT_TOKEN is not set in the environment.');
	process.exit(1);
}

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function setCommands() {
	const response = await fetch(`${TELEGRAM_API}/setMyCommands`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ commands: BOT_COMMANDS }),
	});

	if (response.ok) {
		console.log('Bot commands updated successfully');
	} else {
		const error = await response.json();
		console.error('Failed to update bot commands:', error);
	}
}

setCommands().catch((err) => console.error('Error setting commands:', err));
