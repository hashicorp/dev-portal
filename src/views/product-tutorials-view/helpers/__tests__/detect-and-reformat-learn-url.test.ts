import nock from 'nock'
import detectAndReformatLearnUrl from '../detect-and-reformat-learn-url'

/**
 * Mocks return value from 'api/tutorials-map' endpoint.
 * Maps tutorial slugs to tutorial URLs which include the default collection.
 * When adding new test cases, make sure the path is accounted for below
 *
 * [key: database tutorial slug]: value — dev dot absolute path
 */
const MOCK_TUTORIALS_MAP = {
	'consul/gossip-encryption-secure':
		'/consul/tutorials/gossip-encryption-secure',
	'waypoint/aws-ecs': '/waypoint/tutorials/deploy-aws/aws-ecs',
	'vault/getting-started-install':
		'/vault/tutorials/getting-started/getting-started-install',
}

/**
 * As we onboard more products into internal beta, we lose the ability
 * to test "beta" functionality using real config. So, we mock
 * get-is-beta-product in order to provide a consistent testing config.
 */
jest.mock('lib/get-is-beta-product', () => (productSlug) => {
	return ['consul', 'vault', 'waypoint'].includes(productSlug)
})

describe('detectAndReformatLearnUrl', () => {
	beforeEach(async () => {
		// the api base url defaults to localhost when no VERCEL_URL is provided
		const scope = nock('http://localhost:3000/api/tutorials-map')
			.persist()
			.get(/.*/)
			.reply(200, MOCK_TUTORIALS_MAP)
	})

	it('returns .io URLs with unsupported base paths unmodified', async () => {
		const nonDocsIoUrls: string[] = [
			'https://cloud.hashicorp.com/pricing',
			'https://cloud.hashicorp.com/products/terraform',
			'https://www.vagrantup.com/community',
			'https://www.vaultproject.io/community',
			'https://www.waypointproject.io/community',
		]
		for (let n = 0; n < nonDocsIoUrls.length; n++) {
			const url = nonDocsIoUrls[n]
			const result = await detectAndReformatLearnUrl(url)
			expect(result).toBe(url)
		}
	})

	it('returns non Learn or Docs URLs back unmodified', async () => {
		const absoluteUrls: string[] = [
			'https://www.hashicorp.com',
			'https://portal.cloud.hashicorp.com',
			'https://developer.hashicorp.com/',
		]
		for (let n = 0; n < absoluteUrls.length; n++) {
			const url = absoluteUrls[n]
			const result = await detectAndReformatLearnUrl(url)
			expect(result).toBe(url)
		}
	})

	it('returns non-Learn URLs back unmodified', async () => {
		const nonLearnUrls: string[] = [
			'/vault/docs',
			'/vault/tutorials',
			'/waypoint/tutorials',
		]
		for (let n = 0; n < nonLearnUrls.length; n++) {
			const url = nonLearnUrls[n]
			const result = await detectAndReformatLearnUrl(url)
			expect(result).toBe(url)
		}
	})

	it('reformats product hub URLs', async () => {
		interface UrlTestCase {
			input: string
			expected: string
		}
		const hubPageUrls: UrlTestCase[] = [
			{
				input: '/waypoint',
				expected: '/waypoint/tutorials',
			},
			{
				input: '/vault',
				expected: '/vault/tutorials',
			},
			// Note: underlying rewriteTutorialsLink() handles beta products
			{
				input: '/packer',
				expected: 'https://learn.hashicorp.com/packer',
			},
			{
				input: '/cloud',
				expected: 'https://learn.hashicorp.com/cloud',
			},
		]
		for (let n = 0; n < hubPageUrls.length; n++) {
			const { input, expected } = hubPageUrls[n]
			const result = await detectAndReformatLearnUrl(input)
			expect(result).toBe(expected)
		}
	})

	it('reformats collection URLs', async () => {
		interface UrlTestCase {
			input: string
			expected: string
		}
		const collectionUrls: UrlTestCase[] = [
			{
				input: '/collections/vault/getting-started',
				expected: '/vault/tutorials/getting-started',
			},
			{
				input: '/collections/waypoint/deploy-aws',
				expected: '/waypoint/tutorials/deploy-aws',
			},
			// Note: underlying rewriteTutorialsLink() handles beta products
			{
				input: '/collections/packer/kubernetes',
				expected: 'https://learn.hashicorp.com/collections/packer/kubernetes',
			},
		]
		for (let n = 0; n < collectionUrls.length; n++) {
			const { input, expected } = collectionUrls[n]
			const result = await detectAndReformatLearnUrl(input)
			expect(result).toBe(expected)
		}
	})

	it('reformats tutorial URLs', async () => {
		interface UrlTestCase {
			input: string
			expected: string
		}
		const tutorialUrls: UrlTestCase[] = [
			{
				input: '/tutorials/vault/getting-started-install',
				expected: '/vault/tutorials/getting-started/getting-started-install',
			},
			{
				input:
					'/tutorials/vault/getting-started-install?in=vault/getting-started',
				expected: '/vault/tutorials/getting-started/getting-started-install',
			},
			{
				input:
					'/tutorials/vault/getting-started-install?in=vault/getting-started-ui',
				expected: '/vault/tutorials/getting-started-ui/getting-started-install',
			},
			{
				input:
					'/tutorials/vault/getting-started-install?in=vault/getting-started-ui&utm_source=docs',
				expected:
					'/vault/tutorials/getting-started-ui/getting-started-install?utm_source=docs',
			},
			{
				input:
					'/tutorials/vault/getting-started-install?utm_source=docs&in=vault/getting-started-ui',
				expected:
					'/vault/tutorials/getting-started-ui/getting-started-install?utm_source=docs',
			},
			{
				input:
					'/tutorials/vault/getting-started-install?in=vault/getting-started-ui#test-anchor-hash',
				expected:
					'/vault/tutorials/getting-started-ui/getting-started-install#test-anchor-hash',
			},
			{
				input: '/tutorials/waypoint/aws-ecs?in=waypoint/deploy-aws',
				expected: '/waypoint/tutorials/deploy-aws/aws-ecs',
			},
			{
				input: '/tutorials/waypoint/aws-ecs',
				expected: '/waypoint/tutorials/deploy-aws/aws-ecs',
			},
			{
				input:
					'/tutorials/consul/gossip-encryption-secure?utm_source=consul.io&utm_medium=docs',
				expected:
					'/consul/tutorials/gossip-encryption-secure?utm_source=consul.io&utm_medium=docs',
			},
			{
				input: '/tutorials/cloud/vault-ops?in=vault/cloud',
				expected: '/vault/tutorials/cloud/vault-ops',
			},
			{
				input: '/tutorials/cloud/amazon-peering-hcp',
				expected:
					'https://learn.hashicorp.com/tutorials/cloud/amazon-peering-hcp',
			},
			{
				input: '/tutorials/vault/vault-ops?in=cloud/networking',
				expected:
					'https://learn.hashicorp.com/tutorials/vault/vault-ops?in=cloud/networking',
			},
			{
				input: '/tutorials/vault/vault-ops?in=packer/networking',
				expected:
					'https://learn.hashicorp.com/tutorials/vault/vault-ops?in=packer/networking',
			},
		]
		for (let n = 0; n < tutorialUrls.length; n++) {
			const { input, expected } = tutorialUrls[n]
			const result = await detectAndReformatLearnUrl(input)
			expect(result).toBe(expected)
		}
	})
})
