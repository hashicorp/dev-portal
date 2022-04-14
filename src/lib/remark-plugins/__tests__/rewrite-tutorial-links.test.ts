// test for regular link

// test for non beta product links to external hashicorp

// test for link reference

// test for beta product linking internally

// handle docs links??

// test with more md content to ensure its only targeting links

import remark from 'remark'
import { rewriteTutorialLinksPlugin } from 'lib/remark-plugins/rewrite-tutorial-links'

// Matches the pattern /{beta-product}/tutorials/collection-slug/optional-tutorial-slug
const slug = '[a-z0-9]+(?:[-][a-z0-9]+)*' // matches lower case letters, numbers and hyphens
const devDotTutorialsPath = new RegExp(
  `^/(${__config.dev_dot.beta_product_slugs.join(
    '|'
  )})/tutorials/${slug}(/${slug})?$`
)
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
  betaProductRelativePath:
    '[link to beta product non aboslute path](collections/vault/getting-started)',
}

function isolatePathFromMarkdown(mdLink: string): string {
  // target the path within the md syntax
  // split at the ], then remove the enclosing parens from the path
  return mdLink.split(']')[1].trim().slice(1, -1)
}

describe('rewriteTutorialLinks remark plugin', () => {
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

  test('Beta product relative path is handled propertly', async () => {
    const contents = await remark()
      .use(rewriteTutorialLinksPlugin)
      .process(TEST_MD_LINKS.betaProductRelativePath)

    const result = String(contents)
    const path = isolatePathFromMarkdown(result)
    expect(path).toMatch(devDotTutorialsPath)
  })
})
