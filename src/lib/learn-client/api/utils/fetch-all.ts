import path from 'path'
import { uuid } from 'lib/learn-client/types'
import { get, toError } from 'lib/learn-client'
import { ApiCollection, ApiTutorial } from 'lib/learn-client/api/api-types'

type BaseUrlOptions = '/collections' | '/tutorials'

interface FetchAllParams {
  baseUrl: BaseUrlOptions
  recurse?: boolean
  limit?: string
  fullContent?: boolean
  after?: string
  fetchedTutorials?: ApiTutorial[]
}

/**
 *  Based off content-sync imp --> https://github.com/hashicorp/learn-api-content-sync/blob/main/util/api-client.js#L77
 *
 *  By detault, this function will recursively fetch all tutorials or collections from the db
 *  If you don't want all the tutorials, pass `recurse: false` and a specified limit.
 *  The baseUrl option specifies which endpoint (either collections or tutorials) to hit
 **/

const MAX_LIMIT = '100' // Defaults to API max

export async function fetchAll({
  baseUrl,
  recurse = true,
  limit = MAX_LIMIT,
  fullContent = false,
  after,
  fetchedTutorials,
}: FetchAllParams): Promise<ApiTutorial[] | ApiCollection[]> {
  // Set the base array if it's the first call
  if (typeof fetchedTutorials === 'undefined') {
    fetchedTutorials = []
  }

  const response = await fetchTutorialsOrCollections(
    baseUrl,
    limit,
    after,
    fullContent
  )

  if (response.ok) {
    const data = await response.json()
    const allTutorials = [...fetchedTutorials, ...data.result]

    /*
     ** If recurse is false, we only want the # of tuts specific by the limit.
     ** If there's less than 100 tutorials fetched (less than the max limit),
     ** that means that we've fetched everything.
     */
    if (!recurse || data.result.length < Number(MAX_LIMIT)) return allTutorials

    // Otherwise, recurse to get the next batch of tutorials
    return fetchAll({
      baseUrl,
      recurse: true,
      limit,
      // The last ID
      after: data.result[data.result.length - 1].id,
      // Pass the accumulated tutorials
      fetchedTutorials: allTutorials,
      fullContent,
    })
  }
}

async function fetchTutorialsOrCollections(
  baseRoute: BaseUrlOptions,
  limit: string,
  after?: uuid,
  full?: boolean
) {
  const params = new URLSearchParams({ limit })

  if (after) params.append('after', after)
  if (full) params.append('full', '1')

  const queryStr = `?${params.toString()}`
  const route = path.join(baseRoute, queryStr)
  const response = await get(route)

  if (response.ok) {
    return response
  }

  const error = await toError(response)
  throw error
}
