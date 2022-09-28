import nock from 'nock'
import remark from 'remark'
import { rewriteTutorialLinksPlugin } from 'lib/remark-plugins/rewrite-tutorial-links'

/**
 * As we onboard more products into internal beta, we lose the ability
 * to test "beta" functionality using real config. So, we mock
 * get-is-beta-product in order to provide a consistent testing config.
 */
jest.mock('../../../get-is-beta-product', () => (productSlug) => {
	return ['hcp', 'vault', 'waypoint'].includes(productSlug)
})

// HELPERS ------------------------------------------------------

const slug = '[a-z0-9]+(?:[-][a-z0-9]+)*' // matches lower case letters, numbers and hyphens
const betaProductSlugs = __config.dev_dot.beta_product_slugs.join('|')
const devDotTutorialsPath = new RegExp(
	`^/(${betaProductSlugs})/tutorials/${slug}(/${slug})?$` // Matches /{beta-product}/tutorials/collection-slug/optional-tutorial-slug
)
const devDotDocsPath = new RegExp(
	`^/(${betaProductSlugs})/(docs|plugins|api-docs|commands)/?.*`
)

function isolatePathFromMarkdown(mdLink: string): string {
	// target the path within the md syntax
	// split at the ], then remove the enclosing parens from the path
	return mdLink.split(']')[1].trim().slice(1, -1)
}

// MOCK DATA -----------------------------------------------------

const TEST_MD_LINKS = {
	nonLearnLink:
		'[link to external docs](https://docs.microsoft.com/en-us/azure)',
	plainAnchor: '[plain anchor link to current tutorial](#some-heading)',
	nonBetaProductExternalUrl:
		'[link to external learn path](https://learn.hashicorp.com/tutorials/packer/kubernetes)',
	nonBetaProductTutorial:
		'[link to non-beta product tutorial](/tutorials/packer/kubernetes)',
	betaProductTutorial:
		'[link to beta product tutorial](/tutorials/waypoint/get-started-ui)',
	betaProductCollection:
		'[link to beta product collection](/collections/vault/getting-started)',
	betaProductExternalCollection:
		'[link to beta product external collection](https://learn.hashicorp.com/collections/vault/getting-started)',
	betaProductTutorialAnchorLink:
		'[link to beta product tutorial with anchor](/tutorials/vault/consul-deploy#create-a-hashicorp-virtual-network)',
	externalAnchorLink:
		'[external learn link with anchor](https://learn.hashicorp.com/tutorials/vault/consul-deploy#create-a-hashicorp-virtual-network)',
	betaProductTutorialQueryParam:
		'[link to beta product tutorial with query param](/tutorials/waypoint/get-started?in=waypoint/get-started-kubernetes)',
	betaProductTutorialQueryParamWithAnchor:
		'[link to beta product tutorial with query param](/tutorials/waypoint/get-started?in=waypoint/get-started-nomad#install-the-waypoint-server)',
	betaProductDefintionLink: '[1]: /tutorials/waypoint/get-started-ui',
	betaProductHubLink: '[link to product hub page](/vault)',
	betaProductHubExternalLink:
		'[External link to product hub page](https://learn.hashicorp.com/vault)',
	nonBetaProductHubLink: '[non beta product hub link](/vagrant)',
	nonBetaProductHubExternalLink:
		'[non beta product hub link](https://learn.hashicorp.com/vagrant)',
	errorLink: '[incorrect link](/tutorials/vault/does-not-exist)',
	searchPage: '[link to search page on Learn](/search)',
	betaProductPluginsLink:
		'[link to waypoint docs](https://www.waypointproject.io/plugins/aws-ecs)',
	betaProductDocsLink:
		'[link to waypoint docs](https://www.vaultproject.io/docs/secrets/databases/mssql)',
	betaProductDocsApiLink:
		'[link to vault api docs](https://www.vaultproject.io/api/auth/approle)',
	betaProductDocsApiLinkWithHtml:
		'[link to vault api docs](https://www.vaultproject.io/api/index.html)',
	betaProductDocsAnchorLink:
		'[link to vault api docs](https://www.vaultproject.io/api/auth/something#generate-new-secret-id)',
	betaProductDocsLinkAnchorWithHtml:
		'[link to vault api docs](https://www.vaultproject.io/api/index.html#some-anchor)',
	nonBetaProductDocsLink:
		'[non beta product docs link](https://www.vagrantup.com/docs/installation/backwards-compatibility)',
	betaProductDocsLinkNonDoc:
		'[link to vault trial](https://www.vaultproject.io/trial)',
	betaProductDocsLinkUseCases:
		'[link to vault use cases](https://www.vaultproject.io/use-cases)',
	nonBetaProductLinkWithBetaProductInTitle:
		'[boundary link with vault in tutorial title](/tutorials/boundary/oss-vault-cred-brokering-quickstart)',
	wafTutorialLink:
		'[waf link](/tutorials/well-architected-framework/cloud-operating-model)',
	onboardingCollectionLink:
		'[onboarding link](/collections/onboarding/hcp-vault-week-1)',
}

