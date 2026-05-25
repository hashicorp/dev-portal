/**
 * Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: MPL-2.0
 */

import { registerOTel } from '@vercel/otel'

export function register() {
	registerOTel({ serviceName: 'developer.hashicorp.com' })
}
