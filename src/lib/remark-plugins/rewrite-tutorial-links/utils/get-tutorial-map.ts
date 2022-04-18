import fetch from 'node-fetch'

export async function getTutorialMap() {
  let result = {}
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'
  const apiRoute = new URL('api/tutorials-map', baseUrl)

  try {
    const tutorialMapRes = await fetch(apiRoute.toString())
    if (tutorialMapRes.ok) {
      result = await tutorialMapRes.json()
    }
  } catch (e) {
    console.error(e, 'Tutorials map could not be generated')
  }

  return result
}
