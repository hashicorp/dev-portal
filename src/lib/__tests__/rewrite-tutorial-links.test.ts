// test for regular link

// test for non beta product links to external hashicorp

// test for link reference

// test for beta product linking internally

import path from 'path'
import fs from 'fs'
import remark from 'remark'
import remarkMdx from 'remark-mdx'
import { rewriteTutorialLinksPlugin } from 'lib/remark-plugins/rewrite-tutorial-links'

describe('transformRewriteStandaloneStaticAssets', () => {
  test('Resolves images relative to the document', async () => {
    // load the fixture
    const tutorialFixture = fs.readFileSync(
      path.join(process.cwd(), '/src/lib/__tests__/__fixtures__/tutorial.md')
    )

    // console.log({ tutorialFixture })

    const contents = await remark()
      .use(rewriteTutorialLinksPlugin)
      .process(
        '[link to beta product tutorial](/tutorials/waypoint/get-started-ui)'
      )

    const result = String(contents)

    //     expect(result.document.markdownSource).toMatchInlineSnapshot(`
    // "![image](https://mktg-content-api-hashicorp.vercel.app/api/assets?product=terraform-cdk&version=stable-website&asset=website%2Fdocs%2Fcdktf%2Fimage.png)
    // "
    // `)
  })
})
