/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductSlug } from 'types/products'
import { Version } from './fetch-release-data'

/**
 * A segment analytics plugin to log out calls to track in a structured way. Includes the full event payload
 * in a collapsed console group for further inspection, without interaction the event name and event properties
 * are visible.
 */
const AnalyticsPluginEventLogger = {
	name: 'Event Logger',
	version: '0.1.0',
	type: 'after',
	track: (ctx) => {
		console.groupCollapsed(
			'%ctrack',
			'color:white;background:green;border-radius:4px;padding:2px 4px;',
			ctx.event.event,
			ctx.event.properties
		)
		console.log(ctx.event)
		console.groupEnd()

		return ctx
	},
	load: () => Promise.resolve(),
	isLoaded: () => true,
}

/**
 * Register the event logger plugin for track event logging during development.
 */
export const makeDevAnalyticsLogger = () => {
	if (
		process.env.NODE_ENV !== 'production' &&
		typeof window !== 'undefined' &&
		process.env.NEXT_PUBLIC_ANALYTICS_LOG_LEVEL !== '0'
	) {
		try {
			window.analytics.ready(() => {
				window.analytics.register(AnalyticsPluginEventLogger)
			})
		} catch {
			// do nothing, not critical
		}
	}
}

/**
 * Determines whether or not `window.analytics.track` can be invoked.
 */
export const canTrackAnalytics = (): boolean => {
	return (
		window?.analytics?.track &&
		typeof window.analytics.track === 'function'
	)
}

/**
 * Invokes `window.analytics.track` if it is able to be invoked.
 */
const safeAnalyticsTrack = (
	eventName: string,
	properties: Record<string, unknown>
): void => {
	if (canTrackAnalytics()) {
		window.analytics.track(eventName, properties)
	}
}

/**
 * Determines whether or not `window.analytics.user` can be invoked.
 */
export const canAnalyzeUser = (): boolean => {
	return (
		window?.analytics?.user &&
		typeof window.analytics.user === 'function'
	)
}

export function safeGetSegmentAnonymousId(): string | null {
	if (canAnalyzeUser()) {
		return window.analytics.user().anonymousId()
	} else {
		return null
	}
}

export function safeGetSegmentId(): string | null {
	if (canAnalyzeUser()) {
		return window.analytics.user().id()
	} else {
		return null
	}
}

/**
 * Handles tracking the Download event in the same format it was tracked
 * previously on .io sites (excluding the `category` and `label` properties).
 *
 * Important notes:
 *  - Properties are defined in `analytics/spec/events/product_downloaded.yaml`
 *  - `prettyOSName` examples: "macOS", "Windows", "Linux", "FreeBSD", "NetBSD",
 *    "OpenBSD", "Solaris"
 *  - `architecture` will have it's first character capitalized automatically
 *
 * Based off `@hashicorp/react-product-downloads-page`'s `trackDownload`:
 * https://github.com/hashicorp/react-components/blob/d6eba7971bbbf7c58cf3cc110f5b7b423e3cd27c/packages/product-download-page/utils/downloader.ts#L115-L134
 */
const trackProductDownload = ({
	architecture,
	prettyOSName,
	productSlug,
	version,
}: {
	architecture: string
	prettyOSName: string
	productSlug: Exclude<ProductSlug, 'hcp'>
	version: Version
}) => {
	// Ensure the `architecture` property has the correct casing
	const lowercasedArchitectureName = architecture.toLowerCase()
	const casedArchitectureName =
		lowercasedArchitectureName.charAt(0).toUpperCase() +
		lowercasedArchitectureName.slice(1)

	// Track the Download event
	safeAnalyticsTrack('Download', {
		architecture: casedArchitectureName,
		operating_system: prettyOSName,
		product: productSlug,
		version,
	})
}

export { safeAnalyticsTrack, trackProductDownload }
