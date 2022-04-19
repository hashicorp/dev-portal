import { NextApiRequest, NextApiResponse } from 'next'
import { getTutorialSlug } from 'views/collection-view/helpers'
import { getAllTutorials } from 'lib/learn-client/api/tutorial'
import moize, { Options } from 'moize'

// 1 hour
const MAP_MAX_AGE_IN_SECONDS = 60 * 60 * 60

export default async function tutorialsMapHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const mapData = await cachedGenerateTutorialMap()
  res.setHeader('cache-control', `s-maxage=${MAP_MAX_AGE_IN_SECONDS}`)
  res.status(200).json(mapData)
}

export async function generateTutorialMap() {
  console.log('Generating tutorial map') // to test caching
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

const moizeOpts: Options = { isPromise: true, maxSize: Infinity }
const cachedGenerateTutorialMap = moize(generateTutorialMap, moizeOpts)
