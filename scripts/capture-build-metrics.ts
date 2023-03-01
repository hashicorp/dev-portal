/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import fs from 'fs'
import { client, v1 } from '@datadog/datadog-api-client'

const configuration = client.createConfiguration()
const api = new v1.MetricsApi(configuration)

const TRACE_FILE_PATH = './.next/trace'
const EVENTS = [
	'next-build',
	'run-webpack-compiler',
	'static-generation',
	'next-export',
]

async function readNextTrace(cwd: string) {
	const filepath = path.join(cwd, TRACE_FILE_PATH)

	const content = await fs.promises.readFile(filepath, { encoding: 'utf-8' })

	// The trace file consists of multiple JSON arrays separated by newlines
	// This gives us an array of un-parsed JSON arrays
	const parts = content.trim().split('\n')

	// Parse the arrays from the trace and flatten the full array, giving us a flat list of events
	return parts.map((part) => JSON.parse(part)).flat()
}

function captureMetric({
	name,
	duration,
	timestamp,
	tags,
}: {
	name: string
	duration: number
	timestamp?: number
	tags?: string[]
}): v1.Series {
	return {
		host: '',
		metric: name,
		points: [[timestamp ?? Math.round(Date.now() / 1e3), duration]],
		tags,
		type: 'gauge',
	}
}

async function main() {
	if (!process.env.CI || process.env.DEV_IO) {
		return
	}

	const [, , appName] = process.argv

	try {
		const timestamp = Math.round(Date.now() / 1e3)
		const trace = await readNextTrace(process.cwd())

		const filteredEvents = trace.filter((event) => EVENTS.includes(event.name))

		const structuredMetrics = filteredEvents.map((event) =>
			captureMetric({
				name: `build.${event.name}`,
				duration: Math.round(event.duration / 1e3),
				timestamp,
				tags: [`app:${appName}`, `environment:${process.env.HASHI_ENV}`],
			})
		)

		await api.submitMetrics({
			body: {
				series: structuredMetrics,
			},
		})
	} catch (error) {
		// Swallow errors here, we don't want to impact the build or make it seem like there's been an error in the actual app
		// if something goes wrong when sending metrics
	}
}

main()
