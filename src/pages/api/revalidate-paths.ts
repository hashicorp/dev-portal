/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { NextApiRequest, NextApiResponse } from 'next/types'
import { StatusCodes } from 'http-status-codes'
import { validateToken } from 'lib/api-validate-token'

const PATHS_LIMIT = 100

/**
 * Accepts a POST request with an array of paths,
 * triggers revalidation for paths as they are passed.
 *
 * They should be formatted as full paths from the root of developer.hashicorp.com
 */
async function handler(request: NextApiRequest, response: NextApiResponse) {
	if (request.method !== 'POST') {
		response.status(StatusCodes.NOT_FOUND)
		return
	}

	const { paths } = request.body
	const pathsExist = paths?.length > 0

	if (!pathsExist) {
		response
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: '[revalidation failed]: No paths provided.' })

		return
	}

	// TODO could remove this limit if we refactor for concurrency
	if (paths.length > PATHS_LIMIT) {
		response.status(StatusCodes.BAD_REQUEST).json({
			error: `[revalidation failed]: paths exceed limit of ${PATHS_LIMIT}.`,
		})

		return
	}

	try {
		const revalidatePromises = []

		paths.forEach((path: string) => {
			// remove any trailing slash
			const formattedPath = path.replace(/\/$/, '')
			console.log('[revalidate]', formattedPath)
			revalidatePromises.push(response.revalidate(formattedPath))
		})

		await Promise.allSettled(revalidatePromises)

		response
			.status(StatusCodes.OK)
			.send(`[revalidation success]: for ${paths.length} paths`)
	} catch (e) {
		// If there was an error, Next.js will continue
		// to show the last successfully generated page
		console.error('[revalidation error] ', e)
		return response
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.send(`[revalidation error]:  ${e.message}`)
	}
}

export default validateToken(handler, {
	token: process.env.REVALIDATE_TOKEN,
	onlyMethods: ['POST'],
})