/**
 * Mocks return value from 'api/tutorials-map' endpoint
 * When adding new MD_LINK tests, make sure the path is accounted for below
 *
 * [key: database tutorial slug]: value — dev dot absolute path
 */
const MOCK_TUTORIALS_MAP = {
	'waypoint/getting-started-config':
		'/waypoint/tutorials/getting-started/getting-started-config',
	'waypoint/get-started-ui':
		'/waypoint/tutorials/getting-started/getting-started-ui',
	'vault/consul-deploy': '/vault/tutorials/consul-integration/consul-deploy',
	'waypoint/get-started': '/waypoint/tutorials/get-started-docker/get-started',
	'well-architected-framework/cloud-operating-model':
		'/well-architected-framework/com/cloud-operating-model',
	'cloud/get-started-vault': '/vault/tutorials/cloud/get-started-vault',
}

// TESTS -----------------------------------------------------------------

describe('rewriteTutorialLinks remark plugin', () => {
	beforeEach(async () => {
		// the api base url defaults to localhost when no VERCEL_URL is provided
		const scope = nock('http://localhost:3000/api/tutorials-map')
			.persist()
			.get(/.*/)
			.reply(200, MOCK_TUTORIALS_MAP)
	})

	test('Only internal Learn links are rewritten', async () => {
		const contentsWithoutPlugin = await remark().process(
			TEST_MD_LINKS.nonLearnLink
		)

		const contentsWithPlugin = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.nonLearnLink)

		expect(String(contentsWithPlugin)).toEqual(String(contentsWithoutPlugin))
	})

	test("Local anchor links aren't rewritten", async () => {
		const contents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.plainAnchor)

		const path = isolatePathFromMarkdown(String(contents))
		expect(path.startsWith('#')).toBe(true)
	})

	test('Beta product tutorial links are rewritten to dev portal paths', async () => {
		// load beta product config
		const contents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.betaProductTutorial)

		const result = String(contents)
		const path = isolatePathFromMarkdown(result)

		expect(path).toMatch(devDotTutorialsPath)
	})

	test('Non-beta product tutorial links are made external', async () => {
		const contents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.nonBetaProductTutorial)

		const result = String(contents)
		expect(result.includes('https://learn.hashicorp.com/')).toBeTruthy()
	})

	test("Non-beta product tutorial full URLs aren't rewritten", async () => {
		const contents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.nonBetaProductExternalUrl)

		const result = String(contents)
		expect(result).toMatch(TEST_MD_LINKS.nonBetaProductExternalUrl)
	})

	test('Beta product collection links are rewritten to dev portal paths', async () => {
		const contents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.betaProductCollection)

		const result = String(contents)
		const path = isolatePathFromMarkdown(result)
		expect(path).toMatch(devDotTutorialsPath)
	})

	test('Beta product external collection links are rewritten to relative dev portal paths', async () => {
		const contents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.betaProductExternalCollection)

		const result = String(contents)
		const path = isolatePathFromMarkdown(result)
		expect(path).toMatch(devDotTutorialsPath)
	})

	test('Anchor links are rewritten properly', async () => {
		const contents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.betaProductTutorialAnchorLink)

		const externalLinkContents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.externalAnchorLink)

		const path = isolatePathFromMarkdown(String(contents))
		const externalLinkPath = isolatePathFromMarkdown(
			String(externalLinkContents)
		)

		const anchorLinkPath = new RegExp(
			`^/(${betaProductSlugs})/tutorials/${slug}(/${slug})#`
		)

		expect(path).toMatch(anchorLinkPath)
		expect(externalLinkPath).toMatch(anchorLinkPath)
	})

	test('Query params are rewritten properly', async () => {
		const contents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.betaProductTutorialQueryParam)

		const queryParamCollectionSlug = /get-started-kubernetes/

		expect(String(contents)).toMatch(queryParamCollectionSlug)
	})

	test('Query params with an anchor link are rewritten properly', async () => {
		const contents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.betaProductTutorialQueryParamWithAnchor)

		const queryParamSlugWithAnchor = new RegExp(`get-started-nomad/${slug}#`)

		expect(String(contents)).toMatch(queryParamSlugWithAnchor)
	})

	test('Incorrect link does not throw, only logs the error message', async () => {
		const getContents = async () =>
			await remark()
				.use(rewriteTutorialLinksPlugin)
				.process(TEST_MD_LINKS.errorLink)
		expect(getContents).not.toThrowError()
	})

	test('Definition link is rewritten', async () => {
		const contents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.betaProductDefintionLink)

		const path = String(contents).split(':')[1].trim()
		expect(path).toMatch(devDotTutorialsPath)
	})

	test('Search page on learn is made external', async () => {
		const contents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.searchPage)

		expect(String(contents)).toMatch(/(learn.hashicorp.com)?\/search/)
	})

	test('Beta-product hub pages should be rewritten to dev portal', async () => {
		const interalLinkContents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.betaProductHubLink)
		const internalPath = isolatePathFromMarkdown(String(interalLinkContents))
		const externalLinkContents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.betaProductHubExternalLink)
		const externalPath = isolatePathFromMarkdown(String(externalLinkContents))
		const productHub = /^\/vault\/tutorials$/

		expect(internalPath).toMatch(productHub)
		expect(externalPath).toMatch(productHub)
	})

	test('Beta-product docs links are rewritten to dev portal', async () => {
		const docsLinkContents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.betaProductDocsLink)
		const pluginLinkContents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.betaProductPluginsLink)

		const pluginLinkPath = isolatePathFromMarkdown(String(pluginLinkContents))
		const docsLinkPath = isolatePathFromMarkdown(String(docsLinkContents))

		expect(pluginLinkPath).toMatch(devDotDocsPath)
		expect(docsLinkPath).toMatch(devDotDocsPath)
	})

	test('Beta-product api links are rewritten to api-docs', async () => {
		const contents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.betaProductDocsApiLink)

		const path = isolatePathFromMarkdown(String(contents))
		expect(path).toMatch(devDotDocsPath)
	})

	test('Beta product docs link .html reference should be removed', async () => {
		const contents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.betaProductDocsApiLinkWithHtml)

		const path = isolatePathFromMarkdown(String(contents))

		expect(path.includes('.html')).toBe(false)
		expect(path).toMatch(/(?!(.*\.html))\/vault\/api/)
	})

	test('Beta-product docs link with anchor are rewritten properly', async () => {
		const basicAnchorContents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.betaProductDocsAnchorLink)

		const anchorWithHtmlContents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.betaProductDocsLinkAnchorWithHtml)

		const basicAnchorPath = isolatePathFromMarkdown(String(basicAnchorContents))
		const anchorWithHtmlPath = isolatePathFromMarkdown(
			String(anchorWithHtmlContents)
		)
		const anchorLinkPath = new RegExp(`#${slug}$`)

		expect(basicAnchorPath).toMatch(anchorLinkPath)
		expect(anchorWithHtmlPath.includes('.html')).toBe(false)
		expect(anchorWithHtmlPath).toMatch(anchorLinkPath)
	})

	test('Non-beta product docs links are not rewritten', async () => {
		const contents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.nonBetaProductDocsLink)

		expect(String(contents)).toMatch(TEST_MD_LINKS.nonBetaProductDocsLink)
	})

	test('Beta product /trial path is not rewritten', async () => {
		const contents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.betaProductDocsLinkNonDoc)
		expect(String(contents)).toMatch(TEST_MD_LINKS.betaProductDocsLinkNonDoc)
	})

	test('Beta product usecase path is not rewritten', async () => {
		const contents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.betaProductDocsLinkUseCases)

		expect(String(contents)).toMatch(TEST_MD_LINKS.betaProductDocsLinkUseCases)
	})

	test('Beta product should only be determined by product dir, not tutorial name', async () => {
		const contents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.nonBetaProductLinkWithBetaProductInTitle)

		const basePath = isolatePathFromMarkdown(
			TEST_MD_LINKS.nonBetaProductLinkWithBetaProductInTitle
		)
		const finalPath = 'https://learn.hashicorp.com' + basePath

		expect(isolatePathFromMarkdown(String(contents))).toBe(finalPath)
	})

	test('Waf link should be rewritten properly', async () => {
		const contents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.wafTutorialLink)
		const newPath = isolatePathFromMarkdown(String(contents))

		expect(newPath).toBe(
			'/well-architected-framework/com/cloud-operating-model'
		)
	})

	test('Onboarding link should be rewritten properly', async () => {
		const contents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.onboardingCollectionLink)
		const newPath = isolatePathFromMarkdown(String(contents))

		expect(newPath).toBe('/onboarding/hcp-vault-week-1')
	})
})
