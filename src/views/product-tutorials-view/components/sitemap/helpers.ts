import {
  Collection as ClientCollection,
  TutorialLite as ClientTutorialLite,
} from 'lib/learn-client/types'
import { SitemapCollection } from './types'

export function formatSitemapCollection(
  collection: ClientCollection
): SitemapCollection {
  return {
    slug: collection.slug,
    name: collection.name,
    tutorials: collection.tutorials.map((t: ClientTutorialLite) => ({
      slug: t.slug,
      name: t.name,
    })),
  }
}
