import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { getTutorialSlug } from 'views/collection-view/helpers'
import { getAllTutorials } from 'lib/learn-client/api/tutorial'

const TUTORIALS_MAP_PATH = path.resolve('/public/tutorials-map.json')

export async function generateTutorialMap() {
  let cachedData

  try {
    cachedData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), TUTORIALS_MAP_PATH), 'utf8')
    )
    console.log('READING FROM CACHED DATA!')
  } catch (e) {
    console.log('[TUTORIAL]: Tutorials map not initialized')
    console.error(e.message)
  }

  if (!cachedData) {
    console.log('no cached data, trying to write')
    const allTutorials = await getAllTutorials({
      fullContent: false,
      slugsOnly: true,
    })

    // const allTutorials = [
    //   {
    //     slug: 'waypoint/getting-started-config',
    //     default_collection: {
    //       slug: 'waypoint/getting-started',
    //     },
    //   },
    //   {
    //     slug: 'waypoint/get-started-ui',
    //     default_collection: {
    //       slug: 'waypoint/getting-started',
    //     },
    //   },
    //   {
    //     slug: 'vault/consul-deploy',
    //     default_collection: {
    //       slug: 'vault/consul-integration',
    //     },
    //   },
    //   {
    //     slug: 'waypoint/get-started',
    //     default_collection: {
    //       slug: 'waypoint/get-started-docker',
    //     },
    //   },
    // ]

    const mapItems = allTutorials.map((t) => {
      const oldPath = t.slug
      const newPath = getTutorialSlug(t.slug, t.default_collection.slug)
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
      console.log('[TUTORIAL]: Unable to write to file')
      console.error(error.message)
    }

    cachedData = Object.fromEntries(mapItems)
  }

  return cachedData
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const mapData = await generateTutorialMap()
  res.status(200).json(mapData)
}
