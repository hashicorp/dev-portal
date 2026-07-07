/**
 * Copyright IBM Corp. 2021, 2026
 * SPDX-License-Identifier: MPL-2.0
 */

import crypto from 'node:crypto'

/**
 * OTLP span status codes.
 * @see https://opentelemetry.io/docs/specs/otel/trace/api/#set-status
 */
const STATUS_CODE_UNSET = 0
const STATUS_CODE_ERROR = 2

/**
 * OTLP span kinds.
 * @see https://opentelemetry.io/docs/specs/otel/trace/api/#spankind
 */
const SPAN_KIND_INTERNAL = 1

/** Default `service.name` resource attribute spans are reported under. */
const DEFAULT_SERVICE_NAME = 'developer.hashicorp.com'

/** Default instrumentation scope name. */
const DEFAULT_SCOPE_NAME = 'docs-view'

export interface EmitOtelSpanOptions {
	/** Name of the span, e.g. "content not found". */
	name: string
	/**
	 * Key/value attributes attached to the span. Values are sent as OTLP
	 * `stringValue` attributes.
	 */
	attributes?: Record<string, string>
	/**
	 * Status of the span. Defaults to an unset (ok) status. Provide a `message`
	 * to mark the span as an error.
	 */
	status?: { message: string }
	/**
	 * The `service.name` resource attribute the span is reported under.
	 * Defaults to `developer.hashicorp.com`.
	 */
	serviceName?: string
	/** The instrumentation scope name. Defaults to `docs-view`. */
	scopeName?: string
	/**
	 * The Instana OTLP endpoint to POST the span to.
	 * Defaults to `process.env.INSTANA_OTLP_ENDPOINT`.
	 */
	endpoint?: string
	/**
	 * The Instana OTLP API token.
	 * Defaults to `process.env.INSTANA_OTLP_API_TOKEN`.
	 */
	apiToken?: string
}

/**
 * Emits a single OTLP span to Instana over HTTP.
 *
 * This is shared between the Next.js app (e.g. recording "content not found"
 * spans during static generation) and standalone contexts such as GitHub
 * Actions workflows.
 *
 * The returned promise resolves with the `fetch` response so callers can await
 * delivery when running in short-lived environments like CI. In fire-and-forget
 * contexts the promise can be ignored.
 */
export function emitOtelSpan({
	name,
	attributes = {},
	status,
	serviceName = DEFAULT_SERVICE_NAME,
	scopeName = DEFAULT_SCOPE_NAME,
	endpoint = process.env.INSTANA_OTLP_ENDPOINT,
	apiToken = process.env.INSTANA_OTLP_API_TOKEN,
}: EmitOtelSpanOptions): Promise<Response> {
	if (!endpoint) {
		return Promise.reject(
			new Error(
				'emitOtelSpan: missing OTLP endpoint (set INSTANA_OTLP_ENDPOINT or pass `endpoint`)',
			),
		)
	}
	if (!apiToken) {
		return Promise.reject(
			new Error(
				'emitOtelSpan: missing OTLP API token (set INSTANA_OTLP_API_TOKEN or pass `apiToken`)',
			),
		)
	}

	const nowNs = (BigInt(Date.now()) * BigInt(1_000_000)).toString()
	const traceId = crypto.randomBytes(16).toString('hex')
	const spanId = crypto.randomBytes(8).toString('hex')

	const payload = {
		resourceSpans: [
			{
				resource: {
					attributes: [
						{
							key: 'service.name',
							value: { stringValue: serviceName },
						},
					],
				},
				scopeSpans: [
					{
						scope: { name: scopeName },
						spans: [
							{
								traceId,
								spanId,
								name,
								kind: SPAN_KIND_INTERNAL,
								startTimeUnixNano: nowNs,
								endTimeUnixNano: nowNs,
								attributes: Object.entries(attributes).map(([key, value]) => ({
									key,
									value: { stringValue: value },
								})),
								status: status
									? { code: STATUS_CODE_ERROR, message: status.message }
									: { code: STATUS_CODE_UNSET },
							},
						],
					},
				],
			},
		],
	}

	return fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-instana-key': apiToken,
		},
		body: JSON.stringify(payload),
	})
}
