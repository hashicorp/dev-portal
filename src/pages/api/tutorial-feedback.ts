import type { NextApiRequest, NextApiResponse } from 'next'

import {
	GoogleSpreadsheet,
	GoogleSpreadsheetRow,
	GoogleSpreadsheetWorksheet,
} from 'google-spreadsheet'
import Bowser from 'bowser'

const FEEDBACK_SHEET_ID = process.env.TUTORIAL_FEEDBACK_SHEET_ID
const FEEDBACK_SERVICE_EMAIL = process.env.FEEDBACK_SERVICE_EMAIL
const FEEDBACK_PRIVATE_KEY = process.env.FEEDBACK_PRIVATE_KEY
const HASHI_ENV = process.env.HASHI_ENV

interface SurveyResponse {
	id: string
	value: string
}

interface RequestBody {
	sessionId: string
	page: string
	timestamp: Date
	responses: SurveyResponse[]
}

interface Row {
	sessionId: string
	page: string
	timestamp: Date
	browser: string
	os: string
	platform: string
}

interface StatusError extends Error {
	status?: number
}

async function setupDocument(): Promise<GoogleSpreadsheetWorksheet> {
	const private_key = FEEDBACK_PRIVATE_KEY.replace(/\\n/g, '\n')
	const doc = new GoogleSpreadsheet(FEEDBACK_SHEET_ID)
	await doc.useServiceAccountAuth({
		client_email: FEEDBACK_SERVICE_EMAIL,
		private_key,
	})
	await doc.loadInfo()

	const sheet = doc.sheetsByIndex[0]
	return sheet
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

	const requiredKeys = ['sessionId', 'page', 'responses', 'timestamp']
	const missing = []

	requiredKeys.forEach((key) => {
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

async function findAndUpdate(
	sheet: GoogleSpreadsheetWorksheet,
	newRow: Row
): Promise<GoogleSpreadsheetRow | false> {
	const { sessionId } = newRow
	const rows = await sheet.getRows()
	let existingRowIndex = null
	rows.some((row, index) => {
		if (row.sessionId === sessionId) {
			existingRowIndex = index
			return true
		}
	})

	if (existingRowIndex) {
		//  we have to assign individual properties this way bc the column properties are getter/setters
		Object.keys(newRow).forEach((key) => {
			rows[existingRowIndex][key] = newRow[key]
		})
		return rows[existingRowIndex]
	} else {
		return false
	}
}

const submitFeedback = async (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> => {
	try {
		const requestBody = await validateRequest(req)
		const sheet = await setupDocument()
		const { responses, sessionId, ...rest } = requestBody
		const { browser, os, platform } = Bowser.parse(req.headers['user-agent'])

		const newRow = {
			sessionId,
			...responses,
			...rest,
			browser: `${browser.name} ${browser.version}`,
			os: `${os.name} ${os.version}`,
			platform: platform.type,
		}

		const updatedRow = await findAndUpdate(sheet, newRow)

		if (updatedRow) {
			await updatedRow.save()
		} else {
			//  eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			await sheet.addRow(newRow)
		}

		res.status(204).end()
	} catch (error) {
		console.error('Unexpected error')
		console.error(error)
		res.status(error.status || 500).json({
			body: { error: 'An unexpected error occurred.' },
		})
	}
}

export default submitFeedback
