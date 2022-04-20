import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs'
import { StatusCodes } from 'http-status-codes'
import { getTutorialSlug } from 'views/collection-view/helpers'
import { getAllTutorials } from 'lib/learn-client/api/tutorial'
import moize, { Options } from 'moize'
import { ProductOption } from 'lib/learn-client/types'

// 1 hour
const MAP_MAX_AGE_IN_SECONDS = 60 * 60 * 60

export default async function tutorialsMapHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const mapData = await cachedGenerateTutorialMap()
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

const moizeOpts: Options = { isPromise: true, maxSize: Infinity }
const cachedGenerateTutorialMap = moize(generateTutorialMap, moizeOpts)

const TUTORIALS_MAP_PATH = '.tutorials-map'

export async function generateStaticTutorialMap() {
  let cachedData

  console.log({ __dirname })
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
