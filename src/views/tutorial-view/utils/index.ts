import { TutorialLite as ClientTutorialLite } from 'lib/learn-client/types'
import { getTutorialSlug } from 'views/collection-view/helpers'

export function splitProductFromFilename(slug: string): string {
  return slug.split('/')[1]
}

export function formatTutorialToMenuItem(
  tutorial: ClientTutorialLite,
  collectionSlug: string,
  currentPath: string
): { title: string; href: string; isActive: boolean } {
  const path = getTutorialSlug(tutorial.slug, collectionSlug)
  return {
    title: tutorial.name,
    href: path,
    isActive: path === currentPath,
  }
}

export function generateCanonicalUrl(
  defaultCollectionSlug: string,
  tutorialSlug: string
): URL {
  const path = getTutorialSlug(tutorialSlug, defaultCollectionSlug)
  return new URL(path, __config.dev_dot.canonical_base_url)
}
