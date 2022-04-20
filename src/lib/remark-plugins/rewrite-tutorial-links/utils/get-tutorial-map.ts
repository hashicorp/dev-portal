import fetch from 'node-fetch'
import moize, { Options } from 'moize'
import { generateTutorialMap } from 'pages/api/tutorials-map'

export async function getTutorialMap() {
  let result = {}
  const isDuringBuild = process.env.VERCEL && process.env.CI
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'
  const apiRoute = new URL('api/tutorials-map', baseUrl)

  try {
    if (isDuringBuild) {
      console.log('DURING BUILD -------------')
      const tutorialMapRes = await cachedGenerateTutorialMap()
      result = tutorialMapRes
    } else {
      console.log('DURING ISR ------------------')
      const tutorialMapRes = await fetch(apiRoute)
      if (tutorialMapRes.ok) {
        result = await tutorialMapRes.json()
      }
    }
  } catch (e) {
    console.error(e, 'Tutorials map could not be generated')
  }

  return result
}

const moizeOpts: Options = { isPromise: true, maxSize: Infinity }
const cachedGenerateTutorialMap = moize(generateTutorialMap, moizeOpts)
