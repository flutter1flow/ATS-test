/**
 * Formats a standardized error response for unhandled errors.
 * @param error - The error object to format into the response.
 * @returns A Response object containing error details in JSON format.
 */
export function formatErrorResponse(error: Error): Response {
	// Construct the error response object
	const errorResponse = {
		message: 'Internal Server Error',
		details: error.message,
		timestamp: new Date().toISOString(),
	};

	// Log the error for debugging and monitoring
	console.error('Unhandled Error:', error);

	// Return the response with appropriate headers and status code
	return new Response(JSON.stringify(errorResponse), {
		status: 500,
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'no-store', // Ensures no caching of error responses
		},
	});
}
