/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect, useState } from 'react'
import { ServiceStatus } from 'components/service-status-badge'

/**
 * Hook to use the StatusPage service status at a given endpoint.
 */
export function useServiceStatus(endpointUrl: string) {
	const [status, setStatus] = useState<ServiceStatus>('loading')

	useEffect(() => {
		const asyncEffect = async () => {
			setStatus(await fetchServiceStatus(endpointUrl))
		}
		asyncEffect()
	}, [endpointUrl])

	return status
}

/**
 * Fetches the service status from a given StatusPage component
 * endpoint URL. URLs are expected to be something like:
 * https://status.hashicorp.com/api/v2/components/{componentId}.json
 *
 * If the retrieved data does not match the expected shape
 */
async function fetchServiceStatus(url: string): Promise<ServiceStatus> {
	let status: ServiceStatus
	try {
		const data = (await fetchJson(url)) as ExpectedStatusPageData
		status =
			'component' in data
				? data.component?.status
				: mapPageStatus[data.status?.indicator]
		if (typeof status !== 'string') {
			throw new Error(
				`In the "useServiceStatus" hook, the status data did not match expected shape. Please ensure GET requests to the endpoint ${url} yield data with a string at "responseData.component.status".`
			)
		}
	} catch (e) {
		console.error(`Failed to parse valid status page data from ${url}.`)
		console.error(e)
		// Return 'unknown' as a fallback.
		status = 'unknown'
	}
	return status
}

/**
 * The shape of data we expect to receive from a provided `endpointUrl`.
 */
interface ExpectedComponentPageData {
	component: {
		status: ServiceStatus
	}
}
type RootPageStatusIndicator = 'none' | 'minor' | 'major' | 'critical'
interface ExpectedRootPageData {
	status: {
		indicator: RootPageStatusIndicator
	}
}
const mapPageStatus: Record<RootPageStatusIndicator, ServiceStatus> = {
	none: 'operational',
	minor: 'degraded_performance',
	major: 'major_outage',
	critical: 'major_outage',
}
type ExpectedStatusPageData = ExpectedComponentPageData | ExpectedRootPageData

/**
 * Fetch JSON data from a provided URL.
 */
async function fetchJson(url: string) {
	const response = await fetch(url)
	if (!response.ok) {
		throw new Error(
			`HTTP error when fetching from ${url}. Status: ${response.status}`
		)
	}
	return await response.json()
}
