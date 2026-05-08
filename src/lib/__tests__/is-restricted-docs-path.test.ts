/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { describe, expect, it } from 'vitest'
import { isRestrictedDocsPath } from '../is-restricted-docs-path'

describe('isRestrictedDocsPath', () => {
	it('matches unversioned restricted Vault docs paths', () => {
		expect(isRestrictedDocsPath('/vault/docs/restricted')).toBe(true)
		expect(isRestrictedDocsPath('/vault/docs/restricted/secrets')).toBe(true)
	})

	it('matches versioned restricted Vault docs paths', () => {
		expect(isRestrictedDocsPath('/vault/docs/v1.21.x/restricted')).toBe(true)
		expect(isRestrictedDocsPath('/vault/docs/v1.21.x/restricted/secrets')).toBe(
			true
		)
	})

	it('matches full URL forms of restricted Vault docs paths', () => {
		expect(
			isRestrictedDocsPath(
				'https://developer.hashicorp.com/vault/docs/restricted/secrets'
			)
		).toBe(true)
		expect(
			isRestrictedDocsPath(
				'https://developer.hashicorp.com/vault/docs/v1.21.x/restricted/secrets'
			)
		).toBe(true)
	})

	it('does not match non-restricted or non-Vault docs paths', () => {
		expect(isRestrictedDocsPath('/vault/docs/secrets/kv')).toBe(false)
		expect(isRestrictedDocsPath('/vault/api-docs/restricted')).toBe(false)
		expect(isRestrictedDocsPath('/consul/docs/restricted')).toBe(false)
		expect(isRestrictedDocsPath('/vault/docs/not-a-version/restricted')).toBe(false)
	})
})