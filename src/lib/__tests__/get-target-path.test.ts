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

	it.each([
		[
			{
				basePath: 'terraform/enterprise',
				asPath: '/terraform/enterprise/v202208-3/releases/2022/v202208-2',
				version: 'v202208-2',
			},
			'/terraform/enterprise/v202208-2/releases/2022/v202208-2',
		],
		[
			{
				basePath: 'terraform/enterprise',
				asPath: '/terraform/enterprise/releases/2022/v202208-2',
				version: 'v202208-2',
			},
			'/terraform/enterprise/v202208-2/releases/2022/v202208-2',
		],
	])(
		'should handle additional TFE versions in release notes URLs',
		(arg, expected) => {
			const target = getTargetPath(arg)
			expect(target).toEqual(expected)
		}
	)

	it('should handle versions without a "v" prefix', () => {
		const input = {
			basePath: 'consul/docs',
			asPath: '/consul/docs/k8s/connect',
			version: '1.15.x',
		}
		const target = getTargetPath(input)
		expect(target).toEqual('/consul/docs/1.15.x/k8s/connect')
	})

	it('should handle short versions', () => {
		const input = {
			basePath: 'vault/docs',
			asPath: '/vault/docs/secrets/kv',
			version: 'v2.x',
		}
		const target = getTargetPath(input)
		expect(target).toEqual('/vault/docs/v2.x/secrets/kv')
	})

	describe('with 3-segment basePath (terraform/plugin/framework)', () => {
		it('should return a target path while on "latest"', () => {
			const input = {
				basePath: 'terraform/plugin/framework',
				asPath: '/terraform/plugin/framework/resources',
				version: 'v1.15.x',
			}
			const target = getTargetPath(input)
			expect(target).toEqual('/terraform/plugin/framework/v1.15.x/resources')
		})

		it('should return a target path while on an older version', () => {
			const input = {
				basePath: 'terraform/plugin/framework',
				asPath: '/terraform/plugin/framework/v1.15.x/resources',
				version: 'v1.16.x',
			}
			const target = getTargetPath(input)
			expect(target).toEqual('/terraform/plugin/framework/v1.16.x/resources')
		})

		it('should handle nested paths with version switching', () => {
			const input = {
				basePath: 'terraform/plugin/framework',
				asPath: '/terraform/plugin/framework/v1.15.x/functions/returns/number',
				version: 'v1.16.x',
			}
			const target = getTargetPath(input)
			expect(target).toEqual('/terraform/plugin/framework/v1.16.x/functions/returns/number')
		})

		it('should handle root path version switching', () => {
			const input = {
				basePath: 'terraform/plugin/framework',
				asPath: '/terraform/plugin/framework',
				version: 'v1.15.x',
			}
			const target = getTargetPath(input)
			expect(target).toEqual('/terraform/plugin/framework/v1.15.x')
		})

		it('should handle getting-started paths', () => {
			const input = {
				basePath: 'terraform/plugin/framework',
				asPath: '/terraform/plugin/framework/getting-started/code-walkthrough',
				version: 'v1.15.x',
			}
			const target = getTargetPath(input)
			expect(target).toEqual('/terraform/plugin/framework/v1.15.x/getting-started/code-walkthrough')
		})
	})
})
