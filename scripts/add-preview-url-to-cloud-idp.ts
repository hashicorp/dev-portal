import * as crypto from 'crypto'
import createFetch from '@vercel/fetch'
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
	console.log(response.status, response.statusText)
}

async function main() {
	await sendToCloudIDP(previewUrl)
	const aliasHostname = await fetchDeploymentAlias(previewUrl)
	await sendToCloudIDP(`https://${aliasHostname}`)
}

main()
