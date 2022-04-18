import { NextApiRequest, NextApiResponse } from 'next'
import { getTutorialSlug } from 'views/collection-view/helpers'
import { getAllTutorials } from 'lib/learn-client/api/tutorial'
import moize, { Options } from 'moize'

export default async function tutorialsMapHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const mapData = await cachedGenerateTutorialMap()
  res.status(200).json(mapData)
}

export async function generateTutorialMap() {
  const allTutorials = await getAllTutorials({
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

  return Object.fromEntries(mapItems)
}

const moizeOpts: Options = { isPromise: true, maxSize: Infinity }
const cachedGenerateTutorialMap = moize(generateTutorialMap, moizeOpts)
