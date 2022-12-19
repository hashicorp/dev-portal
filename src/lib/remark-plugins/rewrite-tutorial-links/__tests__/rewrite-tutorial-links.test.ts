import nock from 'nock'
import remark from 'remark'
import { rewriteTutorialLinksPlugin } from 'lib/remark-plugins/rewrite-tutorial-links'
import { productSlugs } from 'lib/products'

// HELPERS ------------------------------------------------------

const slug = '[a-z0-9]+(?:[-][a-z0-9]+)*' // matches lower case letters, numbers and hyphens
const devDotTutorialsPath = new RegExp(
	`^/(${productSlugs.join('|')})/tutorials/${slug}(/${slug})?$` // Matches /{product}/tutorials/collection-slug/optional-tutorial-slug
)
const devDotDocsPath = new RegExp(
	`^/(${productSlugs.join('|')})/(docs|plugins|api-docs|commands)/?.*`
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
	productTutorial:
		'[link to product tutorial](/tutorials/waypoint/get-started-ui)',
	productCollection:
		'[link to product collection](/collections/vault/getting-started)',
	productExternalCollection:
		'[link to product external collection](https://learn.hashicorp.com/collections/vault/getting-started)',
	productTutorialAnchorLink:
		'[link to product tutorial with anchor](/tutorials/vault/consul-deploy#create-a-hashicorp-virtual-network)',
	externalAnchorLink:
		'[external learn link with anchor](https://learn.hashicorp.com/tutorials/vault/consul-deploy#create-a-hashicorp-virtual-network)',
	productTutorialQueryParam:
		'[link to product tutorial with query param](/tutorials/waypoint/get-started?in=waypoint/get-started-kubernetes)',
	productTutorialQueryParamWithAnchor:
		'[link to product tutorial with query param](/tutorials/waypoint/get-started?in=waypoint/get-started-nomad#install-the-waypoint-server)',
	productDefintionLink: '[1]: /tutorials/waypoint/get-started-ui',
	productHubLink: '[link to product hub page](/vault)',
	productHubExternalLink:
		'[External link to product hub page](https://learn.hashicorp.com/vault)',
	errorLink: '[incorrect link](/tutorials/vault/does-not-exist)',
	searchPage: '[link to search page on Learn](/search)',
	productPluginsLink:
		'[link to waypoint docs](https://www.waypointproject.io/plugins/aws-ecs)',
	productDocsLink:
		'[link to waypoint docs](https://www.vaultproject.io/docs/secrets/databases/mssql)',
	productDocsApiLink:
		'[link to vault api docs](https://www.vaultproject.io/api/auth/approle)',
	productDocsApiLinkWithHtml:
		'[link to vault api docs](https://www.vaultproject.io/api/index.html)',
	productDocsAnchorLink:
		'[link to vault api docs](https://www.vaultproject.io/api/auth/something#generate-new-secret-id)',
	productDocsLinkAnchorWithHtml:
		'[link to vault api docs](https://www.vaultproject.io/api/index.html#some-anchor)',
	productDocsLinkNonDoc:
		'[link to vault trial](https://www.vaultproject.io/trial)',
	productDocsLinkUseCases:
		'[link to vault use cases](https://www.vaultproject.io/use-cases)',
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

	test('Product tutorial links are rewritten to dev portal paths', async () => {
		const contents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.productTutorial)

		const result = String(contents)
		const path = isolatePathFromMarkdown(result)

		expect(path).toMatch(devDotTutorialsPath)
	})

	test('Product collection links are rewritten to dev portal paths', async () => {
		const contents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.productCollection)

		const result = String(contents)
		const path = isolatePathFromMarkdown(result)
		expect(path).toMatch(devDotTutorialsPath)
	})

	test('Product external collection links are rewritten to relative dev portal paths', async () => {
		const contents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.productExternalCollection)

		const result = String(contents)
		const path = isolatePathFromMarkdown(result)
		expect(path).toMatch(devDotTutorialsPath)
	})

	test('Anchor links are rewritten properly', async () => {
		const contents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.productTutorialAnchorLink)

		const externalLinkContents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.externalAnchorLink)

		const path = isolatePathFromMarkdown(String(contents))
		const externalLinkPath = isolatePathFromMarkdown(
			String(externalLinkContents)
		)

		const anchorLinkPath = new RegExp(
			`^/(${productSlugs.join('|')})/tutorials/${slug}(/${slug})#`
		)

		expect(path).toMatch(anchorLinkPath)
		expect(externalLinkPath).toMatch(anchorLinkPath)
	})

	test('Query params are rewritten properly', async () => {
		const contents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.productTutorialQueryParam)

		const queryParamCollectionSlug = /get-started-kubernetes/

		expect(String(contents)).toMatch(queryParamCollectionSlug)
	})

	test('Query params with an anchor link are rewritten properly', async () => {
		const contents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.productTutorialQueryParamWithAnchor)

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
			.process(TEST_MD_LINKS.productDefintionLink)

		const path = String(contents).split(':')[1].trim()
		expect(path).toMatch(devDotTutorialsPath)
	})

	test('Search page on learn is made external', async () => {
		const contents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.searchPage)

		expect(String(contents)).toMatch(/(learn.hashicorp.com)?\/search/)
	})

	test('Product hub pages should be rewritten to dev portal', async () => {
		const interalLinkContents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.productHubLink)
		const internalPath = isolatePathFromMarkdown(String(interalLinkContents))
		const externalLinkContents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.productHubExternalLink)
		const externalPath = isolatePathFromMarkdown(String(externalLinkContents))
		const productHub = /^\/vault\/tutorials$/

		expect(internalPath).toMatch(productHub)
		expect(externalPath).toMatch(productHub)
	})

	test('Product docs links are rewritten to dev portal', async () => {
		const docsLinkContents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.productDocsLink)
		const pluginLinkContents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.productPluginsLink)

		const pluginLinkPath = isolatePathFromMarkdown(String(pluginLinkContents))
		const docsLinkPath = isolatePathFromMarkdown(String(docsLinkContents))

		expect(pluginLinkPath).toMatch(devDotDocsPath)
		expect(docsLinkPath).toMatch(devDotDocsPath)
	})

	test('Product api links are rewritten to api-docs', async () => {
		const contents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.productDocsApiLink)

		const path = isolatePathFromMarkdown(String(contents))
		expect(path).toMatch(devDotDocsPath)
	})

	test('Product docs link .html reference should be removed', async () => {
		const contents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.productDocsApiLinkWithHtml)

		const path = isolatePathFromMarkdown(String(contents))

		expect(path.includes('.html')).toBe(false)
		expect(path).toMatch(/(?!(.*\.html))\/vault\/api/)
	})

	test('Product docs link with anchor are rewritten properly', async () => {
		const basicAnchorContents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.productDocsAnchorLink)

		const anchorWithHtmlContents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.productDocsLinkAnchorWithHtml)

		const basicAnchorPath = isolatePathFromMarkdown(String(basicAnchorContents))
		const anchorWithHtmlPath = isolatePathFromMarkdown(
			String(anchorWithHtmlContents)
		)
		const anchorLinkPath = new RegExp(`#${slug}$`)

		expect(basicAnchorPath).toMatch(anchorLinkPath)
		expect(anchorWithHtmlPath.includes('.html')).toBe(false)
		expect(anchorWithHtmlPath).toMatch(anchorLinkPath)
	})

	test('Product /trial path is not rewritten', async () => {
		const contents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.productDocsLinkNonDoc)
		expect(String(contents)).toMatch(TEST_MD_LINKS.productDocsLinkNonDoc)
	})

	test('Product usecase path is not rewritten', async () => {
		const contents = await remark()
			.use(rewriteTutorialLinksPlugin)
			.process(TEST_MD_LINKS.productDocsLinkUseCases)

		expect(String(contents)).toMatch(TEST_MD_LINKS.productDocsLinkUseCases)
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
