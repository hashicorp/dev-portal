import fetch from 'node-fetch'
import moize, { Options } from 'moize'
import { generateTutorialMap } from 'pages/api/tutorials-map'

export async function getTutorialMap() {
  let result = {}
  const isDuringBuild = Boolean(process.env.CI)
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'
  const apiRoute = new URL('api/tutorials-map', baseUrl)

  try {
    /**
     * We can't call the api route during the build
     * so instead we call the generate map function directly
     * Since majority of pages are built via ISR, we need the api
     * route to cache this, since its not guaranteed that the caching
     * will occur on the same lambda
     */
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
