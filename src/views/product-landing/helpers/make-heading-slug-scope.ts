import slugify from 'slugify'

/**
 * Returns a function that generates slugs from heading strings,
 * while ensuring those slugs are unique across calls of the returned function
 * by suffixing with a `-{number}` where needed.
 */
export function makeHeadingSlugScope(): (string) => string {
  /**
   * Track which headings slugs have been used, to avoid potential duplicates
   */
  const USED_SLUGS = []

  /**
   * Generate a heading slug, but avoid potential duplicates.
   * Duplicates are determined based on USED_SLUGS in this scope.
   */
  function makeHeadingSlug(heading: string): string {
    let suffix = 1
    const baseSlug = slugify(heading, { lower: true })
    let headingSlug = baseSlug
    while (USED_SLUGS.indexOf(headingSlug) !== -1) {
      suffix++
      headingSlug = `${baseSlug}-${suffix}`
    }
    USED_SLUGS.push(headingSlug)
    return headingSlug
  }

  return makeHeadingSlug
}
