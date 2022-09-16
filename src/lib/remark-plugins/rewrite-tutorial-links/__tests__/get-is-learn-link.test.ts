import { getIsLearnLink } from '../utils/get-is-learn-link'

const testEachCase = (testCases: [string, boolean][]) => {
	test.each(testCases)(
		'getIsLearnLink(%p) returns %p',
		(input: string, expectedOutput: boolean) => {
			expect(getIsLearnLink(input)).toBe(expectedOutput)
		}
	)
}

describe('getIsLearnLink', () => {
	describe('basic inputs', () => {
		testEachCase([
			[undefined, false],
			[null, false],
			['', false],
			['not-a-learn-link', false],
			['/', false],
			['/not-a-learn-link', false],
			['/not-a/learn-link', false],
			['/not/a/learn-link', false],
			['/not/a/learn/link', false],
			['learn.hashicorp.com', false],
			['learn.hashicorp.com/not-a-learn-link', false],
			['https://waypointproject.io/', false],
			['https://learn.hashicorp.com/', true],
			['https://learn.hashicorp.com', true],
		])
	})

	describe('product hubs', () => {
		testEachCase([
			['/boundary', true],
			['/consul', true],
			['/nomad', true],
			['/packer', true],
			['/terraform', true],
			['/vagrant', true],
			['/vault', true],
			['/waypoint', true],
			['/well-architected-framework', true],
			['/onboarding', true],
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
			['/collections/well-architected-framework/collection-slug', false],
			['/collections/onboarding/collection-slug', false],
			['/collections/boundary/collection-slug', true],
			['/collections/consul/collection-slug', true],
			['/collections/nomad/collection-slug', true],
			['/collections/packer/collection-slug', true],
			['/collections/terraform/collection-slug', true],
			['/collections/vagrant/collection-slug', true],
			['/collections/vault/collection-slug', true],
			['/collections/waypoint/collection-slug', true],
			['/collections/cloud/collection-slug', true],
		])
	})

	describe('tutorials routes', () => {
		testEachCase([
			['/tutorials', false],
			['/tutorials/not-a-learn-link', false],
			['/tutorials/not-a/learn-link', false],
			['/tutorials/not/a/learn-link', false],
			['/tutorials/not/a/learn/link', false],
			['/tutorials/well-architected-framework/tutorial-slug', false],
			['/tutorials/onboarding/tutorial-slug', false],
			['/tutorials/boundary/tutorial-slug', true],
			['/tutorials/consul/tutorial-slug', true],
			['/tutorials/nomad/tutorial-slug', true],
			['/tutorials/packer/tutorial-slug', true],
			['/tutorials/terraform/tutorial-slug', true],
			['/tutorials/vagrant/tutorial-slug', true],
			['/tutorials/vault/tutorial-slug', true],
			['/tutorials/waypoint/tutorial-slug', true],
			['/tutorials/cloud/tutorial-slug', true],
		])
	})
})
