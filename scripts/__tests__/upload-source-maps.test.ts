/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const execSyncMock = vi.fn()

vi.mock('child_process', () => ({
	default: {
		execSync: execSyncMock,
	},
	execSync: execSyncMock,
}))

const runUploader = async () => {
	vi.resetModules()
	await import('../upload-source-maps')
}

describe('upload-source-maps', () => {
	const originalEnv = process.env

	beforeEach(() => {
		process.env = { ...originalEnv }
		vi.spyOn(console, 'log').mockImplementation(() => undefined)
		vi.spyOn(console, 'error').mockImplementation(() => undefined)
	})

	afterEach(() => {
		process.env = originalEnv
		vi.restoreAllMocks()
	})

	it("doesn't log the Datadog API key when upload fails", async () => {
		const key = 'test-dd-api-key-123'

		process.env.DD_API_KEY = key
		process.env.VERCEL_ENV = 'preview'
		process.env.VERCEL_GIT_COMMIT_SHA = 'commit-sha'
		process.env.VERCEL_BRANCH_URL = 'branch.example.com'

		execSyncMock
			.mockImplementationOnce(() => {
				throw new Error(
					`Command failed: DATADOG_API_KEY=${key} npx @datadog/datadog-ci sourcemaps upload`
				)
			})
			.mockImplementationOnce(() => Buffer.from(''))

		await runUploader()

		const errorOutput = vi
			.mocked(console.error)
			.mock.calls.flat()
			.map((entry) => String(entry))
			.join(' ')

		const logOutput = vi
			.mocked(console.log)
			.mock.calls.flat()
			.map((entry) => String(entry))
			.join(' ')

		expect(errorOutput).not.toContain(key)
		expect(logOutput).not.toContain(key)
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})
})
