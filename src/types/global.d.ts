/// <reference types="@cloudflare/workers-types" />

declare global {
	export type Response = import('undici').Response;
}
