// test for regular link

// test for non beta product links to external hashicorp

// test for link reference

// test for beta product linking internally

import remark from 'remark'
import { rewriteTutorialLinksPlugin } from 'lib/remark-plugins/rewrite-tutorial-links'

// Matches the pattern /{beta-product}/tutorials/collection-slug/optional-tutorial-slug
// @TODO load beta products from config, concat as string construction to dynamically load the products?
const validDevPortalTutorialsPath = new RegExp(
  /^\/(waypoint|vault)\/tutorials\/[a-z0-9]+(?:[-][a-z0-9]+)*(\/[a-z0-9]+(?:[-][a-z0-9]+)*)?/
)

describe('rewriteTutorialLinks remark plugin', () => {
  test('Beta product tutorial links are rewritten to dev portal paths', async () => {
    // load beta product config
    const contents = await remark()
      .use(rewriteTutorialLinksPlugin)
      .process(
        '[link to beta product tutorial](/tutorials/waypoint/get-started-ui)'
      )

    const result = String(contents)
    const isValidPath = validDevPortalTutorialsPath.test(result)
    expect(isValidPath).toEqual(true)
  })
})
