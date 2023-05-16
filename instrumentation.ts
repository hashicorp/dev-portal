import { registerOTel } from '@vercel/otel'

export function register() {
	console.log('does this work?')
	registerOTel('next-app')
}

register()
