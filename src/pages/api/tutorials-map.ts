import { NextApiRequest, NextApiResponse } from 'next'
import { StatusCodes } from 'http-status-codes'
import { getTutorialSlug } from 'views/collection-view/helpers'
import { getAllTutorials } from 'lib/learn-client/api/tutorial'
import moize, { Options } from 'moize'

// 1 hour
const MAP_MAX_AGE_IN_SECONDS = 60 * 60 * 60

export default async function tutorialsMapHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const mapData = await generateTutorialMap()
    if (Object.keys(mapData).length > 0) {
      res.setHeader('cache-control', `s-maxage=${MAP_MAX_AGE_IN_SECONDS}`)
      res.status(StatusCodes.OK).json(mapData)
    } else {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Failed to generate tutorial map' })
    }
  } catch (e) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Server error: unable to generate tutorial map' })
  }
}

export async function generateTutorialMap() {
  console.log('Generating tutorial map') // For testing caching
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
