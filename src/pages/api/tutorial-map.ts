import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { getTutorialSlug } from 'views/collection-view/helpers'
import { getAllTutorials } from 'lib/learn-client/api/tutorial'
import moize, { Options } from 'moize'

const TUTORIALS_MAP_PATH = path.resolve('.tutorials-map')

const moizeOpts: Options = { isPromise: true, maxSize: Infinity }
const cachedGetAllTutorials = moize(getAllTutorials, moizeOpts)

async function getTutorials() {
  console.log('getting TUTORIALS')
  return [
    {
      slug: 'waypoint/getting-started-config',
      default_collection: {
        slug: 'waypoint/getting-started',
      },
    },
    {
      slug: 'waypoint/get-started-ui',
      default_collection: {
        slug: 'waypoint/getting-started',
      },
    },
    {
      slug: 'vault/consul-deploy',
      default_collection: {
        slug: 'vault/consul-integration',
      },
    },
    {
      slug: 'waypoint/get-started',
      default_collection: {
        slug: 'waypoint/get-started-docker',
      },
    },
  ]
}

export async function generateTutorialMap() {
  let cachedData
  //   try {
  //     cachedData = JSON.parse(
  //       fs.readFileSync(path.join(process.cwd(), TUTORIALS_MAP_PATH), 'utf8')
  //     )
  //     console.log('READING FROM CACHED DATA!')
  //   } catch (e) {
  //     console.log('[TUTORIAL]: Tutorials map not initialized')
  //     console.error(e.message)
  //   }

  if (!cachedData) {
    console.log('no cached data, trying to write')
    // const allTutorials = await getAllTutorials({
    //   fullContent: false,
    //   slugsOnly: true,
    // })

    const allTutorials = await cachedGetAllTutorials({
      fullContent: false,
      slugsOnly: true,
    })
    console.log(
      allTutorials.length,
      allTutorials[0],
      '-----------------------------'
    )

    const mapItems = allTutorials.map((t) => {
      const oldPath = t.slug
      const newPath = getTutorialSlug(t.slug, t.collection_slug)
      return [oldPath, newPath]
    })

    // try {
    //   fs.writeFileSync(
    //     path.join(process.cwd(), TUTORIALS_MAP_PATH),
    //     JSON.stringify(Object.fromEntries(mapItems)),
    //     'utf8'
    //   )
    //   console.log('[TUTORIAL]: Created tutorials map cache')
    // } catch (error) {
    //   console.log('[TUTORIAL]: Unable to write to file')
    //   console.error(error.message)
    // }

    cachedData = Object.fromEntries(mapItems)
  }

  return cachedData
}

const cachedGenerateTutorialMap = moize(generateTutorialMap, moizeOpts)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const mapData = await cachedGenerateTutorialMap()
  res.status(200).json(mapData)
}
