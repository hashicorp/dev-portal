/**
 * Copyright IBM Corp. 2021, 2026
 * SPDX-License-Identifier: MPL-2.0
 */

import crypto from 'node:crypto'

/** Default `service.name` resource attribute spans are reported under. */
const DEFAULT_SERVICE_NAME = 'developer.hashicorp.com'

/**
 * OTLP `SPAN_KIND_SERVER`. Reporting the span as an entry call makes Instana
 * surface it as an endpoint on the service.
 */
const SPAN_KIND_SERVER = 2

/** OTLP `STATUS_CODE_ERROR`. Instana counts spans with this status as erroneous. */
const STATUS_CODE_ERROR = 2

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
	scopeName: string
	/**
	 * Host identifier used to associate this data with a host entity in Instana.
	 * Sent as the `x-instana-host` header and the `host.id` + `host.name` resource
	 * attributes. Instana groups the resulting call under one process/host entity
	 * per distinct `host.id`, so keep it stable per source (e.g. the app vs CI).
	 * Defaults to `process.env.INSTANA_HOST_ID`, falling back to the `serviceName`.
	 */
	hostId?: string
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
 * Emits a single OTLP span (trace) to Instana over HTTP.
 *
 * The event is reported as a `SPAN_KIND_SERVER` span so that Instana surfaces it
 * as a call/endpoint (named after `name`) on the OpenTelemetry service
 * identified by `serviceName`. These calls are countable and groupable in
 * Analyze Calls / Unbounded Analytics (e.g. group by `endpoint.name`, filter by
 * span attributes), which — unlike raw OTLP metrics — reliably surfaces on this
 * Instana tenant. Providing `status` marks the call as erroneous.
 *
 * The span is POSTed to the configured `INSTANA_OTLP_ENDPOINT`, which must point
 * at the OTLP traces path (`/v1/traces`).
 *
 * This is shared between the Next.js app (e.g. recording "content not found"
 * events during static generation) and standalone contexts such as GitHub
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
	scopeName,
	hostId = process.env.INSTANA_HOST_ID ?? serviceName,
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

	// Millisecond-precision timestamp in nanoseconds. Zero-duration span: the
	// event is instantaneous, so start and end are equal.
	const timeUnixNano = (BigInt(Date.now()) * BigInt(1_000_000)).toString()
	const traceId = crypto.randomBytes(16).toString('hex')
	const spanId = crypto.randomBytes(8).toString('hex')

	const spanAttributes = Object.entries(attributes).map(([key, value]) => ({
		key,
		value: { stringValue: value },
	}))

	const span: Record<string, unknown> = {
		traceId,
		spanId,
		name,
		kind: SPAN_KIND_SERVER,
		startTimeUnixNano: timeUnixNano,
		endTimeUnixNano: timeUnixNano,
		attributes: spanAttributes,
	}
	if (status) {
		span.status = { code: STATUS_CODE_ERROR, message: status.message }
	}

	const payload = {
		resourceSpans: [
			{
				resource: {
					attributes: [
						{
							key: 'service.name',
							value: { stringValue: serviceName },
						},
						{
							key: 'host.id',
							value: { stringValue: hostId },
						},
						{
							key: 'host.name',
							value: { stringValue: hostId },
						},
					],
				},
				scopeSpans: [
					{
						scope: { name: scopeName },
						spans: [span],
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
			'x-instana-host': hostId,
		},
		body: JSON.stringify(payload),
	})
}
