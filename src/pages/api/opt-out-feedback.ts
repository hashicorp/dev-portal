/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Cors from 'cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { GoogleSpreadsheet } from 'google-spreadsheet'

// Filter the body for any keys that aren't included in this list
export const allowedKeys = [
	'segment_anonymous_id',
	'primary_opt_out_reason',
	'details',
	'opt_out_page_url',
] as const

const cors = Cors({
	origin:
		process.env.HASHI_ENV === 'production'
			? 'https://developer.hashicorp.com'
			: '*',
	methods: ['POST'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
// https://nextjs.org/docs/api-routes/api-middlewares
function runMiddleware(req, res, fn) {
	return new Promise((resolve, reject) => {
		fn(req, res, (result) => {
			if (result instanceof Error) {
				return reject(result)
			}
			return resolve(result)
		})
	})
}

export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse
) {
	// Run Cors middleware
	await runMiddleware(request, response, cors)

	// Only allow POST for this endpoint
	if (request.method !== 'POST') {
		response.status(404).json({
			meta: {
				status_code: 404,
				status_text: 'Not Found',
			},
		})
		return
	}

	// Ensure that we're submitting only from developer.hashicorp
	// as our origin on production.
	if (
		process.env.HASHI_ENV === 'production' &&
		request.headers.origin !== 'https://developer.hashicorp.com'
	) {
		response.status(401).json({
			meta: {
				status_code: 401,
				status_text: 'Unauthorized',
			},
		})
		return
	}

	// Validate Request Headers
	if (request.headers['content-type'] !== 'application/json') {
		response.status(400).json({
			meta: {
				status_code: 400,
				status_text: 'Bad Request',
			},
			errors: [
				{
					msg: 'expects header Content-Type: application/json',
				},
			],
		})
		return
	}

	// Ensure `opt_out_page_url` is specified
	if (!request.body.opt_out_page_url) {
		response.status(400).json({
			meta: {
				status_code: 400,
				status_text: 'Bad Request',
			},
			errors: [
				{
					msg: 'Required body key `opt_out_page_url` is not provided',
				},
			],
		})
		return
	}

	// Filter out any keys that aren't sanctioned
	const filteredBody: any = {}
	allowedKeys.forEach((key) => {
		if (typeof request.body[key] !== 'undefined') {
			filteredBody[key] = request.body[key]
		}
	})

	// Add the timestamp
	filteredBody.submission_timestamp = new Date().toString()

	try {
		// Load up the Google Spreadsheet
		const doc = new GoogleSpreadsheet(process.env.FEEDBACK_SHEET_ID)
		await doc.useServiceAccountAuth({
			client_email: process.env.FEEDBACK_SERVICE_EMAIL,
			private_key: process.env.FEEDBACK_PRIVATE_KEY,
		})
		await doc.loadInfo()

		// Add a Row with the users feedback to the sheet
		const sheet = doc.sheetsByIndex[0]
		await sheet.addRow(filteredBody)

		// OK
		response.status(200).json({
			meta: {
				status_code: 200,
				status_text: 'OK',
			},
		})
	} catch (err) {
		console.error('Google Sheet Submission Error:', err.message)
		response.status(500).json({
			meta: {
				status_code: 500,
				status_text: 'Internal Server Error',
			},
		})
	}
}
