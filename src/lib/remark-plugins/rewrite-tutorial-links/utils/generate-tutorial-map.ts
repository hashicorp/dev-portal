import { getAllTutorials } from 'lib/learn-client/api/tutorial'
import { getTutorialSlug } from 'views/collection-view/helpers'

export async function generateTutorialMap() {
  console.log('GENERATING MAP') // Going to check the logs to test caching
  const allTutorials = await getAllTutorials({
    fullContent: false,
    slugsOnly: true,
  })

  const mapItems = allTutorials.map((t) => {
    const oldPath = t.slug
    const newPath = getTutorialSlug(t.slug, t.collection_slug)
    return [oldPath, newPath]
  })

  return Object.fromEntries(mapItems)
}
