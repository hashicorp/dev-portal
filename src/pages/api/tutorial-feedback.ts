/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import { Client } from '@microsoft/microsoft-graph-client'
import { ConfidentialClientApplication } from '@azure/msal-node'
import Bowser from 'bowser'

const FEEDBACK_SHEET_ID = process.env.TUTORIAL_FEEDBACK_SHEET_ID
const CLIENT_ID = process.env.MS_GRAPH_CLIENT_ID
const CLIENT_SECRET = process.env.MS_GRAPH_CLIENT_SECRET
const MS_GRAPH_TENANT_ID = process.env.MS_GRAPH_TENANT_ID

// Cache the CCA instance in module scope to reuse between requests. No need to create
// a new one each time.
const cca = new ConfidentialClientApplication({
	auth: {
		clientId: CLIENT_ID,
		authority: `https://login.microsoftonline.com/${MS_GRAPH_TENANT_ID}`,
		clientSecret: CLIENT_SECRET,
	},
});


/**
 * Create a Microsoft Graph client using the client credentials flow for authentication.
 * This allows the server to authenticate and interact with Microsoft Graph on behalf of the application.
 * The client can then be used to perform operations such as appending rows to an Excel worksheet.
 *
 * @param scopes - An array of permission scopes required for the Microsoft Graph API. Defaults to `['https://graph.microsoft.com/.default']` which uses the permissions assigned to the app in Azure AD.
 */
const createClient = async (scopes: string[] = ['https://graph.microsoft.com/.default']): Promise<Client> => {
	const { accessToken } = await cca.acquireTokenByClientCredential({scopes})
	return Client.init({
		authProvider: done => done(null, accessToken),
	})
}


const HASHI_ENV = process.env.HASHI_ENV

interface SurveyResponse {
	helpful: string
	reasonForVisit?: string
	suggestedImprovements?: string
}

interface UserRequest {
	sessionId: string
	page: string
	timestamp: string
}

interface RequestBody extends UserRequest {
	responses: SurveyResponse
}

interface Row extends SurveyResponse, UserRequest {
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

	const requiredKeys = ['sessionId', 'page', 'responses', 'timestamp']
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

const upsertRow = async (row: Row) => {
	const client = await createClient();
	const values: (string | undefined)[] = Object.values(row);
	const endCol = String.fromCharCode(64 + values.length); // e.g. 9 cols → 'I'

	// Dynamically get the first worksheet name
	const sheets = await client
		.api(`/me/drive/items/${FEEDBACK_SHEET_ID}/workbook/worksheets`)
		.get();
	const firstSheetName = sheets.value[0]?.name;

	const BASE_PATH = `/me/drive/items/${FEEDBACK_SHEET_ID}/workbook/worksheets('${firstSheetName}')/`;

	// Fetch all existing data in the sheet
	const usedRange = await client
		.api(`${BASE_PATH}usedRange`)
		.get();

	const existingRows: (string | undefined)[][] = usedRange.values ?? [];

	const existingRowIndex = existingRows
		.findIndex(([sessionId]) => sessionId === row.sessionId);

	if (existingRowIndex !== -1) {
		// Row already exists — update it in place (1-based Excel row number)
		const excelRow = existingRowIndex + 1;
		await client
			.api(`${BASE_PATH}range(address='A${excelRow}:${endCol}${excelRow}')`)
			.patch({ values: [values] });
	} else {
		// No existing row — append after the last used row
		const nextRow = existingRows.length + 1;
		await client
			.api(`${BASE_PATH}range(address='A${nextRow}:${endCol}${nextRow}')`)
			.patch({ values: [values] });
	}
};

const submitFeedback = async (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> => {
	try {
		const requestBody = await validateRequest(req)
		const { responses, sessionId, ...rest } = requestBody
		const { helpful, ...otherResponses } = responses
		const { browser, os, platform } = Bowser.parse(req.headers['user-agent'])

		const newRow: Row = {
			sessionId,
			helpful,
			...otherResponses,
			...rest,
			browser: `${browser.name} ${browser.version}`,
			os: `${os.name} ${os.version}`,
			platform: platform.type,
		}

		await upsertRow(newRow)

		res.status(204).end()
	} catch (error) {
		console.error('Error occurred. ', error)

		let errorMessage = 'An unexpected error occurred.'

		if (error.response?.status === 404 || error.response?.status === 400) {
			errorMessage = `An error occurred: ${error.message}`
		}

		res.status(error.response?.status || 500).json({
			body: { error: errorMessage },
		})
	}
}

export default submitFeedback
