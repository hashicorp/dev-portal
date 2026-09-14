/**
 * Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: MPL-2.0
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
