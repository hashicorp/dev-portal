/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import fs from 'fs'
import { client, v1 } from '@datadog/datadog-api-client'
import { emitOtelSpan } from './emit-otel-span'

const TRACE_FILE_PATH = './.next/trace'
const EVENTS = [
	'next-build',
	'run-webpack-compiler',
	'static-generation',
	'next-export',
]

interface BuildEvent {
	name: string
	duration: number
	timestamp?: number
	tags: [string, string][]
}

async function readNextTrace(cwd: string) {
	const filepath = path.join(cwd, TRACE_FILE_PATH)

	const content = await fs.promises.readFile(filepath, { encoding: 'utf-8' })

	// The trace file consists of multiple JSON arrays separated by newlines
	// This gives us an array of un-parsed JSON arrays
	const parts = content.trim().split('\n')

	// Parse the arrays from the trace and flatten the full array, giving us a flat list of events
	return parts.map((part) => JSON.parse(part)).flat()
}

/**
 * Submit build metrics to Datadog
 */
const submitDatadogMetrics = async (metrics: BuildEvent[]) => {
	const configuration = client.createConfiguration()
	const api = new v1.MetricsApi(configuration)

	// Send metrics to Datadog API
	await api.submitMetrics({
		body: {
			// Convert the build events into a format Datadog understands
			series: metrics.map(({ timestamp, tags, ...event }) => {
				return {
					host: '',
					metric: `build.${event.name}`,
					points: [
						[
							timestamp ?? Math.round(Date.now() / 1e3),
							Math.round(event.duration / 1e3),
						],
					],
					tags: tags.map(([key, value]) => {
						return `${key}:${value}`
					}),
					type: 'gauge',
				}
			}),
		},
	})
	const tags = metrics[0].tags.map(([key, value]) => {
		return `${key}:${value}`
	})
	console.log(
		`〽️ Submitted build metrics to Datadog:\n${JSON.stringify(tags, null, 2)}`,
	)
}

/**
 * Submit build metrics to Instana as OpenTelemetry spans.
 *
 * Raw OTLP metrics don't reliably surface on our Instana tenant, so each build
 * event is reported as a span (via `emitOtelSpan`) whose duration reflects the
 * build event duration. These appear as calls (named `build.<event>`) on the
 * app's service and can be charted in Analyze Calls.
 */
const submitInstanaMetrics = async (metrics: BuildEvent[]) => {
	const response = await emitOtelSpan({
		scopeName: 'capture-build-metrics',
		span: metrics.map(({ name, duration, tags }) => {
			return {
				name: `build.${name}`,
				attributes: Object.fromEntries(tags),
				// Next.js trace durations are in microseconds; convert to milliseconds
				// so Instana renders the build duration as the call's latency.
				durationMs: duration / 1e3,
			}
		}),
	})

	if (!response.ok) {
		const responseText = await response.text()
		throw new Error(
			`Failed to submit build spans to Instana. Status: ${response.status}, Response: ${responseText}`,
		)
	}

	const tags = metrics[0].tags.map(([key, value]) => {
		return `${key}:${value}`
	})
	console.log(
		`〽️ Submitted build spans to Instana:\n${JSON.stringify(tags, null, 2)}`,
	)
}

async function main() {
	if (!process.env.CI || process.env.DEV_IO) {
		return
	}

	const [, , appName = 'dev-portal'] = process.argv

	try {
		// It's important that this remains a constant variable rather than
		// being incorporated into the `.map()` call as we don't want it to be
		// re-evaluated for each run through the loop. We want it to remain fixed
		const timestamp = Math.round(Date.now() / 1e3)
		const trace = await readNextTrace(process.cwd())

		const environment = process.env.HASHI_ENV ?? 'local'

		const filteredEvents: BuildEvent[] = trace
			.filter((event) => EVENTS.includes(event.name))
			.map((event) => {
				return {
					...event,
					tags: [
						['app', appName],
						['environment', environment],
					] as [string, string][],
					timestamp,
				}
			})

		const results = await Promise.allSettled([
			submitDatadogMetrics(filteredEvents),
			submitInstanaMetrics(filteredEvents),
		])

		const failedSubmissions = results
			.filter(({ status }) => {
				return status === 'rejected'
			})
			.map((result) => {
				return (result as PromiseRejectedResult).reason
			})
		if (failedSubmissions.length > 0) {
			throw new AggregateError(failedSubmissions)
		}
	} catch (error) {
		// Swallow errors
		// we don't want to impact the build or make it seem like there's been
		// an error in the actual app if something goes wrong when sending metrics
		if (process.env.NODE_ENV === 'development' || process.env.CI) {
			throw error
		}
	}
}

main()
