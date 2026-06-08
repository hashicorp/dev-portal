/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * `@hashicorp/platform-edge-utils` accesses `request.geo` which was removed
 * from `NextRequest` in Next.js 15. Re-add it via declaration merging so the
 * package continues to compile until it is updated for Next.js 15+.
 */
import type {} from 'next/server'

declare module 'next/server' {
	interface NextRequest {
		geo?: {
			city?: string
			country?: string
			region?: string
			latitude?: string
			longitude?: string
		}
	}
}
