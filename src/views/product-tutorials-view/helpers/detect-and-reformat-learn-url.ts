import { ProductOption, ThemeOption } from 'lib/learn-client/types'
import isAbsoluteUrl from 'lib/is-absolute-url'
import { rewriteTutorialsLink } from 'lib/remark-plugins/rewrite-tutorial-links'
import { getTutorialMap } from 'lib/remark-plugins/rewrite-tutorial-links/utils'

let TUTORIAL_MAP

/**
 * Given a URL string,  detect whether it is a collection or tutorial URL
 * in the format used on learn.hashicorp.com.
 *
 * If it is, then reformat the URL to work with dev-dot's URL structure.
 * Otherwise, return the URL unmodified.
 */
async function detectAndReformatLearnUrl(url: string): Promise<string> {
  // Don't mess with absolute URLs
  if (isAbsoluteUrl(url)) {
    return url
  }
  // Determine from path parts whether this is a collection or tutorial URL
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_beforeSlash, part1, part2] = url.split('/')
  const isTutorialUrl = part1 === 'tutorials' && isThemeOrProduct(part2)
  const isCollectionUrl = part1 === 'collections' && isThemeOrProduct(part2)
  if (isTutorialUrl || isCollectionUrl) {
    // Tutorial and collection URLs need to be rewritten
    TUTORIAL_MAP = await getTutorialMap()
    return rewriteTutorialsLink(url, TUTORIAL_MAP)
  } else {
    // All other non-absolute URLs are returned unmodified
    return url
  }
}

/**
 * TYPE GUARDS ---------------------------------
 */
function isThemeOrProduct(
  string: string
): string is ProductOption | ThemeOption {
  return isThemeOption(string) || isProductOption(string)
}
function isThemeOption(string: string): string is ThemeOption {
  return Object.values(ThemeOption).includes(string as ThemeOption)
}
function isProductOption(string: string): string is ProductOption {
  return Object.values(ProductOption).includes(string as ProductOption)
}

export default detectAndReformatLearnUrl
