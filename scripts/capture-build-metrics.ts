/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import fs from 'fs'
import { client, v1 } from '@datadog/datadog-api-client'

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
 * Submit build metrics to Instana OpenTelemetry endpoint
 */
const submitInstanaMetrics = async (metrics: BuildEvent[]) => {
	const payload = {
		resourceMetrics: [
			{
				resource: {
					attributes: [
						{
							key: 'service.name',
							value: {
								stringValue: metrics[0].tags.find(([key]) => {
									return key === 'app'
								})?.[1],
							},
						},
					],
				},
				scopeMetrics: [
					{
						scope: {
							name: 'capture-build-metrics',
						},
						metrics: metrics.map(({ timestamp, tags, ...event }) => {
							const unixTimeNs = (
								BigInt(timestamp ?? Math.round(Date.now() / 1e3)) *
								BigInt(1_000_000_000)
							).toString()

							return {
								name: `build.${event.name}`,
								description: 'Build event duration',
								unit: 's',
								gauge: {
									dataPoints: [
										{
											attributes: tags.map(([key, value]) => {
												return {
													key,
													value: { stringValue: value },
												}
											}),
											asDouble: Math.round(event.duration / 1e3),
											timeUnixNano: unixTimeNs,
										},
									],
								},
							}
						}),
					},
				],
			},
		],
	}
	const response = await fetch(process.env.INSTANA_OTLP_ENDPOINT!, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-instana-key': process.env.INSTANA_OTLP_API_TOKEN!,
		},
		body: JSON.stringify(payload),
	})
	if (![200, 202].includes(response.status)) {
		const responseText = await response.text()
		throw new Error(
			`Failed to submit metrics to Instana. Status: ${response.status}, Response: ${responseText}`,
		)
	}

	const tags = metrics[0].tags.map(([key, value]) => {
		return `${key}:${value}`
	})
	console.log(
		`〽️ Submitted build metrics to Instana:\n${JSON.stringify(tags, null, 2)}`,
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
