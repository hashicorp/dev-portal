/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { rewriteExternalTutorialLink } from '../utils'

describe('rewriteExternalTutorialLink', () => {
	let errorSpy

	beforeAll(() => {
		errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
	})

	afterAll(() => {
		errorSpy.mockRestore()
	})

	const TEST_TUTORIAL_SLUG = 'vault/tutorial'
	const MOCK_TUTORIAL_MAP = {
		'vault/tutorial': '/vault/tutorials/collection/tutorial',
		'cloud/amazon-peering-hcp': '/hcp/tutorials/networking/amazon-peering-hcp',
		'well-architected-framework/tutorial':
			'/well-architected-framework/collection/tutorial',
		'validated-patterns/tutorial': '/validated-patterns/collection/tutorial',
	}

	const testEachCase = (cases: string[][]) => {
		test.each(cases)(
			'rewriteExternalTutorialLink(%p) returns %p',
			(input: string, expectedOutput: string) => {
				expect(
					rewriteExternalTutorialLink(
						new URL(input, 'https://learn.hashicorp.com'),
						MOCK_TUTORIAL_MAP
					)
				).toBe(expectedOutput)
			}
		)
	}

	describe('when the input is invalid', () => {
		test.each([
			'',
			'/',
			'invalid-input',
			'still/invalid',
			'also/invalid/',
			'/super/invalid',
			'another/invalid/input',
			'/almost/valid/input',
			'/one/more/invalid/input',
		])('rewriteExternalTutorialLink(%p) throws an error', (input: string) => {
			expect(() =>
				rewriteExternalTutorialLink(
					new URL(input, __config.dev_dot.canonical_base_url),
					{}
				)
			).toThrow()
		})
	})

	describe('when neither `search` nor `hash` are present', () => {
		test('throws an error for unknown product slugs', () => {
			expect(() =>
				rewriteExternalTutorialLink(
					new URL('/tutorials/not-a-beta-product/tutorial', 'https://learn.hashicorp.com'),
					MOCK_TUTORIAL_MAP
				)
			).toThrow('Unrecognized incoming Tutorials slug "not-a-beta-product" in normalizeSlugForDevDot.')
		})
		testEachCase([
			['/tutorials/vault/tutorial', `${MOCK_TUTORIAL_MAP['vault/tutorial']}`],
			[
				'/tutorials/well-architected-framework/tutorial',
				MOCK_TUTORIAL_MAP['well-architected-framework/tutorial'],
			],
			[
				'/tutorials/validated-patterns/tutorial',
				MOCK_TUTORIAL_MAP['validated-patterns/tutorial'],
			],
			['/tutorials/vault/tutorial-does-not-exist', undefined],
			[
				'/tutorials/cloud/amazon-peering-hcp',
				'/hcp/tutorials/networking/amazon-peering-hcp',
			],
			[
				'/tutorials/hcp/amazon-peering-hcp',
				'/hcp/tutorials/networking/amazon-peering-hcp',
			],
		])
	})

	describe('when `search` is present, and `hash` is NOT present', () => {
		testEachCase([
			[
				'/tutorials/waypoint/tutorial?in=vault/collection',
				'/vault/tutorials/collection/tutorial',
			],
			[
				'/tutorials/waypoint/tutorial?paramA=valueA&in=vault/collection',
				'/vault/tutorials/collection/tutorial?paramA=valueA',
			],
			[
				'/tutorials/waypoint/tutorial?paramA=valueA&in=vault/collection&paramB=valueB',
				'/vault/tutorials/collection/tutorial?paramA=valueA&paramB=valueB',
			],
			[
				'/tutorials/cloud/amazon-peering-hcp?in=cloud/consul-cloud&paramA=valueA',
				'/hcp/tutorials/consul-cloud/amazon-peering-hcp?paramA=valueA',
			],
			[
				'/tutorials/hcp/amazon-peering-hcp?in=cloud/consul-cloud&paramA=valueA',
				'/hcp/tutorials/consul-cloud/amazon-peering-hcp?paramA=valueA',
			],
		])
	})

	describe('when `search` is NOT present, and `hash` is present', () => {
		testEachCase([
			[
				`/tutorials/${TEST_TUTORIAL_SLUG}#test-hash`,
				`${MOCK_TUTORIAL_MAP[TEST_TUTORIAL_SLUG]}#test-hash`,
			],
			['/tutorials/vault/does-not-exist#test-hash', undefined],
		])
	})

	describe('when both `search` and `hash` are present', () => {
		testEachCase([
			[
				'/tutorials/waypoint/tutorial?in=vault/collection#test-hash',
				'/vault/tutorials/collection/tutorial#test-hash',
			],
			[
				'/tutorials/waypoint/tutorial?paramA=valueA&in=vault/collection#test-hash',
				'/vault/tutorials/collection/tutorial?paramA=valueA#test-hash',
			],
			[
				'/tutorials/waypoint/tutorial?paramA=valueA&in=vault/collection&paramB=valueB#test-hash',
				'/vault/tutorials/collection/tutorial?paramA=valueA&paramB=valueB#test-hash',
			],
		])
	})
})
