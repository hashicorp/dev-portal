import { NextApiRequest, NextApiResponse } from 'next'
import { StatusCodes } from 'http-status-codes'
import { generateTutorialMap } from 'lib/remark-plugins/rewrite-tutorial-links/utils/get-tutorial-map'

// 1 hour
const MAP_MAX_AGE_IN_SECONDS = 60 * 60 * 60

/**
 * This API caches a tutorial-map blob for the tutorial rewrites
 * remark plugin - lib/remark-plugins/rewrite-tutorial-links.
 * This ensures that calls to `getAllTutorials` are limited
 * for ISR generated tutorial views
 */
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
