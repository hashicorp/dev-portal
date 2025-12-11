/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { registerOTel } from '@vercel/otel'

export function register() {
	registerOTel({ serviceName: 'developer.hashicorp.com' })
}
