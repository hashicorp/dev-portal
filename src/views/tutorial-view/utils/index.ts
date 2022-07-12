import { TutorialLite as ClientTutorialLite } from 'lib/learn-client/types'
import { ListItemProps } from 'components/tutorials-sidebar/types'
import { getTutorialSlug } from 'views/collection-view/helpers'

export function splitProductFromFilename(slug: string): string {
  return slug.split('/')[1]
}

export function formatTutorialToMenuItem(
  tutorial: ClientTutorialLite,
  collectionSlug: string,
  currentPath: string
): ListItemProps {
  const path = getTutorialSlug(tutorial.slug, collectionSlug)
  return {
    text: tutorial.name,
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
