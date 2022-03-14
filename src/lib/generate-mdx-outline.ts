import remark from 'remark'
import { visit } from 'unist-util-visit'
import generateSlug from '@hashicorp/remark-plugins/generate_slug'

export interface OutlineItem {
  slug: string
  title: string
}

export default async function generateOutline(
  mdxContent: string
): Promise<OutlineItem[]> {
  const headings = [{ title: 'Overview', slug: 'overview' }]

  // Small remark plugin to construct AST from mdxContent
  const headingMapper = () => (tree) => {
    const links = []
    visit(tree, 'heading', (node) => {
      const title = node.children.reduce((m, n) => {
        if (n.value) m += n.value
        return m
      }, '')
      // Only include level 1 or level 2 headings
      if (node.depth < 3) {
        headings.push({
          title,
          slug: generateSlug(title, links),
        })
      }
    })
  }

  return remark()
    .use(headingMapper)
    .process(mdxContent)
    .then(() => headings)
}
