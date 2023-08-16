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
		async function updateStatusData() {
			setStatus(await fetchServiceStatus(endpointUrl))
		}
		updateStatusData()
	}, [endpointUrl])

	return status
}

/**
 * Fetches the service status from a given StatusPage component
 * endpoint URL. URLs are expected to be something like:
 * https://status.hashicorp.com/api/v2/components/{componentId}.json
 */
async function fetchServiceStatus(url: string): Promise<ServiceStatus> {
	let status: ServiceStatus = 'unknown'
	try {
		const data = await fetchJson(url)
		status = data?.component?.status ?? 'unknown'
	} catch (e) {
		console.error(`Failed to parse status page data from ${url}.`)
		console.error(e)
	}
	return status
}

/**
 * Fetch JSOn data from a provided URL.
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
