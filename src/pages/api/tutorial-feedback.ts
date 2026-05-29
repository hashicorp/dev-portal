/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import Bowser from 'bowser'
import { post, toError } from 'lib/learn-client'

const HASHI_ENV = process.env.HASHI_ENV

interface SurveyResponse {
	helpful: string
	reasonForVisit?: string
	suggestedImprovements?: string
}

interface UserRequest {
	sessionId: string
	tutorialId: string
}

interface RequestBody extends UserRequest {
	responses: SurveyResponse
}

interface RequestPayload extends UserRequest {
	responses: SurveyResponse
	browser: string
	os: string
	platform: string
}

interface StatusError extends Error {
	status?: number
}


async function validateRequest({
	body,
	headers,
}: NextApiRequest): Promise<RequestBody> {
	if (
		HASHI_ENV === 'production' &&
		headers.origin !== 'https://developer.hashicorp.com'
	) {
		const error: StatusError = new Error('Invalid host')
		error.status = 403
		throw error
	}

	const requiredKeys = ['sessionId', 'tutorialId', 'responses']
	const missing = []

	requiredKeys.forEach((key: string) => {
		if (!body[key]) {
			missing.push(key)
		}
	})

	if (missing.length > 0) {
		const error: StatusError = new Error(
			`The following required fields are missing: ${missing}`
		)
		error.status = 400
		throw error
	}

	return body
}

const submitFeedback = async (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> => {
	try {
		const requestBody = await validateRequest(req)
		const { browser, os, platform } = Bowser.parse(req.headers['user-agent'])

		const payload: RequestPayload = {
			...requestBody,
			browser: `${browser.name} ${browser.version}`,
			os: `${os.name} ${os.version}`,
			platform: platform.type,
		}

		const response = await post('/tutorial-feedback', process.env.ADMIN_TOKEN, payload)
		if (!response.ok) {
			throw await toError(response)
		}

		res.status(204).end()
	} catch (error) {
		const statusError = error as StatusError
		console.error('Error occurred. ', error)

		let errorMessage = 'An unexpected error occurred.'

		if (statusError.status === 404 || statusError.status === 400) {
			errorMessage = `An error occurred: ${statusError.message}`
		}

		res.status(statusError.status || 500).json({
			body: { error: errorMessage },
		})
	}
}

export default submitFeedback
