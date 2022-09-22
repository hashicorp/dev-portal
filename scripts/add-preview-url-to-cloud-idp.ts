import * as crypto from 'crypto'
import createFetch from '@vercel/fetch'
const fetch = createFetch()

const flowUrl = process.env.FLOW_IDP_DEPLOYMENT_READY_URL
// we need to replace \\n with new lines so that the key is formatted correctly
const key = process.env.CLOUD_IDP_DEPLOYMENT_PREVIEW_PRIVATE_KEY.replace(
	/\\n/g,
	'\n'
)
const previewUrl = process.env.PREVIEW_URL

async function main() {
	const payload = JSON.stringify({
		deployment_url: previewUrl,
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

main()
