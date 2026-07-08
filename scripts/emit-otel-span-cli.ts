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
 * Configuration is read from environment variables, mirroring the parameters of
 * `emitOtelSpan`:
 * - SPAN               (required) JSON for the `span` param: either a single
 *                      span object or an array of span objects. Each object is
 *                      `{"name":"...","attributes":{...},"status":{"message":"..."},"durationMs":123}`
 *                      (only `name` is required).
 * - SPAN_SCOPE_NAME    (required) instrumentation scope name (`scopeName`).
 * - SPAN_SERVICE_NAME  (optional) `service.name` resource attribute (`serviceName`).
 * - SPAN_HOST_ID       (optional) host identifier (`hostId`), sent as the
 *                      `x-instana-host` header and `host.id`/`host.name` attrs.
 *                      Defaults to INSTANA_HOST_ID, then serviceName.
 * - INSTANA_OTLP_ENDPOINT  (required) OTLP endpoint (`endpoint`).
 * - INSTANA_OTLP_API_TOKEN (required) Instana API token (`apiToken`).
 */

import { emitOtelSpan, OtelSpanInput } from './emit-otel-span'

async function main() {
	const spanJson = process.env.SPAN
	if (!spanJson) {
		throw new Error('emit-otel-span-cli: SPAN is required')
	}
	const span = JSON.parse(spanJson) as OtelSpanInput | OtelSpanInput[]

	const scopeName = process.env.SPAN_SCOPE_NAME
	if (!scopeName) {
		throw new Error('emit-otel-span-cli: SPAN_SCOPE_NAME is required')
	}

	const response = await emitOtelSpan({
		span,
		scopeName,
		serviceName: process.env.SPAN_SERVICE_NAME,
		hostId: process.env.SPAN_HOST_ID,
	})

	if (!response.ok) {
		throw new Error(
			`emit-otel-span-cli: OTLP endpoint responded ${response.status} ${response.statusText}`,
		)
	}

	const names = (Array.isArray(span) ? span : [span]).map((s) => s.name)
	console.log(`emit-otel-span-cli: emitted span(s) ${JSON.stringify(names)}`)
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})
