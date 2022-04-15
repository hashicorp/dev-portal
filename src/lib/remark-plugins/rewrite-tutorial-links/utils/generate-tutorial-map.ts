import fs from 'fs'
import path from 'path'
import { getAllTutorials } from 'lib/learn-client/api/tutorial'
import { getTutorialSlug } from 'views/collection-view/helpers'

const TUTORIALS_MAP_PATH = path.resolve('.tutorials-map.json')

export async function generateTutorialMap() {
  let cachedData

  try {
    cachedData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), TUTORIALS_MAP_PATH), 'utf8')
    )
  } catch (e) {
    console.log('[TUTORIAL]: Tutorials map not initialized')
    console.error(e.message)
  }

  if (!cachedData) {
    const allTutorials = await getAllTutorials({
      fullContent: false,
      slugsOnly: true,
    })

    const mapItems = allTutorials.map((t) => {
      const oldPath = t.slug
      const newPath = getTutorialSlug(t.slug, t.collection_slug)
      return [oldPath, newPath]
    })

    try {
      fs.writeFileSync(
        path.join(process.cwd(), TUTORIALS_MAP_PATH),
        JSON.stringify(Object.fromEntries(mapItems)),
        'utf8'
      )
      console.log('[TUTORIAL]: Created tutorials map cache')
    } catch (error) {
      console.error(error.message)
    }

    cachedData = Object.fromEntries(mapItems)
  }

  return cachedData
}
