import path from 'path'
import {
	getAllTutorialsOptions,
	identifier,
	Tutorial,
	TutorialFullCollectionCtx,
} from 'lib/learn-client/types'
import { get, toError } from '../../index'
import { formatBatchQueryStr, formatIdentifier, fetchAll } from '../utils'
import { formatTutorialData } from './formatting'
import { augmentTutorial } from './augment-tutorial'
import { ApiTutorial } from 'lib/learn-client/api/api-types'

export const TUTORIAL_API_ROUTE = '/tutorials'

export async function getTutorial(
	idOrSlug: identifier
): Promise<TutorialFullCollectionCtx | null> {
	const identifier = formatIdentifier(idOrSlug)

	// /tutorials/:id
	const route = path.join(TUTORIAL_API_ROUTE, identifier)
	const getTutorialRes = await get(route)

	if (getTutorialRes.ok) {
		const res = await getTutorialRes.json()
		const augmentedData = await augmentTutorial(res.result) // additional Api call here
		return formatTutorialData(augmentedData) as TutorialFullCollectionCtx
	}

	// This is handled by tutorial template /pages/tutorials/[...slug] to render 404 page
	if (getTutorialRes.status === 404) {
		console.error('Learn Api Client: 404 — Tutorial not found')
		return null
	}

	const error = await toError(getTutorialRes)
	throw error
}

/**
 * Fetches tutorials based on provided identifiers. The following function overloads ensure the return type is accurate based on how the
 * `withContent` argument is passed in.
 *
 * @param idsOrSlugs - the tutorial identifiers used to fetch
 * @param withContent - determines whether or not content is included in the returned tutorial records
 */
export async function getTutorials(
	idsOrSlugs: identifier[]
): Promise<Omit<Tutorial, 'content'>[]>
export async function getTutorials(
	idsOrSlugs: identifier[],
	withContent: false
): Promise<Omit<Tutorial, 'content'>[]>
export async function getTutorials(
	idsOrSlugs: identifier[],
	withContent: true
): Promise<Tutorial[]>
export async function getTutorials(
	idsOrSlugs: identifier[],
	withContent?: boolean
): Promise<Tutorial[] | Omit<Tutorial, 'content'>[]> {
	const queryStr = formatBatchQueryStr(idsOrSlugs, withContent)
	const route = path.join(TUTORIAL_API_ROUTE, queryStr)
	const getTutorialsRes = await get(route)

	if (getTutorialsRes.ok) {
		const res = await getTutorialsRes.json()
		return res.result.map(formatTutorialData)
	}

	const error = await toError(getTutorialsRes)
	throw error
}

// getAllTutorials
// if a limit is not passed, all tutorials are fetched
export async function getAllTutorials(
	options?: getAllTutorialsOptions
): Promise<
	Tutorial[] | (Pick<Tutorial, 'slug'> & { collection_slug: string }[])
> {
	let result = []
	const limit = options?.limit?.toString()
	const recurse = Boolean(!limit)
	// errors handled by the `fetchAll` function
	const allTutorials = (await fetchAll({
		baseUrl: TUTORIAL_API_ROUTE,
		recurse,
		limit,
		fullContent: options?.fullContent, // used if needing the tutorial's mdx content
	})) as ApiTutorial[]

	if (options?.slugsOnly) {
		result = allTutorials.map(({ slug, default_collection }) => ({
			slug,
			collection_slug: default_collection.slug,
		}))
	} else {
		return allTutorials.map(formatTutorialData)
	}

	return result
}
