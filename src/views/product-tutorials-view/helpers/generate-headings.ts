import slugify from 'slugify'

//@TODO type blocks
export function generateHeadings(blocks: any) {
  const headings = [
    { title: 'Overview', slug: 'overview', level: 1 },
    { title: 'All tutorials', slug: 'all-tutorials', level: 1 },
  ]
  const blockHeadings = blocks.map((b) => ({
    title: b.heading,
    slug: slugify(b.heading),
    level: 1,
  }))

  headings.splice(1, 0, ...blockHeadings)

  return headings
}
