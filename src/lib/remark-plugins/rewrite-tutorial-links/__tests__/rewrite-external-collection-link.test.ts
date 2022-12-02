import { ProductSlug } from 'types/products'
import { rewriteExternalCollectionLink } from '../utils'

const getTestURLObject = (url: string) => {
	return new URL(url, 'https://learn.hashicorp.com/')
}

const testEachCase = (cases: string[][]) => {
	test.each(cases)(
		'rewriteExternalCollectionLink(%p) returns %p',
		(input: string, expectedOutput: string) => {
			expect(rewriteExternalCollectionLink(getTestURLObject(input))).toBe(
				expectedOutput
			)
		}
	)
}

describe('rewriteExternalCollectionLink', () => {
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
		])('%p as `pathname` throws an error', (input: string) => {
			expect(() =>
				rewriteExternalCollectionLink(getTestURLObject(input))
			).toThrow()
		})
	})

	describe('when neither `search` nor `hash` are present', () => {
		testEachCase([
			[
				'/collections/vault/getting-started',
				'/vault/tutorials/getting-started',
			],
			['/collections/waypoint/deploy-aws', '/waypoint/tutorials/deploy-aws'],
			[
				'/collections/consul/cloud-get-started',
				'/consul/tutorials/cloud-get-started',
			],
			[
				'/collections/onboarding/hcp-vault-week-1',
				'/onboarding/hcp-vault-week-1',
			],
			[
				'/collections/well-architected-framework/com',
				'/well-architected-framework/com',
			],
			['/collections/cloud/networking', '/hcp/tutorials/networking'],
			['/collections/hcp/networking', '/hcp/tutorials/networking'],
		])
	})

	describe('when `search` is present, and `hash` is NOT present', () => {
		testEachCase([
			[
				'/collections/vault/getting-started?paramA=valueA',
				'/vault/tutorials/getting-started?paramA=valueA',
			],
			[
				'/collections/waypoint/deploy-aws?paramA=valueA',
				'/waypoint/tutorials/deploy-aws?paramA=valueA',
			],
			[
				'/collections/consul/cloud-get-started?paramA=valueA',
				'/consul/tutorials/cloud-get-started?paramA=valueA',
			],
			[
				'/collections/onboarding/hcp-vault-week-1?paramA=valueA',
				'/onboarding/hcp-vault-week-1?paramA=valueA',
			],
			[
				'/collections/well-architected-framework/com?paramA=valueA',
				'/well-architected-framework/com?paramA=valueA',
			],
			[
				'/collections/cloud/networking?paramA=valueA',
				'/hcp/tutorials/networking?paramA=valueA',
			],
			[
				'/collections/hcp/networking?paramA=valueA',
				'/hcp/tutorials/networking?paramA=valueA',
			],
		])
	})

	describe('when `search` is NOT present, and `hash` is present', () => {
		testEachCase([
			[
				'/collections/vault/getting-started#test-hash',
				'/vault/tutorials/getting-started#test-hash',
			],
			[
				'/collections/waypoint/deploy-aws#test-hash',
				'/waypoint/tutorials/deploy-aws#test-hash',
			],
			[
				'/collections/consul/cloud-get-started#test-hash',
				'/consul/tutorials/cloud-get-started#test-hash',
			],
			[
				'/collections/onboarding/hcp-vault-week-1#test-hash',
				'/onboarding/hcp-vault-week-1#test-hash',
			],
			[
				'/collections/well-architected-framework/com#test-hash',
				'/well-architected-framework/com#test-hash',
			],
			[
				'/collections/cloud/networking#test-hash',
				'/hcp/tutorials/networking#test-hash',
			],
			[
				'/collections/hcp/networking#test-hash',
				'/hcp/tutorials/networking#test-hash',
			],
		])
	})

	describe('when both `search` and `hash` are present', () => {
		testEachCase([
			[
				'/collections/vault/getting-started?paramA=valueA#test-hash',
				'/vault/tutorials/getting-started?paramA=valueA#test-hash',
			],
			[
				'/collections/waypoint/deploy-aws?paramA=valueA#test-hash',
				'/waypoint/tutorials/deploy-aws?paramA=valueA#test-hash',
			],
			[
				'/collections/consul/cloud-get-started?paramA=valueA#test-hash',
				'/consul/tutorials/cloud-get-started?paramA=valueA#test-hash',
			],
			[
				'/collections/onboarding/hcp-vault-week-1?paramA=valueA#test-hash',
				'/onboarding/hcp-vault-week-1?paramA=valueA#test-hash',
			],
			[
				'/collections/well-architected-framework/com?paramA=valueA#test-hash',
				'/well-architected-framework/com?paramA=valueA#test-hash',
			],
			[
				'/collections/cloud/networking?paramA=valueA#test-hash',
				'/hcp/tutorials/networking?paramA=valueA#test-hash',
			],
			[
				'/collections/hcp/networking?paramA=valueA#test-hash',
				'/hcp/tutorials/networking?paramA=valueA#test-hash',
			],
		])
	})
})
