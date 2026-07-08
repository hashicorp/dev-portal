/**
 * Copyright IBM Corp. 2021, 2026
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * CLI wrapper around `emitOtelSpan` so OTLP spans can be emitted from a GitHub
 * Actions step (or any shell) without importing the function.
 *
 * Run with hc-tools. Note the `--` separator: hc-tools strips flags before it,
 * so everything after `--` is forwarded to this script.
 *
 *   npx hc-tools ./scripts/emit-otel-span-cli.ts -- \
 *     --span '{"name":"content not found","status":{"message":"..."}}' \
 *     --scope-name src/views/docs-view/server.ts \
 *     --service-name developer.hashicorp.com \
 *     --host-id dev-portal-ci
 *
 * Arguments mirror the parameters of `emitOtelSpan`:
 * - --span         (required) JSON for the `span` param: a single span object or
 *                  an array of span objects. Each object is
 *                  `{"name":"...","attributes":{...},"status":{"message":"..."},"durationMs":123}`
 *                  (only `name` is required).
 * - --scope-name   (required) instrumentation scope name (`scopeName`).
 * - --service-name (optional) `service.name` resource attribute (`serviceName`).
 * - --host-id      (optional) host identifier (`hostId`).
 *
 * The OTLP endpoint and token are read from the environment:
 * - INSTANA_OTLP_ENDPOINT  (required) OTLP endpoint (`endpoint`).
 * - INSTANA_OTLP_API_TOKEN (required) Instana API token (`apiToken`).
 */

import { emitOtelSpan, OtelSpanInput } from './emit-otel-span'

/** Parses `--flag value` and `--flag=value` pairs from argv. */
function parseArgs(argv: string[]): Record<string, string> {
	const args: Record<string, string> = {}
	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i]
		if (!arg.startsWith('--')) {
			continue
		}
		const equalsIndex = arg.indexOf('=')
		if (equalsIndex !== -1) {
			args[arg.slice(2, equalsIndex)] = arg.slice(equalsIndex + 1)
		} else {
			args[arg.slice(2)] = argv[++i]
		}
	}
	return args
}

async function main() {
	const args = parseArgs(process.argv.slice(2))

	const spanJson = args['span']
	if (!spanJson) {
		throw new Error('emit-otel-span-cli: --span is required')
	}
	const span = JSON.parse(spanJson) as OtelSpanInput | OtelSpanInput[]

	const scopeName = args['scope-name']
	if (!scopeName) {
		throw new Error('emit-otel-span-cli: --scope-name is required')
	}

	const response = await emitOtelSpan({
		span,
		scopeName,
		serviceName: args['service-name'],
		hostId: args['host-id'],
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
