export function formatErrorResponse(error: Error): Response {
	const errorResponse = {
		message: 'Internal Server Error',
		details: error.message,
		timestamp: new Date().toISOString(),
	};
	console.error('Unhandled Error:', error);
	return new Response(JSON.stringify(errorResponse), {
		status: 500,
		headers: { 'Content-Type': 'application/json' },
	});
}
