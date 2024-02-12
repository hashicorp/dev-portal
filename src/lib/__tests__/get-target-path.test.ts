/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getTargetPath } from '../get-target-path'

describe('getTargetPath', () => {
	describe('with a nested path', () => {
		it('should return a target path while on "latest"', () => {
			const input = {
				basePath: 'vault/docs',
				asPath: '/vault/docs/secrets/kv',
				version: 'v1.9.x',
			}

			const target = getTargetPath(input)
			expect(target).toEqual('/vault/docs/v1.9.x/secrets/kv')
		})

		it('should return a target path while on an older version', () => {
			const input = {
				basePath: 'vault/docs',
				asPath: '/vault/docs/v1.9.x/secrets/kv',
				version: 'v1.10.x',
			}
			const target = getTargetPath(input)
			expect(target).toEqual('/vault/docs/v1.10.x/secrets/kv')
		})
	})

	describe('with a non-nested path', () => {
		it('should return a target path while on "latest"', () => {
			const input = {
				basePath: 'vault/docs',
				asPath: '/vault/docs',
				version: 'v1.10.x',
			}
			const target = getTargetPath(input)
			expect(target).toEqual('/vault/docs/v1.10.x')
		})

		it('should return a target path while on an older version', () => {
			const input = {
				basePath: 'vault/docs',
				asPath: '/vault/docs/v1.8.x',
				version: 'v1.10.x',
			}
			const target = getTargetPath(input)
			expect(target).toEqual('/vault/docs/v1.10.x')
		})
	})

	it('should update the year to match the version on TFE release path', () => {
		const input = {
			basePath: 'terraform/enterprise',
			asPath: '/terraform/enterprise/v202312-1/releases/2023/v202312-1',
			version: 'v202207-1',
		}
		const target = getTargetPath(input)
		expect(target).toEqual(
			'/terraform/enterprise/v202207-1/releases/2022/v202207-1'
		)
	})

	it('should not change other path segments when the version is changed', () => {
		const input = {
			basePath: 'terraform/enterprise',
			asPath: '/terraform/enterprise/v202207-1/registry/publish-modules',
			version: 'v202312-1',
		}
		const target = getTargetPath(input)
		expect(target).toEqual(
			'/terraform/enterprise/v202312-1/registry/publish-modules'
		)
	})

	it('should handle adding the version when it is missing from the release page path', () => {
		const input = {
			basePath: 'terraform/enterprise',
			asPath: '/terraform/enterprise/releases/2022/v202208-2',
			version: 'v202401-1',
		}
		const target = getTargetPath(input)
		expect(target).toEqual(
			'/terraform/enterprise/v202401-1/releases/2024/v202401-1'
		)
	})

	it('should add the version for a TFE release page when changing from latest to older version', () => {
		const input = {
			basePath: 'terraform/enterprise',
			asPath: '/terraform/enterprise/releases',
			version: 'v202208-2',
		}
		const target = getTargetPath(input)
		expect(target).toEqual(
			'/terraform/enterprise/v202208-2/releases/2022/v202208-2'
		)
	})
})
