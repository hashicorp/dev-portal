// test for regular link

// test for non beta product links to external hashicorp

// test for link reference

// test for beta product linking internally

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
  nonLearnLink: '[link to docs](https://www.waypointproject.io/docs)',
  betaProductTutorial:
    '[link to beta product tutorial](/tutorials/waypoint/get-started-ui)',
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
    const path = result.split('(')[1].trim().slice(0, -1) // target the path within the md syntax

    const isValidPath = devDotTutorialsPath.test(path)

    expect(isValidPath).toEqual(true)
  })
})
