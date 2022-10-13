import { getIsExternalLearnLink } from '../utils/get-is-external-learn-link'

const testEachCase = (testCases: [string, boolean][]) => {
	test.each(testCases)(
		'getIsExternalLearnLink(%p) returns %p',
		(input: string, expectedOutput: boolean) => {
			expect(getIsExternalLearnLink(input)).toBe(expectedOutput)
		}
	)
}

describe('getIsExternalLearnLink', () => {
	describe('basic inputs', () => {
		testEachCase([
			[undefined, false],
			[null, false],
			['', false],
			['not-a-learn-link', false],
			['/', false],
			// TODO - rewrite to /tutorials/library soon?
			['/search', false],
			['/not-a-learn-link', false],
			['/not-a/learn-link', false],
			['/not/a/learn-link', false],
			['/not/a/learn/link', false],
			['learn.hashicorp.com', false],
			['learn.hashicorp.com/not-a-learn-link', false],
			['https://waypointproject.io/', false],
			['https://learn.hashicorp.com/', false],
			['https://learn.hashicorp.com', false],
			// TODO - rewrite to /tutorials/library soon?
			['https://learn.hashicorp.com/search', false],
		])
	})

	describe('product hubs', () => {
		testEachCase([
			['/onboarding', false],
			['/boundary', true],
			['/consul', true],
			['/nomad', true],
			['/packer', true],
			['/terraform', true],
			['/vagrant', true],
			['/vault', true],
			['/waypoint', true],
			['/well-architected-framework', true],
			['/cloud', true],
		])
	})

	describe('collections routes', () => {
		testEachCase([
			['/collections', false],
			['/collections/not-a-learn-link', false],
			['/collections/not-a/learn-link', false],
			['/collections/not/a/learn-link', false],
			['/collections/not/a/learn/link', false],
			['/collections/hcp/collection-slug', false],
			['/collections/boundary/collection-slug', true],
			['/collections/consul/collection-slug', true],
			['/collections/nomad/collection-slug', true],
			['/collections/packer/collection-slug', true],
			['/collections/terraform/collection-slug', true],
			['/collections/vagrant/collection-slug', true],
			['/collections/vault/collection-slug', true],
			['/collections/waypoint/collection-slug', true],
			['/collections/well-architected-framework/collection-slug', true],
			['/collections/onboarding/collection-slug', true],
			['/collections/cloud/collection-slug', true],
		])
	})

	describe('tutorials routes', () => {
		const testCases: [string, boolean][] = [
			['/tutorials', false],
			['/tutorials/not-a-learn-link', false],
			['/tutorials/not-a/learn-link', false],
			['/tutorials/not/a/learn-link', false],
			['/tutorials/not/a/learn/link', false],
			['/tutorials/hcp/tutorial-slug', false],
			['/tutorials/boundary/tutorial-slug', true],
			['/tutorials/consul/tutorial-slug', true],
			['/tutorials/nomad/tutorial-slug', true],
			['/tutorials/packer/tutorial-slug', true],
			['/tutorials/terraform/tutorial-slug', true],
			['/tutorials/vagrant/tutorial-slug', true],
			['/tutorials/vault/tutorial-slug', true],
			['/tutorials/waypoint/tutorial-slug', true],
			['/tutorials/well-architected-framework/tutorial-slug', true],
			['/tutorials/onboarding/tutorial-slug', true],
			['/tutorials/cloud/tutorial-slug', true],
		]

		describe('without the `in` query param', () => {
			testEachCase(testCases)
		})

		describe('with the `in` query param', () => {
			testEachCase(
				testCases.map(([input, expectedOutput]: [string, boolean]) => {
					return [`${input}?in=collection/slug`, expectedOutput]
				})
			)
		})
	})

	describe('links already in the DevDot format', () => {
		testEachCase([
			['/waypoint/tutorials', false],
			['/waypoint/tutorials/collection-slug', false],
			['/waypoint/tutorials/collection-slug/tutorial-slug', false],
			['/well-architected-framework/collection-slug', false],
			['/well-architected-framework/collection-slug/tutorial-slug', false],
			['/onboarding/collection-slug', false],
			['/onboarding/collection-slug/tutorial-slug', false],
			['/hcp/tutorials/collection-slug', false],
			['/hcp/tutorials/collection-slug/tutorial-slug', false],
		])
	})
})
