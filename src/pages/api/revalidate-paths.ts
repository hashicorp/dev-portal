/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { NextApiRequest, NextApiResponse } from 'next/types'
import { StatusCodes } from 'http-status-codes'
import { validateToken } from 'lib/api-validate-token'
import { cachedGetProductData } from 'lib/get-product-data'
import { STATUS_CODES } from 'http'

const PATHS_LIMIT = 10

/**
 * Accepts a POST request with a product slug, triggers revalidation for all of a product's docs paths
 * specified in its latest nav data.
 */
async function handler(request: NextApiRequest, response: NextApiResponse) {
	if (request.method !== 'POST') {
		response.status(StatusCodes.NOT_FOUND)
		return
	}

	// @TODO should we consider a limit on the number of paths?
	const { paths } = request.body
	const pathsExist = paths?.length > 0

	if (!pathsExist) {
		response
			.status(StatusCodes.BAD_REQUEST)
			.json({ error: '[Revalidation failed]: No paths provided.' })

		return
	}

	// TODO could remove this limit if we refactor for concurrency
	if (paths.length > PATHS_LIMIT) {
		response.status(StatusCodes.BAD_REQUEST).json({
			error: `[Revalidation failed]: paths exceed limit of ${PATHS_LIMIT}.`,
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

		response.status(StatusCodes.ACCEPTED)

		await Promise.allSettled(revalidatePromises)

		response.status(StatusCodes.OK).end()
	} catch (e) {
		// If there was an error, Next.js will continue
		// to show the last successfully generated page
		console.error('Error revalidating ', e)
		return response
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.send('Error revalidating')
	}
}

export default validateToken(handler, {
	token: process.env.REVALIDATE_TOKEN,
	onlyMethods: ['POST'],
})
