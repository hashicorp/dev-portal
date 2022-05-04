import { URL, URLSearchParams } from 'url'
import createFetch from '@vercel/fetch'
import pMap from 'p-map'
import proxyConfig from '../build-libs/proxy-config'

interface StaticPathsResponse {
  meta: {
    status_code: number
    status_text: string
  }
  result: {
    paths: {
      params: {
        page: string[]
      }
    }[]
  }
}

const fetch = createFetch()

/**
 * Returns a string representing a date that's `daysAgo` in the past.
 * Format: YYYY-MM-DD HH:MM:SS
 */
function getDateRange(daysAgo: number): string {
  const d = new Date()
  d.setTime(d.getTime() - 24 * 60 * 60 * 1000 * daysAgo)
  return d.toISOString().substring(0, 19).split('T').join(' ')
}

/**
 * Uses the Marketing Content API to fetch the top 200 most viewed pages in the
 * past 28 days according to Fathom analytics.
 */
async function getUrlsToCache(product: string): Promise<string[]> {
  const url = new URL('https://mktg-content-api.vercel.app/api/static_paths')
  const params = {
    product,
    limit: '200',
    date_from: getDateRange(28),
    path_prefix: '/',
    param: 'page',
  }

  const formattedParams = new URLSearchParams(params)
  url.search = formattedParams.toString()

  const res = await fetch(url.toString())
  const data = (await res.json()) as StaticPathsResponse

  if (data.meta.status_code !== 200) {
    throw new Error(`Unexpected status: ${data.meta.status_code}`)
  }

  const baseUrl = proxyConfig[product].domain

  return data.result.paths.map((p) => {
    return [baseUrl, p.params.page.join('/')].join('/')
  })
}

;(async () => {
  try {
    const urls = (
      await Promise.all(
        Object.keys(proxyConfig).map((product) => getUrlsToCache(product))
      )
    ).flat(1)
    console.log(`number of urls to cache: ${urls.length}`)
    await pMap(
      urls,
      async (url) => {
        const res = await fetch(url)
        // If a popular page is returning a 404, that's _probably_ okay, so it
        // doesn't warrant a failing CI run, but it does warrant being logged.
        if (res.status === 404) {
          console.log(`unexpected 404 for ${url}`)
        } else if (res.status !== 200) {
          throw new Error(`unexpected ${res.status} for ${url}`)
        } else {
          console.log(`cached ${url}`)
        }
      },
      { concurrency: 16, stopOnError: false }
    )
    process.exit()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
