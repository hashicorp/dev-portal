import { TutorialLite as ClientTutorialLite } from 'lib/learn-client/types'
import { getTutorialSlug } from 'views/collection-view/helpers'
import { MenuItem } from 'components/sidebar'

export function splitProductFromFilename(slug: string): string {
  return slug.split('/')[1]
}

export function formatTutorialToMenuItem(
  tutorial: ClientTutorialLite,
  collectionSlug: string
): MenuItem {
  const path = getTutorialSlug(tutorial.slug, collectionSlug)
  const title = tutorial.name
  return {
    title,
    path,
  }
}

export function generateCanonicalUrl(
  defaultCollectionSlug: string,
  tutorialSlug: string
): URL {
  const path = getTutorialSlug(tutorialSlug, defaultCollectionSlug)
  return new URL(path, __config.dev_dot.canonical_base_url)
}
