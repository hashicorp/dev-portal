import * as crypto from 'crypto'
import createFetch from '@vercel/fetch'
import * as core from '@actions/core'
const fetch = createFetch()

const vercelApiToken = process.env.VERCEL_API_TOKEN
const vercelTeamId = process.env.VERCEL_TEAM_ID

/** A helper to fetch Vercel Deployment Aliases from Vercel Deploy Preview URLs */
async function fetchDeploymentAlias(previewUrl: string): Promise<string[]> {
	const previewHostname = new URL(previewUrl).hostname
	const url = new URL(
		`v13/deployments/${previewHostname}`,
		'https://api.vercel.com'
	)

	url.searchParams.set('teamId', vercelTeamId)
	url.searchParams.set('withAutomaticAliases', '1')

	const headers = { Authorization: `Bearer ${vercelApiToken}` }

	const res = await fetch(url.toString(), { headers })
	const data = await res.json()

	// NOTE: returned aliases only contain hostname, and no scheme
	// Scheme will need to be prepended before being passed in the
	// request body to CloudIDP
	return data.alias[0]
}

const flowUrl = process.env.FLOW_IDP_DEPLOYMENT_READY_URL
// we need to replace \\n with new lines so that the key is formatted correctly
const key = process.env.CLOUD_IDP_DEPLOYMENT_PREVIEW_PRIVATE_KEY.replace(
	/\\n/g,
	'\n'
)
const previewUrl = process.env.PREVIEW_URL

async function sendToCloudIDP(deploymentUrl: string) {
	console.log('sendToCloudIDP', deploymentUrl)
	const payload = JSON.stringify({
		deployment_url: deploymentUrl,
	})
	const signature = crypto.sign(null, Buffer.from(payload), key)
	const headers = {
		'Content-Type': 'application/json',
		'x-hashicorp-deployment-preview-signature': signature.toString('base64'),
	}
	const response = await fetch(flowUrl, {
		method: 'post',
		body: payload,
		headers: headers,
	})

	// log response as text
	try {
		const text = await response.text()
		console.log(response.status, response.statusText, text)
	} catch (err) {
		// ignore this error
	}

	if (response.status >= 200 && response.status < 300) {
		// 2xx — Success
		core.notice(`Successfully registered: ${deploymentUrl}`)
	} else if (response.status >= 300 && response.status < 400) {
		// 3xx — Noop; We should never be here
	} else if (response.status >= 400 && response.status < 500) {
		// 4xx — Fail
		core.error(`Failed to register: ${deploymentUrl}. Received a 4xx response.`)
	} else if (response.status >= 500) {
		// 5xx — Noop; We likely see this if we've already registered a URL
		core.warning(
			`Failed to register: ${deploymentUrl}. Received a 5xx response.`
		)
	}
}

async function main() {
	await sendToCloudIDP(previewUrl)
	const aliasHostname = await fetchDeploymentAlias(previewUrl)
	await sendToCloudIDP(`https://${aliasHostname}`)
}

main()
