import nock from 'nock'
import remark from 'remark'
import { rewriteTutorialLinksPlugin } from 'lib/remark-plugins/rewrite-tutorial-links'

// Note: Mock `@vercel/fetch` during jest tests to avoid the following test-only error:
// > thrown: “Exceeded timeout of 5000 ms for a test.
jest.mock('@vercel/fetch', () => () => require('node-fetch'))

// HELPERS ------------------------------------------------------

// Matches the pattern /{beta-product}/tutorials/collection-slug/optional-tutorial-slug
const slug = '[a-z0-9]+(?:[-][a-z0-9]+)*' // matches lower case letters, numbers and hyphens
const betaProductSlugs = __config.dev_dot.beta_product_slugs.join('|')
const devDotTutorialsPath = new RegExp(
  `^/(${betaProductSlugs})/tutorials/${slug}(/${slug})?$`
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
  nonBetaProductExternalUrl:
    '[link to external learn path](https://learn.hashicorp.com/tutorials/consul/get-started)',
  nonBetaProductTutorial:
    '[link to non-beta product tutorial](/tutorials/consul/get-started)',
  betaProductTutorial:
    '[link to beta product tutorial](/tutorials/waypoint/get-started-ui)',
  betaProductCollection:
    '[link to beta product collection](/collections/vault/getting-started)',
  betaProductExternalCollection:
    '[link to beta product external collection](https://learn.hashicorp.com/collections/vault/getting-started)',
  betaProductTutorialAnchorLink:
    '[link to beta product tutorial with anchor](/tutorials/vault/consul-deploy#create-a-hashicorp-virtual-network)',
  betaProductTutorialQueryParam:
    '[link to beta product tutorial with query param](/tutorials/waypoint/get-started?in=waypoint/get-started-kubernetes)',
  betaProductTutorialQueryParamWithAnchor:
    '[link to beta product tutorial with query param](/tutorials/waypoint/get-started?in=waypoint/get-started-nomad#install-the-waypoint-server)',
  errorLink: '[incorrect link](/tutorials/vault/does-not-exist)',
}

// [key: database tutorial slug]: value — dev dot absolute path
// When adding new MD_LINK tests, make sure the path is accounted for below
const MOCK_TUTORIALS_MAP = {
  'waypoint/getting-started-config':
    '/waypoint/tutorials/getting-started/getting-started-config',
  'waypoint/get-started-ui':
    '/waypoint/tutorials/getting-started/getting-started-ui',
  'vault/consul-deploy': '/vault/tutorials/consul-integration/consul-deploy',
  'waypoint/get-started': '/waypoint/tutorials/get-started-docker/get-started',
}

// TESTS -----------------------------------------------------------------

/**
 *  TODO 

 test for link reference

 handle docs links??

 test with more md content to ensure its only targeting links
 */

describe('rewriteTutorialLinks remark plugin', () => {
  beforeEach(async () => {
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

  test('Beta product tutorial links are rewritten to dev portal paths', async () => {
    // load beta product config
    const contents = await remark()
      .use(rewriteTutorialLinksPlugin)
      .process(TEST_MD_LINKS.betaProductTutorial)

    const result = String(contents)
    const path = isolatePathFromMarkdown(result)

    console.log({ path })

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

    const path = isolatePathFromMarkdown(String(contents))
    const anchorLinkPath = new RegExp(
      `^/(${betaProductSlugs})/tutorials/${slug}(/${slug})#`
    )

    expect(path).toMatch(anchorLinkPath)
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
})
