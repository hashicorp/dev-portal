import { ProductOption, ThemeOption } from 'lib/learn-client/types'
import { getCollectionSlug } from 'views/collection-view/helpers'
import { getTutorialSlug } from 'views/collection-view/helpers'
import { getTutorial } from 'lib/learn-client/api/tutorial'
import isAbsoluteUrl from 'lib/is-absolute-url'

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
  // Gather info on whether this is a collection or tutorial URL
  const urlObject = new URL(url, 'https://learn.hashicorp.com')
  const pathParts = urlObject.pathname.split('/')
  const isTutorialUrl =
    pathParts[1] === 'tutorials' && isThemeOrProduct(pathParts[2])
  const isCollectionUrl =
    pathParts[1] === 'collections' && isThemeOrProduct(pathParts[2])
  if (isTutorialUrl) {
    // For tutorial URLs, we need a collection slug
    const tutorialSlugDb = `${pathParts[2]}/${pathParts[3]}`
    // If there's an "?in=" param, we can use that as the collection slug
    const inParam = urlObject.searchParams.get('in')
    if (inParam) {
      return getTutorialSlug(tutorialSlugDb, inParam)
    } else {
      // If not, we need to fetch the tutorial, & determine its default context
      const tutorialData = await getTutorial(tutorialSlugDb)
      if (!tutorialData) {
        throw new Error(
          `404: Could not find tutorial "${tutorialSlugDb}" in detectAndReformatLearnUrl.`
        )
      }
      const { collectionCtx } = tutorialData
      return getTutorialSlug(tutorialSlugDb, collectionCtx.default.slug)
    }
  } else if (isCollectionUrl) {
    // For collection urls, we can use getCollection Slug
    const collectionSlugDb = `${pathParts[2]}/${pathParts[3]}`
    return getCollectionSlug(collectionSlugDb)
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
