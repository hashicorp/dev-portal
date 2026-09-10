/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */
import env from "env-var"

/**
 * Returns a fully qualified URL to the deployed app for preview deployments and the production deployment. Useful
 * if you need to build a full URL in the context of the app.
 *
 * Returns an empty string in development.
 */
export default function getDeployedUrl() {
	const HASHI_ENV = env.get('HASHI_ENV').asString()
	// preview deployments should derive the url from Vercel's env var
	if (HASHI_ENV === 'preview') {
		return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
	}

	if (HASHI_ENV === 'development') {
		const DEV_HOST_NAME = env.get('HOST_NAME').default('http://localhost:3000').asString()
		return DEV_HOST_NAME
	}

	// use our canonical URL for production
	return __config.dev_dot.canonical_base_url
}
