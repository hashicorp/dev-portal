import path from 'path'
import fs from 'fs'
import { getAllTutorials } from 'lib/learn-client/api/tutorial'
import { getTutorialSlug } from 'views/collection-view/helpers'

/**
 *
 * TRYING OUT THE STATIC APPROACH HERE
 * IT SEEMS LIKE THE ISR SERVERS ARE READ ONLY
 * SO THIS WORKS FOR STATIC BUIDS
 *
 */
const TUTORIALS_MAP_PATH = '.tutorials-map'

export async function generateStaticTutorialMap() {
  let cachedData
  console.log({ __dirname }, '++++++++++++++++++++++++++++++++')
  try {
    cachedData = JSON.parse(
      fs.readFileSync(path.join(__dirname, TUTORIALS_MAP_PATH), 'utf8')
    )
  } catch (e) {
    console.log('Tutorials map not initialized')
    console.error(e.message)
  }

  if (!cachedData) {
    console.log('calling get all tutorials')
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
        path.join(__dirname, TUTORIALS_MAP_PATH),
        JSON.stringify(Object.fromEntries(mapItems)),
        'utf8'
      )
      console.log('Wrote to tutorials map cache')
    } catch (error) {
      console.error(error.message)
    }

    cachedData = Object.fromEntries(mapItems)
  }

  return cachedData
}

export function parseTutorialsMapCache() {
  try {
    const cachedJobs = JSON.parse(
      fs.readFileSync(path.join(__dirname, TUTORIALS_MAP_PATH), 'utf8')
    )
    return cachedJobs || null
  } catch (error) {
    console.log('Tutorials map not initialized')
  }
}
