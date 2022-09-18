import { SectionOption } from 'lib/learn-client/types'
import { handleTutorialLink } from '../utils'

const TEST_TUTORIAL_SLUG = 'product/tutorial'
const MOCK_TUTORIAL_MAP = {
	'product/tutorial': '/product/tutorials/collection/tutorial',
}

const testEachCase = (cases: string[][]) => {
	test.each(cases)(
		'handleTutorialLink(%p) returns %p',
		(input: string, expectedOutput: string) => {
			expect(
				handleTutorialLink(
					new URL(input, __config.dev_dot.canonical_base_url),
					MOCK_TUTORIAL_MAP
				)
			).toBe(expectedOutput)
		}
	)
}

describe('handleTutorialLink', () => {
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
		])('handleTutorialLink(%p) throws an error', (input: string) => {
			expect(() =>
				handleTutorialLink(
					new URL(input, __config.dev_dot.canonical_base_url),
					{}
				)
			).toThrow()
		})
	})

	describe('when neither `search` nor `hash` are present', () => {
		testEachCase([
			[
				`/tutorials/${TEST_TUTORIAL_SLUG}`,
				`${MOCK_TUTORIAL_MAP[TEST_TUTORIAL_SLUG]}`,
			],
			['/tutorials/product/does-not-exist', undefined],
		])
	})

	describe('when `search` is present, and `hash` is NOT present', () => {
		testEachCase([
			[
				'/tutorials/productA/tutorial?in=productB/collection',
				'/productA/tutorials/collection/tutorial',
			],
			[
				'/tutorials/productA/tutorial?paramA=valueA&in=productB/collection',
				'/productA/tutorials/collection/tutorial?paramA=valueA',
			],
			[
				'/tutorials/productA/tutorial?paramA=valueA&in=productB/collection&paramB=valueB',
				'/productA/tutorials/collection/tutorial?paramA=valueA&paramB=valueB',
			],
			[
				`/tutorials/${SectionOption.onboarding}/tutorial?in=productB/collection`,
				`/${SectionOption.onboarding}/collection/tutorial`,
			],
			[
				`/tutorials/${SectionOption.onboarding}/tutorial?paramA=valueA&in=productB/collection`,
				`/${SectionOption.onboarding}/collection/tutorial?paramA=valueA`,
			],
			[
				`/tutorials/${SectionOption.onboarding}/tutorial?paramA=valueA&in=productB/collection&paramB=valueB`,
				`/${SectionOption.onboarding}/collection/tutorial?paramA=valueA&paramB=valueB`,
			],
		])
	})

	describe('when `search` is NOT present, and `hash` is present', () => {
		testEachCase([
			[
				`/tutorials/${TEST_TUTORIAL_SLUG}#test-hash`,
				`${MOCK_TUTORIAL_MAP[TEST_TUTORIAL_SLUG]}#test-hash`,
			],
			['/tutorials/product/does-not-exist#test-hash', undefined],
		])
	})

	describe('when both `search` and `hash` are present', () => {
		testEachCase([
			[
				'/tutorials/productA/tutorial?in=productB/collection#test-hash',
				'/productA/tutorials/collection/tutorial#test-hash',
			],
			[
				'/tutorials/productA/tutorial?paramA=valueA&in=productB/collection#test-hash',
				'/productA/tutorials/collection/tutorial?paramA=valueA#test-hash',
			],
			[
				'/tutorials/productA/tutorial?paramA=valueA&in=productB/collection&paramB=valueB#test-hash',
				'/productA/tutorials/collection/tutorial?paramA=valueA&paramB=valueB#test-hash',
			],
		])
	})
})
