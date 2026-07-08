/**
 * Copyright IBM Corp. 2021, 2026
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * CLI wrapper around `emitOtelSpan` so a single OTLP span can be emitted from
 * a GitHub Actions step (or any shell) without importing the function.
 *
 * Run with hc-tools, matching the other scripts in this repo:
 *
 *   npx hc-tools ./scripts/emit-otel-span-cli.ts
 *
 * Configuration is read from environment variables:
 * - SPAN_NAME          (required) span name, e.g. "content not found"
 * - SPAN_STATUS_MESSAGE (optional) if set, marks the span as an error
 * - SPAN_SCOPE_NAME    (optional) instrumentation scope name
 * - SPAN_SERVICE_NAME  (optional) service.name resource attribute
 * - SPAN_HOST_ID       (optional) host identifier, sent as the `x-instana-host`
 *                      header and `host.id` resource attribute. Instana needs
 *                      this to attach agentless data to a host entity so it is
 *                      queryable. Defaults to INSTANA_HOST_ID, then serviceName.
 * - SPAN_ATTRIBUTES    (optional) JSON object of string attributes, e.g.
 *                      '{"content.path":"/vault/docs","product.slug":"vault"}'
 * - INSTANA_OTLP_ENDPOINT  (required) OTLP endpoint
 * - INSTANA_OTLP_API_TOKEN (required) Instana API token
 */

import { emitOtelSpan } from './emit-otel-span'

async function main() {
	const name = process.env.SPAN_NAME
	if (!name) {
		throw new Error('emit-otel-span-cli: SPAN_NAME is required')
	}

	let attributes: Record<string, string> | undefined
	if (process.env.SPAN_ATTRIBUTES) {
		attributes = JSON.parse(process.env.SPAN_ATTRIBUTES)
	}

	const statusMessage = process.env.SPAN_STATUS_MESSAGE

	const response = await emitOtelSpan({
		name,
		attributes,
		status: statusMessage ? { message: statusMessage } : undefined,
		scopeName: process.env.SPAN_SCOPE_NAME,
		serviceName: process.env.SPAN_SERVICE_NAME,
		hostId: process.env.SPAN_HOST_ID,
	})

	if (!response.ok) {
		throw new Error(
			`emit-otel-span-cli: OTLP endpoint responded ${response.status} ${response.statusText}`,
		)
	}

	console.log(`emit-otel-span-cli: emitted span "${name}"`)
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})
