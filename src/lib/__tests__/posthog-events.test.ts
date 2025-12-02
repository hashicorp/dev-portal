/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { trackSandboxEvent, SANDBOX_EVENT } from '../posthog-events'

// Mock posthog
const mockCapture = vi.fn()
vi.mock('posthog-js', () => ({
	default: {
		capture: (...args: unknown[]) => mockCapture(...args),
	},
}))

describe('trackSandboxEvent', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should track sandbox_open with full instruqt path', () => {
		const fullLabId =
			'hashicorp-learn/tracks/terraform-sandbox?token=em_test123'

		trackSandboxEvent(SANDBOX_EVENT.SANDBOX_OPEN, {
			labId: fullLabId,
			page: '/terraform/sandbox',
		})

		expect(mockCapture).toHaveBeenCalledWith('sandbox_open', {
			labId: fullLabId,
			page: '/terraform/sandbox',
		})
	})

	it('should preserve full instruqt path with query parameters', () => {
		const fullLabId =
			'hashicorp-learn/tracks/boundary-sandbox?token=em_YHsmJu4K1Wk3hwht'

		trackSandboxEvent(SANDBOX_EVENT.SANDBOX_OPEN, {
			labId: fullLabId,
			page: '/boundary/sandbox',
		})

		expect(mockCapture).toHaveBeenCalledWith('sandbox_open', {
			labId: fullLabId,
			page: '/boundary/sandbox',
		})
	})

	it('should track sandbox_open without modifying the labId', () => {
		trackSandboxEvent(SANDBOX_EVENT.SANDBOX_OPEN, {
			labId: 'hashicorp-learn/tracks/nomad-sandbox',
			page: '/nomad/sandbox',
		})

		expect(mockCapture).toHaveBeenCalledTimes(1)
		expect(mockCapture).toHaveBeenCalledWith(
			'sandbox_open',
			expect.objectContaining({
				labId: 'hashicorp-learn/tracks/nomad-sandbox',
			})
		)
	})
})
